/**
 * Input Handler
 * Handles keyboard input for manual dungeon runs
 */

import { movePlayer } from './manual-run-manager.js';
import { gameState } from '../core/game-state.js';

let keysPressed = {};
let lastMoveTime = 0;
const MOVE_COOLDOWN = 150; // milliseconds between moves

/**
 * Initialize input handlers
 */
export function initInputHandler() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    console.log('⌨️ Input handler initialized');
}

/**
 * Remove input handlers
 */
export function removeInputHandler() {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    keysPressed = {};
}

/**
 * Handle key down event
 */
function handleKeyDown(event) {
    // Only handle input if manual run is active
    if (!gameState.manualRun.active) return;

    keysPressed[event.key] = true;

    // Prevent default for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
    }

    // Handle movement with cooldown
    const now = Date.now();
    if (now - lastMoveTime < MOVE_COOLDOWN) return;

    let moved = false;

    // Arrow keys
    if (event.key === 'ArrowUp') {
        moved = movePlayer(0, -1);
    } else if (event.key === 'ArrowDown') {
        moved = movePlayer(0, 1);
    } else if (event.key === 'ArrowLeft') {
        moved = movePlayer(-1, 0);
    } else if (event.key === 'ArrowRight') {
        moved = movePlayer(1, 0);
    }
    // WASD
    else if (event.key === 'w' || event.key === 'W') {
        moved = movePlayer(0, -1);
    } else if (event.key === 's' || event.key === 'S') {
        moved = movePlayer(0, 1);
    } else if (event.key === 'a' || event.key === 'A') {
        moved = movePlayer(-1, 0);
    } else if (event.key === 'd' || event.key === 'D') {
        moved = movePlayer(1, 0);
    }

    if (moved) {
        lastMoveTime = now;
    }
}

/**
 * Handle key up event
 */
function handleKeyUp(event) {
    delete keysPressed[event.key];
}

/**
 * Check if a key is currently pressed
 */
export function isKeyPressed(key) {
    return keysPressed[key] === true;
}