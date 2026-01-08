/**
 * Dungeon Idle Game - Main Entry Point
 * Version: 0.1.0-alpha
 */

import { initUI } from './ui/ui-init.js';
import { gameLoop } from './src/core/game-loop.js';
import { loadGame } from './src/core/game-state.js';

// Initialize game on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log('🏰 Dungeon Idle Game starting...');
    
    // Load saved game state
    loadGame();
    
    // Initialize UI
    initUI();
    
    // Start game loop
    gameLoop();
    
    console.log('✅ Game initialized successfully!');
});