/**
 * Manual Run UI
 * Canvas-based dungeon crawler interface
 */

import { gameState } from '../src/core/game-state.js';
import { ManualRunController } from '../src/manual/manual-run-controller.js';
import { getHeroClass } from '../src/upgrades/equipment-system.js';

let selectedDifficulty = 'NORMAL';
let runController = null;

/**
 * Initialize Manual Run UI
 */
export function initManualRunUI() {
    const manualPanel = document.getElementById('manual-run-panel');
    if (!manualPanel) return;

    manualPanel.innerHTML = `
        <div class="manual-run-container">
            <!-- Difficulty Selector -->
            <div class="difficulty-section">
                <h3>⚔️ Select Difficulty</h3>
                <div class="difficulty-selector">
                    <button class="difficulty-btn" data-difficulty="EASY">
                        <span>😊 Easy</span>
                        <span class="difficulty-label">5-8 Rooms • 0.75x Enemies • 1.0x Rewards</span>
                    </button>
                    <button class="difficulty-btn selected" data-difficulty="NORMAL">
                        <span>😀 Normal</span>
                        <span class="difficulty-label">7-10 Rooms • 1.0x Enemies • 1.5x Rewards</span>
                    </button>
                    <button class="difficulty-btn" data-difficulty="HARD">
                        <span>😠 Hard</span>
                        <span class="difficulty-label">10-13 Rooms • 1.3x Enemies • 2.5x Rewards</span>
                    </button>
                    <button class="difficulty-btn" data-difficulty="EXPERT">
                        <span>🔥 Expert</span>
                        <span class="difficulty-label">12-15 Rooms • 1.6x Enemies • 4.0x Rewards</span>
                    </button>
                </div>
            </div>

            <!-- Equipment Preview -->
            <div class="equipment-section">
                <h3>⚔️ Your Equipment</h3>
                <div class="equipment-preview">
                    <div class="equipment-slot">
                        <span class="slot-icon">🗡️</span>
                        <div class="slot-info">
                            <div class="slot-name" id="weapon-name">No Weapon</div>
                            <div class="slot-class" id="weapon-class">Class: Warrior</div>
                        </div>
                    </div>
                    <div class="equipment-slot">
                        <span class="slot-icon">🛡️</span>
                        <div class="slot-info">
                            <div class="slot-name" id="armor-name">No Armor</div>
                        </div>
                    </div>
                    <div class="equipment-slot">
                        <span class="slot-icon">💍</span>
                        <div class="slot-info">
                            <div class="slot-name" id="accessory-name">No Accessory</div>
                        </div>
                    </div>
                </div>
                
                <div class="hero-stats-preview">
                    <div class="stat-row">
                        <span class="stat-label">⚔️ ATK:</span>
                        <span class="stat-value" id="preview-atk">10</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">🛡️ DEF:</span>
                        <span class="stat-value" id="preview-def">5</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">❤️ HP:</span>
                        <span class="stat-value" id="preview-hp">100</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">✨ CRIT:</span>
                        <span class="stat-value" id="preview-crit">5%</span>
                    </div>
                </div>
            </div>

            <!-- Start Button -->
            <div class="manual-run-actions">
                <button class="btn btn-primary btn-lg" id="start-manual-run">
                    <span>🎮 Start Dungeon Run</span>
                </button>
            </div>
        </div>
    `;

    // Event listeners
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', handleDifficultySelect);
    });
    document.getElementById('start-manual-run')?.addEventListener('click', handleStartManualRun);

    // Update equipment preview
    updateEquipmentPreview();
}

/**
 * Handle difficulty selection
 */
function handleDifficultySelect(e) {
    const btn = e.currentTarget;
    const difficulty = btn.dataset.difficulty;

    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    selectedDifficulty = difficulty;
}

/**
 * Update equipment preview
 */
function updateEquipmentPreview() {
    const weapon = gameState.equipped?.weapon;
    const armor = gameState.equipped?.armor;
    const accessory = gameState.equipped?.accessory;

    // Update weapon
    const weaponNameEl = document.getElementById('weapon-name');
    const weaponClassEl = document.getElementById('weapon-class');
    if (weaponNameEl && weaponClassEl) {
        if (weapon) {
            weaponNameEl.textContent = weapon.name;
            const classInfo = getHeroClass();
            weaponClassEl.textContent = `Class: ${classInfo?.name || 'Warrior'}`;
        } else {
            weaponNameEl.textContent = 'No Weapon';
            weaponClassEl.textContent = 'Class: Warrior';
        }
    }

    // Update armor
    const armorNameEl = document.getElementById('armor-name');
    if (armorNameEl) {
        armorNameEl.textContent = armor ? armor.name : 'No Armor';
    }

    // Update accessory
    const accessoryNameEl = document.getElementById('accessory-name');
    if (accessoryNameEl) {
        accessoryNameEl.textContent = accessory ? accessory.name : 'No Accessory';
    }

    // Update stats
    const hero = gameState.hero;
    const atkEl = document.getElementById('preview-atk');
    const defEl = document.getElementById('preview-def');
    const hpEl = document.getElementById('preview-hp');
    const critEl = document.getElementById('preview-crit');

    if (atkEl) atkEl.textContent = hero.attack || 10;
    if (defEl) defEl.textContent = hero.defense || 5;
    if (hpEl) hpEl.textContent = hero.maxHp || 100;
    if (critEl) critEl.textContent = `${Math.round((hero.critChance || 0.05) * 100)}%`;
}

/**
 * Handle manual run start
 */
function handleStartManualRun() {
    // Hide selection UI
    const manualPanel = document.getElementById('manual-run-panel');
    if (manualPanel) {
        manualPanel.style.display = 'none';
    }

    // Show canvas
    const canvasContainer = document.getElementById('dungeon-canvas-container');
    const canvas = document.getElementById('dungeon-canvas');
    
    if (canvasContainer && canvas) {
        canvasContainer.style.display = 'block';

        // Initialize controller
        if (!runController) {
            runController = new ManualRunController(canvas);
        } else {
            runController.stop(); // Stop any previous run
        }

        // Start run
        runController.startRun(selectedDifficulty);

        console.log(`🎮 Starting manual run on difficulty: ${selectedDifficulty}`);
    }
}

/**
 * Update manual run UI - exported for ui-init.js
 */
export function updateManualRunUI() {
    updateEquipmentPreview();
}

/**
 * Update UI when equipment changes - alias
 */
export function refreshManualRunUI() {
    updateEquipmentPreview();
}

/**
 * Update equipment preview when gear changes - alias
 */
export function onEquipmentChanged() {
    updateEquipmentPreview();
}
