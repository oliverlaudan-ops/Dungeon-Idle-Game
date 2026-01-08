/**
 * Save Manager
 * Handles import, export, and reset functionality
 */

import { gameState, saveGame, loadGame } from './game-state.js';
import { applyUpgradeEffects } from '../upgrades/upgrade-manager.js';
import { updateUI } from '../../ui/ui-render.js';
import { renderUpgrades } from '../../ui/upgrades-ui.js';

/**
 * Export save to base64 string
 */
export function exportSave() {
    try {
        const saveData = JSON.stringify(gameState);
        const encoded = btoa(saveData); // Base64 encode
        console.log('✅ Save exported');
        return encoded;
    } catch (e) {
        console.error('❌ Export failed:', e);
        return null;
    }
}

/**
 * Import save from base64 string
 */
export function importSave(encodedSave) {
    try {
        // Decode
        const decoded = atob(encodedSave);
        const loadedData = JSON.parse(decoded);

        // Validate basic structure
        if (!loadedData.hero || !loadedData.resources || !loadedData.idle) {
            throw new Error('Invalid save data structure');
        }

        // Merge with current state (to handle new properties)
        Object.keys(gameState).forEach(key => {
            if (loadedData[key] !== undefined) {
                if (typeof gameState[key] === 'object' && !Array.isArray(gameState[key])) {
                    gameState[key] = { ...gameState[key], ...loadedData[key] };
                } else {
                    gameState[key] = loadedData[key];
                }
            }
        });

        // Apply upgrades
        applyUpgradeEffects();

        // Save to localStorage
        saveGame();

        // Refresh UI
        updateUI();
        renderUpgrades();

        console.log('✅ Save imported successfully');
        return { success: true };
    } catch (e) {
        console.error('❌ Import failed:', e);
        return { success: false, error: e.message };
    }
}

/**
 * Reset game completely
 */
export function resetGame() {
    const confirmed = confirm(
        '⚠️ WARNUNG!\n\n' +
        'Dies wird deinen GESAMTEN Spielstand löschen!\n' +
        'Du verlierst alle Ressourcen, Upgrades und Fortschritte.\n\n' +
        'Bist du dir ABSOLUT sicher?'
    );

    if (!confirmed) return false;

    // Double confirmation
    const doubleConfirm = confirm(
        'Letzte Chance!\n\n' +
        'Wirklich ALLES zurücksetzen?\n' +
        'Diese Aktion kann NICHT rückgängig gemacht werden!'
    );

    if (!doubleConfirm) return false;

    try {
        // Clear localStorage
        localStorage.removeItem('dungeonIdleGame');
        console.log('🗑️ Game reset - reloading...');
        
        // Reload page
        setTimeout(() => {
            location.reload();
        }, 100);

        return true;
    } catch (e) {
        console.error('❌ Reset failed:', e);
        alert('Fehler beim Zurücksetzen des Spiels!');
        return false;
    }
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format play time in hours/minutes
 */
export function formatPlayTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}