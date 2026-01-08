/**
 * Auto Run System
 * Handles automatic dungeon runs in the background
 */

import { gameState } from '../core/game-state.js';
import { addRunHistoryEntry } from '../../ui/ui-render.js';
import { getEffectiveStats } from '../upgrades/upgrade-manager.js';

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
        
        // Calculate and reward resources
        const rewards = calculateRewards();
        gameState.resources.gold += rewards.gold;
        gameState.resources.gems += rewards.gems;
        gameState.resources.souls += rewards.souls;
        gameState.hero.xp += rewards.xp;

        // Update statistics
        gameState.stats.totalGoldEarned += rewards.gold;

        // Check for level up
        checkLevelUp();

        // Add to history
        addRunHistoryEntry(true, rewards);

        console.log(`✅ Auto-run successful! Earned ${rewards.gold} gold, ${rewards.xp} XP`);
    } else {
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
    
    // Hero level bonus (2% per level)
    chance += gameState.hero.level * 0.02;
    
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
 */
function calculateRewards() {
    const level = gameState.hero.level;
    const effectiveStats = getEffectiveStats();
    
    // Base rewards scale with level
    const baseGold = 10 + (level * 2);
    const baseXP = 5 + level;
    const baseGemChance = 0.1 + (level * 0.01); // 10% + 1% per level
    const baseSoulChance = 0.05 + (level * 0.005); // 5% + 0.5% per level

    // Add some variance (80-120%)
    const variance = 0.8 + Math.random() * 0.4;

    // Apply multipliers from upgrades
    const finalGold = Math.floor(baseGold * variance * (1 + level * 0.1) * effectiveStats.goldMultiplier);
    const finalXP = Math.floor(baseXP * variance * (1 + level * 0.05) * effectiveStats.xpMultiplier);
    
    // Drop chances with upgrade bonuses
    const finalGemChance = Math.min(0.9, baseGemChance + effectiveStats.gemChanceBonus);
    const finalSoulChance = Math.min(0.8, baseSoulChance + effectiveStats.soulChanceBonus);

    return {
        gold: finalGold,
        xp: finalXP,
        gems: Math.random() < finalGemChance ? 1 : 0,
        souls: Math.random() < finalSoulChance ? 1 : 0
    };
}

/**
 * Check if hero leveled up and handle level up
 */
function checkLevelUp() {
    while (gameState.hero.xp >= gameState.hero.xpToNextLevel) {
        // Level up!
        gameState.hero.xp -= gameState.hero.xpToNextLevel;
        gameState.hero.level++;

        // Increase stats
        gameState.hero.maxHp += 10;
        gameState.hero.hp = gameState.hero.maxHp; // Full heal on level up
        gameState.hero.attack += 2;
        gameState.hero.defense += 1;

        // Increase XP required for next level
        gameState.hero.xpToNextLevel = Math.floor(gameState.hero.xpToNextLevel * 1.15);

        console.log(`🎉 Level Up! Now level ${gameState.hero.level}`);
        console.log(`💪 Stats: HP ${gameState.hero.maxHp}, ATK ${gameState.hero.attack}, DEF ${gameState.hero.defense}`);
    }
}