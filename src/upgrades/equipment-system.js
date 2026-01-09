/**
 * Equipment System
 * Handles weapons, armor, and gear with stat bonuses
 */

import { gameState } from '../core/game-state.js';

// Equipment rarity tiers
const RARITY_TIERS = {
    common: { color: '#95a5a6', multiplier: 1.0, dropChance: 0.60 },
    uncommon: { color: '#2ecc71', multiplier: 1.25, dropChance: 0.25 },
    rare: { color: '#3498db', multiplier: 1.50, dropChance: 0.10 },
    epic: { color: '#9b59b6', multiplier: 1.75, dropChance: 0.04 },
    legendary: { color: '#f39c12', multiplier: 2.0, dropChance: 0.01 }
};

// Weapon templates
const WEAPONS = {
    'iron-sword': {
        name: 'Iron Sword',
        type: 'weapon',
        icon: '⚔️',
        baseATK: 5,
        baseCrit: 0.0,
        description: 'Basic iron sword for beginners'
    },
    'steel-sword': {
        name: 'Steel Sword',
        type: 'weapon',
        icon: '⚔️',
        baseATK: 10,
        baseCrit: 0.05,
        description: 'Sturdy steel blade'
    },
    'elven-bow': {
        name: 'Elven Bow',
        type: 'weapon',
        icon: '🏹',
        baseATK: 8,
        baseCrit: 0.15,
        description: 'High crit chance ranged weapon'
    },
    'warhammer': {
        name: 'Warhammer',
        type: 'weapon',
        icon: '🔨',
        baseATK: 15,
        baseCrit: 0.0,
        description: 'Heavy hitting two-hander'
    },
    'enchanted-blade': {
        name: 'Enchanted Blade',
        type: 'weapon',
        icon: '✨⚔️',
        baseATK: 12,
        baseCrit: 0.10,
        description: 'Magically enhanced sword'
    }
};

// Armor templates
const ARMOR = {
    'leather-armor': {
        name: 'Leather Armor',
        type: 'armor',
        icon: '🥾',
        baseDEF: 3,
        baseHP: 0,
        description: 'Light leather protection'
    },
    'chain-mail': {
        name: 'Chain Mail',
        type: 'armor',
        icon: '🛡️',
        baseDEF: 7,
        baseHP: 10,
        description: 'Metal chain protection'
    },
    'plate-armor': {
        name: 'Plate Armor',
        type: 'armor',
        icon: '🔱',
        baseDEF: 12,
        baseHP: 25,
        description: 'Heavy plate armor'
    },
    'dragon-scale': {
        name: 'Dragon Scale Armor',
        type: 'armor',
        icon: '🐉',
        baseDEF: 15,
        baseHP: 40,
        description: 'Legendary dragon protection'
    }
};

// Accessory templates (rings, amulets, etc)
const ACCESSORIES = {
    'ring-of-power': {
        name: 'Ring of Power',
        type: 'accessory',
        icon: '💍',
        bonusATK: 3,
        bonusDEF: 0,
        bonusHP: 0,
        description: '+3 Attack'
    },
    'amulet-of-defense': {
        name: 'Amulet of Defense',
        type: 'accessory',
        icon: '📿',
        bonusATK: 0,
        bonusDEF: 3,
        bonusHP: 0,
        description: '+3 Defense'
    },
    'necklace-of-vitality': {
        name: 'Necklace of Vitality',
        type: 'accessory',
        icon: '💎',
        bonusATK: 0,
        bonusDEF: 0,
        bonusHP: 20,
        description: '+20 HP'
    }
};

/**
 * Create an equipment piece with rarity
 */
export function createEquipment(templateId, rarity = 'common') {
    let template = WEAPONS[templateId] || ARMOR[templateId] || ACCESSORIES[templateId];
    
    if (!template) {
        console.warn(`⚠️ Equipment template not found: ${templateId}`);
        return null;
    }

    const rarityInfo = RARITY_TIERS[rarity];
    if (!rarityInfo) {
        rarity = 'common';
    }

    const mult = RARITY_TIERS[rarity].multiplier;

    const equipment = {
        id: `${templateId}-${Date.now()}`,
        templateId,
        name: template.name,
        type: template.type,
        icon: template.icon,
        rarity,
        color: RARITY_TIERS[rarity].color,
        description: template.description,
        level: 1,
        equipped: false,
        createdAt: Date.now()
    };

    // Apply rarity multipliers to stats
    if (template.type === 'weapon') {
        equipment.atk = Math.floor(template.baseATK * mult);
        equipment.crit = template.baseCrit;
    } else if (template.type === 'armor') {
        equipment.def = Math.floor(template.baseDEF * mult);
        equipment.hp = Math.floor(template.baseHP * mult);
    } else if (template.type === 'accessory') {
        equipment.bonusATK = Math.floor(template.bonusATK * mult);
        equipment.bonusDEF = Math.floor(template.bonusDEF * mult);
        equipment.bonusHP = Math.floor(template.bonusHP * mult);
    }

    return equipment;
}

/**
 * Equip an item to hero
 */
export function equipItem(equipmentId) {
    const equipment = gameState.inventory?.find(e => e.id === equipmentId);
    if (!equipment) {
        console.warn(`⚠️ Equipment not found: ${equipmentId}`);
        return false;
    }

    // Unequip old item of same type if exists
    const oldEquipped = gameState.equipped?.[equipment.type];
    if (oldEquipped) {
        unequipItem(oldEquipped.id);
    }

    // Initialize equipped object if needed
    if (!gameState.equipped) {
        gameState.equipped = {};
    }

    // Equip new item
    equipment.equipped = true;
    gameState.equipped[equipment.type] = equipment;
    
    // Recalculate hero stats
    recalculateStats();
    console.log(`✅ Equipped: ${equipment.name}`);
    return true;
}

/**
 * Unequip an item
 */
export function unequipItem(equipmentId) {
    const equipment = gameState.inventory?.find(e => e.id === equipmentId);
    if (!equipment) return false;

    equipment.equipped = false;
    if (gameState.equipped?.[equipment.type]?.id === equipmentId) {
        delete gameState.equipped[equipment.type];
    }

    recalculateStats();
    console.log(`❌ Unequipped: ${equipment.name}`);
    return true;
}

/**
 * Recalculate hero stats based on equipped items
 */
function recalculateStats() {
    if (!gameState.equipped) return;

    // Reset to base stats
    const baseATK = 10 + gameState.hero.level * 2;
    const baseDEF = 5;
    let baseHP = 100;

    let totalATK = baseATK;
    let totalDEF = baseDEF;
    let totalHP = baseHP;

    // Apply equipment bonuses
    Object.values(gameState.equipped).forEach(equipment => {
        if (equipment.type === 'weapon') {
            totalATK += equipment.atk || 0;
        } else if (equipment.type === 'armor') {
            totalDEF += equipment.def || 0;
            totalHP += equipment.hp || 0;
        } else if (equipment.type === 'accessory') {
            totalATK += equipment.bonusATK || 0;
            totalDEF += equipment.bonusDEF || 0;
            totalHP += equipment.bonusHP || 0;
        }
    });

    // Update hero stats
    gameState.hero.attack = totalATK;
    gameState.hero.defense = totalDEF;
    gameState.hero.maxHp = totalHP;
    
    // Heal to full when equipping
    gameState.hero.hp = totalHP;
}

/**
 * Get all available weapons
 */
export function getAvailableWeapons() {
    return Object.keys(WEAPONS);
}

/**
 * Get all available armor
 */
export function getAvailableArmor() {
    return Object.keys(ARMOR);
}

/**
 * Get all available accessories
 */
export function getAvailableAccessories() {
    return Object.keys(ACCESSORIES);
}

/**
 * Get equipment by rarity
 */
export function getEquipmentByRarity(rarity) {
    return RARITY_TIERS[rarity];
}

/**
 * Sell equipment for gold
 */
export function sellEquipment(equipmentId) {
    const index = gameState.inventory?.findIndex(e => e.id === equipmentId);
    if (index === -1) return 0;

    const equipment = gameState.inventory[index];
    
    // Unequip if equipped
    if (equipment.equipped) {
        unequipItem(equipmentId);
    }

    // Calculate sell value based on rarity
    const baseValue = 50;
    const rarityMult = RARITY_TIERS[equipment.rarity].multiplier;
    const sellValue = Math.floor(baseValue * rarityMult);

    // Remove from inventory
    gameState.inventory.splice(index, 1);
    
    // Add gold
    gameState.resources.gold += sellValue;

    console.log(`💰 Sold ${equipment.name} for ${sellValue} gold`);
    return sellValue;
}

/**
 * Get equipment stats display
 */
export function getEquipmentStats(equipment) {
    let stats = [];

    if (equipment.type === 'weapon') {
        stats.push(`⚔️ ATK: +${equipment.atk}`);
        if (equipment.crit > 0) {
            stats.push(`💥 Crit: +${(equipment.crit * 100).toFixed(0)}%`);
        }
    } else if (equipment.type === 'armor') {
        stats.push(`🛡️ DEF: +${equipment.def}`);
        if (equipment.hp > 0) {
            stats.push(`❤️ HP: +${equipment.hp}`);
        }
    } else if (equipment.type === 'accessory') {
        if (equipment.bonusATK > 0) stats.push(`⚔️ ATK: +${equipment.bonusATK}`);
        if (equipment.bonusDEF > 0) stats.push(`🛡️ DEF: +${equipment.bonusDEF}`);
        if (equipment.bonusHP > 0) stats.push(`❤️ HP: +${equipment.bonusHP}`);
    }

    return stats;
}
