/**
 * Achievement Manager
 * Handles checking, unlocking, and tracking achievements
 */

import { gameState, saveGame } from '../core/game-state.js';
import { ACHIEVEMENTS } from './achievement-definitions.js';

/**
 * Check all achievements and unlock new ones
 * Returns array of newly unlocked achievements
 */
export function checkAchievements() {
    const newlyUnlocked = [];

    for (const achievement of Object.values(ACHIEVEMENTS)) {
        // Skip if already unlocked
        if (gameState.achievements.unlocked[achievement.id]) {
            continue;
        }

        // Check condition
        if (achievement.condition(gameState)) {
            unlockAchievement(achievement.id);
            newlyUnlocked.push(achievement);
        }
    }

    if (newlyUnlocked.length > 0) {
        saveGame();
    }

    return newlyUnlocked;
}

/**
 * Unlock a specific achievement
 */
function unlockAchievement(achievementId) {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;

    // Mark as unlocked
    gameState.achievements.unlocked[achievementId] = Date.now();
    gameState.achievements.newlyUnlocked.push(achievementId);

    // Grant rewards
    if (achievement.reward.gold) {
        gameState.resources.gold += achievement.reward.gold;
    }
    if (achievement.reward.gems) {
        gameState.resources.gems += achievement.reward.gems;
    }
    if (achievement.reward.souls) {
        gameState.resources.souls += achievement.reward.souls;
    }

    console.log(`🏆 Achievement unlocked: ${achievement.name}`);
    console.log(`   Rewards: ${formatReward(achievement.reward)}`);
}

/**
 * Get achievement progress (0-1)
 */
export function getAchievementProgress(achievementId) {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return 0;

    // If already unlocked, return 1
    if (gameState.achievements.unlocked[achievementId]) {
        return 1;
    }

    // Try to calculate progress for numeric achievements
    // This is a simplified version - could be expanded
    const id = achievement.id;
    
    // Level-based
    if (id === 'first_steps') return Math.min(1, gameState.hero.level / 5);
    if (id === 'apprentice') return Math.min(1, gameState.hero.level / 10);
    if (id === 'veteran') return Math.min(1, gameState.hero.level / 20);
    if (id === 'master') return Math.min(1, gameState.hero.level / 50);

    // Run-based
    if (id === 'dungeon_explorer') return Math.min(1, gameState.idle.totalAutoRuns / 50);
    if (id === 'dungeon_master') return Math.min(1, gameState.idle.successfulRuns / 100);
    if (id === 'unstoppable') return Math.min(1, gameState.idle.totalAutoRuns / 500);

    // Gold-based
    if (id === 'penny_pincher') return Math.min(1, gameState.stats.totalGoldEarned / 1000);
    if (id === 'treasure_hunter') return Math.min(1, gameState.stats.totalGoldEarned / 10000);
    if (id === 'gold_baron') return Math.min(1, gameState.stats.totalGoldEarned / 100000);

    // Resource-based
    if (id === 'gem_collector') return Math.min(1, gameState.resources.gems / 100);
    if (id === 'soul_keeper') return Math.min(1, gameState.resources.souls / 50);

    // Upgrade-based
    if (id === 'upgrade_enthusiast') {
        const total = Object.values(gameState.upgrades).reduce((sum, level) => sum + level, 0);
        return Math.min(1, total / 10);
    }

    // Time-based
    if (id === 'dedicated') return Math.min(1, gameState.totalPlayTime / 3600);
    if (id === 'no_life') return Math.min(1, gameState.totalPlayTime / 36000);

    // For boolean achievements, return 0 or 1
    return achievement.condition(gameState) ? 1 : 0;
}

/**
 * Get all unlocked achievements
 */
export function getUnlockedAchievements() {
    return Object.keys(gameState.achievements.unlocked)
        .map(id => ACHIEVEMENTS[id])
        .filter(a => a !== undefined);
}

/**
 * Get completion percentage
 */
export function getCompletionPercentage() {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = Object.keys(gameState.achievements.unlocked).length;
    return Math.round((unlocked / total) * 100);
}

/**
 * Mark newly unlocked achievements as seen
 */
export function clearNewlyUnlocked() {
    gameState.achievements.newlyUnlocked = [];
}

/**
 * Format reward for display
 */
function formatReward(reward) {
    const parts = [];
    if (reward.gold) parts.push(`💰 ${reward.gold} Gold`);
    if (reward.gems) parts.push(`💎 ${reward.gems} Gems`);
    if (reward.souls) parts.push(`👻 ${reward.souls} Souls`);
    return parts.join(', ');
}