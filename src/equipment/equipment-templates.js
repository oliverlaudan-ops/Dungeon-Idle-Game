/**
 * Equipment Templates v1.0
 * Defines all equipment items and their base stats
 * Sprint 4 - Equipment Sets
 */

/**
 * Equipment Template Database
 * Each template defines the base stats for an equipment piece
 */
export const EQUIPMENT_TEMPLATES = {
    // ========================================
    // DRAGON SET - Offensive Power
    // ========================================
    'dragon-blade': {
        id: 'dragon-blade',
        name: 'Dragon Blade',
        type: 'weapon',
        icon: '🗡️',
        rarity: 'legendary',
        attack: 25,
        defense: 0,
        hp: 0,
        critChance: 0.10,
        description: 'A blade forged from dragon fangs'
    },
    'dragon-scale': {
        id: 'dragon-scale',
        name: 'Dragon Scale Armor',
        type: 'armor',
        icon: '🛡️',
        rarity: 'legendary',
        attack: 15,
        defense: 20,
        hp: 50,
        critChance: 0.05,
        description: 'Armor made from impenetrable dragon scales'
    },
    'dragon-heart': {
        id: 'dragon-heart',
        name: 'Dragon Heart Amulet',
        type: 'accessory',
        icon: '💎',
        rarity: 'legendary',
        attack: 10,
        defense: 5,
        hp: 30,
        critChance: 0.08,
        description: 'A crystallized dragon heart pulsing with power'
    },

    // ========================================
    // GUARDIAN SET - Defensive Might
    // ========================================
    'guardian-mace': {
        id: 'guardian-mace',
        name: 'Guardian Mace',
        type: 'weapon',
        icon: '🔨',
        rarity: 'legendary',
        attack: 15,
        defense: 10,
        hp: 40,
        critChance: 0.03,
        description: 'A holy mace blessed by ancient guardians'
    },
    'guardian-plate': {
        id: 'guardian-plate',
        name: 'Guardian Plate Armor',
        type: 'armor',
        icon: '🛡️',
        rarity: 'legendary',
        attack: 5,
        defense: 35,
        hp: 100,
        critChance: 0,
        description: 'Heavy armor that has protected heroes for generations'
    },
    'guardian-ring': {
        id: 'guardian-ring',
        name: 'Guardian Ring',
        type: 'accessory',
        icon: '💍',
        rarity: 'legendary',
        attack: 3,
        defense: 15,
        hp: 60,
        critChance: 0.02,
        description: 'A ring that grants the wearer unwavering resolve'
    },

    // ========================================
    // SHADOW SET - Critical Strikes
    // ========================================
    'shadow-blade': {
        id: 'shadow-blade',
        name: 'Shadow Blade',
        type: 'weapon',
        icon: '🗡️',
        rarity: 'legendary',
        attack: 22,
        defense: 3,
        hp: 20,
        critChance: 0.15,
        description: 'A blade that strikes from the shadows'
    },
    'shadow-cloak': {
        id: 'shadow-cloak',
        name: 'Shadow Cloak',
        type: 'armor',
        icon: '🧥',
        rarity: 'legendary',
        attack: 8,
        defense: 12,
        hp: 35,
        critChance: 0.12,
        description: 'A cloak woven from darkness itself'
    },
    'shadow-ring': {
        id: 'shadow-ring',
        name: 'Shadow Ring',
        type: 'accessory',
        icon: '💍',
        rarity: 'legendary',
        attack: 5,
        defense: 5,
        hp: 25,
        critChance: 0.10,
        description: 'A ring that bends shadows to your will'
    },

    // ========================================
    // ASSASSIN SET - Speed and Precision
    // ========================================
    'assassin-daggers': {
        id: 'assassin-daggers',
        name: 'Assassin Daggers',
        type: 'weapon',
        icon: '🗡️',
        rarity: 'legendary',
        attack: 20,
        defense: 2,
        hp: 15,
        critChance: 0.08,
        description: 'Twin daggers that strike with deadly precision'
    },
    'assassin-leather': {
        id: 'assassin-leather',
        name: 'Assassin Leather Armor',
        type: 'armor',
        icon: '🥋',
        rarity: 'legendary',
        attack: 12,
        defense: 15,
        hp: 30,
        critChance: 0.06,
        description: 'Lightweight armor for swift movements'
    },
    'assassin-pendant': {
        id: 'assassin-pendant',
        name: 'Assassin Pendant',
        type: 'accessory',
        icon: '📿',
        rarity: 'legendary',
        attack: 8,
        defense: 5,
        hp: 20,
        critChance: 0.07,
        description: 'A pendant that enhances reflexes and precision'
    }
};

/**
 * Get equipment template by ID
 */
export function getEquipmentTemplate(templateId) {
    return EQUIPMENT_TEMPLATES[templateId] || null;
}

/**
 * Get all templates of a specific type
 */
export function getTemplatesByType(type) {
    return Object.values(EQUIPMENT_TEMPLATES).filter(t => t.type === type);
}

/**
 * Get all template IDs
 */
export function getAllTemplateIds() {
    return Object.keys(EQUIPMENT_TEMPLATES);
}
