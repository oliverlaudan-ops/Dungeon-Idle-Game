/**
 * Game State Management
 * Handles all game state and save/load functionality
 */

export const gameState = {
    // Hero stats
    hero: {
        name: 'Adventurer',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        critChance: 0.05,
        critMultiplier: 2.0
    },

    // Resources
    resources: {
        gold: 0,
        gems: 0,
        souls: 0,
        dungeonKeys: 3
    },

    // Idle system
    idle: {
        autoRunEnabled: false,
        autoRunInterval: 60, // seconds
        lastAutoRun: Date.now(),
        totalAutoRuns: 0,
        successfulRuns: 0
    },

    // Manual run state
    manualRun: {
        active: false,
        currentFloor: 0,
        currentRoom: 0,
        dungeon: null
    },

    // Upgrades (key: upgradeId, value: level)
    upgrades: {},

    // Upgrade bonuses (calculated from upgrades)
    upgradeBonuses: {},

    // Achievements
    achievements: {
        unlocked: {}, // { achievementId: timestamp }
        newlyUnlocked: [] // Array of achievement IDs for notification
    },

    // Statistics
    stats: {
        totalGoldEarned: 0,
        totalMonstersKilled: 0,
        totalRunsCompleted: 0,
        totalDeaths: 0,
        deepestFloor: 0
    },

    // Meta
    version: '0.1.0',
    lastSave: Date.now(),
    totalPlayTime: 0
};

/**
 * Save game to localStorage
 */
export function saveGame() {
    try {
        gameState.lastSave = Date.now();
        localStorage.setItem('dungeonIdleGame', JSON.stringify(gameState));
        console.log('💾 Game saved');
        return true;
    } catch (e) {
        console.error('❌ Save failed:', e);
        return false;
    }
}

/**
 * Load game from localStorage
 */
export function loadGame() {
    try {
        const saved = localStorage.getItem('dungeonIdleGame');
        if (saved) {
            const loaded = JSON.parse(saved);
            // Merge loaded state with default state to handle new properties
            Object.keys(gameState).forEach(key => {
                if (loaded[key] !== undefined) {
                    if (typeof gameState[key] === 'object' && !Array.isArray(gameState[key])) {
                        gameState[key] = { ...gameState[key], ...loaded[key] };
                    } else {
                        gameState[key] = loaded[key];
                    }
                }
            });
            console.log('💾 Game loaded');
            return true;
        }
        console.log('🆕 No save found, starting new game');
        return false;
    } catch (e) {
        console.error('❌ Load failed:', e);
        return false;
    }
}

/**
 * Reset game (for testing or hard reset)
 */
export function resetGame() {
    if (confirm('⚠️ Are you sure? This will delete all progress!')) {
        localStorage.removeItem('dungeonIdleGame');
        location.reload();
    }
}

/**
 * Auto-save every 30 seconds
 */
setInterval(saveGame, 30000);