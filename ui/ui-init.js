/**
 * UI Initialization
 * Sets up all UI event listeners and interactions
 */

import { gameState, saveGame } from '../src/core/game-state.js';
import { updateUI } from './ui-render.js';
import { initUpgradesUI } from './ui-upgrades.js';

/**
 * Initialize UI
 */
export function initUI() {
    console.log('📱 Initializing UI...');

    // Setup tab navigation
    setupTabs();

    // Setup button listeners
    setupButtons();

    // Initialize upgrades UI
    initUpgradesUI();

    // Initial UI update
    updateUI();

    console.log('✅ UI initialized');
}

/**
 * Setup tab navigation
 */
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(`${targetTab}-tab`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/**
 * Setup button event listeners
 */
function setupButtons() {
    // Auto-run toggle button
    const autoRunBtn = document.getElementById('toggle-auto-run');
    if (autoRunBtn) {
        autoRunBtn.addEventListener('click', toggleAutoRun);
        updateAutoRunButton();
    }
}

/**
 * Toggle auto-run on/off
 */
function toggleAutoRun() {
    gameState.idle.autoRunEnabled = !gameState.idle.autoRunEnabled;
    
    if (gameState.idle.autoRunEnabled) {
        console.log('✅ Auto-runs aktiviert');
        // Set last run time to now so first run happens after full interval
        gameState.idle.lastAutoRun = Date.now();
    } else {
        console.log('❌ Auto-runs deaktiviert');
    }

    updateAutoRunButton();
    saveGame();
}

/**
 * Update auto-run button text and style
 */
function updateAutoRunButton() {
    const btn = document.getElementById('toggle-auto-run');
    if (!btn) return;

    if (gameState.idle.autoRunEnabled) {
        btn.textContent = 'Stop Auto Runs';
        btn.style.background = 'var(--danger)';
    } else {
        btn.textContent = 'Start Auto Runs';
        btn.style.background = 'var(--success)';
    }
}