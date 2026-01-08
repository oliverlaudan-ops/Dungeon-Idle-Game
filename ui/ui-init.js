/**
 * UI Initialization
 * Sets up all UI event listeners and interactions
 */

import { gameState, saveGame } from '../src/core/game-state.js';
import { updateUI } from './ui-render.js';
import { renderUpgrades } from './upgrades-ui.js';
import { applyUpgradeEffects } from '../src/upgrades/upgrade-manager.js';
import { exportSave, importSave, resetGame, formatTimestamp, formatPlayTime } from '../src/core/save-manager.js';

/**
 * Initialize UI
 */
export function initUI() {
    console.log('📱 Initializing UI...');

    // Apply upgrades from save game
    applyUpgradeEffects();

    // Setup tab navigation
    setupTabs();

    // Setup button listeners
    setupButtons();

    // Render upgrades
    renderUpgrades();

    // Initial UI update
    updateUI();

    // Update settings info
    updateSettingsInfo();

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

            // Refresh upgrades when switching to upgrades tab
            if (targetTab === 'upgrades') {
                renderUpgrades();
            }

            // Update settings info when switching to settings tab
            if (targetTab === 'settings') {
                updateSettingsInfo();
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

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExport);
    }

    // Import button
    const importBtn = document.getElementById('import-btn');
    if (importBtn) {
        importBtn.addEventListener('click', handleImport);
    }

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
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

/**
 * Handle export button click
 */
function handleExport() {
    const exportText = document.getElementById('export-text');
    if (!exportText) return;

    const saveString = exportSave();
    if (saveString) {
        exportText.value = saveString;
        exportText.select();
        
        // Try to copy to clipboard
        try {
            navigator.clipboard.writeText(saveString);
            alert('✅ Spielstand exportiert und in die Zwischenablage kopiert!\n\nDu kannst ihn auch aus dem Textfeld unten kopieren.');
        } catch (e) {
            alert('✅ Spielstand exportiert!\n\nKopiere den Text aus dem Feld unten.');
        }
    } else {
        alert('❌ Fehler beim Exportieren des Spielstands!');
    }
}

/**
 * Handle import button click
 */
function handleImport() {
    const importText = document.getElementById('import-text');
    if (!importText || !importText.value.trim()) {
        alert('❌ Bitte füge zuerst einen Spielstand in das Textfeld ein!');
        return;
    }

    const result = importSave(importText.value.trim());
    
    if (result.success) {
        alert('✅ Spielstand erfolgreich importiert!\n\nDie Seite wird neu geladen...');
        setTimeout(() => {
            location.reload();
        }, 500);
    } else {
        alert(`❌ Fehler beim Importieren!\n\n${result.error || 'Ungültiger Spielstand'}`);
    }
}

/**
 * Handle reset button click
 */
function handleReset() {
    resetGame();
}

/**
 * Update settings info display
 */
function updateSettingsInfo() {
    const lastSaveEl = document.getElementById('last-save-time');
    const playTimeEl = document.getElementById('play-time');

    if (lastSaveEl) {
        lastSaveEl.textContent = formatTimestamp(gameState.lastSave);
    }

    if (playTimeEl) {
        // Calculate play time (rough estimate based on save times)
        const playTime = Math.floor(gameState.totalPlayTime || 0);
        playTimeEl.textContent = formatPlayTime(playTime);
    }
}