/**
 * Achievement Definitions
 * All achievements with unlock conditions and rewards
 */

export const ACHIEVEMENT_CATEGORIES = {
    PROGRESS: 'progress',
    COMBAT: 'combat',
    WEALTH: 'wealth',
    MASTERY: 'mastery'
};

export const ACHIEVEMENTS = {
    // === PROGRESS ACHIEVEMENTS ===
    first_steps: {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Reach Level 5',
        icon: '🌱',
        category: ACHIEVEMENT_CATEGORIES.PROGRESS,
        condition: (state) => state.hero.level >= 5,
        reward: { gold: 100, gems: 5 },
        hidden: false
    },
    apprentice: {
        id: 'apprentice',
        name: 'Apprentice',
        description: 'Reach Level 10',
        icon: '⚔️',
        category: ACHIEVEMENT_CATEGORIES.PROGRESS,
        condition: (state) => state.hero.level >= 10,
        reward: { gold: 500, gems: 10 },
        hidden: false
    },
    veteran: {
        id: 'veteran',
        name: 'Veteran',
        description: 'Reach Level 20',
        icon: '🛡️',
        category: ACHIEVEMENT_CATEGORIES.PROGRESS,
        condition: (state) => state.hero.level >= 20,
        reward: { gold: 2000, gems: 25, souls: 5 },
        hidden: false
    },
    master: {
        id: 'master',
        name: 'Master',
        description: 'Reach Level 50',
        icon: '👑',
        category: ACHIEVEMENT_CATEGORIES.PROGRESS,
        condition: (state) => state.hero.level >= 50,
        reward: { gold: 10000, gems: 100, souls: 20 },
        hidden: false
    },

    // === COMBAT ACHIEVEMENTS ===
    first_run: {
        id: 'first_run',
        name: 'First Exploration',
        description: 'Complete your first run',
        icon: '🎯',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => state.idle.totalAutoRuns >= 1,
        reward: { gold: 50 },
        hidden: false
    },
    dungeon_explorer: {
        id: 'dungeon_explorer',
        name: 'Dungeon Explorer',
        description: 'Complete 50 runs',
        icon: '🗺️',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => state.idle.totalAutoRuns >= 50,
        reward: { gold: 1000, gems: 10 },
        hidden: false
    },
    dungeon_master: {
        id: 'dungeon_master',
        name: 'Dungeon Master',
        description: 'Complete 100 successful runs',
        icon: '🏆',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => state.idle.successfulRuns >= 100,
        reward: { gold: 5000, gems: 50, souls: 10 },
        hidden: false
    },
    perfectionist: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 90% success rate (min. 50 runs)',
        icon: '⭐',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => {
            const total = state.idle.totalAutoRuns;
            const successful = state.idle.successfulRuns;
            return total >= 50 && (successful / total) >= 0.9;
        },
        reward: { gold: 3000, gems: 30, souls: 15 },
        hidden: false
    },
    unstoppable: {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Complete 500 runs',
        icon: '🔥',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => state.idle.totalAutoRuns >= 500,
        reward: { gold: 20000, gems: 150, souls: 50 },
        hidden: false
    },

    // === WEALTH ACHIEVEMENTS ===
    penny_pincher: {
        id: 'penny_pincher',
        name: 'Penny Pincher',
        description: 'Earn 1,000 Gold',
        icon: '💰',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.stats.totalGoldEarned >= 1000,
        reward: { gems: 5 },
        hidden: false
    },
    treasure_hunter: {
        id: 'treasure_hunter',
        name: 'Treasure Hunter',
        description: 'Earn 10,000 Gold',
        icon: '💎',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.stats.totalGoldEarned >= 10000,
        reward: { gems: 25, souls: 5 },
        hidden: false
    },
    gold_baron: {
        id: 'gold_baron',
        name: 'Gold Baron',
        description: 'Earn 100,000 Gold',
        icon: '👑',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.stats.totalGoldEarned >= 100000,
        reward: { gems: 100, souls: 25 },
        hidden: false
    },
    gem_collector: {
        id: 'gem_collector',
        name: 'Gem Collector',
        description: 'Collect 100 Gems',
        icon: '💠',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.resources.gems >= 100,
        reward: { gold: 5000, souls: 10 },
        hidden: false
    },
    soul_keeper: {
        id: 'soul_keeper',
        name: 'Soul Keeper',
        description: 'Collect 50 Souls',
        icon: '👻',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.resources.souls >= 50,
        reward: { gold: 5000, gems: 25 },
        hidden: false
    },

    // === MASTERY ACHIEVEMENTS ===
    upgrade_novice: {
        id: 'upgrade_novice',
        name: 'Upgrade Novice',
        description: 'Buy your first upgrade',
        icon: '⬆️',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => {
            return Object.values(state.upgrades).some(level => level > 0);
        },
        reward: { gold: 200, gems: 5 },
        hidden: false
    },
    upgrade_enthusiast: {
        id: 'upgrade_enthusiast',
        name: 'Upgrade Enthusiast',
        description: 'Buy 10 upgrade levels',
        icon: '📈',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => {
            const totalLevels = Object.values(state.upgrades).reduce((sum, level) => sum + level, 0);
            return totalLevels >= 10;
        },
        reward: { gold: 1000, gems: 20, souls: 5 },
        hidden: false
    },
    upgrade_master: {
        id: 'upgrade_master',
        name: 'Upgrade Master',
        description: 'Max out an upgrade',
        icon: '✨',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => {
            return Object.values(state.upgrades).some(level => level >= 10);
        },
        reward: { gold: 5000, gems: 50, souls: 20 },
        hidden: false
    },
    completionist: {
        id: 'completionist',
        name: 'Completionist',
        description: 'Max out all upgrades',
        icon: '🌟',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => {
            // Check if all 12 upgrades are at level 10
            const upgradeCount = Object.keys(state.upgrades).length;
            if (upgradeCount < 12) return false;
            return Object.values(state.upgrades).every(level => level >= 10);
        },
        reward: { gold: 50000, gems: 500, souls: 100 },
        hidden: false
    },
    dedicated: {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Play for 1 hour',
        icon: '⏰',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => state.totalPlayTime >= 3600,
        reward: { gold: 1000, gems: 25 },
        hidden: false
    },
    no_life: {
        id: 'no_life',
        name: 'Hardcore Gamer',
        description: 'Play for 10 hours',
        icon: '🎮',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => state.totalPlayTime >= 36000,
        reward: { gold: 25000, gems: 200, souls: 50 },
        hidden: false
    }
};

/**
 * Get all achievements as array
 */
export function getAllAchievements() {
    return Object.values(ACHIEVEMENTS);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category) {
    return getAllAchievements().filter(a => a.category === category);
}