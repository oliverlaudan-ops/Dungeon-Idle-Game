/**
 * Manual Run UI with Difficulty Selection & Loot Display
 * Updated with Fantasy Theme and Loot Drop System
 */

import { gameState } from '../core/game-state.js';
import { shouldDropLoot, generateLootDrops, addLootToInventory, getLootNotificationMessage, getDropRateForDifficulty } from '../upgrades/loot-system.js';
import { getHeroClass, getClassInfo } from '../upgrades/equipment-system.js';

let selectedDifficulty = 'NORMAL';
let runInProgress = false;
let lastRunLoot = [];

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
                <h3>⚔️ Wähle die Schwierigkeit</h3>
                <div class="difficulty-selector">
                    <button class="difficulty-btn selected" data-difficulty="EASY">
                        <span>😊 Easy</span>
                        <span class="difficulty-label">5-8 Räume • 0.75x Feinde • 1.0x Belohnungen</span>
                    </button>
                    <button class="difficulty-btn" data-difficulty="NORMAL">
                        <span>😀 Normal</span>
                        <span class="difficulty-label">7-10 Räume • 1.2x Feinde • 1.5x Belohnungen</span>
                    </button>
                    <button class="difficulty-btn" data-difficulty="HARD">
                        <span>😠 Hard</span>
                        <span class="difficulty-label">10-13 Räume • 1.6x Feinde • 2.5x Belohnungen</span>
                    </button>
                    <button class="difficulty-btn" data-difficulty="EXPERT">
                        <span>🔥 Expert</span>
                        <span class="difficulty-label">12-15 Räume • 2.0x Feinde • 4.0x Belohnungen</span>
                    </button>
                </div>
                <div class="loot-chance-info">
                    <p>🎲 <strong>Loot-Quote:</strong> <span id="loot-chance">15%</span> Chance auf Equipment-Drops</p>
                </div>
            </div>

            <!-- Equipment & Stats Preview -->
            <div class="equipment-section">
                <h3>⚔️ Dein Equipment & Hero-Stats</h3>
                <div class="equipment-preview">
                    <div class="equipment-slot">
                        <span class="slot-icon">🗡️</span>
                        <div class="slot-info">
                            <div class="slot-name" id="weapon-name">Keine Waffe ausgerüstet</div>
                            <div class="slot-class" id="weapon-class">Klasse: Warrior</div>
                        </div>
                    </div>
                    <div class="equipment-slot">
                        <span class="slot-icon">🛡️</span>
                        <div class="slot-info">
                            <div class="slot-name" id="armor-name">Keine Rüstung ausgerüstet</div>
                            <div class="slot-class">Basis Defense</div>
                        </div>
                    </div>
                    <div class="equipment-slot">
                        <span class="slot-icon">💍</span>
                        <div class="slot-info">
                            <div class="slot-name" id="accessory-name">Kein Accessory</div>
                            <div class="slot-class">Basis Stats</div>
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
                        <span class="stat-label">💥 CRIT:</span>
                        <span class="stat-value" id="preview-crit">5%</span>
                    </div>
                </div>
            </div>

            <!-- Loot History -->
            <div class="loot-history-section" id="loot-history-section" style="display: none;">
                <h3>🎁 Letzte Belohnungen</h3>
                <div class="loot-container" id="loot-container"></div>
            </div>

            <!-- Start Button -->
            <div class="manual-run-actions">
                <button class="btn btn-primary btn-lg" id="start-manual-run">
                    <span>🎮 Dungeon Betreten</span>
                </button>
            </div>
        </div>
    `;

    // Event listeners
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', handleDifficultySelect);
    });
    document.getElementById('start-manual-run')?.addEventListener('click', handleStartManualRun);

    // Initialize with default difficulty
    selectedDifficulty = 'EASY';
    updateLootChanceDisplay();
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
    updateLootChanceDisplay();
}

/**
 * Update loot chance display
 */
function updateLootChanceDisplay() {
    const chanceElement = document.getElementById('loot-chance');
    if (chanceElement) {
        chanceElement.textContent = getDropRateForDifficulty(selectedDifficulty);
    }
}

/**
 * Update equipment preview
 */
function updateEquipmentPreview() {
    const weapon = gameState.equipped?.weapon;
    const armor = gameState.equipped?.armor;
    const accessory = gameState.equipped?.accessory;

    // Update weapon
    if (weapon) {
        document.getElementById('weapon-name').textContent = weapon.name;
        const classInfo = getHeroClass();
        document.getElementById('weapon-class').textContent = `Klasse: ${weapon.classInfo?.name || 'Unknown'}`;
    }

    // Update armor
    if (armor) {
        document.getElementById('armor-name').textContent = armor.name;
    }

    // Update accessory
    if (accessory) {
        document.getElementById('accessory-name').textContent = accessory.name;
    }

    // Update stats
    const hero = gameState.hero;
    document.getElementById('preview-atk').textContent = hero.attack || 10;
    document.getElementById('preview-def').textContent = hero.defense || 5;
    document.getElementById('preview-hp').textContent = hero.maxHp || 100;
    document.getElementById('preview-crit').textContent = `${Math.round((hero.critChance || 0.05) * 100)}%`;
}

/**
 * Handle manual run start
 */
function handleStartManualRun() {
    if (runInProgress) return;

    runInProgress = true;
    const btn = document.getElementById('start-manual-run');
    btn.disabled = true;
    btn.textContent = '⏳ Dungeon wird betreten...';

    // Simulate dungeon run
    simulateManualRun();
}

/**
 * Simulate a manual dungeon run
 */
function simulateManualRun() {
    // Simulate success/failure
    const successRate = 0.7; // 70% success rate for testing
    const success = Math.random() < successRate;

    // Generate loot if successful
    lastRunLoot = [];
    let lootMessage = '';

    if (success) {
        lastRunLoot = generateLootDrops(selectedDifficulty, true);
        addLootToInventory(lastRunLoot);
        lootMessage = getLootNotificationMessage(lastRunLoot);
        
        // Add to history
        const reward = getRewardForDifficulty(selectedDifficulty);
        gameState.totalGold += reward.gold;
        gameState.totalXP += reward.xp;
    }

    // Show result
    setTimeout(() => {
        showManualRunResult(success, lootMessage);
        runInProgress = false;
    }, 1500);
}

/**
 * Get reward values for difficulty
 */
function getRewardForDifficulty(difficulty) {
    const baseGold = 50;
    const baseXP = 20;

    const multipliers = {
        EASY: { gold: 1.0, xp: 1.0 },
        NORMAL: { gold: 1.5, xp: 1.5 },
        HARD: { gold: 2.5, xp: 2.5 },
        EXPERT: { gold: 4.0, xp: 4.0 }
    };

    const mult = multipliers[difficulty] || multipliers.NORMAL;
    return {
        gold: Math.round(baseGold * mult.gold),
        xp: Math.round(baseXP * mult.xp)
    };
}

/**
 * Show manual run result
 */
function showManualRunResult(success, lootMessage) {
    const resultHTML = `
        <div class="manual-run-result ${success ? 'success' : 'failure'}">
            <div class="result-icon">${success ? '✅ Sieg!' : '❌ Niederlage!'}</div>
            <div class="result-message">
                ${success ? `Du hast den Dungeon erfolgreich besiegt!` : `Du bist im Dungeon gefallen...`}
            </div>
            ${lastRunLoot.length > 0 ? `
                <div class="result-loot">
                    <h4>🎁 ${lootMessage}</h4>
                    <div class="loot-items">
                        ${lastRunLoot.map(item => `
                            <div class="loot-item" style="border-color: ${item.color}">
                                <span class="loot-icon">${item.icon}</span>
                                <div class="loot-info">
                                    <div class="loot-name">${item.name}</div>
                                    <div class="loot-rarity" style="color: ${item.color}">${item.rarity}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    // Show result in modal or panel
    alert(`${success ? '✅ Sieg!' : '❌ Niederlage!'}\n${lootMessage}`);

    // Reset button
    const btn = document.getElementById('start-manual-run');
    btn.disabled = false;
    btn.textContent = '🎮 Dungeon Betreten';

    // Display loot if any
    if (lastRunLoot.length > 0) {
        displayLootHistory();
    }
}

/**
 * Display loot history
 */
function displayLootHistory() {
    const section = document.getElementById('loot-history-section');
    const container = document.getElementById('loot-container');

    if (!section || !container) return;

    if (lastRunLoot.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    container.innerHTML = lastRunLoot.map(item => `
        <div class="loot-item-card" style="border-color: ${item.color}">
            <span class="loot-card-icon">${item.icon}</span>
            <div class="loot-card-info">
                <div class="loot-card-name">${item.name}</div>
                <div class="loot-card-rarity" style="color: ${item.color}">${item.rarity.toUpperCase()}</div>
                <div class="loot-card-type">${item.type}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Update UI when equipment changes
 */
export function refreshManualRunUI() {
    updateEquipmentPreview();
}

/**
 * Update equipment preview when gear changes
 */
export function onEquipmentChanged() {
    updateEquipmentPreview();
}
