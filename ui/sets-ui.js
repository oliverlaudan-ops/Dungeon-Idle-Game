/**
 * Equipment Sets UI v1.0
 * Sprint 4: Display and track equipment set collections
 */

import { gameState } from '../src/core/game-state.js';
import { EQUIPMENT_SETS, getActiveSetBonuses, getAllSetsProgress } from '../src/upgrades/equipment-sets.js';

/**
 * Initialize Sets UI
 */
export function initializeSetsUI() {
    console.log('🎁 Initializing Equipment Sets UI');
    updateSetsUI();
}

/**
 * Update Sets Display
 */
export function updateSetsUI() {
    const setsContainer = document.getElementById('sets-container');
    if (!setsContainer) {
        console.warn('⚠️ Sets container not found');
        return;
    }

    const activeSets = getActiveSetBonuses();
    const allSetsProgress = getAllSetsProgress();

    let html = `
        <div class="sets-header">
            <h2>🎁 Equipment Sets</h2>
            <p class="sets-description">Collect matching equipment pieces to unlock powerful set bonuses!</p>
        </div>
    `;

    // Active set bonuses section
    html += renderActiveSetBonuses(activeSets);

    // All sets overview
    html += `
        <div class="sets-collection">
            <h3>📚 Set Collection</h3>
            <div class="sets-grid">
    `;

    for (const setProgress of allSetsProgress) {
        html += renderSetCard(setProgress, activeSets);
    }

    html += `
            </div>
        </div>
    `;

    setsContainer.innerHTML = html;
}

/**
 * Render active set bonuses section
 */
function renderActiveSetBonuses(activeSets) {
    const hasActiveSets = Object.keys(activeSets).length > 0;

    if (!hasActiveSets) {
        return `
            <div class="active-sets-section">
                <h3>✨ Active Set Bonuses</h3>
                <div class="no-active-sets">
                    <p>🚫 No active set bonuses</p>
                    <p class="hint">Equip 2 or more pieces from the same set to activate bonuses!</p>
                </div>
            </div>
        `;
    }

    let html = `
        <div class="active-sets-section active">
            <h3>✨ Active Set Bonuses</h3>
            <div class="active-sets-list">
    `;

    for (const [setId, setData] of Object.entries(activeSets)) {
        const setInfo = EQUIPMENT_SETS[setId];
        html += `
            <div class="active-set-bonus" style="border-left: 4px solid ${setInfo.color}">
                <div class="set-bonus-header">
                    <span class="set-icon">${setInfo.icon}</span>
                    <span class="set-name">${setData.name}</span>
                    <span class="set-pieces">(${setData.pieceCount}/3 pieces)</span>
                </div>
                <div class="set-bonus-effects">
        `;

        for (const bonus of setData.bonuses) {
            html += `
                <div class="bonus-effect level-${bonus.level}">
                    <span class="bonus-level">${bonus.level}-Piece:</span>
                    <span class="bonus-name">${bonus.name}</span>
                    <span class="bonus-description">${bonus.description}</span>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;
    }

    html += `
            </div>
        </div>
    `;

    return html;
}

/**
 * Render a set card
 */
function renderSetCard(setProgress, activeSets) {
    const isActive = activeSets[setProgress.setId] !== undefined;
    const activeClass = isActive ? 'set-active' : '';
    const setInfo = EQUIPMENT_SETS[setProgress.setId];

    return `
        <div class="set-card ${activeClass}" style="border-color: ${setProgress.color}">
            <div class="set-card-header" style="background: linear-gradient(135deg, ${setProgress.color}22, transparent)">
                <span class="set-icon-large">${setProgress.icon}</span>
                <div class="set-card-title">
                    <h4 style="color: ${setProgress.color}">${setProgress.name}</h4>
                    <p class="set-theme">${setProgress.theme}</p>
                </div>
            </div>
            
            <div class="set-card-body">
                <div class="set-description">
                    ${setProgress.description}
                </div>
                
                <div class="set-progress">
                    <div class="progress-label">
                        <span>📦 Collection Progress</span>
                        <span class="progress-count">${setProgress.ownedCount}/3</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(setProgress.ownedCount / 3) * 100}%; background: ${setProgress.color}"></div>
                    </div>
                </div>
                
                <div class="set-pieces-list">
                    ${renderSetPieces(setProgress)}
                </div>
                
                <div class="set-bonuses-list">
                    <h5>Set Bonuses:</h5>
                    ${renderSetBonusesList(setProgress.bonuses, setProgress.equippedCount)}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render set pieces checklist
 */
function renderSetPieces(setProgress) {
    const pieces = ['weapon', 'armor', 'accessory'];
    const icons = { weapon: '⚔️', armor: '🛡️', accessory: '💍' };
    
    let html = '<div class="pieces-checklist">';
    
    for (const piece of pieces) {
        const owned = setProgress.ownedPieces.includes(piece);
        const equipped = setProgress.equippedPieces.includes(piece);
        const statusClass = equipped ? 'equipped' : (owned ? 'owned' : 'missing');
        const statusIcon = equipped ? '✅' : (owned ? '📦' : '❌');
        
        html += `
            <div class="piece-status ${statusClass}">
                <span class="piece-icon">${icons[piece]}</span>
                <span class="piece-name">${piece.charAt(0).toUpperCase() + piece.slice(1)}</span>
                <span class="piece-status-icon">${statusIcon}</span>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

/**
 * Render set bonuses list
 */
function renderSetBonusesList(bonuses, equippedCount) {
    let html = '';
    
    for (const [level, bonus] of Object.entries(bonuses)) {
        const isActive = equippedCount >= parseInt(level);
        const activeClass = isActive ? 'bonus-active' : 'bonus-inactive';
        const activeIcon = isActive ? '✅' : '🔒';
        
        html += `
            <div class="set-bonus-item ${activeClass}">
                <div class="bonus-level-indicator">
                    <span class="bonus-icon">${activeIcon}</span>
                    <span class="bonus-level-text">${level}-Piece</span>
                </div>
                <div class="bonus-details">
                    <div class="bonus-name">${bonus.name}</div>
                    <div class="bonus-desc">${bonus.description}</div>
                </div>
            </div>
        `;
    }
    
    return html;
}

/**
 * Export for external use
 */
export { updateSetsUI as refreshSets };
