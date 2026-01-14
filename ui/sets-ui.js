/**
 * Equipment Sets UI v1.0
 * Display set collections, bonuses, and progress
 * Sprint 4 - Equipment Sets
 */

import { gameState } from '../src/core/game-state.js';
import { getSetCollectionProgress, getActiveSetBonuses, EQUIPMENT_SETS } from '../src/upgrades/equipment-sets.js';

/**
 * Initialize Sets UI
 */
export function initializeSetsUI() {
    console.log('🎁 Initializing Sets UI...');
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

    const activeSetBonuses = getActiveSetBonuses();
    const collectionProgress = getSetCollectionProgress();

    let html = `
        <div class="sets-header">
            <h2>🎁 Equipment Sets</h2>
            <p class="sets-description">Collect matching equipment pieces to unlock powerful set bonuses!</p>
        </div>
    `;

    // Active Set Bonuses Section
    html += renderActiveSetBonuses(activeSetBonuses);

    // Set Collection Section
    html += `<div class="sets-collection">`;
    html += `<h3>📦 Set Collection</h3>`;
    
    Object.keys(collectionProgress).forEach(setId => {
        const set = collectionProgress[setId];
        html += renderSetCard(set, activeSetBonuses.sets[setId]);
    });
    
    html += `</div>`;

    setsContainer.innerHTML = html;
}

/**
 * Render active set bonuses section
 */
function renderActiveSetBonuses(activeSetBonuses) {
    const activeSets = Object.keys(activeSetBonuses.sets);
    
    if (activeSets.length === 0) {
        return `
            <div class="active-sets-section empty">
                <h3>✨ Active Set Bonuses</h3>
                <div class="no-sets">
                    <p>🚫 No active set bonuses</p>
                    <p class="hint">Equip 2 or 3 pieces from the same set to activate bonuses!</p>
                </div>
            </div>
        `;
    }

    let html = `
        <div class="active-sets-section">
            <h3>✨ Active Set Bonuses</h3>
            <div class="active-sets-grid">
    `;

    activeSets.forEach(setId => {
        const setInfo = activeSetBonuses.sets[setId];
        const set = EQUIPMENT_SETS[setId];
        
        html += `
            <div class="active-set-card" style="border-color: ${setInfo.color}">
                <div class="set-header">
                    <span class="set-icon" style="font-size: 2em;">${setInfo.icon}</span>
                    <div class="set-info">
                        <div class="set-name" style="color: ${setInfo.color}">${setInfo.name}</div>
                        <div class="set-pieces">${setInfo.piecesEquipped}/3 pieces equipped</div>
                    </div>
                </div>
                <div class="set-active-bonuses">
        `;

        setInfo.activeBonuses.forEach(bonus => {
            html += `
                <div class="bonus-item active">
                    <div class="bonus-name">✅ ${bonus.name}</div>
                    <div class="bonus-description">${bonus.description}</div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

/**
 * Render a single set card
 */
function renderSetCard(set, activeInfo) {
    const isActive = activeInfo !== undefined;
    const progressPercent = (set.ownedCount / set.totalPieces) * 100;
    const cardClass = isActive ? 'set-card active' : 'set-card';

    let html = `
        <div class="${cardClass}" style="border-left: 4px solid ${set.color}">
            <div class="set-card-header">
                <div class="set-icon-large">${set.icon}</div>
                <div class="set-header-info">
                    <h4 class="set-title" style="color: ${set.color}">${set.name}</h4>
                    <p class="set-description">${set.description}</p>
                    <div class="set-theme-badge" style="background-color: ${set.color}20; color: ${set.color}">
                        ${set.theme.toUpperCase()}
                    </div>
                </div>
            </div>

            <div class="set-progress">
                <div class="progress-label">
                    <span>Collection Progress</span>
                    <span class="progress-count">${set.ownedCount}/${set.totalPieces}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%; background-color: ${set.color}"></div>
                </div>
            </div>

            <div class="set-pieces-list">
                <h5>Set Pieces:</h5>
    `;

    set.pieces.forEach(piece => {
        const ownedClass = piece.owned ? 'owned' : 'missing';
        const icon = piece.owned ? '✅' : '❌';
        
        html += `
            <div class="set-piece ${ownedClass}">
                <span class="piece-icon">${icon}</span>
                <span class="piece-slot">${piece.slot.charAt(0).toUpperCase() + piece.slot.slice(1)}</span>
            </div>
        `;
    });

    html += `
            </div>

            <div class="set-bonuses-info">
                <h5>Set Bonuses:</h5>
    `;

    // 2-piece bonus
    if (set.bonuses['2piece']) {
        const bonus = set.bonuses['2piece'];
        const activeClass = (isActive && activeInfo.piecesEquipped >= 2) ? 'bonus-active' : '';
        
        html += `
            <div class="bonus-item ${activeClass}">
                <div class="bonus-header">
                    <span class="bonus-pieces">(2) ${bonus.name}</span>
                    ${activeClass ? '<span class="bonus-active-tag">✨ ACTIVE</span>' : ''}
                </div>
                <div class="bonus-desc">${bonus.description}</div>
            </div>
        `;
    }

    // 3-piece bonus
    if (set.bonuses['3piece']) {
        const bonus = set.bonuses['3piece'];
        const activeClass = (isActive && activeInfo.piecesEquipped >= 3) ? 'bonus-active' : '';
        
        html += `
            <div class="bonus-item ${activeClass}">
                <div class="bonus-header">
                    <span class="bonus-pieces">(3) ${bonus.name}</span>
                    ${activeClass ? '<span class="bonus-active-tag">✨ ACTIVE</span>' : ''}
                </div>
                <div class="bonus-desc">${bonus.description}</div>
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
 * Refresh Sets UI (called after equipping/unequipping)
 */
export function refreshSetsUI() {
    updateSetsUI();
}

/**
 * Get sets statistics for display
 */
export function getSetsStatistics() {
    const progress = getSetCollectionProgress();
    const activeBonuses = getActiveSetBonuses();
    
    let totalPieces = 0;
    let ownedPieces = 0;
    let completedSets = 0;
    
    Object.keys(progress).forEach(setId => {
        const set = progress[setId];
        totalPieces += set.totalPieces;
        ownedPieces += set.ownedCount;
        
        if (set.ownedCount === set.totalPieces) {
            completedSets++;
        }
    });
    
    return {
        totalPieces,
        ownedPieces,
        completedSets,
        totalSets: Object.keys(progress).length,
        activeBonuses: Object.keys(activeBonuses.sets).length
    };
}
