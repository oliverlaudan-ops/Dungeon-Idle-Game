/**
 * Main Game Loop
 * Handles core game updates and timing
 */

import { gameState, saveGame } from './game-state.js';
import { updateUI } from '../../ui/ui-render.js';
import { processAutoRun } from '../idle/auto-run.js';

let lastUpdate = Date.now();
let running = false;

/**
 * Main game loop
 */
export function gameLoop() {
    if (running) return;
    running = true;

    function loop() {
        const now = Date.now();
        const delta = (now - lastUpdate) / 1000; // seconds
        lastUpdate = now;

        // Update game state
        update(delta);

        // Update UI
        updateUI();

        // Continue loop
        requestAnimationFrame(loop);
    }

    loop();
}

/**
 * Update game logic
 */
function update(delta) {
    // Update play time
    gameState.totalPlayTime += delta;

    // Check for auto-runs
    if (gameState.idle.autoRunEnabled) {
        processAutoRun();
    }

    // Update manual run if active
    if (gameState.manualRun.active) {
        // Manual run logic will go here
    }
}