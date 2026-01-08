/**
 * Upgrade Manager
 * Handles buying upgrades and applying their effects
 */

import { gameState, saveGame } from '../core/game-state.js';
import { UPGRADES, getUpgradeCost, getUpgradeEffect } from './upgrade-definitions.js';

/**
 * Attempt to buy an upgrade
 */
export function buyUpgrade(upgradeId) {
    const upgrade = UPGRADES[upgradeId];
    if (!upgrade) {
        console.error('Unknown upgrade:', upgradeId);
        return { success: false, error: 'Unknown upgrade' };
    }

    const currentLevel = gameState.upgrades[upgradeId] || 0;

    // Check max level
    if (currentLevel >= upgrade.maxLevel) {
        return { success: false, error: 'Max level reached' };
    }

    // Get cost
    const cost = getUpgradeCost(upgradeId, currentLevel);

    // Check resources
    if (gameState.resources.gold < cost.gold) {
        return { success: false, error: 'Not enough gold' };
    }
    if (gameState.resources.gems < cost.gems) {
        return { success: false, error: 'Not enough gems' };
    }
    if (gameState.resources.souls < cost.souls) {
        return { success: false, error: 'Not enough souls' };
    }

    // Deduct cost
    gameState.resources.gold -= cost.gold;
    gameState.resources.gems -= cost.gems;
    gameState.resources.souls -= cost.souls;

    // Increase level
    gameState.upgrades[upgradeId] = currentLevel + 1;

    // Apply effects
    applyUpgradeEffects();

    // Save
    saveGame();

    console.log(`✅ Bought ${upgrade.name} (Level ${currentLevel + 1})`);

    return { success: true, newLevel: currentLevel + 1 };
}

/**
 * Apply all upgrade effects to game state
 */
export function applyUpgradeEffects() {
    // Reset bonuses to base values
    const hero = gameState.hero;
    const idle = gameState.idle;

    // Calculate total bonuses from all upgrades
    let totalEffects = {
        attack: 0,
        defense: 0,
        maxHp: 0,
        critChance: 0,
        critMultiplier: 0,
        autoRunInterval: 0,
        successBonus: 0,
        goldMultiplier: 0,
        xpMultiplier: 0,
        gemChanceBonus: 0,
        soulChanceBonus: 0,
        extraKeys: 0
    };

    // Sum up all upgrade effects
    for (const [upgradeId, level] of Object.entries(gameState.upgrades)) {
        if (level > 0) {
            const effect = getUpgradeEffect(upgradeId, level);
            for (const [key, value] of Object.entries(effect)) {
                totalEffects[key] = (totalEffects[key] || 0) + value;
            }
        }
    }

    // Store upgrade bonuses (don't directly modify hero base stats)
    gameState.upgradeBonuses = totalEffects;

    // Apply auto-run interval change
    const baseInterval = 60;
    idle.autoRunInterval = Math.max(10, baseInterval + totalEffects.autoRunInterval);
}

/**
 * Get effective stats with upgrade bonuses
 */
export function getEffectiveStats() {
    const hero = gameState.hero;
    const bonuses = gameState.upgradeBonuses || {};

    return {
        attack: hero.attack + (bonuses.attack || 0),
        defense: hero.defense + (bonuses.defense || 0),
        maxHp: hero.maxHp + (bonuses.maxHp || 0),
        critChance: hero.critChance + (bonuses.critChance || 0),
        critMultiplier: hero.critMultiplier + (bonuses.critMultiplier || 0),
        successBonus: bonuses.successBonus || 0,
        goldMultiplier: 1 + (bonuses.goldMultiplier || 0),
        xpMultiplier: 1 + (bonuses.xpMultiplier || 0),
        gemChanceBonus: bonuses.gemChanceBonus || 0,
        soulChanceBonus: bonuses.soulChanceBonus || 0
    };
}