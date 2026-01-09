/**
 * Visual Effects System v1.0
 * Provides visual feedback for combat actions
 * 
 * Features:
 * - Floating damage numbers
 * - Screen shake on hits
 * - Critical hit effects
 * - Boss ability effects
 */

/**
 * Create floating damage number
 */
export function showDamageNumber(damage, x, y, isCrit = false, isHeal = false) {
    const damageElement = document.createElement('div');
    damageElement.className = `damage-number ${isCrit ? 'crit' : ''} ${isHeal ? 'heal' : ''}`;
    damageElement.textContent = isHeal ? `+${damage}` : `-${damage}`;
    
    // Position at specified coordinates
    damageElement.style.left = `${x}px`;
    damageElement.style.top = `${y}px`;
    
    // Add to body
    document.body.appendChild(damageElement);
    
    // Animate
    requestAnimationFrame(() => {
        damageElement.style.opacity = '1';
        damageElement.style.transform = 'translateY(-50px) scale(1)';
    });
    
    // Remove after animation
    setTimeout(() => {
        damageElement.style.opacity = '0';
        setTimeout(() => {
            damageElement.remove();
        }, 300);
    }, 1000);
}

/**
 * Create damage number in combat UI
 */
export function showCombatDamageNumber(damage, target = 'monster', isCrit = false, isHeal = false) {
    const targetElement = target === 'monster' ? 
        document.querySelector('.combat-monster-icon') :
        document.querySelector('.combat-player-icon');
    
    if (!targetElement) return;
    
    const rect = targetElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    showDamageNumber(damage, x, y, isCrit, isHeal);
}

/**
 * Screen shake effect
 */
export function screenShake(intensity = 'medium') {
    const gameContainer = document.querySelector('.game-container') || document.body;
    
    const intensityMap = {
        light: 'shake-light',
        medium: 'shake-medium',
        heavy: 'shake-heavy'
    };
    
    const shakeClass = intensityMap[intensity] || intensityMap.medium;
    
    gameContainer.classList.add(shakeClass);
    
    setTimeout(() => {
        gameContainer.classList.remove(shakeClass);
    }, 500);
}

/**
 * Critical hit flash effect
 */
export function showCritEffect(target = 'monster') {
    const targetElement = target === 'monster' ? 
        document.querySelector('.combat-monster') :
        document.querySelector('.combat-player');
    
    if (!targetElement) return;
    
    // Add crit effect class
    targetElement.classList.add('crit-flash');
    
    // Create crit particles
    createCritParticles(targetElement);
    
    // Remove effect after animation
    setTimeout(() => {
        targetElement.classList.remove('crit-flash');
    }, 600);
}

/**
 * Create crit particles around target
 */
function createCritParticles(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'crit-particle';
        particle.textContent = '✨';
        
        // Random position around target
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 50;
        const x = rect.left + rect.width / 2 + Math.cos(angle) * distance;
        const y = rect.top + rect.height / 2 + Math.sin(angle) * distance;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        
        // Animate outward
        setTimeout(() => {
            const finalX = x + Math.cos(angle) * 30;
            const finalY = y + Math.sin(angle) * 30;
            particle.style.left = `${finalX}px`;
            particle.style.top = `${finalY}px`;
            particle.style.opacity = '0';
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 600);
    }
}

/**
 * Boss ability effect (special visual)
 */
export function showBossAbilityEffect(abilityType) {
    const bossElement = document.querySelector('.combat-monster.boss-monster');
    if (!bossElement) return;
    
    const effectMap = {
        'AOE_ATTACK': () => {
            bossElement.classList.add('ability-aoe');
            screenShake('heavy');
            setTimeout(() => bossElement.classList.remove('ability-aoe'), 800);
        },
        'HEAL': () => {
            bossElement.classList.add('ability-heal');
            createHealParticles(bossElement);
            setTimeout(() => bossElement.classList.remove('ability-heal'), 1000);
        },
        'RAGE_MODE': () => {
            bossElement.classList.add('ability-rage');
            screenShake('medium');
            setTimeout(() => bossElement.classList.remove('ability-rage'), 1200);
        },
        'SHIELD': () => {
            bossElement.classList.add('ability-shield');
            createShieldEffect(bossElement);
            setTimeout(() => bossElement.classList.remove('ability-shield'), 1000);
        }
    };
    
    const effect = effectMap[abilityType];
    if (effect) effect();
}

/**
 * Create healing particles
 */
function createHealParticles(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const particleCount = 6;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'heal-particle';
        particle.textContent = '❤️‍🩹';
        
        const x = rect.left + Math.random() * rect.width;
        const y = rect.bottom;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        
        // Animate upward
        setTimeout(() => {
            particle.style.top = `${y - 100}px`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

/**
 * Create shield effect
 */
function createShieldEffect(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    
    const shield = document.createElement('div');
    shield.className = 'shield-effect';
    shield.textContent = '🛡️';
    
    shield.style.left = `${rect.left + rect.width / 2}px`;
    shield.style.top = `${rect.top + rect.height / 2}px`;
    
    document.body.appendChild(shield);
    
    setTimeout(() => {
        shield.style.transform = 'translate(-50%, -50%) scale(2)';
        shield.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        shield.remove();
    }, 800);
}

/**
 * Show telegraph warning effect
 */
export function showTelegraphWarning() {
    const combatPanel = document.querySelector('.combat-panel');
    if (!combatPanel) return;
    
    combatPanel.classList.add('telegraph-warning');
    
    setTimeout(() => {
        combatPanel.classList.remove('telegraph-warning');
    }, 1000);
}

/**
 * Victory effect
 */
export function showVictoryEffect() {
    const combatPanel = document.querySelector('.combat-panel');
    if (!combatPanel) return;
    
    // Create victory particles
    const rect = combatPanel.getBoundingClientRect();
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'victory-particle';
        particle.textContent = ['⭐', '✨', '🎉'][Math.floor(Math.random() * 3)];
        
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + rect.height / 2;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        
        // Animate
        setTimeout(() => {
            particle.style.top = `${y - 150 - Math.random() * 100}px`;
            particle.style.left = `${x + (Math.random() - 0.5) * 100}px`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }
}

/**
 * Defeat effect
 */
export function showDefeatEffect() {
    screenShake('heavy');
    
    const playerElement = document.querySelector('.combat-player');
    if (playerElement) {
        playerElement.classList.add('defeated');
    }
}

/**
 * Hit effect (simple flash)
 */
export function showHitEffect(target = 'monster') {
    const targetElement = target === 'monster' ? 
        document.querySelector('.combat-monster') :
        document.querySelector('.combat-player');
    
    if (!targetElement) return;
    
    targetElement.classList.add('hit-flash');
    
    setTimeout(() => {
        targetElement.classList.remove('hit-flash');
    }, 200);
}
