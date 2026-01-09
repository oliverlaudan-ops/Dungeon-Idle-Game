/**
 * Manual Run Controller
 * Main controller for canvas-based manual dungeon runs
 */

import { gameState, saveGame } from '../core/game-state.js';
import { DungeonGenerator } from './dungeon-generator.js';
import { DungeonRenderer } from './dungeon-renderer.js';
import { CombatSystem } from './combat-system.js';
import { generateLootDrops, addLootToInventory } from '../upgrades/loot-system.js';

export class ManualRunController {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new DungeonRenderer(canvas);
        this.combat = new CombatSystem();
        this.dungeon = null;
        this.difficulty = 'NORMAL';
        this.isRunning = false;
        this.keys = {};
        this.animationId = null;

        this.setupControls();
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Prevent arrow key scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    startRun(difficulty = 'NORMAL') {
        if (this.isRunning) return;

        this.difficulty = difficulty;
        this.isRunning = true;

        // Generate dungeon
        const generator = new DungeonGenerator(difficulty);
        this.dungeon = generator.generate();

        // Reset hero position
        gameState.hero.x = 1;
        gameState.hero.y = 1;

        // Start game loop
        this.gameLoop();

        console.log(`🎮 Manual Run started (${difficulty})`);
    }

    gameLoop() {
        if (!this.isRunning) return;

        // Update
        this.handleMovement();
        this.checkCollisions();

        // Render
        this.renderer.render(this.dungeon, gameState.hero);

        // Continue loop
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    handleMovement() {
        const hero = gameState.hero;
        const room = this.dungeon.rooms[this.dungeon.currentRoom];
        let newX = hero.x;
        let newY = hero.y;

        // Check input
        if (this.keys['w'] || this.keys['arrowup']) {
            newY--;
        } else if (this.keys['s'] || this.keys['arrowdown']) {
            newY++;
        } else if (this.keys['a'] || this.keys['arrowleft']) {
            newX--;
        } else if (this.keys['d'] || this.keys['arrowright']) {
            newX++;
        } else {
            return; // No movement
        }

        // Check bounds
        if (newX < 0 || newX >= room.width || newY < 0 || newY >= room.height) {
            // Check if at exit (right side)
            if (newX >= room.width && this.canProgressToNextRoom(room)) {
                this.progressToNextRoom();
            }
            return;
        }

        // Check monster collision
        const monster = this.getMonsterAt(newX, newY, room);
        if (monster && monster.alive) {
            this.handleCombat(monster);
            return; // Don't move into monster
        }

        // Move hero
        hero.x = newX;
        hero.y = newY;

        // Check treasure collection
        if (room.treasure && !room.treasure.collected) {
            if (hero.x === room.treasure.x && hero.y === room.treasure.y) {
                this.collectTreasure(room);
            }
        }

        // Clear keys to prevent continuous movement
        this.keys = {};
    }

    getMonsterAt(x, y, room) {
        return room.monsters.find(m => m.alive && m.x === x && m.y === y);
    }

    handleCombat(monster) {
        // Hero attacks monster
        const heroResult = this.combat.heroAttack(monster);
        if (!heroResult) return; // Cooldown

        console.log(`⚔️ Hero attacks ${monster.name} for ${heroResult.damage} damage${heroResult.isCrit ? ' (CRIT!)' : ''}`);

        if (heroResult.killed) {
            console.log(`✅ ${monster.name} defeated! +${monster.xp} XP, +${monster.gold} Gold`);
            return;
        }

        // Monster counter-attacks
        setTimeout(() => {
            if (monster.alive) {
                const monsterResult = this.combat.monsterAttack(monster);
                console.log(`👹 ${monster.name} attacks for ${monsterResult.damage} damage`);

                if (monsterResult.killed) {
                    this.endRun(false); // Hero died
                }
            }
        }, 300);
    }

    collectTreasure(room) {
        room.treasure.collected = true;
        const goldReward = Math.floor(50 * this.getRewardMultiplier());
        gameState.resources.gold += goldReward;
        console.log(`💰 Treasure collected! +${goldReward} Gold`);
    }

    canProgressToNextRoom(room) {
        // Must defeat all monsters
        return room.monsters.every(m => !m.alive);
    }

    progressToNextRoom() {
        this.dungeon.currentRoom++;

        if (this.dungeon.currentRoom >= this.dungeon.totalRooms) {
            // Dungeon complete!
            this.endRun(true);
            return;
        }

        // Reset hero position
        gameState.hero.x = 0;
        gameState.hero.y = Math.floor(this.dungeon.rooms[this.dungeon.currentRoom].height / 2);

        console.log(`🚪 Entering room ${this.dungeon.currentRoom + 1}`);
    }

    endRun(success) {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);

        if (success) {
            console.log('✅ Dungeon Complete!');
            
            // Generate loot
            const loot = generateLootDrops(this.difficulty, true);
            addLootToInventory(loot);

            // Bonus rewards
            const xpBonus = Math.floor(100 * this.getRewardMultiplier());
            const goldBonus = Math.floor(200 * this.getRewardMultiplier());
            gameState.hero.xp += xpBonus;
            gameState.resources.gold += goldBonus;

            alert(`🎉 Victory!\n\n+${xpBonus} XP\n+${goldBonus} Gold\n${loot.length > 0 ? `\n🎁 ${loot.length} items looted!` : ''}`);
        } else {
            console.log('❌ Hero defeated!');
            alert('☠️ Defeat\n\nYou were defeated in the dungeon...');
        }

        saveGame();

        // Return to selection screen
        this.showSelectionScreen();
    }

    showSelectionScreen() {
        // Clear canvas
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Show message
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Manual Run Completed', this.canvas.width / 2, this.canvas.height / 2 - 20);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#aaa';
        ctx.fillText('Switch to another tab or start a new run', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    getRewardMultiplier() {
        const multipliers = {
            EASY: 1.0,
            NORMAL: 1.5,
            HARD: 2.5,
            EXPERT: 4.0
        };
        return multipliers[this.difficulty] || 1.0;
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
