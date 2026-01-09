/**
 * Equipment System v2.1
 * Handles weapons, armor, and gear with stat bonuses
 * UPDATED: Weapons have classes that modify combat behavior
 * UPDATED: Equipment affects both manual and auto-runs
 * UPDATED: Equipment operations now save game state
 */

import { gameState, saveGame } from '../core/game-state.js';

// Equipment rarity tiers
const RARITY_TIERS = {
    common: { color: '#95a5a6', multiplier: 1.0, dropChance: 0.60 },
    uncommon: { color: '#2ecc71', multiplier: 1.25, dropChance: 0.25 },
    rare: { color: '#3498db', multiplier: 1.50, dropChance: 0.10 },
    epic: { color: '#9b59b6', multiplier: 1.75, dropChance: 0.04 },
    legendary: { color: '#f39c12', multiplier: 2.0, dropChance: 0.01 }
};

// Weapon classes - define combat style
const WEAPON_CLASSES = {
    WARRIOR: {
        name: 'Warrior',
        description: 'Balanced damage and defense',
        damageMultiplier: 1.0,
        defenseBenefit: 2,
        critBonus: 0.0
    },
    RANGER: {
        name: 'Ranger',
        description: 'High critical strikes with reduced damage',
        damageMultiplier: 0.8,
        defenseBenefit: 0,
        critBonus: 0.15
    },
    BERSERKER: {
        name: 'Berserker',
        description: 'Extreme damage but reduced defense',
        damageMultiplier: 1.5,
        defenseBenefit: -1,
        critBonus: 0.0
    },
    MAGE: {
        name: 'Mage',
        description: 'Utility damage with extra survivability',
        damageMultiplier: 0.9,
        defenseBenefit: 0,
        critBonus: 0.10,
        hpBonus: 10
    },
    ROGUE: {
        name: 'Rogue',
        description: 'High crit chance but fragile',
        damageMultiplier: 1.2,
        defenseBenefit: -1,
        critBonus: 0.25
    }
};

// Weapon templates with class assignment
const WEAPONS = {
    'iron-sword': {
        name: 'Iron Sword',
        type: 'weapon',
        icon: '⚔️',
        class: 'WARRIOR',
        baseATK: 5,
        baseCrit: 0.0,
        description: 'Basic iron sword for beginners'
    },
    'steel-sword': {
        name: 'Steel Sword',
        type: 'weapon',
        icon: '⚔️',
        class: 'WARRIOR',
        baseATK: 10,
        baseCrit: 0.05,
        description: 'Sturdy steel blade'
    },
    'elven-bow': {
        name: 'Elven Bow',
        type: 'weapon',
        icon: '🏹',
        class: 'RANGER',
        baseATK: 8,
        baseCrit: 0.15,
        description: 'High crit chance ranged weapon'
    },
    'warhammer': {
        name: 'Warhammer',
        type: 'weapon',
        icon: '🔨',
        class: 'BERSERKER',
        baseATK: 15,
        baseCrit: 0.0,
        description: 'Heavy hitting two-hander'
    },
    'enchanted-blade': {
        name: 'Enchanted Blade',
        type: 'weapon',
        icon: '✨⚔️',
        class: 'MAGE',
        baseATK: 12,
        baseCrit: 0.10,
        description: 'Magically enhanced sword'
    },
    'assassins-dagger': {
        name: "Assassin's Dagger",
        type: 'weapon',
        icon: '🔪',
        class: 'ROGUE',
        baseATK: 10,
        baseCrit: 0.25,
        description: 'Silent and deadly'
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
        id: `${templateId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        equipment.class = template.class;  // NEW: Weapon class
        equipment.classInfo = WEAPON_CLASSES[template.class];  // NEW: Class details
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
        gameState.equipped = { weapon: null, armor: null, accessory: null };
    }

    // Equip new item
    equipment.equipped = true;
    gameState.equipped[equipment.type] = equipment;
    
    // Recalculate hero stats
    recalculateStats();
    
    // SAVE GAME!
    saveGame();
    
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
        gameState.equipped[equipment.type] = null;
    }

    recalculateStats();
    
    // SAVE GAME!
    saveGame();
    
    console.log(`❌ Unequipped: ${equipment.name}`);
    return true;
}

/**
 * Recalculate hero stats based on equipped items
 */
function recalculateStats() {
    if (!gameState.equipped) return;

    // Reset to base stats
    const baseATK = 10 + (gameState.hero.level - 1) * 2;
    const baseDEF = 5 + (gameState.hero.level - 1) * 1;
    let baseHP = 100 + (gameState.hero.level - 1) * 10;

    let totalATK = baseATK;
    let totalDEF = baseDEF;
    let totalHP = baseHP;
    let totalCrit = 0.05; // Base crit
    let weaponClass = null;
    let classInfo = null;

    // Apply equipment bonuses
    if (gameState.equipped.weapon) {
        const weapon = gameState.equipped.weapon;
        totalATK += weapon.atk || 0;
        totalCrit += weapon.crit || 0;
        weaponClass = weapon.class;
        classInfo = WEAPON_CLASSES[weaponClass];
    }
    
    if (gameState.equipped.armor) {
        const armor = gameState.equipped.armor;
        totalDEF += armor.def || 0;
        totalHP += armor.hp || 0;
    }
    
    if (gameState.equipped.accessory) {
        const acc = gameState.equipped.accessory;
        totalATK += acc.bonusATK || 0;
        totalDEF += acc.bonusDEF || 0;
        totalHP += acc.bonusHP || 0;
    }

    // Apply class modifiers (NEW!)
    if (classInfo) {
        // Apply damage multiplier
        totalATK = Math.floor(totalATK * classInfo.damageMultiplier);
        
        // Apply defense benefit
        totalDEF += classInfo.defenseBenefit;
        
        // Apply crit bonus
        totalCrit += classInfo.critBonus;
        
        // Apply any extra HP bonus
        if (classInfo.hpBonus) {
            totalHP += classInfo.hpBonus;
        }
    }

    // Update hero stats
    gameState.hero.attack = totalATK;
    gameState.hero.defense = Math.max(0, totalDEF);  // Defense can't be negative
    gameState.hero.maxHp = totalHP;
    gameState.hero.critChance = Math.min(1.0, totalCrit);  // Cap at 100%
    
    // Heal to full when equipping
    gameState.hero.hp = totalHP;
    
    // Store current class for reference
    gameState.hero.currentClass = weaponClass || 'NONE';
    
    console.log(`📊 Stats recalculated: ATK=${totalATK}, DEF=${totalDEF}, HP=${totalHP}, CRIT=${(totalCrit*100).toFixed(1)}%`);
}

/**
 * Get current hero class
 */
export function getHeroClass() {
    const weapon = gameState.equipped?.weapon;
    if (!weapon) {
        return { name: 'Warrior', description: 'No weapon equipped' };
    }
    return WEAPON_CLASSES[weapon.class] || WEAPON_CLASSES.WARRIOR;
}

/**
 * Get class information
 */
export function getClassInfo(className) {
    return WEAPON_CLASSES[className] || null;
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

    // SAVE GAME!
    saveGame();

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
        stats.push(`🎯 Class: ${equipment.classInfo?.name || 'Unknown'}`);
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
