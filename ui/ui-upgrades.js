/**
 * Upgrade UI Rendering
 * Handles rendering upgrade cards and purchase buttons
 */

import { gameState } from '../src/core/game-state.js';
import { upgrades, upgradeCategories, getUpgradeCost, canAffordUpgrade, meetsRequirements } from '../src/meta/upgrades-def.js';
import { purchaseUpgrade } from '../src/meta/upgrades.js';
import { updateUI } from './ui-render.js';

/**
 * Initialize upgrade UI
 */
export function initUpgradesUI() {
    renderAllUpgrades();
}

/**
 * Render all upgrades grouped by category
 */
function renderAllUpgrades() {
    renderCategoryUpgrades('hero-upgrades', upgradeCategories.HERO);
    renderCategoryUpgrades('idle-upgrades', upgradeCategories.IDLE);
    renderCategoryUpgrades('combat-upgrades', upgradeCategories.COMBAT);
}

/**
 * Render upgrades for a specific category
 */
function renderCategoryUpgrades(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const categoryUpgrades = upgrades.filter(u => u.category === category);
    
    container.innerHTML = categoryUpgrades.map(upgrade => {
        return createUpgradeCard(upgrade);
    }).join('');

    // Add event listeners to buy buttons
    categoryUpgrades.forEach(upgrade => {
        const btn = document.getElementById(`buy-${upgrade.id}`);
        if (btn) {
            btn.addEventListener('click', () => handleUpgradePurchase(upgrade.id));
        }
    });
}

/**
 * Create HTML for upgrade card
 */
function createUpgradeCard(upgrade) {
    const currentLevel = gameState.upgrades[upgrade.id] || 0;
    const cost = getUpgradeCost(upgrade, currentLevel);
    const canAfford = canAffordUpgrade(upgrade, currentLevel, gameState.resources);
    const meetsReqs = meetsRequirements(upgrade, gameState.upgrades);
    const isMaxLevel = currentLevel >= upgrade.maxLevel;

    // Cost string
    const costStr = Object.keys(cost).map(resource => {
        const icon = getResourceIcon(resource);
        const hasEnough = gameState.resources[resource] >= cost[resource];
        const className = hasEnough ? 'cost-affordable' : 'cost-expensive';
        return `<span class="${className}">${icon} ${cost[resource]}</span>`;
    }).join(' ');

    // Button state
    let buttonHtml;
    if (isMaxLevel) {
        buttonHtml = '<button class="upgrade-btn max-level" disabled>MAX</button>';
    } else if (!meetsReqs) {
        buttonHtml = '<button class="upgrade-btn locked" disabled>🔒 Gesperrt</button>';
    } else if (canAfford) {
        buttonHtml = `<button id="buy-${upgrade.id}" class="upgrade-btn">Kaufen</button>`;
    } else {
        buttonHtml = `<button id="buy-${upgrade.id}" class="upgrade-btn" disabled>Kaufen</button>`;
    }

    // Requirements text
    let reqsHtml = '';
    if (upgrade.requires && !meetsReqs) {
        const reqNames = upgrade.requires.map(reqId => {
            const reqUpgrade = upgrades.find(u => u.id === reqId);
            return reqUpgrade ? reqUpgrade.name : reqId;
        }).join(', ');
        reqsHtml = `<p class="upgrade-requires">🔒 Benötigt: ${reqNames}</p>`;
    }

    return `
        <div class="upgrade-card ${isMaxLevel ? 'max-level' : ''} ${!meetsReqs ? 'locked' : ''}">
            <div class="upgrade-header">
                <h4 class="upgrade-name">${upgrade.name}</h4>
                <span class="upgrade-level">${currentLevel}/${upgrade.maxLevel}</span>
            </div>
            <p class="upgrade-description">${upgrade.description}</p>
            ${reqsHtml}
            <div class="upgrade-footer">
                <div class="upgrade-cost">${costStr}</div>
                ${buttonHtml}
            </div>
        </div>
    `;
}

/**
 * Handle upgrade purchase
 */
function handleUpgradePurchase(upgradeId) {
    const success = purchaseUpgrade(upgradeId);
    
    if (success) {
        // Update UI
        updateUI();
        renderAllUpgrades();
        
        // Visual feedback
        const btn = document.getElementById(`buy-${upgradeId}`);
        if (btn) {
            btn.textContent = '✅';
            setTimeout(() => {
                renderAllUpgrades();
            }, 300);
        }
    } else {
        // Error feedback
        const btn = document.getElementById(`buy-${upgradeId}`);
        if (btn) {
            btn.classList.add('error-shake');
            setTimeout(() => {
                btn.classList.remove('error-shake');
            }, 500);
        }
    }
}

/**
 * Update upgrade displays (called from main loop)
 */
export function updateUpgradesUI() {
    // Update all upgrade cards to reflect current affordability
    upgrades.forEach(upgrade => {
        const card = document.querySelector(`[data-upgrade-id="${upgrade.id}"]`);
        if (!card) return;

        const currentLevel = gameState.upgrades[upgrade.id] || 0;
        const canAfford = canAffordUpgrade(upgrade, currentLevel, gameState.resources);
        const btn = document.getElementById(`buy-${upgrade.id}`);
        
        if (btn && !btn.disabled && currentLevel < upgrade.maxLevel) {
            btn.disabled = !canAfford;
        }
    });
}

/**
 * Get icon for resource
 */
function getResourceIcon(resource) {
    const icons = {
        gold: '💰',
        gems: '💎',
        souls: '👻',
        dungeonKeys: '🗝️'
    };
    return icons[resource] || '?';
}