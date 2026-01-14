/**
 * Equipment Sets System v1.0
 * Sprint 4: Equipment Sets
 * Adds set bonuses for collecting matching equipment pieces
 */

import { gameState } from '../core/game-state.js';

/**
 * Equipment Set Definitions
 * Each set has 3 pieces: Weapon, Armor, Accessory
 */
export const EQUIPMENT_SETS = {
    dragon: {
        id: 'dragon',
        name: 'Dragon Set',
        description: 'Forged from dragon scales and fire',
        theme: 'High damage and critical strikes',
        icon: '🐉',
        color: '#e74c3c',
        pieces: {
            weapon: 'dragon-blade',
            armor: 'dragon-scale',
            accessory: 'dragon-heart'
        },
        bonuses: {
            2: {
                name: 'Dragon Blood',
                description: '+15% Attack, +10% Crit Chance',
                attackPercent: 0.15,
                critChance: 0.10
            },
            3: {
                name: 'Dragon Fury',
                description: '+30% Attack, +20% Crit Chance, +50% Crit Damage',
                attackPercent: 0.30,
                critChance: 0.20,
                critMultiplier: 0.5
            }
        }
    },
    
    guardian: {
        id: 'guardian',
        name: 'Guardian Set',
        description: 'Ancient armor of the sworn protectors',
        theme: 'Tank and defense focused',
        icon: '🛡️',
        color: '#3498db',
        pieces: {
            weapon: 'guardian-mace',
            armor: 'guardian-plate',
            accessory: 'guardian-ring'
        },
        bonuses: {
            2: {
                name: 'Guardian Wall',
                description: '+20% Max HP, +15% Defense',
                hpPercent: 0.20,
                defensePercent: 0.15
            },
            3: {
                name: 'Unbreakable',
                description: '+40% Max HP, +30% Defense, Heal 5% HP per kill',
                hpPercent: 0.40,
                defensePercent: 0.30,
                healOnKill: 0.05
            }
        }
    },
    
    shadow: {
        id: 'shadow',
        name: 'Shadow Set',
        description: 'Gear of the shadow walkers',
        theme: 'Critical hits and evasion',
        icon: '🌙',
        color: '#9b59b6',
        pieces: {
            weapon: 'shadow-blade',
            armor: 'shadow-cloak',
            accessory: 'shadow-ring'
        },
        bonuses: {
            2: {
                name: 'Shadow Step',
                description: '+20% Crit Chance, +10% Dodge',
                critChance: 0.20,
                dodgeChance: 0.10
            },
            3: {
                name: 'Shadow Master',
                description: '+35% Crit Chance, +20% Dodge, First hit always crits',
                critChance: 0.35,
                dodgeChance: 0.20,
                firstStrikeCrit: true
            }
        }
    },
    
    assassin: {
        id: 'assassin',
        name: 'Assassin Set',
        description: 'Tools of the silent killers',
        theme: 'Speed and critical damage',
        icon: '🗡️',
        color: '#e67e22',
        pieces: {
            weapon: 'assassin-daggers',
            armor: 'assassin-leather',
            accessory: 'assassin-pendant'
        },
        bonuses: {
            2: {
                name: 'Swift Death',
                description: '+25% Crit Chance, +10% Attack',
                critChance: 0.25,
                attackPercent: 0.10
            },
            3: {
                name: 'Silent Killer',
                description: '+40% Crit Chance, +20% Attack, +100% Crit Damage',
                critChance: 0.40,
                attackPercent: 0.20,
                critMultiplier: 1.0
            }
        }
    }
};

/**
 * Get active set bonuses based on equipped items
 * @returns {Object} Active set bonuses
 */
export function getActiveSetBonuses() {
    const equipped = gameState.equipped || {};
    const activeSets = {};
    
    // Check each set
    for (const [setId, setData] of Object.entries(EQUIPMENT_SETS)) {
        const equippedPieces = [];
        
        // Check which pieces of this set are equipped
        if (equipped.weapon?.setId === setId) {
            equippedPieces.push('weapon');
        }
        if (equipped.armor?.setId === setId) {
            equippedPieces.push('armor');
        }
        if (equipped.accessory?.setId === setId) {
            equippedPieces.push('accessory');
        }
        
        const pieceCount = equippedPieces.length;
        
        // Only track sets with 2+ pieces
        if (pieceCount >= 2) {
            activeSets[setId] = {
                name: setData.name,
                pieceCount,
                pieces: equippedPieces,
                bonuses: []
            };
            
            // Add active bonuses
            if (pieceCount >= 2) {
                activeSets[setId].bonuses.push({
                    level: 2,
                    ...setData.bonuses[2]
                });
            }
            if (pieceCount >= 3) {
                activeSets[setId].bonuses.push({
                    level: 3,
                    ...setData.bonuses[3]
                });
            }
        }
    }
    
    return activeSets;
}

/**
 * Calculate total set bonuses for hero stats
 * @returns {Object} Combined set bonuses
 */
export function calculateSetBonuses() {
    const activeSets = getActiveSetBonuses();
    
    const totalBonuses = {
        attackPercent: 0,
        defensePercent: 0,
        hpPercent: 0,
        critChance: 0,
        critMultiplier: 0,
        dodgeChance: 0,
        healOnKill: 0,
        firstStrikeCrit: false
    };
    
    // Sum up all active bonuses
    for (const setData of Object.values(activeSets)) {
        for (const bonus of setData.bonuses) {
            if (bonus.attackPercent) totalBonuses.attackPercent += bonus.attackPercent;
            if (bonus.defensePercent) totalBonuses.defensePercent += bonus.defensePercent;
            if (bonus.hpPercent) totalBonuses.hpPercent += bonus.hpPercent;
            if (bonus.critChance) totalBonuses.critChance += bonus.critChance;
            if (bonus.critMultiplier) totalBonuses.critMultiplier += bonus.critMultiplier;
            if (bonus.dodgeChance) totalBonuses.dodgeChance += bonus.dodgeChance;
            if (bonus.healOnKill) totalBonuses.healOnKill += bonus.healOnKill;
            if (bonus.firstStrikeCrit) totalBonuses.firstStrikeCrit = true;
        }
    }
    
    return totalBonuses;
}

/**
 * Get set progress for a specific set
 * @param {string} setId - Set identifier
 * @returns {Object} Set progress info
 */
export function getSetProgress(setId) {
    const setData = EQUIPMENT_SETS[setId];
    if (!setData) return null;
    
    const inventory = gameState.inventory || [];
    const ownedPieces = [];
    
    // Check inventory for set pieces
    for (const item of inventory) {
        if (item.setId === setId) {
            ownedPieces.push(item.type);
        }
    }
    
    // Check equipped items
    const equipped = gameState.equipped || {};
    const equippedPieces = [];
    
    if (equipped.weapon?.setId === setId) equippedPieces.push('weapon');
    if (equipped.armor?.setId === setId) equippedPieces.push('armor');
    if (equipped.accessory?.setId === setId) equippedPieces.push('accessory');
    
    return {
        setId,
        name: setData.name,
        description: setData.description,
        theme: setData.theme,
        icon: setData.icon,
        color: setData.color,
        ownedPieces,
        equippedPieces,
        totalPieces: 3,
        ownedCount: ownedPieces.length,
        equippedCount: equippedPieces.length,
        bonuses: setData.bonuses
    };
}

/**
 * Get all sets progress
 * @returns {Array} Array of set progress objects
 */
export function getAllSetsProgress() {
    return Object.keys(EQUIPMENT_SETS).map(setId => getSetProgress(setId));
}

/**
 * Check if equipment belongs to a set
 * @param {string} templateId - Equipment template ID
 * @returns {string|null} Set ID or null
 */
export function getEquipmentSetId(templateId) {
    for (const [setId, setData] of Object.entries(EQUIPMENT_SETS)) {
        if (Object.values(setData.pieces).includes(templateId)) {
            return setId;
        }
    }
    return null;
}

/**
 * Get set name for equipment
 * @param {string} templateId - Equipment template ID
 * @returns {string|null} Set name or null
 */
export function getEquipmentSetName(templateId) {
    const setId = getEquipmentSetId(templateId);
    return setId ? EQUIPMENT_SETS[setId].name : null;
}
