/**
 * Manual Run UI
 * Handles UI updates for manual dungeon runs
 */

import { gameState } from '../src/core/game-state.js';
import { startManualRun, endManualRun } from '../src/manual-run/manual-run-manager.js';
import { initCanvas, clearCanvas, renderCenterMessage } from '../src/manual-run/canvas-renderer.js';
import { initInputHandler, removeInputHandler } from '../src/manual-run/input-handler.js';
import { initCombatUI } from '../src/manual-run/combat-ui.js';

let isInitialized = false;

/**
 * Initialize manual run UI
 */
export function initManualRunUI() {
    if (isInitialized) return;

    // Initialize canvas
    if (!initCanvas()) {
        console.error('❌ Failed to initialize canvas');
        return;
    }

    // Initialize combat UI
    if (!initCombatUI()) {
        console.error('❌ Failed to initialize combat UI');
    }

    // Show welcome message
    renderWelcomeScreen();

    // Setup start button
    setupStartButton();

    // Initialize input handler
    initInputHandler();

    isInitialized = true;
    console.log('✅ Manual run UI initialized');
}

/**
 * Render welcome screen
 */
function renderWelcomeScreen() {
    renderCenterMessage('Manual Dungeon Run', 'Click START RUN to begin');
}

/**
 * Setup start run button
 */
function setupStartButton() {
    // Remove existing button if any
    const existingBtn = document.getElementById('start-manual-run-btn');
    if (existingBtn) {
        existingBtn.remove();
    }

    // Create start button
    const container = document.getElementById('manual-tab');
    if (!container) return;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginTop = '20px';

    const startBtn = document.createElement('button');
    startBtn.id = 'start-manual-run-btn';
    startBtn.className = 'btn btn-primary';
    startBtn.textContent = 'Start Run';
    startBtn.style.fontSize = '1.2rem';
    startBtn.style.padding = '15px 40px';

    startBtn.addEventListener('click', handleStartRun);

    buttonContainer.appendChild(startBtn);
    
    // Insert after canvas container
    const canvasContainer = document.getElementById('dungeon-canvas-container');
    if (canvasContainer && canvasContainer.nextSibling) {
        container.insertBefore(buttonContainer, canvasContainer.nextSibling);
    } else {
        container.appendChild(buttonContainer);
    }
}

/**
 * Handle start run button click
 */
function handleStartRun() {
    if (gameState.manualRun.active) {
        console.log('⚠️ Run already active');
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

    // Update button
    const btn = document.getElementById('start-manual-run-btn');
    if (btn) {
        btn.textContent = 'Run in Progress...';
        btn.disabled = true;
        btn.style.opacity = '0.5';
    }
}

/**
 * Update manual run UI (called from main game loop)
 */
export function updateManualRunUI() {
    // Update button state
    const btn = document.getElementById('start-manual-run-btn');
    if (btn) {
        if (gameState.manualRun.active) {
            btn.textContent = 'Run in Progress...';
            btn.disabled = true;
            btn.style.opacity = '0.5';
        } else {
            btn.textContent = 'Start Run';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }
}

/**
 * Cleanup manual run UI
 */
export function cleanupManualRunUI() {
    removeInputHandler();
    clearCanvas();
    renderWelcomeScreen();
}