/**
 * Combat UI
 * Handles combat interface and interactions
 */

import { gameState } from '../core/game-state.js';

let currentMonster = null;
let combatContainer = null;

/**
 * Initialize combat UI container
 */
export function initCombatUI() {
    combatContainer = document.getElementById('combat-ui');
    if (!combatContainer) {
        console.error('❌ Combat UI container not found');
        return false;
    }
    return true;
}

/**
 * Show combat UI
 */
export function showCombatUI(monster) {
    if (!combatContainer) {
        initCombatUI();
    }

    currentMonster = monster;

    combatContainer.innerHTML = `
        <div class="combat-panel">
            <div class="combat-header">
                <h3>⚔️ Combat!</h3>
            </div>

            <!-- Monster Info -->
            <div class="combat-monster">
                <div class="combat-monster-icon">${monster.icon || '👹'}</div>
                <div class="combat-monster-info">
                    <div class="combat-monster-name">${monster.name}</div>
                    <div class="combat-hp-bar-container">
                        <div class="combat-hp-bar monster-hp" style="width: ${(monster.hp / monster.maxHp) * 100}%"></div>
                    </div>
                    <div class="combat-hp-text">${monster.hp} / ${monster.maxHp} HP</div>
                </div>
            </div>

            <!-- Player Info -->
            <div class="combat-player">
                <div class="combat-player-icon">🦸</div>
                <div class="combat-player-info">
                    <div class="combat-player-name">${gameState.hero.name}</div>
                    <div class="combat-hp-bar-container">
                        <div class="combat-hp-bar player-hp" style="width: ${(gameState.hero.hp / gameState.hero.maxHp) * 100}%"></div>
                    </div>
                    <div class="combat-hp-text">${gameState.hero.hp} / ${gameState.hero.maxHp} HP</div>
                </div>
            </div>

            <!-- Combat Actions -->
            <div class="combat-actions">
                <button id="combat-attack-btn" class="combat-btn combat-btn-attack">
                    ⚔️ Angriff
                </button>
                <button id="combat-defend-btn" class="combat-btn combat-btn-defend">
                    🛡️ Verteidigung
                </button>
            </div>

            <!-- Combat Log -->
            <div class="combat-log" id="combat-log">
                <div class="combat-log-entry">Kampf gegen ${monster.name} beginnt!</div>
            </div>
        </div>
    `;

    combatContainer.style.display = 'block';

    // Setup action buttons
    setupCombatButtons();
}

/**
 * Setup combat button listeners
 */
function setupCombatButtons() {
    const attackBtn = document.getElementById('combat-attack-btn');
    const defendBtn = document.getElementById('combat-defend-btn');

    if (attackBtn) {
        attackBtn.addEventListener('click', () => handleCombatAction('attack'));
    }

    if (defendBtn) {
        defendBtn.addEventListener('click', () => handleCombatAction('defend'));
    }
}

/**
 * Handle combat action
 */
function handleCombatAction(action) {
    if (!currentMonster) return;

    const log = document.getElementById('combat-log');

    if (action === 'attack') {
        // Player attacks
        const isCrit = Math.random() < gameState.hero.critChance;
        let damage = gameState.hero.attack;
        
        if (isCrit) {
            damage = Math.floor(damage * gameState.hero.critMultiplier);
            addCombatLog(`✨ Kritischer Treffer! ${damage} Schaden!`, 'crit');
        } else {
            addCombatLog(`Du triffst für ${damage} Schaden!`, 'player-action');
        }

        currentMonster.hp -= damage;

        // Check if monster defeated
        if (currentMonster.hp <= 0) {
            currentMonster.hp = 0;
            addCombatLog(`✅ ${currentMonster.name} besiegt!`, 'victory');
            
            // Award XP and gold
            const xpGain = currentMonster.xp || 10;
            const goldGain = currentMonster.gold || 5;
            
            gameState.hero.xp += xpGain;
            gameState.resources.gold += goldGain;
            
            addCombatLog(`+${xpGain} XP, +${goldGain} Gold`, 'reward');

            // Close combat after 2 seconds
            setTimeout(() => {
                hideCombatUI();
            }, 2000);
            return;
        }

        // Monster attacks back
        setTimeout(() => {
            monsterAttack();
        }, 500);
    } else if (action === 'defend') {
        addCombatLog('Du verteidigst dich!', 'player-action');
        
        // Monster attacks with reduced damage
        setTimeout(() => {
            monsterAttack(0.5);
        }, 500);
    }

    // Update combat UI
    updateCombatUI();
}

/**
 * Monster attacks
 */
function monsterAttack(damageMultiplier = 1.0) {
    if (!currentMonster || currentMonster.hp <= 0) return;

    const baseDamage = currentMonster.attack || 5;
    const defense = gameState.hero.defense || 0;
    const damage = Math.max(1, Math.floor((baseDamage - defense) * damageMultiplier));

    gameState.hero.hp -= damage;
    addCombatLog(`${currentMonster.name} trifft dich für ${damage} Schaden!`, 'monster-action');

    // Check if player defeated
    if (gameState.hero.hp <= 0) {
        gameState.hero.hp = 0;
        addCombatLog('💀 Du wurdest besiegt!', 'defeat');
        
        // End run after 2 seconds
        setTimeout(() => {
            hideCombatUI();
            // TODO: Trigger game over
        }, 2000);
        return;
    }

    updateCombatUI();
}

/**
 * Add entry to combat log
 */
function addCombatLog(message, type = '') {
    const log = document.getElementById('combat-log');
    if (!log) return;

    const entry = document.createElement('div');
    entry.className = `combat-log-entry ${type}`;
    entry.textContent = message;
    
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

/**
 * Update combat UI (HP bars, etc.)
 */
export function updateCombatUI() {
    if (!currentMonster) return;

    // Update monster HP bar
    const monsterHpBar = document.querySelector('.monster-hp');
    if (monsterHpBar) {
        const percent = (currentMonster.hp / currentMonster.maxHp) * 100;
        monsterHpBar.style.width = `${percent}%`;
    }

    // Update monster HP text
    const monsterHpText = document.querySelector('.combat-monster-info .combat-hp-text');
    if (monsterHpText) {
        monsterHpText.textContent = `${currentMonster.hp} / ${currentMonster.maxHp} HP`;
    }

    // Update player HP bar
    const playerHpBar = document.querySelector('.player-hp');
    if (playerHpBar) {
        const percent = (gameState.hero.hp / gameState.hero.maxHp) * 100;
        playerHpBar.style.width = `${percent}%`;
    }

    // Update player HP text
    const playerHpText = document.querySelector('.combat-player-info .combat-hp-text');
    if (playerHpText) {
        playerHpText.textContent = `${gameState.hero.hp} / ${gameState.hero.maxHp} HP`;
    }
}

/**
 * Hide combat UI
 */
export function hideCombatUI() {
    if (combatContainer) {
        combatContainer.style.display = 'none';
        combatContainer.innerHTML = '';
    }
    currentMonster = null;
}

/**
 * Get current combat monster
 */
export function getCurrentMonster() {
    return currentMonster;
}