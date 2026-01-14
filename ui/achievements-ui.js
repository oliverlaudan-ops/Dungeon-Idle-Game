/**
 * Achievements UI
 * Handles rendering and display of achievements
 */

import { gameState } from '../src/core/game-state.js';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, getAchievementsByCategory } from '../src/achievements/achievement-definitions.js';
import { getAchievementProgress, getCompletionPercentage } from '../src/achievements/achievement-manager.js';

/**
 * Render all achievements
 */
export function renderAchievements() {
    renderAchievementHeader();
    renderAchievementsByCategory();
}

/**
 * Render achievement header with stats
 */
function renderAchievementHeader() {
    const headerEl = document.getElementById('achievement-header');
    if (!headerEl) return;

    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    const unlockedCount = Object.keys(gameState.achievements.unlocked).length;
    const percentage = getCompletionPercentage();

    headerEl.innerHTML = `
        <div class="achievement-stats">
            <div class="achievement-stat-card">
                <span class="achievement-stat-icon">🏆</span>
                <div class="achievement-stat-info">
                    <span class="achievement-stat-label">Unlocked</span>
                    <span class="achievement-stat-value">${unlockedCount} / ${totalAchievements}</span>
                </div>
            </div>
            <div class="achievement-stat-card">
                <span class="achievement-stat-icon">📊</span>
                <div class="achievement-stat-info">
                    <span class="achievement-stat-label">Progress</span>
                    <span class="achievement-stat-value">${percentage}%</span>
                </div>
            </div>
        </div>
        <div class="achievement-progress-bar">
            <div class="achievement-progress-fill" style="width: ${percentage}%"></div>
        </div>
    `;
}

/**
 * Render achievements by category
 */
function renderAchievementsByCategory() {
    const categories = [
        { key: ACHIEVEMENT_CATEGORIES.PROGRESS, name: 'Progress', icon: '📈' },
        { key: ACHIEVEMENT_CATEGORIES.COMBAT, name: 'Combat', icon: '⚔️' },
        { key: ACHIEVEMENT_CATEGORIES.WEALTH, name: 'Wealth', icon: '💰' },
        { key: ACHIEVEMENT_CATEGORIES.MASTERY, name: 'Mastery', icon: '✨' },
        { key: ACHIEVEMENT_CATEGORIES.PRESTIGE, name: 'Prestige', icon: '🔑' },
        { key: ACHIEVEMENT_CATEGORIES.SKILLS, name: 'Skills', icon: '🌳' },
        { key: ACHIEVEMENT_CATEGORIES.EQUIPMENT, name: 'Equipment', icon: '🎁' },
        { key: ACHIEVEMENT_CATEGORIES.MANUAL_RUN, name: 'Manual Runs', icon: '🎮' }
    ];

    categories.forEach(cat => {
        const containerEl = document.getElementById(`achievements-${cat.key}`);
        if (!containerEl) {
            console.warn(`Achievement container not found: achievements-${cat.key}`);
            return;
        }

        const achievements = getAchievementsByCategory(cat.key);
        
        if (achievements.length === 0) {
            containerEl.innerHTML = '<p class="text-muted">No achievements in this category yet.</p>';
            return;
        }
        
        containerEl.innerHTML = achievements.map(achievement => 
            createAchievementCard(achievement)
        ).join('');
    });
}

/**
 * Create a single achievement card HTML
 */
function createAchievementCard(achievement) {
    const isUnlocked = gameState.achievements.unlocked[achievement.id] !== undefined;
    const progress = getAchievementProgress(achievement.id);
    const progressPercent = Math.round(progress * 100);

    const rewardText = [];
    if (achievement.reward.gold) rewardText.push(`💰 ${achievement.reward.gold}`);
    if (achievement.reward.gems) rewardText.push(`💎 ${achievement.reward.gems}`);
    if (achievement.reward.souls) rewardText.push(`👻 ${achievement.reward.souls}`);

    return `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon ${isUnlocked ? '' : 'grayscale'}">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">
                    <span class="achievement-name">${achievement.name}</span>
                    ${isUnlocked ? '<span class="achievement-check">✅</span>' : ''}
                </div>
                <p class="achievement-description">${achievement.description}</p>
                <div class="achievement-reward">
                    <span class="achievement-reward-label">Reward:</span>
                    <span class="achievement-reward-value">${rewardText.join(' ')}</span>
                </div>
                ${!isUnlocked ? `
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar-small">
                            <div class="achievement-progress-fill-small" style="width: ${progressPercent}%"></div>
                        </div>
                        <span class="achievement-progress-text">${progressPercent}%</span>
                    </div>
                ` : ''}
                ${isUnlocked ? `
                    <div class="achievement-unlocked-date">
                        Unlocked: ${formatDate(gameState.achievements.unlocked[achievement.id])}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Show achievement notification
 */
export function showAchievementNotification(achievement) {
    const notificationEl = document.createElement('div');
    notificationEl.className = 'achievement-notification';
    notificationEl.innerHTML = `
        <div class="achievement-notification-content">
            <div class="achievement-notification-icon">${achievement.icon}</div>
            <div class="achievement-notification-text">
                <div class="achievement-notification-title">🏆 Achievement Unlocked!</div>
                <div class="achievement-notification-name">${achievement.name}</div>
            </div>
        </div>
    `;

    document.body.appendChild(notificationEl);

    // Animate in
    setTimeout(() => {
        notificationEl.classList.add('show');
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notificationEl.classList.remove('show');
        setTimeout(() => {
            notificationEl.remove();
        }, 300);
    }, 5000);
}

/**
 * Format date for display
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
