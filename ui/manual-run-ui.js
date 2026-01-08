/**
 * Manual Run UI
 * Handles UI updates for manual dungeon runs
 */

import { gameState } from '../src/core/game-state.js';
import { startManualRun, endManualRun } from '../src/manual-run/manual-run-manager.js';
import { initCanvas, clearCanvas, renderCenterMessage } from '../src/manual-run/canvas-renderer.js';
import { initInputHandler, removeInputHandler } from '../src/manual-run/input-handler.js';
import { initCombatUI } from '../src/manual-run/combat-ui.js';

let canvasInitialized = false;
let combatUIInitialized = false;
let inputHandlerInitialized = false;

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

    // Always show welcome screen when tab is opened
    renderWelcomeScreen();

    // Always ensure start button exists and has correct state
    ensureStartButton();
}

/**
 * Render welcome screen
 */
function renderWelcomeScreen() {
    renderCenterMessage('Manual Dungeon Run', 'Click START RUN to begin');
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
        btn.textContent = 'Run in Progress...';
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.textContent = 'Start Run';
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
        alert('⚠️ Your hero has no HP! Heal first.');
        return;
    }

    // Start the run
    const floor = 1; // Start with floor 1
    startManualRun(floor);

    // Update button immediately
    updateManualRunUI();
}

/**
 * Update manual run UI (called from main game loop and manual-run-manager)
 */
export function updateManualRunUI() {
    const btn = document.getElementById('start-manual-run-btn');
    updateButtonState(btn);
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