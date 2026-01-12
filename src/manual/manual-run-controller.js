/**
 * Manual Run Controller
 * Main controller for canvas-based manual dungeon runs
 */

import { gameState, saveGame } from '../core/game-state.js';
import { DungeonGenerator } from './dungeon-generator.js';
import { DungeonRenderer } from './dungeon-renderer.js';
import { CombatSystem } from './combat-system.js';
import { generateLootDrops, addLootToInventory } from '../upgrades/loot-system.js';
import { 
    updateEffects, 
    clearAllEffects, 
    triggerCritEffect, 
    triggerHitEffect,
    triggerHealEffect 
} from './combat-effects.js';
import { initBossAI } from './boss-abilities.js';

export class ManualRunController {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new DungeonRenderer(canvas);
        this.combat = new CombatSystem();
        this.dungeon = null;
        this.difficulty = 'NORMAL';
        this.floorLevel = 1;
        this.isRunning = false;
        this.keys = {};
        this.animationId = null;
        this.lastFrameTime = 0;

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
        this.lastFrameTime = performance.now();

        // Determine floor level based on progression
        // Use deepestFloor + 1 (since we're attempting the next floor)
        this.floorLevel = (gameState.stats.deepestFloor || 0) + 1;

        // Generate dungeon with floor scaling
        const generator = new DungeonGenerator(difficulty, this.floorLevel);
        this.dungeon = generator.generate();
        
        // Initialize boss AI for all boss monsters
        this.dungeon.rooms.forEach(room => {
            room.monsters.forEach(monster => {
                if (monster.isBoss) {
                    initBossAI(monster);
                }
            });
        });

        // Reset hero position and HP
        gameState.hero.x = 1;
        gameState.hero.y = 1;
        gameState.hero.hp = gameState.hero.maxHp;
        
        // Clear any previous effects
        clearAllEffects();

        // Start game loop
        this.lastFrameTime = performance.now();
        this.gameLoop(this.lastFrameTime);

        console.log(`🎮 Manual Run started (${difficulty}, Floor ${this.floorLevel})`);
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        // Update
        this.handleMovement();
        updateEffects(deltaTime);

        // Render
        this.renderer.render(this.dungeon, gameState.hero);

        // Continue loop
        this.animationId = requestAnimationFrame((ts) => this.gameLoop(ts));
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

        // Get monster screen position for effects
        const monsterPos = this.renderer.getEntityScreenPosition(monster.x, monster.y);
        
        // Trigger visual effects
        if (heroResult.isCrit) {
            triggerCritEffect(monsterPos.x, monsterPos.y, heroResult.damage);
        } else {
            triggerHitEffect(monsterPos.x, monsterPos.y, heroResult.damage);
        }
        
        if (heroResult.shieldBlocked) {
            console.log(`👥 Shield blocked some damage!`);
        }

        console.log(`⚔️ Hero attacks ${monster.name} for ${heroResult.damage} damage${heroResult.isCrit ? ' (CRIT!)' : ''}`);

        if (heroResult.killed) {
            console.log(`✅ ${monster.name} defeated! +${monster.xp} XP, +${monster.gold} Gold`);
            return;
        }

        // Monster counter-attacks
        setTimeout(() => {
            if (monster.alive) {
                const monsterResult = this.combat.monsterAttack(monster);
                
                // Get hero screen position for effects
                const heroPos = this.renderer.getEntityScreenPosition(gameState.hero.x, gameState.hero.y);
                
                // Handle different result types
                if (monsterResult.telegraph) {
                    // Boss is telegraphing an ability
                    console.log(`⚠️ ${monsterResult.telegraphMessage}`);
                } else if (monsterResult.isAbility) {
                    // Boss used an ability
                    console.log(monsterResult.abilityMessage);
                    
                    if (monsterResult.heal) {
                        triggerHealEffect(monsterPos.x, monsterPos.y, monsterResult.heal);
                    } else if (monsterResult.damage > 0) {
                        if (monsterResult.isCrit) {
                            triggerCritEffect(heroPos.x, heroPos.y, monsterResult.damage);
                        } else {
                            triggerHitEffect(heroPos.x, heroPos.y, monsterResult.damage);
                        }
                    }
                } else if (monsterResult.damage > 0) {
                    // Normal attack
                    triggerHitEffect(heroPos.x, heroPos.y, monsterResult.damage);
                    console.log(`👹 ${monster.name} attacks for ${monsterResult.damage} damage`);
                }
                
                // Process boss turn (cooldowns, shield, etc.)
                if (monster.isBoss) {
                    const turnResult = this.combat.processBossTurn(monster);
                    if (turnResult && turnResult.message) {
                        console.log(turnResult.message);
                    }
                }

                if (monsterResult.killed) {
                    this.endRun(false); // Hero died
                }
            }
        }, 300);
    }

    collectTreasure(room) {
        room.treasure.collected = true;
        const goldReward = Math.floor(50 * this.getRewardMultiplier() * (1 + (this.floorLevel - 1) * 0.1));
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
        clearAllEffects();

        if (success) {
            console.log('✅ Dungeon Complete!');
            
            // Update deepest floor reached
            if (this.floorLevel > (gameState.stats.deepestFloor || 0)) {
                gameState.stats.deepestFloor = this.floorLevel;
                console.log(`🏆 New record! Reached Floor ${this.floorLevel}`);
            }
            
            // Generate loot
            const loot = generateLootDrops(this.difficulty, true);
            addLootToInventory(loot);

            // Bonus rewards scale with floor
            const xpBonus = Math.floor(100 * this.getRewardMultiplier() * (1 + (this.floorLevel - 1) * 0.15));
            const goldBonus = Math.floor(200 * this.getRewardMultiplier() * (1 + (this.floorLevel - 1) * 0.2));
            gameState.hero.xp += xpBonus;
            gameState.resources.gold += goldBonus;
            gameState.stats.totalRunsCompleted++;

            // Update inventory UI
            this.refreshInventoryUI();

            alert(`🎉 Victory! (Floor ${this.floorLevel})\n\n+${xpBonus} XP\n+${goldBonus} Gold${loot.length > 0 ? `\n\n🎁 ${loot.length} items looted!` : ''}`);
        } else {
            console.log('❌ Hero defeated!');
            gameState.stats.totalDeaths++;
            alert(`☠️ Defeat (Floor ${this.floorLevel})\n\nYou were defeated in the dungeon...`);
        }

        saveGame();

        // Return to selection screen
        this.showSelectionScreen();
    }

    refreshInventoryUI() {
        // Dynamically import and call inventory UI update
        import('../../ui/inventory-ui.js').then(module => {
            if (module.updateInventoryUI) {
                module.updateInventoryUI();
            }
        }).catch(err => {
            console.error('Failed to update inventory UI:', err);
        });
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
        ctx.fillText('Go to Equipment tab to see your loot or start a new run', this.canvas.width / 2, this.canvas.height / 2 + 20);

        // Show canvas container, hide if needed
        setTimeout(() => {
            const canvasContainer = document.getElementById('dungeon-canvas-container');
            const manualPanel = document.getElementById('manual-run-panel');
            
            if (canvasContainer) canvasContainer.style.display = 'none';
            if (manualPanel) manualPanel.style.display = 'block';
        }, 3000);
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
        clearAllEffects();
    }
}
