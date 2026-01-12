/**
 * Main Game Entry Point
 * Initializes and runs the game loop
 */

import { gameState, loadGame, saveGame } from './src/core/game-state.js';
import { initUI } from './ui/ui-init.js';
import { updateUI } from './ui/ui-render.js';
import { updateManualRunUIState } from './ui/ui-init.js';
import { processAutoRun } from './src/idle/auto-run.js';
import { checkAchievements } from './src/achievements/achievement-manager.js';
import { showAchievementNotification } from './ui/achievements-ui.js';
import { initializeInventoryUI } from './ui/inventory-ui.js';
import { initSkillTreeUI, refreshSkillTreeUI } from './src/ui/skill-tree-ui.js';
import { applySkillBonuses } from './src/skills/skill-effects.js';
import { getPrestigeBonuses } from './src/prestige/prestige-system.js';

// Load game on start
loadGame();

// Apply skill bonuses from loaded save
applySkillBonuses();

// Apply prestige bonuses to hero stats (Sprint 3)
applyPrestigeBonuses();

// Initialize UI
initUI();

// Initialize Inventory UI
initializeInventoryUI();

// Initialize Skill Tree UI
initSkillTreeUI();

// Track play time
let lastPlayTimeUpdate = Date.now();
let lastAchievementCheck = Date.now();
let previousLevel = gameState.hero.level;

/**
 * Apply prestige bonuses to hero stats
 */
function applyPrestigeBonuses() {
    const bonuses = getPrestigeBonuses();
    
    if (Object.keys(bonuses).length === 0) {
        console.log('🔑 No prestige bonuses yet');
        return;
    }
    
    // Apply stat bonuses
    if (bonuses.maxHpBonus) {
        gameState.hero.maxHp += bonuses.maxHpBonus;
        gameState.hero.hp = gameState.hero.maxHp; // Full heal on load
    }
    if (bonuses.attackBonus) {
        gameState.hero.attack += bonuses.attackBonus;
    }
    if (bonuses.defenseBonus) {
        gameState.hero.defense += bonuses.defenseBonus;
    }
    if (bonuses.critChanceBonus) {
        gameState.hero.critChance += bonuses.critChanceBonus;
    }
    
    console.log('✨ Prestige bonuses applied:', bonuses);
}

// Main game loop
function gameLoop() {
    const now = Date.now();
    
    // Update play time (track seconds)
    const deltaTime = (now - lastPlayTimeUpdate) / 1000;
    gameState.totalPlayTime += deltaTime;
    lastPlayTimeUpdate = now;

    // Process auto-runs if enabled (only if not in manual run)
    if (gameState.idle.autoRunEnabled && !gameState.manualRun.active) {
        processAutoRun();
    }

    // Check achievements every 2 seconds
    if (now - lastAchievementCheck > 2000) {
        const newAchievements = checkAchievements();
        
        // Show notifications for new achievements
        newAchievements.forEach(achievement => {
            showAchievementNotification(achievement);
        });
        
        lastAchievementCheck = now;
    }

    // Check for level up to refresh skill tree
    if (gameState.hero.level > previousLevel) {
        console.log(`🌳 Level up detected! Refreshing skill tree UI...`);
        refreshSkillTreeUI();
        previousLevel = gameState.hero.level;
    }

    // Update manual run UI if active
    if (gameState.manualRun.active) {
        updateManualRunUIState();
    }

    // Update UI
    updateUI();

    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();

console.log('🎮 Dungeon Idle Game v2.5.0 started!');
console.log('💾 Game State:', gameState);
console.log('✅ Manual Run System: Ready');
console.log('🎒 Equipment System: Ready');
console.log('🌳 Skill Tree System: Ready');
console.log('⭐ Prestige System: Ready (Keys as currency)');
console.log('⚖️ Monster Difficulty: Rebalanced for endgame');
console.log('🎮 Use Arrow Keys or WASD to move in manual runs');
