/**
 * Upgrades UI
 * Handles rendering and interaction with upgrade cards
 */

import { gameState } from '../src/core/game-state.js';
import { UPGRADES, UPGRADE_CATEGORIES, getUpgradeCost } from '../src/upgrades/upgrade-definitions.js';
import { buyUpgrade } from '../src/upgrades/upgrade-manager.js';
import { updateUI } from './ui-render.js';

/**
 * Render all upgrade cards
 */
export function renderUpgrades() {
    const combatContainer = document.getElementById('combat-upgrades');
    const idleContainer = document.getElementById('idle-upgrades');
    const specialContainer = document.getElementById('special-upgrades');

    if (!combatContainer || !idleContainer || !specialContainer) return;

    // Clear
    combatContainer.innerHTML = '';
    idleContainer.innerHTML = '';
    specialContainer.innerHTML = '';

    // Render each upgrade
    for (const upgrade of Object.values(UPGRADES)) {
        const card = createUpgradeCard(upgrade);
        
        if (upgrade.category === UPGRADE_CATEGORIES.COMBAT) {
            combatContainer.appendChild(card);
        } else if (upgrade.category === UPGRADE_CATEGORIES.IDLE) {
            idleContainer.appendChild(card);
        } else if (upgrade.category === UPGRADE_CATEGORIES.SPECIAL) {
            specialContainer.appendChild(card);
        }
    }
}

/**
 * Create a single upgrade card
 */
function createUpgradeCard(upgrade) {
    const currentLevel = gameState.upgrades[upgrade.id] || 0;
    const isMaxLevel = currentLevel >= upgrade.maxLevel;
    const cost = isMaxLevel ? null : getUpgradeCost(upgrade.id, currentLevel);
    
    const canAfford = !isMaxLevel && 
        gameState.resources.gold >= cost.gold &&
        gameState.resources.gems >= cost.gems &&
        gameState.resources.souls >= cost.souls;

    const card = document.createElement('div');
    card.className = `upgrade-card ${isMaxLevel ? 'max-level' : ''} ${!canAfford && !isMaxLevel ? 'cannot-afford' : ''}`;
    card.dataset.upgradeId = upgrade.id;

    // Icon & Name
    const header = document.createElement('div');
    header.className = 'upgrade-header';
    header.innerHTML = `
        <span class="upgrade-icon">${upgrade.icon}</span>
        <div class="upgrade-title">
            <span class="upgrade-name">${upgrade.name}</span>
            <span class="upgrade-level">Level ${currentLevel}/${upgrade.maxLevel}</span>
        </div>
    `;

    // Description
    const desc = document.createElement('p');
    desc.className = 'upgrade-description';
    desc.textContent = upgrade.description;

    // Current Effect (if level > 0)
    const effectDiv = document.createElement('div');
    effectDiv.className = 'upgrade-effect';
    if (currentLevel > 0) {
        const effect = upgrade.effect(currentLevel);
        effectDiv.innerHTML = `<small>Aktuell: ${formatEffect(effect)}</small>`;
    }

    // Cost & Button
    const footer = document.createElement('div');
    footer.className = 'upgrade-footer';
    
    if (isMaxLevel) {
        footer.innerHTML = '<span class="max-level-text">✅ MAX LEVEL</span>';
    } else {
        const costText = [];
        if (cost.gold > 0) costText.push(`💰 ${cost.gold}`);
        if (cost.gems > 0) costText.push(`💎 ${cost.gems}`);
        if (cost.souls > 0) costText.push(`👻 ${cost.souls}`);

        footer.innerHTML = `
            <span class="upgrade-cost">${costText.join(' ')}</span>
            <button class="btn btn-upgrade ${canAfford ? '' : 'disabled'}" ${canAfford ? '' : 'disabled'}>
                Kaufen
            </button>
        `;

        const buyBtn = footer.querySelector('.btn-upgrade');
        buyBtn.addEventListener('click', () => handleUpgradePurchase(upgrade.id));
    }

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(effectDiv);
    card.appendChild(footer);

    return card;
}

/**
 * Handle upgrade purchase
 */
function handleUpgradePurchase(upgradeId) {
    const result = buyUpgrade(upgradeId);
    
    if (result.success) {
        // Success feedback
        console.log('✅ Upgrade gekauft!');
        
        // Re-render upgrades
        renderUpgrades();
        
        // Update UI
        updateUI();
    } else {
        // Error feedback
        console.log('❌ Fehler:', result.error);
        alert(getErrorMessage(result.error));
    }
}

/**
 * Format effect for display
 */
function formatEffect(effect) {
    const parts = [];
    if (effect.attack) parts.push(`+${effect.attack} ATK`);
    if (effect.defense) parts.push(`+${effect.defense} DEF`);
    if (effect.maxHp) parts.push(`+${effect.maxHp} HP`);
    if (effect.critChance) parts.push(`+${(effect.critChance * 100).toFixed(1)}% Krit`);
    if (effect.critMultiplier) parts.push(`+${effect.critMultiplier.toFixed(1)}x Krit-Dmg`);
    if (effect.autoRunInterval) parts.push(`${effect.autoRunInterval}s Intervall`);
    if (effect.successBonus) parts.push(`+${(effect.successBonus * 100).toFixed(0)}% Erfolg`);
    if (effect.goldMultiplier) parts.push(`+${(effect.goldMultiplier * 100).toFixed(0)}% Gold`);
    if (effect.xpMultiplier) parts.push(`+${(effect.xpMultiplier * 100).toFixed(0)}% XP`);
    if (effect.gemChanceBonus) parts.push(`+${(effect.gemChanceBonus * 100).toFixed(0)}% Gem`);
    if (effect.soulChanceBonus) parts.push(`+${(effect.soulChanceBonus * 100).toFixed(0)}% Soul`);
    if (effect.extraKeys) parts.push(`+${effect.extraKeys} Keys`);
    return parts.join(', ');
}

/**
 * Get user-friendly error message
 */
function getErrorMessage(error) {
    switch (error) {
        case 'Not enough gold': return 'Nicht genug Gold!';
        case 'Not enough gems': return 'Nicht genug Gems!';
        case 'Not enough souls': return 'Nicht genug Souls!';
        case 'Max level reached': return 'Maximales Level erreicht!';
        default: return 'Fehler beim Kauf!';
    }
}