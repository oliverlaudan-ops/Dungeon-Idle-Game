/**
 * Auto Run System
 * Handles automatic dungeon runs in the background
 */

import { gameState } from '../core/game-state.js';
import { addRunHistoryEntry } from '../../ui/ui-render.js';
import { getEffectiveStats } from '../upgrades/upgrade-manager.js';
import { getPrestigeBonuses } from '../prestige/prestige-system.js';
import { processDungeonLoot } from '../equipment/equipment-drops.js';

// Maximum hero level
const MAX_LEVEL = 100;

/**
 * Process auto-run if enough time has passed
 */
export function processAutoRun() {
    const now = Date.now();
    const timeSinceLastRun = (now - gameState.idle.lastAutoRun) / 1000;

    if (timeSinceLastRun >= gameState.idle.autoRunInterval) {
        executeAutoRun();
        gameState.idle.lastAutoRun = now;
    }
}

/**
 * Get difficulty tier based on hero level
 */
function getDifficultyForLevel(level) {
    if (level < 10) return 'easy';
    if (level < 20) return 'medium';
    if (level < 30) return 'hard';
    return 'nightmare';
}

/**
 * Execute a single auto-run
 */
function executeAutoRun() {
    console.log('🎯 Executing auto-run...');

    // Calculate success chance based on hero stats + upgrades
    const successChance = calculateSuccessChance();
    const success = Math.random() < successChance;

    gameState.idle.totalAutoRuns++;

    if (success) {
        gameState.idle.successfulRuns++;
        
        // Calculate and reward resources (INCLUDING KEYS now!)
        const rewards = calculateRewards();
        gameState.resources.gold += rewards.gold;
        gameState.resources.gems += rewards.gems;
        gameState.resources.souls += rewards.souls;
        gameState.resources.dungeonKeys += rewards.keys;
        
        // Only add XP if below max level
        if (gameState.hero.level < MAX_LEVEL) {
            gameState.hero.xp += rewards.xp;
        }

        // Update statistics
        gameState.stats.totalGoldEarned += rewards.gold;
        gameState.stats.totalRunsCompleted++;

        // Check for equipment drop (NEW for Sprint 4!)
        const difficulty = getDifficultyForLevel(gameState.hero.level);
        const droppedEquipment = processDungeonLoot(difficulty);
        
        // Add equipment to rewards for display
        if (droppedEquipment) {
            rewards.equipment = droppedEquipment;
        }

        // Check for level up
        checkLevelUp();

        // Add to history
        addRunHistoryEntry(true, rewards);

        // Console log with equipment info
        let logMessage = `✅ Auto-run successful! Earned ${rewards.gold} gold`;
        if (gameState.hero.level < MAX_LEVEL) {
            logMessage += `, ${rewards.xp} XP`;
        }
        if (rewards.keys > 0) {
            logMessage += `, 🔑 ${rewards.keys} KEY(S)`;
        }
        if (droppedEquipment) {
            logMessage += `, 🎁 ${droppedEquipment.name}`;
        }
        console.log(logMessage);
    } else {
        gameState.stats.totalDeaths++;
        // Failed run - add to history
        addRunHistoryEntry(false);
        console.log('❌ Auto-run failed');
    }
}

/**
 * Calculate success chance for auto-runs
 */
function calculateSuccessChance() {
    const effectiveStats = getEffectiveStats();
    
    // Base 50% + bonuses from stats and upgrades
    let chance = 0.5;
    
    // Hero level bonus (2% per level, capped at max level)
    const levelBonus = Math.min(gameState.hero.level, MAX_LEVEL) * 0.02;
    chance += levelBonus;
    
    // Hero stats bonus (with upgrades)
    const statBonus = (effectiveStats.attack + effectiveStats.defense) / 1000;
    chance += statBonus;
    
    // Direct success bonus from upgrades
    chance += effectiveStats.successBonus;
    
    // Cap at 95%
    return Math.min(0.95, chance);
}

/**
 * Calculate rewards for successful auto-run
 * NOW INCLUDES KEY DROPS!
 */
function calculateRewards() {
    const level = Math.min(gameState.hero.level, MAX_LEVEL);
    const effectiveStats = getEffectiveStats();
    const prestigeBonuses = getPrestigeBonuses();
    
    // Base rewards scale with level
    const baseGold = 10 + (level * 2);
    const baseXP = 5 + level;
    const baseGemChance = 0.1 + (level * 0.01); // 10% + 1% per level
    const baseSoulChance = 0.05 + (level * 0.005); // 5% + 0.5% per level

    // KEY DROP CHANCE (NEW for Sprint 3)
    // Base 30% chance to drop 1 key per successful run
    // Increases with prestige bonuses
    let baseKeyChance = 0.30;
    if (prestigeBonuses.keyFindBonus) {
        baseKeyChance += prestigeBonuses.keyFindBonus;
    }
    
    // Guarantee key on milestone floors (every 5 levels)
    const guaranteedKey = (level % 5 === 0 && level >= 5);
    
    // Add some variance (80-120%)
    const variance = 0.8 + Math.random() * 0.4;

    // Apply multipliers from upgrades and prestige
    let goldMultiplier = effectiveStats.goldMultiplier;
    if (prestigeBonuses.goldMultiplier) {
        goldMultiplier *= prestigeBonuses.goldMultiplier;
    }
    
    let xpMultiplier = effectiveStats.xpMultiplier;
    if (prestigeBonuses.xpMultiplier) {
        xpMultiplier *= prestigeBonuses.xpMultiplier;
    }
    
    const finalGold = Math.floor(baseGold * variance * (1 + level * 0.1) * goldMultiplier);
    const finalXP = Math.floor(baseXP * variance * (1 + level * 0.05) * xpMultiplier);
    
    // Drop chances with upgrade bonuses
    const finalGemChance = Math.min(0.9, baseGemChance + effectiveStats.gemChanceBonus);
    const finalSoulChance = Math.min(0.8, baseSoulChance + effectiveStats.soulChanceBonus);
    const finalKeyChance = Math.min(0.9, baseKeyChance); // Cap at 90%

    // Determine key drops
    let keysDropped = 0;
    if (guaranteedKey) {
        keysDropped = 1; // Guaranteed on milestones
    } else if (Math.random() < finalKeyChance) {
        keysDropped = 1; // Random chance
    }

    return {
        gold: finalGold,
        xp: finalXP,
        gems: Math.random() < finalGemChance ? 1 : 0,
        souls: Math.random() < finalSoulChance ? 1 : 0,
        keys: keysDropped
    };
}

/**
 * Calculate XP required for a given level
 */
function calculateMaxXpForLevel(level) {
    // Base XP requirement
    let xp = 100;
    
    // Calculate XP for all levels up to current level
    for (let i = 1; i < level; i++) {
        xp = Math.floor(xp * 1.15);
    }
    
    return xp;
}

/**
 * Check if hero leveled up and handle level up
 * EXPORTED so it can be called from other modules (e.g., on game load)
 */
export function checkLevelUp() {
    // Don't level up past max level
    if (gameState.hero.level >= MAX_LEVEL) {
        // Cap XP at max level requirement
        gameState.hero.xp = Math.min(gameState.hero.xp, gameState.hero.maxXp);
        return;
    }

    // Validate and fix maxXp if it's corrupted
    const expectedMaxXp = calculateMaxXpForLevel(gameState.hero.level);
    if (!gameState.hero.maxXp || gameState.hero.maxXp !== expectedMaxXp) {
        console.warn(`⚠️ Fixing corrupted maxXp: was ${gameState.hero.maxXp}, should be ${expectedMaxXp}`);
        gameState.hero.maxXp = expectedMaxXp;
    }

    let leveledUp = false;
    
    while (gameState.hero.xp >= gameState.hero.maxXp && gameState.hero.level < MAX_LEVEL) {
        // Level up!
        gameState.hero.xp -= gameState.hero.maxXp;
        gameState.hero.level++;
        leveledUp = true;

        // Apply prestige bonuses to base stats
        const prestigeBonuses = getPrestigeBonuses();
        
        // Increase base stats
        const baseHpGain = 10 + (prestigeBonuses.maxHpBonus || 0);
        const baseAtkGain = 2 + (prestigeBonuses.attackBonus || 0);
        const baseDefGain = 1 + (prestigeBonuses.defenseBonus || 0);
        
        gameState.hero.maxHp += baseHpGain;
        gameState.hero.hp = gameState.hero.maxHp; // Full heal on level up
        gameState.hero.attack += baseAtkGain;
        gameState.hero.defense += baseDefGain;

        // Increase XP required for next level (if not at max)
        if (gameState.hero.level < MAX_LEVEL) {
            gameState.hero.maxXp = Math.floor(gameState.hero.maxXp * 1.15);
        }

        console.log(`🎉 Level Up! Now level ${gameState.hero.level}`);
        console.log(`💪 Stats: HP ${gameState.hero.maxHp}, ATK ${gameState.hero.attack}, DEF ${gameState.hero.defense}`);
        
        // Max level reached!
        if (gameState.hero.level === MAX_LEVEL) {
            console.log(`🎆 MAX LEVEL REACHED! You've reached level ${MAX_LEVEL}!`);
            console.log(`🔑 Use Prestige to continue growing stronger!`);
            break; // Stop processing level-ups
        }
        // Milestone notification
        else if (gameState.hero.level % 5 === 0) {
            console.log(`🌟 Milestone Level ${gameState.hero.level}! 🔑 Guaranteed key drop!`);
        }
    }
    
    // Prevent negative XP
    if (gameState.hero.xp < 0) {
        console.warn(`⚠️ Negative XP detected (${gameState.hero.xp}), resetting to 0`);
        gameState.hero.xp = 0;
    }
    
    return leveledUp;
}
