/**
 * Skill Tree UI
 * Handles rendering and interaction with the skill tree system
 */

import { gameState, saveGame } from '../core/game-state.js';
import { 
    SKILL_TREES, 
    SKILLS, 
    getSkillsForTree, 
    canLearnSkill,
    getAvailableSkillPoints,
    resetSkills,
    getRespecCost
} from '../skills/skill-tree.js';
import { applySkillBonuses, getSkillEffectSummary } from '../skills/skill-effects.js';

let currentTree = 'COMBAT';

/**
 * Initialize skill tree UI
 */
export function initSkillTreeUI() {
    console.log('🌳 Initializing Skill Tree UI...');
    
    // Apply existing skills on load
    applySkillBonuses();
    
    // Setup tree tabs
    setupTreeTabs();
    
    // Setup respec button
    setupRespecButton();
    
    // Render initial tree
    renderSkillTree(currentTree);
    
    // Update skill points display
    updateSkillPointsDisplay();
    
    // Update active skills summary
    updateActiveSkillsSummary();
}

/**
 * Setup tree tab switching
 */
function setupTreeTabs() {
    const tabs = document.querySelectorAll('.skill-tree-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const treeId = tab.dataset.tree;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Switch tree
            currentTree = treeId;
            renderSkillTree(treeId);
        });
    });
}

/**
 * Setup respec button
 */
function setupRespecButton() {
    const respecBtn = document.getElementById('respec-btn');
    
    respecBtn.addEventListener('click', () => {
        const cost = getRespecCost(gameState.hero.level);
        
        if (confirm(`Reset all skills for ${cost} gold?`)) {
            const result = resetSkills(gameState);
            
            if (result.success) {
                // Reapply bonuses (now empty)
                applySkillBonuses();
                
                // Update UI
                updateSkillPointsDisplay();
                renderSkillTree(currentTree);
                updateActiveSkillsSummary();
                
                // Show notification
                showNotification(`✅ ${result.message}`, 'success');
                
                saveGame();
            } else {
                showNotification(`❌ ${result.message}`, 'error');
            }
        }
    });
    
    // Update button text with cost
    updateRespecButtonCost();
}

/**
 * Update respec button cost display
 */
function updateRespecButtonCost() {
    const respecBtn = document.getElementById('respec-btn');
    const cost = getRespecCost(gameState.hero.level);
    respecBtn.textContent = `Reset Skills (${cost} 💰)`;
}

/**
 * Render skill tree for a specific tree ID
 */
function renderSkillTree(treeId) {
    const container = document.getElementById('skill-tree-container');
    const tree = SKILL_TREES[treeId];
    const skills = getSkillsForTree(treeId);
    
    if (!tree || !skills) {
        container.innerHTML = '<p class="text-muted">Tree not found</p>';
        return;
    }
    
    // Create tree container
    container.innerHTML = `
        <div class="skill-tree">
            ${skills.map(skill => renderSkillCard(skill)).join('')}
        </div>
    `;
    
    // Add event listeners to skill cards
    skills.forEach(skill => {
        const card = document.getElementById(`skill-${skill.id}`);
        if (card && !card.classList.contains('locked')) {
            card.addEventListener('click', () => handleSkillClick(skill.id));
        }
    });
}

/**
 * Render a single skill card
 */
function renderSkillCard(skill) {
    const currentRank = gameState.skills[skill.id] || 0;
    const canLearn = canLearnSkill(skill.id, gameState.skills);
    const availablePoints = getAvailableSkillPoints(gameState.hero.level, gameState.skills);
    const isMaxed = currentRank >= skill.maxRank;
    
    // Determine card state
    let cardState = 'locked';
    if (currentRank > 0) {
        cardState = 'unlocked';
    } else if (canLearn && availablePoints > 0) {
        cardState = 'unlockable';
    } else if (canLearn) {
        cardState = 'unlockable'; // Can learn but no points
    }
    
    // Get requirement text
    let requirementHTML = '';
    if (skill.requires && currentRank === 0) {
        const requiredSkill = SKILLS[skill.requires];
        const hasRequirement = (gameState.skills[skill.requires] || 0) > 0;
        requirementHTML = `
            <div class="skill-requirement ${hasRequirement ? 'met' : ''}">
                ${hasRequirement ? '✅' : '🔒'} Requires: ${requiredSkill.name}
            </div>
        `;
    }
    
    // Render rank dots
    const rankDotsHTML = `
        <div class="rank-dots">
            ${Array.from({ length: skill.maxRank }, (_, i) => `
                <div class="rank-dot ${i < currentRank ? 'filled' : ''}"></div>
            `).join('')}
        </div>
    `;
    
    // Get tooltip for current or next rank
    const tooltipRank = currentRank > 0 ? currentRank : 1;
    const tooltip = skill.tooltip(tooltipRank);
    
    // Button text
    let buttonText = 'Unlock';
    let buttonDisabled = false;
    
    if (isMaxed) {
        buttonText = 'Max Rank';
        buttonDisabled = true;
    } else if (currentRank > 0) {
        buttonText = `Upgrade (${currentRank}/${skill.maxRank})`;
    }
    
    if (!canLearn && currentRank === 0) {
        buttonDisabled = true;
        buttonText = 'Locked';
    } else if (availablePoints === 0 && !isMaxed) {
        buttonDisabled = true;
        buttonText = 'No Points';
    }
    
    return `
        <div id="skill-${skill.id}" 
             class="skill-card ${cardState}" 
             data-tree="${skill.tree}"
             data-skill="${skill.id}">
            
            <div class="skill-card-header">
                <div class="skill-icon">${skill.icon}</div>
                <div class="skill-info">
                    <h4 class="skill-name">${skill.name}</h4>
                    <div class="skill-rank ${isMaxed ? 'maxed' : ''}">
                        ${isMaxed ? '⭐ MAX RANK' : `Rank ${currentRank}/${skill.maxRank}`}
                    </div>
                </div>
            </div>
            
            <div class="skill-description">
                ${skill.description}
            </div>
            
            ${requirementHTML}
            
            <div class="skill-tooltip">
                ${currentRank > 0 ? '📊 Current: ' : '➡️ Next: '} ${tooltip}
            </div>
            
            <div class="rank-progress">
                ${rankDotsHTML}
            </div>
            
            <button class="skill-level-btn" 
                    ${buttonDisabled ? 'disabled' : ''}
                    data-skill="${skill.id}">
                ${buttonText}
            </button>
        </div>
    `;
}

/**
 * Handle skill card click (learning/upgrading)
 */
function handleSkillClick(skillId) {
    const skill = SKILLS[skillId];
    if (!skill) return;
    
    const currentRank = gameState.skills[skillId] || 0;
    const canLearn = canLearnSkill(skillId, gameState.skills);
    const availablePoints = getAvailableSkillPoints(gameState.hero.level, gameState.skills);
    const isMaxed = currentRank >= skill.maxRank;
    
    // Check if can learn/upgrade
    if (isMaxed) {
        showNotification('⭐ Skill already at max rank!', 'info');
        return;
    }
    
    if (!canLearn) {
        showNotification('🔒 Requirements not met!', 'error');
        return;
    }
    
    if (availablePoints === 0) {
        showNotification('❌ No skill points available!', 'error');
        return;
    }
    
    // Learn/upgrade the skill
    if (!gameState.skills[skillId]) {
        gameState.skills[skillId] = 0;
    }
    gameState.skills[skillId]++;
    
    // Reapply all skill bonuses
    applySkillBonuses();
    
    // Update UI
    updateSkillPointsDisplay();
    renderSkillTree(currentTree);
    updateActiveSkillsSummary();
    updateRespecButtonCost();
    
    // Show notification
    const newRank = gameState.skills[skillId];
    if (newRank === 1) {
        showNotification(`✨ Learned ${skill.name}!`, 'success');
    } else {
        showNotification(`⬆️ ${skill.name} upgraded to rank ${newRank}!`, 'success');
    }
    
    // Save game
    saveGame();
}

/**
 * Update skill points display
 */
function updateSkillPointsDisplay() {
    const pointsElement = document.getElementById('available-points');
    const availablePoints = getAvailableSkillPoints(gameState.hero.level, gameState.skills);
    
    if (pointsElement) {
        pointsElement.textContent = availablePoints;
        
        // Add visual feedback if points available
        if (availablePoints > 0) {
            pointsElement.style.animation = 'pulse 2s infinite';
        } else {
            pointsElement.style.animation = 'none';
        }
    }
}

/**
 * Update active skills summary
 */
function updateActiveSkillsSummary() {
    const container = document.getElementById('active-skills-list');
    const summary = getSkillEffectSummary();
    
    if (!container) return;
    
    if (summary.length === 0) {
        container.innerHTML = '<p class="text-muted">No skills learned yet...</p>';
        return;
    }
    
    // Group by tree type
    const combat = summary.filter(s => s.includes('⚔️') || s.includes('🩸') || s.includes('💀') || s.includes('🔥') || s.includes('🧛'));
    const defense = summary.filter(s => s.includes('💃') || s.includes('🛡️') || s.includes('🌵') || s.includes('🌬️') || s.includes('🪨'));
    const utility = summary.filter(s => s.includes('💰') || s.includes('✨') || s.includes('🎓') || s.includes('💨') || s.includes('🍀'));
    
    container.innerHTML = `
        ${combat.length > 0 ? combat.map(effect => `
            <div class="active-skill-effect combat">${effect}</div>
        `).join('') : ''}
        ${defense.length > 0 ? defense.map(effect => `
            <div class="active-skill-effect defense">${effect}</div>
        `).join('') : ''}
        ${utility.length > 0 ? utility.map(effect => `
            <div class="active-skill-effect utility">${effect}</div>
        `).join('') : ''}
    `;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Reuse existing notification system if available
    const container = document.getElementById('notification-container') || document.body;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Refresh skill tree UI (call this when leveling up)
 */
export function refreshSkillTreeUI() {
    updateSkillPointsDisplay();
    updateActiveSkillsSummary();
    updateRespecButtonCost();
    
    // Re-render current tree if on skills tab
    const skillsTab = document.getElementById('skills-tab');
    if (skillsTab && skillsTab.classList.contains('active')) {
        renderSkillTree(currentTree);
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(style);
