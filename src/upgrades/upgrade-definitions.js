/**
 * Upgrade Definitions
 * All available upgrades with costs, effects, and descriptions
 */

export const UPGRADE_CATEGORIES = {
    COMBAT: 'combat',
    IDLE: 'idle',
    SPECIAL: 'special'
};

export const UPGRADES = {
    // ===== COMBAT UPGRADES =====
    attack_boost: {
        id: 'attack_boost',
        name: 'Sharper Blade',
        category: UPGRADE_CATEGORIES.COMBAT,
        description: 'Increases your hero\'s attack power',
        icon: '⚔️',
        maxLevel: 20,
        baseCost: { gold: 50, gems: 0, souls: 0 },
        costMultiplier: 1.4,
        effect: (level) => ({ attack: level * 2 })
    },
    defense_boost: {
        id: 'defense_boost',
        name: 'Stronger Armor',
        category: UPGRADE_CATEGORIES.COMBAT,
        description: 'Increases your hero\'s defense',
        icon: '🛡️',
        maxLevel: 20,
        baseCost: { gold: 40, gems: 0, souls: 0 },
        costMultiplier: 1.4,
        effect: (level) => ({ defense: level * 1 })
    },
    hp_boost: {
        id: 'hp_boost',
        name: 'Greater Vitality',
        category: UPGRADE_CATEGORIES.COMBAT,
        description: 'Increases maximum health points',
        icon: '❤️',
        maxLevel: 20,
        baseCost: { gold: 60, gems: 0, souls: 0 },
        costMultiplier: 1.4,
        effect: (level) => ({ maxHp: level * 20 })
    },
    crit_chance: {
        id: 'crit_chance',
        name: 'Precision Strike',
        category: UPGRADE_CATEGORIES.COMBAT,
        description: 'Increases critical hit chance',
        icon: '✨',
        maxLevel: 10,
        baseCost: { gold: 100, gems: 1, souls: 0 },
        costMultiplier: 1.6,
        effect: (level) => ({ critChance: level * 0.01 })
    },
    crit_damage: {
        id: 'crit_damage',
        name: 'Deadly Strike',
        category: UPGRADE_CATEGORIES.COMBAT,
        description: 'Increases critical damage bonus',
        icon: '💥',
        maxLevel: 10,
        baseCost: { gold: 120, gems: 2, souls: 0 },
        costMultiplier: 1.6,
        effect: (level) => ({ critMultiplier: level * 0.1 })
    },

    // ===== IDLE UPGRADES =====
    faster_runs: {
        id: 'faster_runs',
        name: 'Faster Exploration',
        category: UPGRADE_CATEGORIES.IDLE,
        description: 'Reduces auto-run interval',
        icon: '⏰',
        maxLevel: 8,
        baseCost: { gold: 150, gems: 0, souls: 0 },
        costMultiplier: 1.8,
        effect: (level) => ({ autoRunInterval: -level * 5 })
    },
    better_success: {
        id: 'better_success',
        name: 'Combat Tactics',
        category: UPGRADE_CATEGORIES.IDLE,
        description: 'Increases auto-run success rate',
        icon: '🎯',
        maxLevel: 15,
        baseCost: { gold: 80, gems: 0, souls: 0 },
        costMultiplier: 1.5,
        effect: (level) => ({ successBonus: level * 0.02 })
    },
    gold_multiplier: {
        id: 'gold_multiplier',
        name: 'Treasure Hunter',
        category: UPGRADE_CATEGORIES.IDLE,
        description: 'Increases gold gained from runs',
        icon: '💰',
        maxLevel: 20,
        baseCost: { gold: 100, gems: 0, souls: 0 },
        costMultiplier: 1.5,
        effect: (level) => ({ goldMultiplier: level * 0.1 })
    },
    xp_multiplier: {
        id: 'xp_multiplier',
        name: 'Quick Learner',
        category: UPGRADE_CATEGORIES.IDLE,
        description: 'Increases XP gained from runs',
        icon: '📚',
        maxLevel: 15,
        baseCost: { gold: 120, gems: 0, souls: 0 },
        costMultiplier: 1.5,
        effect: (level) => ({ xpMultiplier: level * 0.1 })
    },

    // ===== SPECIAL UPGRADES =====
    gem_finder: {
        id: 'gem_finder',
        name: 'Gem Hunter',
        category: UPGRADE_CATEGORIES.SPECIAL,
        description: 'Increases gem drop chance',
        icon: '💎',
        maxLevel: 10,
        baseCost: { gold: 200, gems: 0, souls: 1 },
        costMultiplier: 1.7,
        effect: (level) => ({ gemChanceBonus: level * 0.05 })
    },
    soul_harvester: {
        id: 'soul_harvester',
        name: 'Soul Collector',
        category: UPGRADE_CATEGORIES.SPECIAL,
        description: 'Increases soul drop chance',
        icon: '👻',
        maxLevel: 10,
        baseCost: { gold: 250, gems: 0, souls: 0 },
        costMultiplier: 1.7,
        effect: (level) => ({ soulChanceBonus: level * 0.03 })
    },
    extra_keys: {
        id: 'extra_keys',
        name: 'Master Thief',
        category: UPGRADE_CATEGORIES.SPECIAL,
        description: 'Gives you additional dungeon keys',
        icon: '🗝️',
        maxLevel: 5,
        baseCost: { gold: 500, gems: 5, souls: 2 },
        costMultiplier: 2.0,
        effect: (level) => ({ extraKeys: level * 1 })
    }
};

/**
 * Calculate cost for specific upgrade level
 */
export function getUpgradeCost(upgradeId, currentLevel) {
    const upgrade = UPGRADES[upgradeId];
    if (!upgrade) return null;

    const level = currentLevel + 1;
    const multiplier = Math.pow(upgrade.costMultiplier, currentLevel);

    return {
        gold: Math.floor(upgrade.baseCost.gold * multiplier),
        gems: Math.floor(upgrade.baseCost.gems * multiplier),
        souls: Math.floor(upgrade.baseCost.souls * multiplier)
    };
}

/**
 * Get total effect of an upgrade at given level
 */
export function getUpgradeEffect(upgradeId, level) {
    const upgrade = UPGRADES[upgradeId];
    if (!upgrade || level === 0) return {};
    return upgrade.effect(level);
}