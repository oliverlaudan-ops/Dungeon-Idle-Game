/**
 * Prestige System
 * Handles ascension, prestige upgrades, and key economy
 */

import { gameState, saveGame } from '../core/game-state.js';

// Prestige Upgrades Definition
export const PRESTIGE_UPGRADES = {
    // ==================== STAT UPGRADES ====================
    PRESTIGE_HP: {
        id: 'PRESTIGE_HP',
        name: 'Eternal Vitality',
        icon: '❤️',
        description: 'Permanently increase max HP',
        category: 'STATS',
        maxLevel: 10,
        baseCost: 5,
        costScaling: 1.5, // Cost multiplier per level
        effect: (level) => ({
            maxHpBonus: level * 10 // +10 HP per level
        }),
        tooltip: (level) => `+${level * 10} Max HP`
    },
    
    PRESTIGE_ATTACK: {
        id: 'PRESTIGE_ATTACK',
        name: 'Eternal Strength',
        icon: '⚔️',
        description: 'Permanently increase attack power',
        category: 'STATS',
        maxLevel: 10,
        baseCost: 5,
        costScaling: 1.5,
        effect: (level) => ({
            attackBonus: level * 2 // +2 Attack per level
        }),
        tooltip: (level) => `+${level * 2} Attack`
    },
    
    PRESTIGE_DEFENSE: {
        id: 'PRESTIGE_DEFENSE',
        name: 'Eternal Resilience',
        icon: '🛡️',
        description: 'Permanently increase defense',
        category: 'STATS',
        maxLevel: 10,
        baseCost: 5,
        costScaling: 1.5,
        effect: (level) => ({
            defenseBonus: level * 1 // +1 Defense per level
        }),
        tooltip: (level) => `+${level} Defense`
    },
    
    PRESTIGE_CRIT: {
        id: 'PRESTIGE_CRIT',
        name: 'Eternal Precision',
        icon: '✨',
        description: 'Permanently increase critical hit chance',
        category: 'STATS',
        maxLevel: 5,
        baseCost: 8,
        costScaling: 2.0,
        effect: (level) => ({
            critChanceBonus: level * 0.02 // +2% per level
        }),
        tooltip: (level) => `+${level * 2}% Crit Chance`
    },
    
    // ==================== RESOURCE UPGRADES ====================
    PRESTIGE_GOLD: {
        id: 'PRESTIGE_GOLD',
        name: 'Golden Touch',
        icon: '💰',
        description: 'Permanently increase gold gained',
        category: 'RESOURCES',
        maxLevel: 10,
        baseCost: 4,
        costScaling: 1.6,
        effect: (level) => ({
            goldMultiplier: 1 + (level * 0.15) // +15% per level
        }),
        tooltip: (level) => `+${level * 15}% Gold`
    },
    
    PRESTIGE_XP: {
        id: 'PRESTIGE_XP',
        name: 'Sage Wisdom',
        icon: '🎓',
        description: 'Permanently increase XP gained',
        category: 'RESOURCES',
        maxLevel: 10,
        baseCost: 4,
        costScaling: 1.6,
        effect: (level) => ({
            xpMultiplier: 1 + (level * 0.15) // +15% per level
        }),
        tooltip: (level) => `+${level * 15}% XP`
    },
    
    PRESTIGE_KEY_FIND: {
        id: 'PRESTIGE_KEY_FIND',
        name: 'Keymaster',
        icon: '🗝️',
        description: 'Increase chance to find keys',
        category: 'RESOURCES',
        maxLevel: 5,
        baseCost: 10,
        costScaling: 2.5,
        effect: (level) => ({
            keyFindBonus: level * 0.10 // +10% per level
        }),
        tooltip: (level) => `+${level * 10}% Key Drop Rate`
    },
    
    PRESTIGE_LOOT: {
        id: 'PRESTIGE_LOOT',
        name: 'Fortune Seeker',
        icon: '🎁',
        description: 'Better loot quality from chests',
        category: 'RESOURCES',
        maxLevel: 5,
        baseCost: 6,
        costScaling: 2.0,
        effect: (level) => ({
            lootQualityBonus: level * 0.15 // +15% per level
        }),
        tooltip: (level) => `+${level * 15}% Loot Quality`
    },
    
    // ==================== CONVENIENCE UPGRADES ====================
    PRESTIGE_START_LEVEL: {
        id: 'PRESTIGE_START_LEVEL',
        name: 'Experienced Adventurer',
        icon: '🌟',
        description: 'Start at a higher level after ascension',
        category: 'CONVENIENCE',
        maxLevel: 5,
        baseCost: 15,
        costScaling: 3.0,
        effect: (level) => ({
            startLevel: 1 + level // Start at level 2, 3, 4, 5, 6
        }),
        tooltip: (level) => `Start at Level ${1 + level}`
    },
    
    PRESTIGE_START_KEYS: {
        id: 'PRESTIGE_START_KEYS',
        name: 'Key Hoarder',
        icon: '🔑',
        description: 'Start each run with extra keys',
        category: 'CONVENIENCE',
        maxLevel: 3,
        baseCost: 12,
        costScaling: 3.5,
        effect: (level) => ({
            startKeys: level // +1, +2, +3 keys
        }),
        tooltip: (level) => `Start with +${level} Keys`
    },
    
    PRESTIGE_AUTO_SAVE: {
        id: 'PRESTIGE_AUTO_SAVE',
        name: 'Divine Protection',
        icon: '🛡️',
        description: 'Prevent death once per run',
        category: 'CONVENIENCE',
        maxLevel: 1,
        baseCost: 25,
        costScaling: 1.0,
        effect: (level) => ({
            deathProtection: level > 0 // True if purchased
        }),
        tooltip: (level) => level > 0 ? 'Death Protection Active' : 'Prevent Death Once'
    },
    
    PRESTIGE_SKILL_POINTS: {
        id: 'PRESTIGE_SKILL_POINTS',
        name: 'Master Trainer',
        icon: '🌳',
        description: 'Start with bonus skill points',
        category: 'CONVENIENCE',
        maxLevel: 5,
        baseCost: 10,
        costScaling: 2.5,
        effect: (level) => ({
            bonusSkillPoints: level // +1 to +5 skill points
        }),
        tooltip: (level) => `Start with +${level} Skill Points`
    }
};

/**
 * Check if player can ascend
 */
export function canAscend() {
    const minLevel = 20;
    const ascensionCost = 10;
    
    return {
        canAscend: gameState.hero.level >= minLevel && gameState.resources.dungeonKeys >= ascensionCost,
        levelReached: gameState.hero.level >= minLevel,
        hasKeys: gameState.resources.dungeonKeys >= ascensionCost,
        keysNeeded: Math.max(0, ascensionCost - gameState.resources.dungeonKeys),
        levelNeeded: Math.max(0, minLevel - gameState.hero.level)
    };
}

/**
 * Perform ascension (prestige)
 */
export function performAscension() {
    const check = canAscend();
    
    if (!check.canAscend) {
        return {
            success: false,
            message: !check.levelReached 
                ? `Need level 20 to ascend (${check.levelNeeded} more levels)` 
                : `Need 10 keys to ascend (${check.keysNeeded} more keys)`
        };
    }
    
    // Deduct ascension cost
    gameState.resources.dungeonKeys -= 10;
    
    // Increment prestige level
    if (!gameState.prestigeLevel) {
        gameState.prestigeLevel = 0;
    }
    gameState.prestigeLevel++;
    
    // Store prestige stats
    if (!gameState.prestigeStats) {
        gameState.prestigeStats = {
            totalAscensions: 0,
            keysSpent: 0
        };
    }
    gameState.prestigeStats.totalAscensions++;
    gameState.prestigeStats.keysSpent += 10;
    
    // Reset hero to starting state (with prestige bonuses)
    resetHeroForAscension();
    
    // Save immediately
    saveGame();
    
    return {
        success: true,
        message: `Ascended to Prestige Level ${gameState.prestigeLevel}!`,
        prestigeLevel: gameState.prestigeLevel
    };
}

/**
 * Reset hero but keep prestige bonuses
 */
function resetHeroForAscension() {
    // Get prestige bonuses
    const bonuses = getPrestigeBonuses();
    
    // Calculate start level
    const startLevel = bonuses.startLevel || 1;
    
    // Reset hero
    gameState.hero.level = startLevel;
    gameState.hero.xp = 0;
    gameState.hero.maxXp = Math.floor(100 * Math.pow(1.5, startLevel - 1));
    
    // Apply base stats + prestige bonuses
    gameState.hero.maxHp = 100 + (startLevel - 1) * 10 + (bonuses.maxHpBonus || 0);
    gameState.hero.hp = gameState.hero.maxHp;
    gameState.hero.attack = 10 + (startLevel - 1) * 2 + (bonuses.attackBonus || 0);
    gameState.hero.defense = 5 + (startLevel - 1) * 1 + (bonuses.defenseBonus || 0);
    gameState.hero.critChance = 0.05 + (bonuses.critChanceBonus || 0);
    gameState.hero.critMultiplier = 2.0;
    
    // Reset resources (except keys)
    gameState.resources.gold = 0;
    gameState.resources.gems = 0;
    gameState.resources.souls = 0;
    // Keys stay! + add start bonus
    gameState.resources.dungeonKeys += (bonuses.startKeys || 0);
    
    // Reset inventory and equipment
    gameState.inventory = [];
    gameState.equipped = {
        weapon: null,
        armor: null,
        accessory: null
    };
    
    // Reset skills but grant bonus points
    gameState.skills = {};
    gameState.skillEffects = {};
    
    // Reset upgrades
    gameState.upgrades = {};
    gameState.upgradeBonuses = {};
    
    // Reset stats
    gameState.stats = {
        totalGoldEarned: 0,
        totalMonstersKilled: 0,
        totalRunsCompleted: 0,
        totalDeaths: 0,
        deepestFloor: 0
    };
    
    console.log(`🔄 Ascended! Starting at Level ${startLevel} with prestige bonuses`);
}

/**
 * Get cost for a prestige upgrade
 */
export function getPrestigeUpgradeCost(upgradeId) {
    const upgrade = PRESTIGE_UPGRADES[upgradeId];
    if (!upgrade) return 0;
    
    const currentLevel = gameState.prestigeUpgrades?.[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) return Infinity;
    
    // Cost formula: baseCost * (costScaling ^ currentLevel)
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costScaling, currentLevel));
}

/**
 * Purchase a prestige upgrade
 */
export function purchasePrestigeUpgrade(upgradeId) {
    const upgrade = PRESTIGE_UPGRADES[upgradeId];
    if (!upgrade) return { success: false, message: 'Upgrade not found' };
    
    // Initialize prestige upgrades if needed
    if (!gameState.prestigeUpgrades) {
        gameState.prestigeUpgrades = {};
    }
    
    const currentLevel = gameState.prestigeUpgrades[upgradeId] || 0;
    
    // Check max level
    if (currentLevel >= upgrade.maxLevel) {
        return { success: false, message: 'Already at max level' };
    }
    
    const cost = getPrestigeUpgradeCost(upgradeId);
    
    // Check if can afford
    if (gameState.resources.dungeonKeys < cost) {
        return { 
            success: false, 
            message: `Need ${cost} keys (have ${gameState.resources.dungeonKeys})` 
        };
    }
    
    // Purchase upgrade
    gameState.resources.dungeonKeys -= cost;
    gameState.prestigeUpgrades[upgradeId] = currentLevel + 1;
    
    // Track total keys spent
    if (!gameState.prestigeStats) {
        gameState.prestigeStats = { totalAscensions: 0, keysSpent: 0 };
    }
    gameState.prestigeStats.keysSpent += cost;
    
    saveGame();
    
    return {
        success: true,
        message: `${upgrade.name} upgraded to level ${currentLevel + 1}!`,
        newLevel: currentLevel + 1
    };
}

/**
 * Get all active prestige bonuses
 */
export function getPrestigeBonuses() {
    const bonuses = {};
    
    if (!gameState.prestigeUpgrades) return bonuses;
    
    Object.entries(gameState.prestigeUpgrades).forEach(([upgradeId, level]) => {
        const upgrade = PRESTIGE_UPGRADES[upgradeId];
        if (upgrade && level > 0) {
            const effects = upgrade.effect(level);
            Object.entries(effects).forEach(([key, value]) => {
                if (bonuses[key] !== undefined) {
                    bonuses[key] += value;
                } else {
                    bonuses[key] = value;
                }
            });
        }
    });
    
    return bonuses;
}

/**
 * Get upgrades by category
 */
export function getUpgradesByCategory(category) {
    return Object.values(PRESTIGE_UPGRADES).filter(u => u.category === category);
}
