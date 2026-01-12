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
        maxXp: 100,
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

    // Equipment & Inventory
    inventory: [],
    equipped: {
        weapon: null,
        armor: null,
        accessory: null
    },

    // Skills (Sprint 2)
    skills: {}, // { skillId: rank }
    skillEffects: {}, // Calculated effects from skills
    bloodlustStacks: 0, // Temporary combat buff
    bloodlustTimer: null, // Timer reference

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
    version: '2.4.1',
    lastSave: Date.now(),
    totalPlayTime: 0
};

/**
 * Save game to localStorage
 */
export function saveGame() {
    try {
        gameState.lastSave = Date.now();
        const saveData = JSON.stringify(gameState);
        localStorage.setItem('dungeonIdleGame', saveData);
        
        console.log('💾 Game saved');
        console.log(`📦 Inventory: ${gameState.inventory?.length || 0} items`);
        console.log(`⚔️ Equipped: Weapon=${gameState.equipped?.weapon?.name || 'None'}, Armor=${gameState.equipped?.armor?.name || 'None'}`);
        console.log(`🌳 Skills: ${Object.keys(gameState.skills || {}).length} learned`);
        
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
                    if (typeof gameState[key] === 'object' && !Array.isArray(gameState[key]) && gameState[key] !== null) {
                        gameState[key] = { ...gameState[key], ...loaded[key] };
                    } else {
                        gameState[key] = loaded[key];
                    }
                }
            });
            
            // Ensure inventory and equipped exist
            if (!gameState.inventory) {
                gameState.inventory = [];
            }
            if (!gameState.equipped) {
                gameState.equipped = { weapon: null, armor: null, accessory: null };
            }
            
            // Ensure skills exist (Sprint 2)
            if (!gameState.skills) {
                gameState.skills = {};
            }
            if (!gameState.skillEffects) {
                gameState.skillEffects = {};
            }
            
            // Reset temporary combat state
            gameState.bloodlustStacks = 0;
            gameState.bloodlustTimer = null;
            
            // Always reset manual run state on load (runs don't persist across page reloads)
            gameState.manualRun.active = false;
            gameState.manualRun.currentFloor = 0;
            gameState.manualRun.currentRoom = 0;
            gameState.manualRun.dungeon = null;
            
            console.log('💾 Game loaded');
            console.log(`📦 Loaded inventory: ${gameState.inventory.length} items`);
            console.log(`⚔️ Loaded equipment: Weapon=${gameState.equipped?.weapon?.name || 'None'}, Armor=${gameState.equipped?.armor?.name || 'None'}`);
            console.log(`🌳 Loaded skills: ${Object.keys(gameState.skills).length} learned`);
            console.log('♻️ Manual run state reset');
            
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
 * Export save data as Base64 string (Unicode-safe)
 */
export function exportSave() {
    try {
        saveGame(); // Save current state first
        const jsonString = JSON.stringify(gameState);
        
        // Use TextEncoder for Unicode-safe Base64 encoding
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(jsonString);
        
        // Convert Uint8Array to Base64
        let binaryString = '';
        uint8Array.forEach(byte => {
            binaryString += String.fromCharCode(byte);
        });
        
        return btoa(binaryString);
    } catch (e) {
        console.error('❌ Export failed:', e);
        return null;
    }
}

/**
 * Import save data from Base64 string (Unicode-safe)
 */
export function importSave(saveString) {
    try {
        // Decode Base64 to binary string
        const binaryString = atob(saveString);
        
        // Convert binary string to Uint8Array
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }
        
        // Use TextDecoder for Unicode-safe decoding
        const decoder = new TextDecoder();
        const jsonString = decoder.decode(uint8Array);
        
        // Parse and validate
        const decoded = JSON.parse(jsonString);
        
        // Save to localStorage
        localStorage.setItem('dungeonIdleGame', JSON.stringify(decoded));
        
        // Reload page to apply
        location.reload();
        return true;
    } catch (e) {
        console.error('❌ Import failed:', e);
        alert('❌ Invalid save data! Make sure you copied the complete export string.');
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
