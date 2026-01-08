/**
 * UI Initialization
 * Sets up all UI event listeners and interactions
 */

import { gameState } from '../src/core/game-state.js';

/**
 * Initialize UI
 */
export function initUI() {
    console.log('📱 Initializing UI...');

    // Setup tab navigation
    setupTabs();

    // Setup button listeners
    setupButtons();

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
    // Buttons will be added as we implement features
}