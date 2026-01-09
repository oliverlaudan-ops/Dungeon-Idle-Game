/**
 * Manual Run UI v2.0
 * Handles UI updates for manual dungeon runs with difficulty selection
 * UPDATED: Now supports difficulty selection and equipment preview
 */

import { gameState } from '../src/core/game-state.js';
import { startManualRun, endManualRun } from '../src/manual-run/manual-run-manager.js';
import { initCanvas, clearCanvas, renderCenterMessage } from '../src/manual-run/canvas-renderer.js';
import { initInputHandler, removeInputHandler } from '../src/manual-run/input-handler.js';
import { initCombatUI } from '../src/manual-run/combat-ui.js';

let canvasInitialized = false;
let combatUIInitialized = false;
let inputHandlerInitialized = false;

// Difficulty configuration
const DIFFICULTY_CONFIG = {
    easy: {
        label: '😊 Easy',
        color: '#2ecc71',
        description: '5-8 rooms, 0.75x monster strength'
    },
    normal: {
        label: '😀 Normal',
        color: '#3498db',
        description: '7-10 rooms, 1.2x monster strength, 1.5x rewards'
    },
    hard: {
        label: '😠 Hard',
        color: '#f39c12',
        description: '10-13 rooms, 1.6x monster strength, 2.5x rewards'
    },
    expert: {
        label: '🔥 Expert',
        color: '#e74c3c',
        description: '12-15 rooms, 2.0x monster strength, 4.0x rewards'
    }
};

/**
 * Initialize manual run UI
 */
export function initManualRunUI() {
    // Initialize canvas (only once)
    if (!canvasInitialized) {
        if (!initCanvas()) {
            console.error('❌ Failed to initialize canvas');
            return;
        }
        canvasInitialized = true;
    }

    // Initialize combat UI (only once)
    if (!combatUIInitialized) {
        if (!initCombatUI()) {
            console.error('❌ Failed to initialize combat UI');
        } else {
            combatUIInitialized = true;
        }
    }

    // Initialize input handler (only once)
    if (!inputHandlerInitialized) {
        initInputHandler();
        inputHandlerInitialized = true;
    }

    // Initialize game state defaults
    if (!gameState.settings) {
        gameState.settings = {};
    }
    if (!gameState.settings.difficulty) {
        gameState.settings.difficulty = 'normal';
    }
    if (!gameState.equipped) {
        gameState.equipped = {};
    }
    if (!gameState.inventory) {
        gameState.inventory = [];
    }

    // Always show welcome screen when tab is opened
    renderWelcomeScreen();

    // Always ensure UI elements exist
    ensureDifficultySelector();
    ensureStartButton();
    renderEquipmentPreview();
}

/**
 * Render welcome screen with difficulty selector
 */
function renderWelcomeScreen() {
    renderCenterMessage('Manual Dungeon Run', 'Select difficulty and click START');
}

/**
 * Create and manage difficulty selector
 */
function ensureDifficultySelector() {
    let selector = document.getElementById('difficulty-selector-manual');
    
    if (!selector) {
        const container = document.getElementById('manual-tab');
        if (!container) {
            console.warn('⚠️ Manual tab container not found');
            return;
        }

        selector = document.createElement('div');
        selector.id = 'difficulty-selector-manual';
        selector.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
            padding: 20px;
            background: rgba(0,0,0,0.1);
            border-radius: 8px;
        `;

        // Create buttons for each difficulty
        Object.entries(DIFFICULTY_CONFIG).forEach(([key, config]) => {
            const btn = document.createElement('button');
            btn.className = 'difficulty-btn';
            btn.id = `difficulty-${key}`;
            btn.style.cssText = `
                padding: 12px 20px;
                border: 2px solid ${config.color};
                background: rgba(255,255,255,0.1);
                color: #fff;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                flex: 1;
                max-width: 150px;
            `;
            
            btn.innerHTML = `
                <div style="font-size: 1.2em; margin-bottom: 5px;">${config.label}</div>
                <div style="font-size: 0.85em; opacity: 0.8;">${config.description}</div>
            `;

            btn.addEventListener('click', () => setDifficulty(key, btn));
            selector.appendChild(btn);
        });

        container.insertBefore(selector, container.firstChild);
        updateDifficultySelectorUI();
    } else {
        updateDifficultySelectorUI();
    }
}

/**
 * Update difficulty selector visual state
 */
function updateDifficultySelectorUI() {
    const currentDifficulty = gameState.settings?.difficulty || 'normal';
    
    Object.keys(DIFFICULTY_CONFIG).forEach(key => {
        const btn = document.getElementById(`difficulty-${key}`);
        if (!btn) return;

        const config = DIFFICULTY_CONFIG[key];
        if (key === currentDifficulty) {
            btn.style.background = config.color;
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = `0 0 15px ${config.color}`;
        } else {
            btn.style.background = 'rgba(255,255,255,0.1)';
            btn.style.transform = 'scale(1.0)';
            btn.style.boxShadow = 'none';
        }
    });
}

/**
 * Set difficulty
 */
function setDifficulty(difficulty, btn) {
    gameState.settings.difficulty = difficulty;
    updateDifficultySelectorUI();
    renderEquipmentPreview(); // Update preview with new difficulty multipliers
    console.log(`✅ Difficulty set to: ${difficulty}`);
}

/**
 * Render equipment preview
 */
function renderEquipmentPreview() {
    let preview = document.getElementById('equipment-preview-manual');
    
    if (!preview) {
        const container = document.getElementById('manual-tab');
        if (!container) return;

        preview = document.createElement('div');
        preview.id = 'equipment-preview-manual';
        preview.style.cssText = `
            margin: 20px 0;
            padding: 15px;
            background: rgba(0,0,0,0.2);
            border-radius: 8px;
            border-left: 4px solid #3498db;
        `;
        container.insertBefore(preview, document.getElementById('manual-run-button-container') || container.lastChild);
    }

    // Build equipment info
    const equipped = gameState.equipped || {};
    const heroStats = calculateHeroStats();
    
    let html = '<div style="font-weight: bold; margin-bottom: 10px;">⚔️ Current Equipment & Stats:</div>';
    html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">';
    
    // Equipment column
    html += '<div>';
    html += '<strong>Equipment:</strong><br>';
    if (equipped.weapon) {
        html += `🗡️ Weapon: ${equipped.weapon.name} (+${equipped.weapon.atk} ATK)<br>`;
    } else {
        html += '🗡️ Weapon: None (Base ATK only)<br>';
    }
    if (equipped.armor) {
        html += `🛡️ Armor: ${equipped.armor.name} (+${equipped.armor.def} DEF)<br>`;
    } else {
        html += '🛡️ Armor: None (Base DEF only)<br>';
    }
    if (equipped.accessory) {
        html += `💎 Accessory: ${equipped.accessory.name}<br>`;
    }
    html += '</div>';
    
    // Stats column
    html += '<div>';
    html += '<strong>Expected Stats:</strong><br>';
    html += `⚔️ ATK: ${heroStats.atk}<br>`;
    html += `🛡️ DEF: ${heroStats.def}<br>`;
    html += `❤️ HP: ${heroStats.hp}<br>`;
    html += '</div>';
    
    html += '</div>';
    html += `<div style="margin-top: 10px; font-size: 0.9em; opacity: 0.7;">💡 Tip: Better equipment makes difficult dungeons easier!</div>`;
    
    preview.innerHTML = html;
}

/**
 * Calculate hero stats with equipment
 */
function calculateHeroStats() {
    const equipped = gameState.equipped || {};
    const level = gameState.hero?.level || 1;
    
    let atk = 10 + (level * 2);
    let def = 5;
    let hp = 100;

    // Add equipment bonuses
    if (equipped.weapon) {
        atk += equipped.weapon.atk || 0;
    }
    if (equipped.armor) {
        def += equipped.armor.def || 0;
        hp += equipped.armor.hp || 0;
    }
    if (equipped.accessory) {
        atk += equipped.accessory.bonusATK || 0;
        def += equipped.accessory.bonusDEF || 0;
        hp += equipped.accessory.bonusHP || 0;
    }

    return { atk, def, hp };
}

/**
 * Ensure start button exists and has correct state
 */
function ensureStartButton() {
    let startBtn = document.getElementById('start-manual-run-btn');
    
    // Create button if it doesn't exist
    if (!startBtn) {
        const container = document.getElementById('manual-tab');
        if (!container) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'manual-run-button-container';
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '20px';

        startBtn = document.createElement('button');
        startBtn.id = 'start-manual-run-btn';
        startBtn.className = 'btn btn-primary';
        startBtn.style.fontSize = '1.2rem';
        startBtn.style.padding = '15px 40px';

        startBtn.addEventListener('click', handleStartRun);

        buttonContainer.appendChild(startBtn);
        container.appendChild(buttonContainer);
    }

    // Set correct button state based on game state
    updateButtonState(startBtn);
}

/**
 * Update button state
 */
function updateButtonState(btn) {
    if (!btn) {
        btn = document.getElementById('start-manual-run-btn');
        if (!btn) return;
    }

    if (gameState.manualRun.active) {
        btn.textContent = '⚔️ Run in Progress...';
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.textContent = '🎮 Start Manual Run';
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

/**
 * Handle start run button click
 */
function handleStartRun() {
    if (gameState.manualRun.active) {
        return;
    }

    // Check if hero has enough HP
    if (gameState.hero.hp <= 0) {
        alert('⚠️ Your hero has no HP! Rest or use a healing item first.');
        return;
    }

    const difficulty = gameState.settings?.difficulty || 'normal';
    const floor = 1; // Start with floor 1
    
    console.log(`🎮 Starting manual run - Floor ${floor}, Difficulty: ${difficulty}`);
    startManualRun(floor, difficulty);

    // Update button immediately
    updateManualRunUI();
}

/**
 * Update manual run UI (called from main game loop and manual-run-manager)
 */
export function updateManualRunUI() {
    const btn = document.getElementById('start-manual-run-btn');
    updateButtonState(btn);
    renderEquipmentPreview();
}

/**
 * Cleanup manual run UI
 */
export function cleanupManualRunUI() {
    removeInputHandler();
    clearCanvas();
    renderWelcomeScreen();
    
    // Reset button state
    updateManualRunUI();
}

/**
 * Get current difficulty setting
 */
export function getDifficultySetting() {
    return gameState.settings?.difficulty || 'normal';
}
