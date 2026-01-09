/**
 * Loot System v1.1
 * Generates equipment drops from defeated monsters and dungeons
 */

import { gameState } from '../core/game-state.js';
import { createEquipment } from './equipment-system.js';

// Drop rates by difficulty - INCREASED!
const DROP_RATES = {
    EASY: {
        chance: 0.50,           // 50% chance to get loot
        minRarity: 'common',
        maxRarity: 'uncommon',
        minQuantity: 1,
        maxQuantity: 2
    },
    NORMAL: {
        chance: 0.75,           // 75% chance
        minRarity: 'common',
        maxRarity: 'rare',
        minQuantity: 1,
        maxQuantity: 2
    },
    HARD: {
        chance: 0.85,           // 85% chance
        minRarity: 'uncommon',
        maxRarity: 'epic',
        minQuantity: 2,
        maxQuantity: 3
    },
    EXPERT: {
        chance: 1.0,            // 100% GUARANTEED
        minRarity: 'rare',
        maxRarity: 'legendary',
        minQuantity: 2,
        maxQuantity: 4
    }
};

// Rarity weights (how likely each rarity is)
const RARITY_WEIGHTS = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 4,
    legendary: 1
};

// All possible loot items
const LOOT_POOL = {
    weapons: [
        'iron-sword',
        'steel-sword',
        'elven-bow',
        'warhammer',
        'enchanted-blade',
        'assassins-dagger'
    ],
    armor: [
        'leather-armor',
        'chain-mail',
        'plate-armor',
        'dragon-scale'
    ],
    accessories: [
        'ring-of-power',
        'amulet-of-defense',
        'necklace-of-vitality'
    ]
};

/**
 * Determine if loot drops from a run
 */
export function shouldDropLoot(difficulty) {
    const rates = DROP_RATES[difficulty];
    if (!rates) return false;
    return Math.random() < rates.chance;
}

/**
 * Pick a random rarity based on weights and difficulty
 */
function getRandomRarity(difficulty) {
    const rates = DROP_RATES[difficulty];
    
    // Weighted random selection
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const rarityIndex = rarities.indexOf(rates.minRarity);
    const maxIndex = rarities.indexOf(rates.maxRarity);
    
    // Create filtered weights
    let filteredRarities = rarities.slice(rarityIndex, maxIndex + 1);
    let filteredWeights = filteredRarities.map(r => RARITY_WEIGHTS[r]);
    
    // Weighted random selection
    const totalWeight = filteredWeights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < filteredRarities.length; i++) {
        random -= filteredWeights[i];
        if (random <= 0) return filteredRarities[i];
    }
    
    return filteredRarities[filteredRarities.length - 1];
}

/**
 * Get a random item from the loot pool
 */
function getRandomLootTemplate() {
    const allItems = [
        ...LOOT_POOL.weapons.map(id => ({ id, type: 'weapon' })),
        ...LOOT_POOL.armor.map(id => ({ id, type: 'armor' })),
        ...LOOT_POOL.accessories.map(id => ({ id, type: 'accessory' }))
    ];
    
    return allItems[Math.floor(Math.random() * allItems.length)];
}

/**
 * Generate loot drops for a completed run
 */
export function generateLootDrops(difficulty, runSuccess = true) {
    const drops = [];
    
    console.log(`🎲 Generating loot for ${difficulty} difficulty...`);
    
    // Only drop loot if run was successful
    if (!runSuccess) {
        console.log('❌ Run failed - no loot');
        return drops;
    }
    
    // Check if loot should drop
    if (!shouldDropLoot(difficulty)) {
        console.log('💔 No loot dropped (unlucky roll)');
        return drops;
    }
    
    // Determine how many items
    const rates = DROP_RATES[difficulty];
    const quantity = Math.floor(Math.random() * 
        (rates.maxQuantity - rates.minQuantity + 1)) + rates.minQuantity;
    
    console.log(`🎁 Generating ${quantity} items...`);
    
    // Generate each item
    for (let i = 0; i < quantity; i++) {
        const lootTemplate = getRandomLootTemplate();
        const rarity = getRandomRarity(difficulty);
        const equipment = createEquipment(lootTemplate.id, rarity);
        
        if (equipment) {
            drops.push(equipment);
            console.log(`✨ Generated: ${equipment.name} (${rarity})`);
        } else {
            console.warn(`⚠️ Failed to create equipment: ${lootTemplate.id}`);
        }
    }
    
    console.log(`✅ Total loot generated: ${drops.length} items`);
    return drops;
}

/**
 * Add loot to player inventory
 */
export function addLootToInventory(loot) {
    if (!gameState.inventory) {
        gameState.inventory = [];
    }
    
    console.log(`📦 Adding ${loot.length} items to inventory`);
    console.log(`📦 Inventory before: ${gameState.inventory.length} items`);
    
    gameState.inventory.push(...loot);
    
    console.log(`📦 Inventory after: ${gameState.inventory.length} items`);
    
    return loot;
}

/**
 * Get loot drop notification message
 */
export function getLootNotificationMessage(drops) {
    if (drops.length === 0) {
        return 'No loot received...';
    }
    
    const rarityEmojis = {
        common: '⚪',
        uncommon: '🟢',
        rare: '🔵',
        epic: '🟣',
        legendary: '🟡'
    };
    
    const lootList = drops.map(item => 
        `${rarityEmojis[item.rarity]} ${item.name}`
    ).join(', ');
    
    return `Loot received: ${lootList}`;
}

/**
 * Get detailed loot information
 */
export function getLootDetails(drops) {
    if (drops.length === 0) {
        return {
            hasLoot: false,
            count: 0,
            items: []
        };
    }
    
    return {
        hasLoot: true,
        count: drops.length,
        items: drops.map(item => ({
            icon: item.icon,
            name: item.name,
            rarity: item.rarity,
            type: item.type,
            color: item.color
        }))
    };
}

/**
 * Get drop rate for difficulty (for UI display)
 */
export function getDropRateForDifficulty(difficulty) {
    const rates = DROP_RATES[difficulty];
    if (!rates) return '0%';
    return `${Math.round(rates.chance * 100)}%`;
}

/**
 * Simulate full loot drop from boss room
 * (Higher chance, better rarity)
 */
export function generateBossLoot(difficulty) {
    const drops = [];
    
    // Bosses always drop loot
    const rates = DROP_RATES[difficulty];
    const baseQuantity = difficulty === 'EXPERT' ? 3 : 2;
    const quantity = baseQuantity + (Math.random() < 0.5 ? 1 : 0);
    
    for (let i = 0; i < quantity; i++) {
        const lootTemplate = getRandomLootTemplate();
        const rarity = getRandomRarity(difficulty);
        const equipment = createEquipment(lootTemplate.id, rarity);
        
        if (equipment) {
            drops.push(equipment);
        }
    }
    
    return drops;
}

/**
 * Get statistics about loot drops
 */
export function getLootStatistics() {
    const stats = {
        totalLooted: 0,
        byType: {
            weapon: 0,
            armor: 0,
            accessory: 0
        },
        byRarity: {
            common: 0,
            uncommon: 0,
            rare: 0,
            epic: 0,
            legendary: 0
        }
    };
    
    if (!gameState.inventory) return stats;
    
    gameState.inventory.forEach(item => {
        stats.totalLooted++;
        stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
        stats.byRarity[item.rarity] = (stats.byRarity[item.rarity] || 0) + 1;
    });
    
    return stats;
}
