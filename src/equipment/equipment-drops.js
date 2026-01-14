/**
 * Equipment Drops System v1.0
 * Handles equipment generation and drops from dungeons
 * Sprint 4 - Equipment Sets
 */

import { gameState } from '../core/game-state.js';
import { EQUIPMENT_SETS, getItemSetInfo } from '../upgrades/equipment-sets.js';
import { EQUIPMENT_TEMPLATES } from './equipment-templates.js';

/**
 * Drop rates by difficulty
 */
const DROP_RATES = {
    easy: 0.05,      // 5% chance per run
    medium: 0.08,    // 8% chance
    hard: 0.12,      // 12% chance
    nightmare: 0.15  // 15% chance
};

/**
 * Generate equipment drop based on dungeon completion
 * @param {string} difficulty - Difficulty of completed dungeon
 * @returns {object|null} Generated equipment item or null
 */
export function rollEquipmentDrop(difficulty = 'medium') {
    const dropRate = DROP_RATES[difficulty] || DROP_RATES.medium;
    
    // Roll for drop
    if (Math.random() > dropRate) {
        return null; // No drop
    }

    console.log(`🎲 Equipment drop rolled! (${difficulty})`);
    
    // Get all available set items
    const allSetItems = [];
    Object.keys(EQUIPMENT_SETS).forEach(setId => {
        const set = EQUIPMENT_SETS[setId];
        Object.keys(set.pieces).forEach(slot => {
            const templateId = set.pieces[slot];
            allSetItems.push({
                templateId,
                setId,
                type: slot
            });
        });
    });

    // Random set item
    const randomItem = allSetItems[Math.floor(Math.random() * allSetItems.length)];
    
    // Generate item from template
    const item = generateEquipmentItem(randomItem.templateId, randomItem.setId, randomItem.type);
    
    if (item) {
        console.log(`🎁 Generated: ${item.name} (${item.setName})`);
        return item;
    }
    
    return null;
}

/**
 * Generate an equipment item from template
 * @param {string} templateId - Equipment template ID
 * @param {string} setId - Set ID
 * @param {string} type - Equipment type (weapon, armor, accessory)
 * @returns {object} Generated equipment item
 */
export function generateEquipmentItem(templateId, setId, type) {
    const template = EQUIPMENT_TEMPLATES[templateId];
    
    if (!template) {
        console.error(`⚠️ Template not found: ${templateId}`);
        return null;
    }

    const setInfo = getItemSetInfo(templateId);
    
    const item = {
        id: `${templateId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        templateId,
        name: template.name,
        type: template.type,
        icon: template.icon,
        attack: template.attack || 0,
        defense: template.defense || 0,
        hp: template.hp || 0,
        critChance: template.critChance || 0,
        rarity: template.rarity || 'rare',
        setId: setInfo ? setInfo.setId : null,
        setName: setInfo ? setInfo.setName : null,
        setIcon: setInfo ? setInfo.setIcon : null,
        setColor: setInfo ? setInfo.setColor : null
    };

    return item;
}

/**
 * Add equipment drop to inventory
 * @param {object} item - Equipment item to add
 */
export function addEquipmentToInventory(item) {
    if (!item) return;
    
    if (!gameState.inventory) {
        gameState.inventory = [];
    }
    
    gameState.inventory.push(item);
    console.log(`🎽 Added to inventory: ${item.name}`);
}

/**
 * Process equipment drops after dungeon completion
 * @param {string} difficulty - Completed dungeon difficulty
 * @returns {object|null} Dropped item or null
 */
export function processDungeonLoot(difficulty) {
    const droppedItem = rollEquipmentDrop(difficulty);
    
    if (droppedItem) {
        addEquipmentToInventory(droppedItem);
    }
    
    return droppedItem;
}
