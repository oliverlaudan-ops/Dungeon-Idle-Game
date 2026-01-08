/**
 * Upgrade System
 * Handles purchasing and applying upgrades
 */

import { gameState, saveGame } from '../core/game-state.js';
import { upgrades, getUpgradeCost, canAffordUpgrade, meetsRequirements } from './upgrades-def.js';

/**
 * Purchase an upgrade
 */
export function purchaseUpgrade(upgradeId) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) {
        console.error('Upgrade not found:', upgradeId);
        return false;
    }

    // Initialize upgrade level if not exists
    if (!gameState.upgrades[upgradeId]) {
        gameState.upgrades[upgradeId] = 0;
    }

    const currentLevel = gameState.upgrades[upgradeId];

    // Check max level
    if (currentLevel >= upgrade.maxLevel) {
        console.log('Upgrade already at max level');
        return false;
    }

    // Check requirements
    if (!meetsRequirements(upgrade, gameState.upgrades)) {
        console.log('Upgrade requirements not met');
        return false;
    }

    // Check cost
    const cost = getUpgradeCost(upgrade, currentLevel);
    if (!canAffordUpgrade(upgrade, currentLevel, gameState.resources)) {
        console.log('Cannot afford upgrade');
        return false;
    }

    // Deduct cost
    Object.keys(cost).forEach(resource => {
        gameState.resources[resource] -= cost[resource];
    });

    // Apply upgrade
    gameState.upgrades[upgradeId]++;
    applyUpgradeEffect(upgrade);

    console.log(`✅ Purchased ${upgrade.name} (Level ${gameState.upgrades[upgradeId]})`);
    saveGame();
    return true;
}

/**
 * Apply upgrade effect to game state
 */
function applyUpgradeEffect(upgrade) {
    const effect = upgrade.effect();

    Object.keys(effect).forEach(key => {
        switch(key) {
            // Hero stats
            case 'maxHp':
                gameState.hero.maxHp += effect[key];
                gameState.hero.hp = gameState.hero.maxHp; // Full heal
                break;
            case 'attack':
                gameState.hero.attack += effect[key];
                break;
            case 'defense':
                gameState.hero.defense += effect[key];
                break;
            case 'critChance':
                gameState.hero.critChance += effect[key];
                break;
            case 'critMultiplier':
                gameState.hero.critMultiplier += effect[key];
                break;

            // Idle system
            case 'autoRunInterval':
                gameState.idle.autoRunInterval += effect[key];
                gameState.idle.autoRunInterval = Math.max(10, gameState.idle.autoRunInterval);
                break;

            // Bonuses (stored for later calculation)
            case 'autoRunSuccessBonus':
            case 'autoRunGoldBonus':
            case 'xpBonus':
            case 'gemDropBonus':
            case 'soulDropBonus':
                if (!gameState.bonuses) gameState.bonuses = {};
                if (!gameState.bonuses[key]) gameState.bonuses[key] = 0;
                gameState.bonuses[key] += effect[key];
                break;
        }
    });
}

/**
 * Get total bonus of a specific type
 */
export function getTotalBonus(bonusType) {
    if (!gameState.bonuses || !gameState.bonuses[bonusType]) return 0;
    return gameState.bonuses[bonusType];
}

/**
 * Recalculate all upgrades (called on game load)
 */
export function recalculateUpgrades() {
    // Reset bonuses
    gameState.bonuses = {};

    // Reapply all purchased upgrades
    Object.keys(gameState.upgrades).forEach(upgradeId => {
        const upgrade = upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;

        const level = gameState.upgrades[upgradeId];
        for (let i = 0; i < level; i++) {
            applyUpgradeEffect(upgrade);
        }
    });

    console.log('🔄 Upgrades recalculated');
}