/**
 * Difficulty UI
 * Handles difficulty selection and display
 */

import { gameState } from '../src/core/game-state.js';

const DIFFICULTY_INFO = {
    easy: {
        label: '😊 Easy',
        color: '#2ecc71',
        description: '5-8 rooms, 0.6x monster strength, 1.0x rewards',
        recommendation: 'Perfect for beginners'
    },
    normal: {
        label: '😀 Normal',
        color: '#3498db',
        description: '7-10 rooms, 1.0x monster strength, 1.5x rewards',
        recommendation: 'Recommended for most players'
    },
    hard: {
        label: '😬 Hard',
        color: '#f39c12',
        description: '10-13 rooms, 1.4x monster strength, 2.5x rewards',
        recommendation: 'For experienced players'
    },
    expert: {
        label: '🔥 Expert',
        color: '#e74c3c',
        description: '12-15 rooms, 1.8x monster strength, 4.0x rewards',
        recommendation: 'Only for hardcore players!'
    }
};

/**
 * Initialize difficulty UI
 */
export function initDifficultyUI() {
    const container = document.getElementById('difficulty-selector');
    if (!container) {
        console.warn('⚠️ Difficulty selector container not found');
        return;
    }

    // Create difficulty buttons
    Object.entries(DIFFICULTY_INFO).forEach(([key, info]) => {
        const button = document.createElement('button');
        button.className = `difficulty-btn ${key === gameState.settings.difficulty ? 'active' : ''}`;
        button.id = `difficulty-${key}`;
        button.innerHTML = `
            <div class="difficulty-label">${info.label}</div>
            <div class="difficulty-desc">${info.description}</div>
            <div class="difficulty-rec">${info.recommendation}</div>
        `;
        button.style.borderColor = info.color;
        
        button.addEventListener('click', () => setDifficulty(key));
        container.appendChild(button);
    });
}

/**
 * Set game difficulty
 */
export function setDifficulty(difficulty) {
    if (!Object.keys(DIFFICULTY_INFO).includes(difficulty)) {
        console.warn(`❌ Invalid difficulty: ${difficulty}`);
        return;
    }

    gameState.settings.difficulty = difficulty;
    updateDifficultyUI();
    
    const info = DIFFICULTY_INFO[difficulty];
    console.log(`✅ Difficulty set to ${info.label}`);
}

/**
 * Update difficulty UI display
 */
function updateDifficultyUI() {
    Object.keys(DIFFICULTY_INFO).forEach(key => {
        const btn = document.getElementById(`difficulty-${key}`);
        if (btn) {
            if (key === gameState.settings.difficulty) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
}

/**
 * Get current difficulty info
 */
export function getDifficultyInfo(difficulty = null) {
    const diff = difficulty || gameState.settings.difficulty || 'normal';
    return DIFFICULTY_INFO[diff] || DIFFICULTY_INFO.normal;
}

/**
 * Display difficulty info tooltip
 */
export function showDifficultyTooltip(difficulty) {
    const info = DIFFICULTY_INFO[difficulty];
    if (!info) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'difficulty-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-title">${info.label}</div>
        <div class="tooltip-desc">${info.description}</div>
        <div class="tooltip-rec">${info.recommendation}</div>
    `;
    tooltip.style.borderLeftColor = info.color;

    return tooltip;
}
