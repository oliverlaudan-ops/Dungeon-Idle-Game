/**
 * Auto Run System
 * Handles automatic dungeon runs in the background
 */

import { gameState } from '../core/game-state.js';
import { addRunHistoryEntry } from '../../ui/ui-render.js';

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

    // Calculate success chance based on hero stats
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
    // Base 50% + bonuses from stats and upgrades
    let chance = 0.5;
    
    // Hero level bonus (2% per level)
    chance += gameState.hero.level * 0.02;
    
    // Hero stats bonus
    const statBonus = (gameState.hero.attack + gameState.hero.defense) / 1000;
    chance += statBonus;
    
    // Cap at 95%
    return Math.min(0.95, chance);
}

/**
 * Calculate rewards for successful auto-run
 */
function calculateRewards() {
    const level = gameState.hero.level;
    
    // Base rewards scale with level
    const baseGold = 10 + (level * 2);
    const baseXP = 5 + level;
    const gemChance = 0.1 + (level * 0.01); // 10% + 1% per level
    const soulChance = 0.05 + (level * 0.005); // 5% + 0.5% per level

    // Add some variance (80-120%)
    const variance = 0.8 + Math.random() * 0.4;

    return {
        gold: Math.floor(baseGold * variance * (1 + level * 0.1)),
        xp: Math.floor(baseXP * variance * (1 + level * 0.05)),
        gems: Math.random() < gemChance ? 1 : 0,
        souls: Math.random() < soulChance ? 1 : 0
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
        
        // TODO: Show notification
    }
}