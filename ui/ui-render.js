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
    updateHeroDisplay();
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
 * Update hero display
 */
function updateHeroDisplay() {
    const hero = gameState.hero;

    // Basic info
    document.getElementById('hero-name').textContent = hero.name;
    document.getElementById('hero-level').textContent = hero.level;

    // XP
    document.getElementById('hero-xp').textContent = Math.floor(hero.xp);
    document.getElementById('hero-xp-next').textContent = hero.xpToNextLevel;
    const xpPercent = (hero.xp / hero.xpToNextLevel) * 100;
    document.getElementById('xp-progress-fill').style.width = xpPercent + '%';

    // Stats
    document.getElementById('hero-hp').textContent = Math.floor(hero.hp);
    document.getElementById('hero-max-hp').textContent = hero.maxHp;
    const hpPercent = (hero.hp / hero.maxHp) * 100;
    document.getElementById('hp-bar').style.width = hpPercent + '%';

    document.getElementById('hero-attack').textContent = hero.attack;
    document.getElementById('hero-defense').textContent = hero.defense;
    document.getElementById('hero-crit-chance').textContent = Math.round(hero.critChance * 100) + '%';
    document.getElementById('hero-crit-multi').textContent = hero.critMultiplier.toFixed(1) + 'x';

    // Update stat bars (visual representation)
    updateStatBars();

    // Combat stats
    document.getElementById('monsters-killed').textContent = gameState.stats.totalMonstersKilled;
    document.getElementById('deepest-floor').textContent = gameState.stats.deepestFloor;
    document.getElementById('total-deaths').textContent = gameState.stats.totalDeaths;
    document.getElementById('runs-completed').textContent = gameState.stats.totalRunsCompleted;
}

/**
 * Update visual stat bars (not HP)
 */
function updateStatBars() {
    const hero = gameState.hero;
    
    // Attack bar (max at 100 attack = 100%)
    const attackPercent = Math.min((hero.attack / 100) * 100, 100);
    const attackBar = document.querySelector('.attack-bar');
    if (attackBar) attackBar.style.width = attackPercent + '%';

    // Defense bar (max at 50 defense = 100%)
    const defensePercent = Math.min((hero.defense / 50) * 100, 100);
    const defenseBar = document.querySelector('.defense-bar');
    if (defenseBar) defenseBar.style.width = defensePercent + '%';

    // Crit bar (shows crit chance directly)
    const critPercent = hero.critChance * 100;
    const critBar = document.querySelector('.crit-bar');
    if (critBar) critBar.style.width = critPercent + '%';
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
            ? `+${entry.rewards.gold} Gold, +${entry.rewards.xp} XP${entry.rewards.gems > 0 ? ', +' + entry.rewards.gems + ' Gems' : ''}${entry.rewards.souls > 0 ? ', +' + entry.rewards.souls + ' Souls' : ''}`
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
 * Show notification
 */
export function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const icons = {
        success: '✅',
        warning: '⚠️',
        danger: '❌',
        info: 'ℹ️'
    };

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;

    container.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Calculate success chance (same logic as in auto-run.js)
 */
function calculateSuccessChance() {
    let chance = 0.5;
    chance += gameState.hero.level * 0.02;
    const statBonus = (gameState.hero.attack + gameState.hero.defense) / 1000;
    chance += statBonus;
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