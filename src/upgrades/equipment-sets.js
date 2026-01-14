/**
 * Equipment Sets System v1.0
 * Handles set bonuses for matching equipment pieces
 * Sprint 4 - Equipment Sets
 */

import { gameState } from '../core/game-state.js';

// Equipment Set Definitions
export const EQUIPMENT_SETS = {
    dragon: {
        id: 'dragon',
        name: 'Dragon Set',
        description: 'Forged from dragon scales, grants immense offensive power',
        icon: '🐉',
        theme: 'damage',
        color: '#e74c3c',
        pieces: {
            weapon: 'dragon-fang',
            armor: 'dragon-scale',
            accessory: 'dragon-heart'
        },
        bonuses: {
            '2piece': {
                name: 'Dragon\'s Fury',
                description: '+15% Critical Chance, +25% Critical Damage',
                effects: {
                    critChance: 0.15,
                    critMultiplier: 0.25
                }
            },
            '3piece': {
                name: 'Dragon\'s Wrath',
                description: '+30% Attack, +25% Critical Chance, +50% Critical Damage',
                effects: {
                    attackMultiplier: 0.30,
                    critChance: 0.25,
                    critMultiplier: 0.50
                }
            }
        }
    },
    guardian: {
        id: 'guardian',
        name: 'Guardian Set',
        description: 'Ancient armor of legendary protectors',
        icon: '🛡️',
        theme: 'defense',
        color: '#3498db',
        pieces: {
            weapon: 'guardian-mace',
            armor: 'guardian-plate',
            accessory: 'guardian-amulet'
        },
        bonuses: {
            '2piece': {
                name: 'Guardian\'s Resolve',
                description: '+30% Max HP, +20% Defense',
                effects: {
                    hpMultiplier: 0.30,
                    defenseMultiplier: 0.20
                }
            },
            '3piece': {
                name: 'Guardian\'s Blessing',
                description: '+50% Max HP, +40% Defense, +10% Damage Reduction',
                effects: {
                    hpMultiplier: 0.50,
                    defenseMultiplier: 0.40,
                    damageReduction: 0.10
                }
            }
        }
    },
    shadow: {
        id: 'shadow',
        name: 'Shadow Set',
        description: 'Crafted for those who strike from darkness',
        icon: '🌑',
        theme: 'critical',
        color: '#8e44ad',
        pieces: {
            weapon: 'shadow-blade',
            armor: 'shadow-cloak',
            accessory: 'shadow-ring'
        },
        bonuses: {
            '2piece': {
                name: 'Shadow\'s Grace',
                description: '+20% Critical Chance, +15% Dodge Chance',
                effects: {
                    critChance: 0.20,
                    dodgeChance: 0.15
                }
            },
            '3piece': {
                name: 'Shadow\'s Mastery',
                description: '+35% Critical Chance, +25% Dodge, +100% Critical Damage',
                effects: {
                    critChance: 0.35,
                    dodgeChance: 0.25,
                    critMultiplier: 1.00
                }
            }
        }
    },
    assassin: {
        id: 'assassin',
        name: 'Assassin Set',
        description: 'Swift and deadly, the mark of a master killer',
        icon: '🗡️',
        theme: 'speed',
        color: '#e67e22',
        pieces: {
            weapon: 'assassin-dagger',
            armor: 'assassin-garb',
            accessory: 'assassin-charm'
        },
        bonuses: {
            '2piece': {
                name: 'Assassin\'s Swiftness',
                description: '+20% Attack Speed, +15% Movement Speed',
                effects: {
                    attackSpeed: 0.20,
                    movementSpeed: 0.15
                }
            },
            '3piece': {
                name: 'Assassin\'s Precision',
                description: '+40% Attack Speed, +25% Movement, +20% Attack',
                effects: {
                    attackSpeed: 0.40,
                    movementSpeed: 0.25,
                    attackMultiplier: 0.20
                }
            }
        }
    }
};

/**
 * Get currently active set bonuses based on equipped items
 */
export function getActiveSetBonuses() {
    const equipped = gameState.equipped || {};
    const equippedItems = [
        equipped.weapon,
        equipped.armor,
        equipped.accessory
    ].filter(item => item !== null);

    if (equippedItems.length === 0) {
        return { sets: {}, bonuses: {} };
    }

    // Count pieces per set
    const setCounts = {};
    equippedItems.forEach(item => {
        if (item.setId) {
            setCounts[item.setId] = (setCounts[item.setId] || 0) + 1;
        }
    });

    // Determine active bonuses
    const activeSets = {};
    const combinedBonuses = {
        attackMultiplier: 0,
        defenseMultiplier: 0,
        hpMultiplier: 0,
        critChance: 0,
        critMultiplier: 0,
        dodgeChance: 0,
        damageReduction: 0,
        attackSpeed: 0,
        movementSpeed: 0
    };

    Object.keys(setCounts).forEach(setId => {
        const count = setCounts[setId];
        const set = EQUIPMENT_SETS[setId];
        
        if (!set) return;

        activeSets[setId] = {
            name: set.name,
            icon: set.icon,
            color: set.color,
            piecesEquipped: count,
            activeBonuses: []
        };

        // 2-piece bonus
        if (count >= 2 && set.bonuses['2piece']) {
            const bonus = set.bonuses['2piece'];
            activeSets[setId].activeBonuses.push({
                pieces: 2,
                name: bonus.name,
                description: bonus.description
            });

            // Add to combined bonuses
            Object.keys(bonus.effects).forEach(key => {
                combinedBonuses[key] += bonus.effects[key];
            });
        }

        // 3-piece bonus (replaces 2-piece in most cases)
        if (count >= 3 && set.bonuses['3piece']) {
            const bonus = set.bonuses['3piece'];
            
            // Remove 2-piece bonus effects first
            if (set.bonuses['2piece']) {
                Object.keys(set.bonuses['2piece'].effects).forEach(key => {
                    combinedBonuses[key] -= set.bonuses['2piece'].effects[key];
                });
            }

            activeSets[setId].activeBonuses.push({
                pieces: 3,
                name: bonus.name,
                description: bonus.description
            });

            // Add 3-piece bonuses
            Object.keys(bonus.effects).forEach(key => {
                combinedBonuses[key] += bonus.effects[key];
            });
        }
    });

    return {
        sets: activeSets,
        bonuses: combinedBonuses
    };
}

/**
 * Apply set bonuses to hero stats
 * Called during stat recalculation
 */
export function applySetBonuses(baseStats) {
    const { bonuses } = getActiveSetBonuses();

    const modifiedStats = { ...baseStats };

    // Apply multiplicative bonuses
    if (bonuses.attackMultiplier > 0) {
        modifiedStats.attack = Math.floor(modifiedStats.attack * (1 + bonuses.attackMultiplier));
    }
    if (bonuses.defenseMultiplier > 0) {
        modifiedStats.defense = Math.floor(modifiedStats.defense * (1 + bonuses.defenseMultiplier));
    }
    if (bonuses.hpMultiplier > 0) {
        modifiedStats.maxHp = Math.floor(modifiedStats.maxHp * (1 + bonuses.hpMultiplier));
        modifiedStats.hp = modifiedStats.maxHp; // Heal to full when bonus changes
    }

    // Apply additive bonuses
    if (bonuses.critChance > 0) {
        modifiedStats.critChance = Math.min(1.0, (modifiedStats.critChance || 0.05) + bonuses.critChance);
    }
    if (bonuses.critMultiplier > 0) {
        modifiedStats.critMultiplier = (modifiedStats.critMultiplier || 2.0) + bonuses.critMultiplier;
    }

    // Store additional bonuses for combat use
    modifiedStats.setBonuses = {
        dodgeChance: bonuses.dodgeChance || 0,
        damageReduction: bonuses.damageReduction || 0,
        attackSpeed: bonuses.attackSpeed || 0,
        movementSpeed: bonuses.movementSpeed || 0
    };

    return modifiedStats;
}

/**
 * Get set collection progress (for UI)
 */
export function getSetCollectionProgress() {
    const inventory = gameState.inventory || [];
    const progress = {};

    Object.keys(EQUIPMENT_SETS).forEach(setId => {
        const set = EQUIPMENT_SETS[setId];
        const ownedPieces = [];

        // Check which pieces the player owns
        Object.keys(set.pieces).forEach(slot => {
            const templateId = set.pieces[slot];
            const owned = inventory.some(item => item.setId === setId && item.type === slot);
            
            ownedPieces.push({
                slot,
                templateId,
                owned
            });
        });

        progress[setId] = {
            name: set.name,
            icon: set.icon,
            color: set.color,
            theme: set.theme,
            description: set.description,
            pieces: ownedPieces,
            ownedCount: ownedPieces.filter(p => p.owned).length,
            totalPieces: ownedPieces.length,
            bonuses: set.bonuses
        };
    });

    return progress;
}

/**
 * Check if item is part of a set
 */
export function getItemSetInfo(templateId) {
    for (const setId in EQUIPMENT_SETS) {
        const set = EQUIPMENT_SETS[setId];
        const pieces = Object.values(set.pieces);
        
        if (pieces.includes(templateId)) {
            return {
                setId,
                setName: set.name,
                setIcon: set.icon,
                setColor: set.color
            };
        }
    }
    return null;
}

/**
 * Get all set template IDs for loot generation
 */
export function getAllSetTemplateIds() {
    const templateIds = [];
    
    Object.keys(EQUIPMENT_SETS).forEach(setId => {
        const set = EQUIPMENT_SETS[setId];
        Object.values(set.pieces).forEach(templateId => {
            templateIds.push({
                templateId,
                setId,
                type: Object.keys(set.pieces).find(key => set.pieces[key] === templateId)
            });
        });
    });

    return templateIds;
}
