/**
 * Canvas Renderer v2.0
 * Handles all visual rendering of the dungeon on canvas
 * NOW WITH: Combat effects (damage numbers, screen shake, hit flashes)
 */

import { 
    updateEffects, 
    renderEffects, 
    getScreenShakeOffset 
} from './combat-effects.js';

// Canvas settings
const TILE_SIZE = 40; // Size of each tile in pixels
const COLORS = {
    floor: '#2c3e50',
    wall: '#1a1a2e',
    door: '#f39c12',
    doorOpen: '#2ecc71',
    player: '#3498db',
    monster: '#e74c3c',
    treasure: '#f1c40f',
    fog: 'rgba(0, 0, 0, 0.8)',
    explored: 'rgba(0, 0, 0, 0.3)',
    grid: 'rgba(255, 255, 255, 0.1)'
};

let canvas = null;
let ctx = null;
let lastFrameTime = Date.now();

/**
 * Initialize the canvas renderer
 */
export function initCanvas() {
    canvas = document.getElementById('dungeon-canvas');
    if (!canvas) {
        console.error('❌ Canvas element not found!');
        return false;
    }

    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    console.log('✅ Canvas initialized:', canvas.width, 'x', canvas.height);
    return true;
}

/**
 * Clear the entire canvas
 */
export function clearCanvas() {
    if (!ctx) return;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Render the entire dungeon
 */
export function renderDungeon(dungeon, playerState) {
    if (!ctx || !dungeon) return;

    // Calculate delta time for animations
    const now = Date.now();
    const deltaTime = now - lastFrameTime;
    lastFrameTime = now;

    // Update effects (damage numbers, screen shake, etc.)
    updateEffects(deltaTime);

    clearCanvas();

    // Get screen shake offset
    const shakeOffset = getScreenShakeOffset();

    // Calculate camera offset to center on player (with shake)
    const cameraX = Math.floor(canvas.width / 2 - playerState.x * TILE_SIZE) + shakeOffset.x;
    const cameraY = Math.floor(canvas.height / 2 - playerState.y * TILE_SIZE) + shakeOffset.y;

    // Apply screen shake to context
    ctx.save();
    ctx.translate(shakeOffset.x, shakeOffset.y);

    // Render current room
    const currentRoom = dungeon.rooms[playerState.currentRoom];
    if (currentRoom) {
        renderRoom(currentRoom, cameraX - shakeOffset.x, cameraY - shakeOffset.y, playerState);
    }

    // Render player
    renderPlayer(playerState, cameraX - shakeOffset.x, cameraY - shakeOffset.y);

    ctx.restore();

    // Render effects (damage numbers, hit flashes) - no shake
    renderEffects(ctx);

    // Render UI overlay (no shake)
    renderUIOverlay(dungeon, playerState);
}

/**
 * Render a single room
 */
function renderRoom(room, offsetX, offsetY, playerState) {
    const startX = room.x;
    const startY = room.y;
    const width = room.width;
    const height = room.height;

    // Draw floor
    ctx.fillStyle = COLORS.floor;
    ctx.fillRect(
        offsetX + startX * TILE_SIZE,
        offsetY + startY * TILE_SIZE,
        width * TILE_SIZE,
        height * TILE_SIZE
    );

    // Draw grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + (startX + x) * TILE_SIZE, offsetY + startY * TILE_SIZE);
        ctx.lineTo(offsetX + (startX + x) * TILE_SIZE, offsetY + (startY + height) * TILE_SIZE);
        ctx.stroke();
    }
    for (let y = 0; y <= height; y++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + startX * TILE_SIZE, offsetY + (startY + y) * TILE_SIZE);
        ctx.lineTo(offsetX + (startX + width) * TILE_SIZE, offsetY + (startY + y) * TILE_SIZE);
        ctx.stroke();
    }

    // Draw walls
    ctx.fillStyle = COLORS.wall;
    ctx.lineWidth = 3;
    
    // Top wall
    ctx.fillRect(
        offsetX + startX * TILE_SIZE,
        offsetY + startY * TILE_SIZE - 3,
        width * TILE_SIZE,
        3
    );
    
    // Bottom wall
    ctx.fillRect(
        offsetX + startX * TILE_SIZE,
        offsetY + (startY + height) * TILE_SIZE,
        width * TILE_SIZE,
        3
    );
    
    // Left wall
    ctx.fillRect(
        offsetX + startX * TILE_SIZE - 3,
        offsetY + startY * TILE_SIZE,
        3,
        height * TILE_SIZE
    );
    
    // Right wall
    ctx.fillRect(
        offsetX + (startX + width) * TILE_SIZE,
        offsetY + startY * TILE_SIZE,
        3,
        height * TILE_SIZE
    );

    // Draw doors (check if room is cleared to determine if door is open)
    if (room.doors) {
        room.doors.forEach(door => {
            renderDoor(door, offsetX, offsetY, room.cleared);
        });
    }

    // Draw monsters
    if (room.monsters && !room.cleared) {
        room.monsters.forEach(monster => {
            if (monster.hp > 0) {
                renderMonster(monster, offsetX, offsetY);
            }
        });
    }

    // Draw treasure
    if (room.treasure && !room.looted) {
        renderTreasure(room.treasure, offsetX, offsetY);
    }

    // Draw room cleared indicator
    if (room.cleared) {
        renderRoomClearedIndicator(room, offsetX, offsetY);
    }
}

/**
 * Render a door
 */
function renderDoor(door, offsetX, offsetY, roomCleared) {
    const x = offsetX + door.x * TILE_SIZE;
    const y = offsetY + door.y * TILE_SIZE;
    
    // Door is open if room is cleared
    const isOpen = roomCleared;
    ctx.fillStyle = isOpen ? COLORS.doorOpen : COLORS.door;
    
    if (door.direction === 'north' || door.direction === 'south') {
        // Horizontal door
        ctx.fillRect(x + TILE_SIZE / 4, y, TILE_SIZE / 2, TILE_SIZE / 4);
    } else {
        // Vertical door
        ctx.fillRect(x, y + TILE_SIZE / 4, TILE_SIZE / 4, TILE_SIZE / 2);
    }

    // Draw door icon
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isOpen ? '🚪' : '🔒', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
}

/**
 * Render the player
 */
function renderPlayer(playerState, offsetX, offsetY) {
    const x = offsetX + playerState.x * TILE_SIZE;
    const y = offsetY + playerState.y * TILE_SIZE;

    // Player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + TILE_SIZE / 2, y + TILE_SIZE * 0.9, TILE_SIZE / 3, TILE_SIZE / 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Player body
    ctx.fillStyle = COLORS.player;
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();

    // Player border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Player emoji
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦾', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
}

/**
 * Render a monster
 */
function renderMonster(monster, offsetX, offsetY) {
    const x = offsetX + monster.x * TILE_SIZE;
    const y = offsetY + monster.y * TILE_SIZE;

    // Monster shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + TILE_SIZE / 2, y + TILE_SIZE * 0.9, TILE_SIZE / 3, TILE_SIZE / 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Monster body
    ctx.fillStyle = COLORS.monster;
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();

    // Monster border (glow if boss)
    if (monster.isBoss) {
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Boss crown emoji
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👑', x + TILE_SIZE / 2, y + 5);
    } else {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Monster emoji
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(monster.icon || '👹', x + TILE_SIZE / 2, y + TILE_SIZE / 2);

    // Monster HP bar
    renderHealthBar(x, y - 5, TILE_SIZE, monster.hp, monster.maxHp);
}

/**
 * Render a treasure chest
 */
function renderTreasure(treasure, offsetX, offsetY) {
    const x = offsetX + treasure.x * TILE_SIZE;
    const y = offsetY + treasure.y * TILE_SIZE;

    // Treasure glow
    const gradient = ctx.createRadialGradient(
        x + TILE_SIZE / 2, y + TILE_SIZE / 2, 0,
        x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE / 2
    );
    gradient.addColorStop(0, 'rgba(241, 196, 15, 0.3)');
    gradient.addColorStop(1, 'rgba(241, 196, 15, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    // Treasure chest
    ctx.fillStyle = COLORS.treasure;
    ctx.fillRect(x + TILE_SIZE / 4, y + TILE_SIZE / 3, TILE_SIZE / 2, TILE_SIZE / 2);

    // Chest emoji
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💰', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
}

/**
 * Render a health bar
 */
function renderHealthBar(x, y, width, currentHp, maxHp) {
    const barHeight = 4;
    const barWidth = width;
    const hpPercent = currentHp / maxHp;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x, y, barWidth, barHeight);

    // HP bar
    const hpColor = hpPercent > 0.5 ? '#2ecc71' : hpPercent > 0.25 ? '#f39c12' : '#e74c3c';
    ctx.fillStyle = hpColor;
    ctx.fillRect(x, y, barWidth * hpPercent, barHeight);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
}

/**
 * Render room cleared indicator
 */
function renderRoomClearedIndicator(room, offsetX, offsetY) {
    const centerX = offsetX + (room.x + room.width / 2) * TILE_SIZE;
    const centerY = offsetY + (room.y + room.height / 2) * TILE_SIZE;

    // Checkmark circle
    ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, TILE_SIZE, 0, Math.PI * 2);
    ctx.fill();

    // Checkmark
    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓', centerX, centerY);
}

/**
 * Render UI overlay (minimap, stats, etc.)
 */
function renderUIOverlay(dungeon, playerState) {
    // Draw semi-transparent panel at top
    ctx.fillStyle = 'rgba(26, 26, 46, 0.8)';
    ctx.fillRect(0, 0, canvas.width, 60);

    // Room info
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Floor ${dungeon.floor} - Room ${playerState.currentRoom + 1}/${dungeon.rooms.length}`, 20, 25);

    // Current room status
    const currentRoom = dungeon.rooms[playerState.currentRoom];
    if (currentRoom) {
        const status = currentRoom.cleared ? '✓ Cleared' : currentRoom.monsters?.length > 0 ? '⚔️ Enemies' : '🚪 Empty';
        ctx.fillText(status, 20, 45);
    }

    // Controls hint (bottom)
    ctx.fillStyle = 'rgba(26, 26, 46, 0.8)';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    ctx.fillStyle = '#aaa';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Use Arrow Keys or WASD to move', canvas.width / 2, canvas.height - 15);
}

/**
 * Render a message in the center of the screen
 */
export function renderCenterMessage(message, subMessage = '') {
    if (!ctx) return;

    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Main message
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 30);

    // Sub message
    if (subMessage) {
        ctx.font = '24px Arial';
        ctx.fillStyle = '#aaa';
        ctx.fillText(subMessage, canvas.width / 2, canvas.height / 2 + 30);
    }
}

export { TILE_SIZE, COLORS };
