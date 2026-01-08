/**
 * Upgrade Definitions
 * All permanent upgrades available in the game
 */

export const upgradeCategories = {
    HERO: 'hero',
    IDLE: 'idle',
    COMBAT: 'combat'
};

export const upgrades = [
    // === HERO UPGRADES ===
    {
        id: 'hero_hp_1',
        name: 'Vitality I',
        description: '+20 Max HP',
        category: upgradeCategories.HERO,
        cost: { gold: 50 },
        maxLevel: 5,
        effect: () => {
            return { maxHp: 20 };
        }
    },
    {
        id: 'hero_attack_1',
        name: 'Strength I',
        description: '+3 Attack',
        category: upgradeCategories.HERO,
        cost: { gold: 75 },
        maxLevel: 5,
        effect: () => {
            return { attack: 3 };
        }
    },
    {
        id: 'hero_defense_1',
        name: 'Toughness I',
        description: '+2 Defense',
        category: upgradeCategories.HERO,
        cost: { gold: 60 },
        maxLevel: 5,
        effect: () => {
            return { defense: 2 };
        }
    },
    {
        id: 'hero_crit_1',
        name: 'Critical Training',
        description: '+2% Critical Chance',
        category: upgradeCategories.HERO,
        cost: { gold: 100, gems: 2 },
        maxLevel: 3,
        effect: () => {
            return { critChance: 0.02 };
        }
    },

    // === IDLE UPGRADES ===
    {
        id: 'idle_speed_1',
        name: 'Swift Runs',
        description: 'Reduziere Auto-Run Intervall um 10s',
        category: upgradeCategories.IDLE,
        cost: { gold: 100 },
        maxLevel: 3,
        effect: () => {
            return { autoRunInterval: -10 };
        }
    },
    {
        id: 'idle_success_1',
        name: 'Better Preparation',
        description: '+5% Auto-Run Erfolgsrate',
        category: upgradeCategories.IDLE,
        cost: { gold: 150, souls: 1 },
        maxLevel: 4,
        effect: () => {
            return { autoRunSuccessBonus: 0.05 };
        }
    },
    {
        id: 'idle_rewards_1',
        name: 'Lucky Charm',
        description: '+20% Gold aus Auto-Runs',
        category: upgradeCategories.IDLE,
        cost: { gold: 200, gems: 3 },
        maxLevel: 5,
        effect: () => {
            return { autoRunGoldBonus: 0.2 };
        }
    },
    {
        id: 'idle_gem_chance',
        name: 'Gem Hunter',
        description: '+5% Gem Drop-Chance',
        category: upgradeCategories.IDLE,
        cost: { gold: 300, gems: 5 },
        maxLevel: 3,
        effect: () => {
            return { gemDropBonus: 0.05 };
        }
    },

    // === COMBAT UPGRADES ===
    {
        id: 'combat_xp_1',
        name: 'Fast Learner',
        description: '+25% XP Gain',
        category: upgradeCategories.COMBAT,
        cost: { gold: 150 },
        maxLevel: 4,
        effect: () => {
            return { xpBonus: 0.25 };
        }
    },
    {
        id: 'combat_crit_dmg',
        name: 'Devastating Blows',
        description: '+25% Critical Damage',
        category: upgradeCategories.COMBAT,
        cost: { gold: 250, souls: 2 },
        maxLevel: 3,
        effect: () => {
            return { critMultiplier: 0.25 };
        }
    },

    // === ADVANCED UPGRADES ===
    {
        id: 'soul_collector',
        name: 'Soul Collector',
        description: '+10% Soul Drop-Chance',
        category: upgradeCategories.IDLE,
        cost: { gold: 500, souls: 3 },
        maxLevel: 2,
        requires: ['idle_gem_chance'],
        effect: () => {
            return { soulDropBonus: 0.1 };
        }
    },
    {
        id: 'powerhouse',
        name: 'Powerhouse',
        description: '+10 Attack, +5 Defense',
        category: upgradeCategories.HERO,
        cost: { gold: 1000, gems: 10, souls: 5 },
        maxLevel: 1,
        requires: ['hero_attack_1', 'hero_defense_1'],
        effect: () => {
            return { attack: 10, defense: 5 };
        }
    }
];

/**
 * Get upgrade cost for specific level
 */
export function getUpgradeCost(upgrade, currentLevel) {
    const costMultiplier = Math.pow(1.5, currentLevel);
    const cost = {};
    
    Object.keys(upgrade.cost).forEach(resource => {
        cost[resource] = Math.floor(upgrade.cost[resource] * costMultiplier);
    });
    
    return cost;
}

/**
 * Check if player can afford upgrade
 */
export function canAffordUpgrade(upgrade, currentLevel, resources) {
    const cost = getUpgradeCost(upgrade, currentLevel);
    
    return Object.keys(cost).every(resource => {
        return resources[resource] >= cost[resource];
    });
}

/**
 * Check if upgrade requirements are met
 */
export function meetsRequirements(upgrade, purchasedUpgrades) {
    if (!upgrade.requires) return true;
    
    return upgrade.requires.every(reqId => {
        return purchasedUpgrades[reqId] && purchasedUpgrades[reqId] > 0;
    });
}