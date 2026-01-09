/**
 * Manual Run Manager v2.0
 * Manages the state and logic for manual dungeon runs
 * NOW WITH: Toast notifications instead of alerts
 */

import { gameState } from '../core/game-state.js';
import { generateDungeon } from '../dungeons/dungeon-generator.js';
import { renderDungeon, renderCenterMessage } from './canvas-renderer.js';
import { showCombatUI, hideCombatUI, updateCombatUI } from './combat-ui.js';
import { updateManualRunUI } from '../../ui/manual-run-ui.js';
import { showVictoryNotification, showDefeatNotification } from '../../ui/notifications.js';

// Player state for manual run
const playerState = {
    x: 0,
    y: 0,
    currentRoom: 0,
    inCombat: false,
    canMove: true
};

let currentDungeon = null;
let animationFrameId = null;
let currentCombatMonster = null;

/**
 * Start a manual dungeon run
 */
export function startManualRun(floor = 1) {
    console.log('🎮 Starting manual run on floor', floor);

    // Generate dungeon
    currentDungeon = generateDungeon(floor);
    
    // Reset player state
    const startRoom = currentDungeon.rooms[0];
    playerState.x = startRoom.x + Math.floor(startRoom.width / 2);
    playerState.y = startRoom.y + Math.floor(startRoom.height / 2);
    playerState.currentRoom = 0;
    playerState.inCombat = false;
    playerState.canMove = true;

    // Mark as active in game state
    gameState.manualRun.active = true;
    gameState.manualRun.currentFloor = floor;
    gameState.manualRun.currentRoom = 0;
    gameState.manualRun.dungeon = currentDungeon;

    console.log('✅ Manual run started:', currentDungeon);
    console.log(`🎰 Dungeon has ${currentDungeon.rooms.length} rooms`);

    // Start render loop
    startRenderLoop();

    // Show start message
    setTimeout(() => {
        renderCenterMessage('Floor ' + floor, 'Use Arrow Keys or WASD to move');
    }, 100);
}

/**
 * End the current manual run
 */
export function endManualRun(success = true) {
    console.log(success ? '✅ Run completed!' : '❌ Run failed!');

    // Stop render loop
    stopRenderLoop();

    // Hide combat UI if open
    hideCombatUI();

    // Award rewards if successful
    if (success) {
        const goldReward = 50 * gameState.manualRun.currentFloor;
        const xpReward = 30 * gameState.manualRun.currentFloor;
        
        gameState.resources.gold += goldReward;
        gameState.hero.xp += xpReward;
        gameState.stats.totalRunsCompleted++;
        
        console.log(`🎉 Rewards: +${goldReward} Gold, +${xpReward} XP`);
        
        // Show victory toast notification
        showVictoryNotification(goldReward, xpReward, gameState.manualRun.currentFloor);
    } else {
        // Show defeat toast notification
        showDefeatNotification(gameState.manualRun.currentFloor);
    }

    // Reset game state
    gameState.manualRun.active = false;
    gameState.manualRun.currentFloor = 0;
    gameState.manualRun.currentRoom = 0;
    gameState.manualRun.dungeon = null;

    currentDungeon = null;
    currentCombatMonster = null;

    // Update button state
    updateManualRunUI();

    // Show canvas message (can be dismissed by starting new run)
    if (success) {
        renderCenterMessage('Victory! 🎉', 'Click START RUN to play again');
    } else {
        renderCenterMessage('Defeated 💀', 'Click START RUN to try again');
    }
}

/**
 * Handle player movement
 */
export function movePlayer(dx, dy) {
    if (!playerState.canMove || !currentDungeon || playerState.inCombat) return false;

    const newX = playerState.x + dx;
    const newY = playerState.y + dy;
    const currentRoom = currentDungeon.rooms[playerState.currentRoom];

    // Check for doors FIRST (before room boundary check)
    if (currentRoom.doors) {
        const door = currentRoom.doors.find(d => d.x === newX && d.y === newY);
        if (door) {
            if (currentRoom.cleared) {
                console.log('🚪 Door found! Transitioning to room', door.targetRoom + 1);
                transitionToRoom(door.targetRoom);
                return true;
            } else {
                console.log('🚪 Door is locked - clear the room first!');
                renderCenterMessage('🚪 Locked', 'Clear all monsters first!');
                setTimeout(() => {
                    // Clear message after 2 seconds
                }, 2000);
                return false;
            }
        }
    }

    // Check if position is valid (within current room)
    if (!isPositionInRoom(newX, newY, currentRoom)) {
        return false;
    }

    // Check for collisions with monsters
    if (currentRoom.monsters && !currentRoom.cleared) {
        const monster = currentRoom.monsters.find(m => m.x === newX && m.y === newY && m.hp > 0);
        if (monster) {
            // Start combat
            startCombat(monster);
            return false;
        }
    }

    // Update player position
    playerState.x = newX;
    playerState.y = newY;

    return true;
}

/**
 * Check if position is within a room
 */
function isPositionInRoom(x, y, room) {
    return x >= room.x && x < room.x + room.width &&
           y >= room.y && y < room.y + room.height;
}

/**
 * Start combat with a monster
 */
function startCombat(monster) {
    console.log('⚔️ Combat started with', monster.name);
    
    playerState.inCombat = true;
    playerState.canMove = false;
    currentCombatMonster = monster;

    // Stop render loop during combat
    stopRenderLoop();

    // Store max HP if not already set
    if (!monster.maxHp) {
        monster.maxHp = monster.hp;
    }

    // Show combat UI
    showCombatUI(monster);
}

/**
 * End combat (called when monster is defeated or player wins)
 */
export function endCombat(victory = true) {
    console.log(victory ? '✅ Combat won!' : '❌ Combat lost!');

    if (victory && currentCombatMonster) {
        // Mark monster as defeated
        currentCombatMonster.hp = 0;
        
        // Check if room is cleared
        const currentRoom = currentDungeon.rooms[playerState.currentRoom];
        if (currentRoom.monsters && currentRoom.monsters.every(m => m.hp <= 0)) {
            currentRoom.cleared = true;
            console.log('✅ Room cleared!');
            
            // Check if this was the final room
            const isLastRoom = playerState.currentRoom === currentDungeon.rooms.length - 1;
            
            if (isLastRoom) {
                // Final room cleared - Victory!
                console.log('🎆 Final room cleared! Victory!');
                setTimeout(() => {
                    endManualRun(true);
                }, 1500);
                return; // Don't restart render loop, run is ending
            } else {
                // Show cleared message briefly
                setTimeout(() => {
                    renderCenterMessage('✅ Room Cleared!', 'Find the door to continue');
                    setTimeout(() => {
                        // Message will be cleared when render loop restarts
                    }, 2000);
                }, 100);
            }
        }
    }

    if (!victory) {
        // Player defeated - end run
        endManualRun(false);
        return;
    }

    // Hide combat UI
    hideCombatUI();

    // Reset combat state
    playerState.inCombat = false;
    playerState.canMove = true;
    currentCombatMonster = null;

    // Restart render loop
    startRenderLoop();
}

/**
 * Transition to another room
 */
function transitionToRoom(roomIndex) {
    if (roomIndex >= currentDungeon.rooms.length) {
        // Completed all rooms!
        endManualRun(true);
        return;
    }

    console.log('🚪 Moving to room', roomIndex + 1);
    playerState.currentRoom = roomIndex;
    gameState.manualRun.currentRoom = roomIndex;

    // Place player at room entrance
    const newRoom = currentDungeon.rooms[roomIndex];
    playerState.x = newRoom.x + Math.floor(newRoom.width / 2);
    playerState.y = newRoom.y + Math.floor(newRoom.height / 2);

    // Show room message briefly
    setTimeout(() => {
        renderCenterMessage(`Room ${roomIndex + 1}/${currentDungeon.rooms.length}`, 'Clear all monsters!');
        setTimeout(() => {
            // Message will be cleared when render loop continues
        }, 2000);
    }, 100);
}

/**
 * Start render loop
 */
function startRenderLoop() {
    // Stop any existing loop first
    stopRenderLoop();

    function render() {
        if (currentDungeon && gameState.manualRun.active && !playerState.inCombat) {
            renderDungeon(currentDungeon, playerState);
            animationFrameId = requestAnimationFrame(render);
        }
    }
    render();
    console.log('🎨 Render loop started');
}

/**
 * Stop render loop
 */
function stopRenderLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        console.log('🛑 Render loop stopped');
    }
}

/**
 * Get current player state
 */
export function getPlayerState() {
    return playerState;
}

/**
 * Get current dungeon
 */
export function getCurrentDungeon() {
    return currentDungeon;
}

/**
 * Get current combat monster
 */
export function getCurrentCombatMonster() {
    return currentCombatMonster;
}
