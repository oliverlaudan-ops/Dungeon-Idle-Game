/**
 * Auto Run System
 * Handles automatic dungeon runs in the background
 */

import { gameState } from '../core/game-state.js';

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
        
        // Reward resources
        const rewards = calculateRewards();
        gameState.resources.gold += rewards.gold;
        gameState.resources.gems += rewards.gems;
        gameState.hero.xp += rewards.xp;

        console.log(`✅ Auto-run successful! Earned ${rewards.gold} gold, ${rewards.xp} XP`);
    } else {
        console.log('❌ Auto-run failed');
    }
}

/**
 * Calculate success chance for auto-runs
 */
function calculateSuccessChance() {
    // Base 50% + bonuses from stats and upgrades
    let chance = 0.5;
    
    // Hero level bonus
    chance += gameState.hero.level * 0.02;
    
    // Cap at 95%
    return Math.min(0.95, chance);
}

/**
 * Calculate rewards for successful auto-run
 */
function calculateRewards() {
    const baseGold = 10;
    const baseXP = 5;
    const baseGems = 0.1;

    return {
        gold: Math.floor(baseGold * (1 + gameState.hero.level * 0.1)),
        xp: Math.floor(baseXP * (1 + gameState.hero.level * 0.05)),
        gems: Math.random() < baseGems ? 1 : 0
    };
}