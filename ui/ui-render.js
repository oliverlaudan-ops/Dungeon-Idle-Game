/**
 * UI Rendering
 * Handles updating the UI with current game state
 */

import { gameState } from '../src/core/game-state.js';

let runHistory = [];
const MAX_HISTORY_ENTRIES = 10;

/**
 * Update all UI elements
 */
export function updateUI() {
    updateResources();
    updateAutoRunInfo();
    updateStats();
}

/**
 * Update resource displays
 */
function updateResources() {
    document.getElementById('gold-value').textContent = formatNumber(gameState.resources.gold);
    document.getElementById('gems-value').textContent = formatNumber(gameState.resources.gems);
    document.getElementById('souls-value').textContent = formatNumber(gameState.resources.souls);
    document.getElementById('keys-value').textContent = gameState.resources.dungeonKeys;
}

/**
 * Update auto-run information
 */
function updateAutoRunInfo() {
    const statusEl = document.getElementById('auto-run-status');
    const timerEl = document.getElementById('next-run-timer');
    const successRateEl = document.getElementById('success-rate');
    const intervalEl = document.getElementById('auto-run-interval');

    // Status
    if (gameState.idle.autoRunEnabled) {
        statusEl.textContent = 'Aktiv';
        statusEl.className = 'status-active';

        // Timer
        const now = Date.now();
        const timeSinceLastRun = (now - gameState.idle.lastAutoRun) / 1000;
        const timeUntilNext = Math.max(0, gameState.idle.autoRunInterval - timeSinceLastRun);
        timerEl.textContent = formatTime(timeUntilNext);
    } else {
        statusEl.textContent = 'Inaktiv';
        statusEl.className = 'status-inactive';
        timerEl.textContent = '--';
    }

    // Interval
    intervalEl.textContent = gameState.idle.autoRunInterval + 's';

    // Success rate
    const successChance = calculateSuccessChance();
    successRateEl.textContent = Math.round(successChance * 100) + '%';
}

/**
 * Update statistics
 */
function updateStats() {
    const totalRuns = gameState.idle.totalAutoRuns;
    const successfulRuns = gameState.idle.successfulRuns;
    const failedRuns = totalRuns - successfulRuns;
    const successRatio = totalRuns > 0 ? (successfulRuns / totalRuns * 100) : 0;

    document.getElementById('total-runs').textContent = totalRuns;
    document.getElementById('successful-runs').textContent = successfulRuns;
    document.getElementById('failed-runs').textContent = failedRuns;
    document.getElementById('success-ratio').textContent = Math.round(successRatio) + '%';
}

/**
 * Add entry to run history
 */
export function addRunHistoryEntry(success, rewards = null) {
    const entry = {
        success,
        rewards,
        timestamp: Date.now()
    };

    runHistory.unshift(entry);
    if (runHistory.length > MAX_HISTORY_ENTRIES) {
        runHistory.pop();
    }

    updateRunHistory();
}

/**
 * Update run history display
 */
function updateRunHistory() {
    const historyEl = document.getElementById('run-history');
    
    if (runHistory.length === 0) {
        historyEl.innerHTML = '<p class="text-muted">Noch keine Runs durchgeführt...</p>';
        return;
    }

    historyEl.innerHTML = runHistory.map(entry => {
        const icon = entry.success ? '✅' : '❌';
        const cssClass = entry.success ? 'success' : 'failure';
        const result = entry.success ? 'Erfolgreich' : 'Fehlgeschlagen';
        const rewardsText = entry.success && entry.rewards 
            ? `+${entry.rewards.gold} Gold, +${entry.rewards.xp} XP${entry.rewards.gems > 0 ? ', +' + entry.rewards.gems + ' Gems' : ''}`
            : 'Keine Belohnungen';
        const timeAgo = formatTimeAgo(entry.timestamp);

        return `
            <div class="run-entry ${cssClass}">
                <div class="run-entry-info">
                    <span class="run-entry-icon">${icon}</span>
                    <div class="run-entry-details">
                        <span class="run-entry-result">${result}</span>
                        <span class="run-entry-rewards">${rewardsText}</span>
                    </div>
                </div>
                <span class="run-entry-time">${timeAgo}</span>
            </div>
        `;
    }).join('');
}

/**
 * Calculate success chance (same logic as in auto-run.js)
 */
function calculateSuccessChance() {
    let chance = 0.5;
    chance += gameState.hero.level * 0.02;
    return Math.min(0.95, chance);
}

/**
 * Format number with thousand separators
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toString();
}

/**
 * Format seconds to MM:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format timestamp to "X ago" format
 */
function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Gerade eben';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h';
    return Math.floor(seconds / 86400) + 'd';
}