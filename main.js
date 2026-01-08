/**
 * Main Game Entry Point
 * Initializes and runs the game loop
 */

import { gameState, loadGame, saveGame } from './src/core/game-state.js';
import { initUI } from './ui/ui-init.js';
import { updateUI } from './ui/ui-render.js';
import { processAutoRun } from './src/idle/auto-run.js';
import { checkAchievements } from './src/achievements/achievement-manager.js';
import { showAchievementNotification } from './ui/achievements-ui.js';

// Load game on start
loadGame();

// Initialize UI
initUI();

// Track play time
let lastPlayTimeUpdate = Date.now();
let lastAchievementCheck = Date.now();

// Main game loop
function gameLoop() {
    const now = Date.now();
    
    // Update play time (track seconds)
    const deltaTime = (now - lastPlayTimeUpdate) / 1000;
    gameState.totalPlayTime += deltaTime;
    lastPlayTimeUpdate = now;

    // Process auto-runs if enabled
    if (gameState.idle.autoRunEnabled) {
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

    // Update UI
    updateUI();

    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();

console.log('🎮 Dungeon Idle Game started!');
console.log('💾 Game State:', gameState);