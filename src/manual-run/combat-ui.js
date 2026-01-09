/**
 * Combat UI v2.1
 * Handles combat interface and interactions
 * UPDATED: Visual effects integration (damage numbers, screen shake, crit effects)
 */

import { gameState } from '../core/game-state.js';
import { endCombat } from './manual-run-manager.js';
import { 
    shouldUseBossAbility, 
    selectBossAbility, 
    telegraphBossAbility,
    executeBossAbility,
    processBossTurn,
    calculateDamageToBoss,
    getBossStatus
} from './boss-abilities.js';
import {
    showCombatDamageNumber,
    screenShake,
    showCritEffect,
    showBossAbilityEffect,
    showTelegraphWarning,
    showVictoryEffect,
    showDefeatEffect,
    showHitEffect
} from './visual-effects.js';

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
    
    // Get boss status if applicable
    const bossStatus = monster.isBoss ? getBossStatus(monster) : '';

    combatContainer.innerHTML = `
        <div class="combat-panel">
            <div class="combat-header">
                <h3>⚔️ Combat!</h3>
                ${monster.isBoss ? '<span class="boss-badge">👑 BOSS</span>' : ''}
            </div>

            <!-- Monster Info -->
            <div class="combat-monster ${monster.isBoss ? 'boss-monster' : ''}">
                <div class="combat-monster-icon">${monster.icon || '👹'}</div>
                <div class="combat-monster-info">
                    <div class="combat-monster-name">${monster.name}</div>
                    <div class="combat-hp-bar-container">
                        <div class="combat-hp-bar monster-hp" style="width: ${(monster.hp / monster.maxHp) * 100}%"></div>
                    </div>
                    <div class="combat-hp-text">${monster.hp} / ${monster.maxHp} HP</div>
                    ${bossStatus ? `<div class="boss-status">${bossStatus}</div>` : ''}
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
        let baseDamage = gameState.hero.attack;
        
        // Apply crit multiplier
        if (isCrit) {
            baseDamage = Math.floor(baseDamage * gameState.hero.critMultiplier);
        }
        
        // Calculate final damage (accounting for boss shield)
        const damage = currentMonster.isBoss ? 
            calculateDamageToBoss(currentMonster, baseDamage) : 
            baseDamage;
        
        // VISUAL EFFECTS
        if (isCrit) {
            showCritEffect('monster');
            screenShake('medium');
            addCombatLog(`✨ Kritischer Treffer! ${damage} Schaden!`, 'crit');
        } else {
            showHitEffect('monster');
            screenShake('light');
            addCombatLog(`Du triffst für ${damage} Schaden!`, 'player-action');
        }
        
        // Show damage number
        showCombatDamageNumber(damage, 'monster', isCrit, false);
        
        // Show shield message if active
        if (currentMonster.isBoss && currentMonster.shielded && baseDamage !== damage) {
            addCombatLog(`🛡️ Schild reduziert Schaden!`, 'info');
        }

        currentMonster.hp -= damage;

        // Check if monster defeated
        if (currentMonster.hp <= 0) {
            currentMonster.hp = 0;
            
            // VICTORY EFFECT
            showVictoryEffect();
            
            addCombatLog(`✅ ${currentMonster.name} besiegt!`, 'victory');
            
            // Award XP and gold
            const xpGain = currentMonster.xp || 10;
            const goldGain = currentMonster.gold || 5;
            
            gameState.hero.xp += xpGain;
            gameState.resources.gold += goldGain;
            gameState.stats.totalMonstersKilled++;
            
            addCombatLog(`+${xpGain} XP, +${goldGain} Gold`, 'reward');

            // Close combat after 2 seconds
            setTimeout(() => {
                endCombat(true);
            }, 2000);
            return;
        }

        // Monster/Boss attacks back
        setTimeout(() => {
            if (currentMonster.isBoss) {
                handleBossAction();
            } else {
                monsterAttack();
            }
        }, 800);
    } else if (action === 'defend') {
        addCombatLog('Du verteidigst dich!', 'player-action');
        
        // Monster attacks with reduced damage
        setTimeout(() => {
            if (currentMonster.isBoss) {
                handleBossAction(0.5);
            } else {
                monsterAttack(0.5);
            }
        }, 800);
    }

    // Update combat UI
    updateCombatUI();
}

/**
 * Handle boss action (ability or normal attack)
 */
function handleBossAction(damageMultiplier = 1.0) {
    if (!currentMonster || !currentMonster.isBoss) return;
    
    // Process boss turn (cooldowns, buffs, etc.)
    const turnResult = processBossTurn(currentMonster);
    if (turnResult && turnResult.message) {
        addCombatLog(turnResult.message, 'info');
    }
    
    // Check if boss is telegraphing an ability
    if (currentMonster.telegraphing) {
        // Execute telegraphed ability
        const abilityKey = currentMonster.telegraphing;
        const result = executeBossAbility(currentMonster, gameState.hero);
        
        if (result) {
            // SHOW ABILITY EFFECT
            showBossAbilityEffect(abilityKey);
            
            addCombatLog(result.message, result.isCrit ? 'crit' : 'monster-action');
            
            if (result.damage > 0) {
                const finalDamage = Math.floor(result.damage * damageMultiplier);
                gameState.hero.hp -= finalDamage;
                
                // Show damage to player
                showCombatDamageNumber(finalDamage, 'player', result.isCrit, false);
                showHitEffect('player');
                
                if (damageMultiplier < 1.0) {
                    addCombatLog(`Deine Verteidigung reduziert den Schaden!`, 'info');
                }
            }
            
            if (result.heal) {
                // Show heal number
                showCombatDamageNumber(result.heal, 'monster', false, true);
                addCombatLog(`Der Boss wurde geheilt!`, 'monster-action');
            }
        }
        
        updateCombatUI();
        checkPlayerDefeat();
        return;
    }
    
    // Decide if boss should use ability
    if (shouldUseBossAbility(currentMonster)) {
        const abilityKey = selectBossAbility(currentMonster);
        
        if (abilityKey) {
            // Telegraph the ability (warning to player)
            const telegraph = telegraphBossAbility(currentMonster, abilityKey);
            
            if (telegraph) {
                // SHOW TELEGRAPH WARNING
                showTelegraphWarning();
                
                addCombatLog(telegraph.message, 'boss-telegraph');
                updateCombatUI();
                return; // Ability will execute next turn
            }
        }
    }
    
    // Normal boss attack if no ability
    monsterAttack(damageMultiplier);
}

/**
 * Monster/Boss normal attack
 */
function monsterAttack(damageMultiplier = 1.0) {
    if (!currentMonster || currentMonster.hp <= 0) return;

    const baseDamage = currentMonster.attack || 5;
    const defense = gameState.hero.defense || 0;
    const damage = Math.max(1, Math.floor((baseDamage - defense) * damageMultiplier));

    gameState.hero.hp -= damage;
    
    // VISUAL EFFECTS
    showCombatDamageNumber(damage, 'player', false, false);
    showHitEffect('player');
    screenShake('light');
    
    addCombatLog(`${currentMonster.name} trifft dich für ${damage} Schaden!`, 'monster-action');
    
    updateCombatUI();
    checkPlayerDefeat();
}

/**
 * Check if player is defeated
 */
function checkPlayerDefeat() {
    if (gameState.hero.hp <= 0) {
        gameState.hero.hp = 0;
        gameState.stats.totalDeaths++;
        
        // DEFEAT EFFECT
        showDefeatEffect();
        
        addCombatLog('💀 Du wurdest besiegt!', 'defeat');
        
        // End combat after 2 seconds
        setTimeout(() => {
            endCombat(false);
        }, 2000);
    }
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
 * Update combat UI (HP bars, status, etc.)
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
    
    // Update boss status
    if (currentMonster.isBoss) {
        const bossStatusElement = document.querySelector('.boss-status');
        if (bossStatusElement) {
            const status = getBossStatus(currentMonster);
            bossStatusElement.textContent = status;
            bossStatusElement.style.display = status ? 'block' : 'none';
        }
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
