/**
 * UI Rendering
 * Handles updating the UI with current game state
 */

import { gameState } from '../src/core/game-state.js';
import { getEffectiveStats } from '../src/upgrades/upgrade-manager.js';

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
    updateUpgradeResources();
}

/**
 * Update resource displays (Idle tab)
 */
function updateResources() {
    const goldEl = document.getElementById('gold-value');
    const gemsEl = document.getElementById('gems-value');
    const soulsEl = document.getElementById('souls-value');
    const keysEl = document.getElementById('keys-value');

    if (goldEl) goldEl.textContent = formatNumber(gameState.resources.gold);
    if (gemsEl) gemsEl.textContent = formatNumber(gameState.resources.gems);
    if (soulsEl) soulsEl.textContent = formatNumber(gameState.resources.souls);
    if (keysEl) keysEl.textContent = gameState.resources.dungeonKeys;
}

/**
 * Update resource displays (Upgrades tab)
 */
function updateUpgradeResources() {
    const goldEl = document.getElementById('upgrade-gold');
    const gemsEl = document.getElementById('upgrade-gems');
    const soulsEl = document.getElementById('upgrade-souls');
    const keysEl = document.getElementById('upgrade-keys');

    if (goldEl) goldEl.textContent = formatNumber(gameState.resources.gold);
    if (gemsEl) gemsEl.textContent = formatNumber(gameState.resources.gems);
    if (soulsEl) soulsEl.textContent = formatNumber(gameState.resources.souls);
    if (keysEl) keysEl.textContent = gameState.resources.dungeonKeys;
}

/**
 * Update auto-run information
 */
function updateAutoRunInfo() {
    const statusEl = document.getElementById('auto-run-status');
    const timerEl = document.getElementById('next-run-timer');
    const successRateEl = document.getElementById('success-rate');
    const intervalEl = document.getElementById('auto-run-interval');

    if (!statusEl || !timerEl || !successRateEl || !intervalEl) return;

    // Status
    if (gameState.idle.autoRunEnabled) {
        statusEl.textContent = 'Active';
        statusEl.className = 'status-active';

        // Timer
        const now = Date.now();
        const timeSinceLastRun = (now - gameState.idle.lastAutoRun) / 1000;
        const timeUntilNext = Math.max(0, gameState.idle.autoRunInterval - timeSinceLastRun);
        timerEl.textContent = formatTime(timeUntilNext);
    } else {
        statusEl.textContent = 'Inactive';
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

    const totalEl = document.getElementById('total-runs');
    const successEl = document.getElementById('successful-runs');
    const failedEl = document.getElementById('failed-runs');
    const ratioEl = document.getElementById('success-ratio');

    if (totalEl) totalEl.textContent = totalRuns;
    if (successEl) successEl.textContent = successfulRuns;
    if (failedEl) failedEl.textContent = failedRuns;
    if (ratioEl) ratioEl.textContent = Math.round(successRatio) + '%';
}

/**
 * Update hero display
 */
function updateHeroDisplay() {
    const hero = gameState.hero;
    const effectiveStats = getEffectiveStats();

    // Basic info
    const nameEl = document.getElementById('hero-name');
    const levelEl = document.getElementById('hero-level');
    if (nameEl) nameEl.textContent = hero.name;
    if (levelEl) levelEl.textContent = hero.level;

    // XP Bar
    const xpTextEl = document.getElementById('xp-text');
    const xpBarEl = document.getElementById('xp-bar');
    const xpNeededEl = document.getElementById('xp-needed');
    
    if (xpTextEl) {
        xpTextEl.textContent = `${Math.floor(hero.xp)} / ${hero.xpToNextLevel}`;
    }
    if (xpBarEl) {
        const xpPercent = (hero.xp / hero.xpToNextLevel) * 100;
        xpBarEl.style.width = `${Math.min(100, xpPercent)}%`;
    }
    if (xpNeededEl) {
        const xpLeft = hero.xpToNextLevel - Math.floor(hero.xp);
        xpNeededEl.textContent = `${xpLeft} XP`;
    }

    // Stats (show effective stats with upgrade bonuses)
    const hpEl = document.getElementById('hero-hp');
    const attackEl = document.getElementById('hero-attack');
    const defenseEl = document.getElementById('hero-defense');
    const critEl = document.getElementById('hero-crit');
    const critMultEl = document.getElementById('hero-crit-mult');

    if (hpEl) hpEl.textContent = `${hero.hp} / ${effectiveStats.maxHp}`;
    if (attackEl) attackEl.textContent = effectiveStats.attack;
    if (defenseEl) defenseEl.textContent = effectiveStats.defense;
    if (critEl) critEl.textContent = `${Math.round(effectiveStats.critChance * 100)}%`;
    if (critMultEl) critMultEl.textContent = `${effectiveStats.critMultiplier.toFixed(1)}x`;
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
    if (!historyEl) return;
    
    if (runHistory.length === 0) {
        historyEl.innerHTML = '<p class="text-muted">No runs completed yet...</p>';
        return;
    }

    historyEl.innerHTML = runHistory.map(entry => {
        const icon = entry.success ? '✅' : '❌';
        const cssClass = entry.success ? 'success' : 'failure';
        const result = entry.success ? 'Successful' : 'Failed';
        
        let rewardsText = 'No rewards';
        if (entry.success && entry.rewards) {
            const parts = [];
            parts.push(`+${entry.rewards.gold} Gold`);
            parts.push(`+${entry.rewards.xp} XP`);
            if (entry.rewards.gems > 0) parts.push(`+${entry.rewards.gems} Gems`);
            if (entry.rewards.souls > 0) parts.push(`+${entry.rewards.souls} Souls`);
            if (entry.rewards.keys > 0) parts.push(`🔑 +${entry.rewards.keys} Keys`);
            
            // NEW: Equipment drops
            if (entry.rewards.equipment) {
                const eq = entry.rewards.equipment;
                const setInfo = eq.setName ? ` (${eq.setIcon} ${eq.setName})` : '';
                parts.push(`🎁 ${eq.icon} ${eq.name}${setInfo}`);
            }
            
            rewardsText = parts.join(', ');
        }
        
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
    const effectiveStats = getEffectiveStats();
    let chance = 0.5;
    chance += gameState.hero.level * 0.02;
    const statBonus = (effectiveStats.attack + effectiveStats.defense) / 1000;
    chance += statBonus;
    chance += effectiveStats.successBonus;
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
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}
