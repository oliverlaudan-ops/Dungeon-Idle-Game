/**
 * Prestige UI
 * Handles rendering and interaction for prestige system
 */

import { gameState } from '../core/game-state.js';
import {
    canAscend,
    performAscension,
    PRESTIGE_UPGRADES,
    getPrestigeUpgradeCost,
    purchasePrestigeUpgrade,
    getUpgradesByCategory,
    getPrestigeBonuses
} from '../prestige/prestige-system.js';

/**
 * Initialize prestige UI
 */
export function initPrestigeUI() {
    // Ascension button
    const ascendBtn = document.getElementById('ascend-btn');
    if (ascendBtn) {
        ascendBtn.addEventListener('click', handleAscension);
    }
    
    // Render prestige UI
    renderPrestigeUI();
}

/**
 * Render complete prestige UI
 */
export function renderPrestigeUI() {
    renderPrestigeHeader();
    renderAscensionPanel();
    renderPrestigeUpgrades();
    renderActiveBonuses();
}

/**
 * Render prestige header with stats
 */
function renderPrestigeHeader() {
    const container = document.getElementById('prestige-header');
    if (!container) return;
    
    const prestigeLevel = gameState.prestigeLevel || 0;
    const stats = gameState.prestigeStats || { totalAscensions: 0, keysSpent: 0 };
    
    container.innerHTML = `
        <div class="prestige-stats-grid">
            <div class="prestige-stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-info">
                    <span class="stat-label">Prestige Level</span>
                    <span class="stat-value">${prestigeLevel}</span>
                </div>
            </div>
            <div class="prestige-stat-card">
                <div class="stat-icon">🔄</div>
                <div class="stat-info">
                    <span class="stat-label">Total Ascensions</span>
                    <span class="stat-value">${stats.totalAscensions}</span>
                </div>
            </div>
            <div class="prestige-stat-card">
                <div class="stat-icon">🔑</div>
                <div class="stat-info">
                    <span class="stat-label">Keys Spent</span>
                    <span class="stat-value">${stats.keysSpent}</span>
                </div>
            </div>
            <div class="prestige-stat-card">
                <div class="stat-icon">💼</div>
                <div class="stat-info">
                    <span class="stat-label">Current Keys</span>
                    <span class="stat-value">${gameState.resources.dungeonKeys}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render ascension panel
 */
function renderAscensionPanel() {
    const container = document.getElementById('ascension-panel');
    if (!container) return;
    
    const check = canAscend();
    
    let statusHTML = '';
    if (!check.levelReached) {
        statusHTML = `<p class="ascension-requirement warning">⚠️ Need Level 20 (${check.levelNeeded} more levels)</p>`;
    } else if (!check.hasKeys) {
        statusHTML = `<p class="ascension-requirement warning">⚠️ Need 10 Keys (${check.keysNeeded} more keys)</p>`;
    } else {
        statusHTML = `<p class="ascension-requirement success">✅ Ready to Ascend!</p>`;
    }
    
    container.innerHTML = `
        <div class="ascension-card">
            <h3>🔄 Ascension</h3>
            <p class="ascension-description">
                Reset your progress but gain permanent bonuses! You'll keep your keys and prestige upgrades.
            </p>
            <div class="ascension-cost">
                <span class="cost-label">Cost:</span>
                <span class="cost-value">🔑 10 Keys</span>
            </div>
            ${statusHTML}
            <button id="ascend-btn" class="btn ${check.canAscend ? 'btn-primary' : 'btn-disabled'}" ${!check.canAscend ? 'disabled' : ''}>
                🔄 Ascend (Prestige Level ${(gameState.prestigeLevel || 0) + 1})
            </button>
            <div class="ascension-warning">
                <strong>⚠️ Warning:</strong> You will lose levels, skills, equipment, and resources (except keys)!
            </div>
        </div>
    `;
    
    // Re-attach event listener
    const ascendBtn = document.getElementById('ascend-btn');
    if (ascendBtn) {
        ascendBtn.addEventListener('click', handleAscension);
    }
}

/**
 * Render prestige upgrades by category
 */
function renderPrestigeUpgrades() {
    renderUpgradeCategory('STATS', 'stats-upgrades');
    renderUpgradeCategory('RESOURCES', 'resources-upgrades');
    renderUpgradeCategory('CONVENIENCE', 'convenience-upgrades');
}

/**
 * Render upgrades for a specific category
 */
function renderUpgradeCategory(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const upgrades = getUpgradesByCategory(category);
    
    container.innerHTML = upgrades.map(upgrade => {
        const currentLevel = gameState.prestigeUpgrades?.[upgrade.id] || 0;
        const cost = getPrestigeUpgradeCost(upgrade.id);
        const isMaxed = currentLevel >= upgrade.maxLevel;
        const canAfford = gameState.resources.dungeonKeys >= cost;
        
        return `
            <div class="prestige-upgrade-card ${isMaxed ? 'maxed' : ''} ${!canAfford && !isMaxed ? 'locked' : ''}">
                <div class="upgrade-header">
                    <div class="upgrade-icon">${upgrade.icon}</div>
                    <div class="upgrade-info">
                        <div class="upgrade-name">${upgrade.name}</div>
                        <div class="upgrade-level">Level ${currentLevel}/${upgrade.maxLevel}</div>
                    </div>
                </div>
                <p class="upgrade-description">${upgrade.description}</p>
                <div class="upgrade-effect">${upgrade.tooltip(currentLevel)}</div>
                ${!isMaxed ? `
                    <div class="upgrade-cost">
                        <span>🔑 ${cost} Keys</span>
                    </div>
                    <button class="btn btn-small ${canAfford ? 'btn-success' : 'btn-disabled'}" 
                            data-upgrade-id="${upgrade.id}"
                            ${!canAfford ? 'disabled' : ''}>
                        Upgrade
                    </button>
                ` : `
                    <div class="upgrade-maxed">✅ MAX LEVEL</div>
                `}
            </div>
        `;
    }).join('');
    
    // Attach event listeners
    container.querySelectorAll('button[data-upgrade-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const upgradeId = e.target.dataset.upgradeId;
            handlePurchaseUpgrade(upgradeId);
        });
    });
}

/**
 * Render active prestige bonuses
 */
function renderActiveBonuses() {
    const container = document.getElementById('active-bonuses');
    if (!container) return;
    
    const bonuses = getPrestigeBonuses();
    const bonusCount = Object.keys(bonuses).length;
    
    if (bonusCount === 0) {
        container.innerHTML = '<p class="text-muted">No prestige bonuses yet. Purchase upgrades to gain permanent benefits!</p>';
        return;
    }
    
    const bonusHTML = [];
    
    if (bonuses.maxHpBonus) bonusHTML.push(`<div class="bonus-item">❤️ +${bonuses.maxHpBonus} Max HP</div>`);
    if (bonuses.attackBonus) bonusHTML.push(`<div class="bonus-item">⚔️ +${bonuses.attackBonus} Attack</div>`);
    if (bonuses.defenseBonus) bonusHTML.push(`<div class="bonus-item">🛡️ +${bonuses.defenseBonus} Defense</div>`);
    if (bonuses.critChanceBonus) bonusHTML.push(`<div class="bonus-item">✨ +${(bonuses.critChanceBonus * 100).toFixed(0)}% Crit Chance</div>`);
    if (bonuses.goldMultiplier) bonusHTML.push(`<div class="bonus-item">💰 ${(bonuses.goldMultiplier * 100).toFixed(0)}% Gold</div>`);
    if (bonuses.xpMultiplier) bonusHTML.push(`<div class="bonus-item">🎓 ${(bonuses.xpMultiplier * 100).toFixed(0)}% XP</div>`);
    if (bonuses.keyFindBonus) bonusHTML.push(`<div class="bonus-item">🔑 +${(bonuses.keyFindBonus * 100).toFixed(0)}% Key Drop Rate</div>`);
    if (bonuses.lootQualityBonus) bonusHTML.push(`<div class="bonus-item">🎁 +${(bonuses.lootQualityBonus * 100).toFixed(0)}% Loot Quality</div>`);
    if (bonuses.startLevel && bonuses.startLevel > 1) bonusHTML.push(`<div class="bonus-item">🌟 Start at Level ${bonuses.startLevel}</div>`);
    if (bonuses.startKeys) bonusHTML.push(`<div class="bonus-item">🔑 Start with +${bonuses.startKeys} Keys</div>`);
    if (bonuses.deathProtection) bonusHTML.push(`<div class="bonus-item">🛡️ Death Protection Active</div>`);
    if (bonuses.bonusSkillPoints) bonusHTML.push(`<div class="bonus-item">🌳 +${bonuses.bonusSkillPoints} Skill Points</div>`);
    
    container.innerHTML = `<div class="bonus-grid">${bonusHTML.join('')}</div>`;
}

/**
 * Handle ascension button click
 */
function handleAscension() {
    const check = canAscend();
    if (!check.canAscend) return;
    
    const confirmMsg = `⚠️ Are you sure you want to ascend?\n\nYou will lose:\n- All levels and XP\n- All skills\n- All equipment\n- All resources (except keys)\n\nYou will keep:\n- Your keys\n- All prestige upgrades\n- Permanent bonuses`;
    
    if (!confirm(confirmMsg)) return;
    
    const result = performAscension();
    
    if (result.success) {
        alert(`✨ ${result.message}\n\nYou now have powerful permanent bonuses!`);
        // Reload page to apply reset
        location.reload();
    } else {
        alert(`❌ ${result.message}`);
    }
}

/**
 * Handle upgrade purchase
 */
function handlePurchaseUpgrade(upgradeId) {
    const result = purchasePrestigeUpgrade(upgradeId);
    
    if (result.success) {
        // Show success feedback
        console.log(`✨ ${result.message}`);
        
        // Re-render UI
        renderPrestigeUI();
    } else {
        alert(`❌ ${result.message}`);
    }
}
