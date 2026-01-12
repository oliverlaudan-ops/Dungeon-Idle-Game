/**
 * Boss Abilities System
 * Adds special abilities to boss monsters for dynamic combat
 * 
 * Features:
 * - 4 unique boss abilities
 * - Telegraph system (warnings before attacks)
 * - Ability cooldowns
 * - Visual feedback in combat log
 */

// Boss ability types
const BOSS_ABILITIES = {
    AOE_ATTACK: {
        name: 'Flächenangriff',
        icon: '💥',
        description: 'Greift mit verstärkter Kraft an!',
        telegraph: 'Der Boss sammelt Energie...',
        cooldown: 3,
        execute: (boss, player) => {
            const baseDamage = boss.attack || 10;
            const damage = Math.floor(baseDamage * 1.5);
            return {
                damage,
                isCrit: false,
                message: `${boss.icon} ${boss.name} entfesselt einen Flächenangriff für ${damage} Schaden!`
            };
        }
    },
    
    HEAL: {
        name: 'Heilung',
        icon: '❤️‍🩹',
        description: 'Heilt sich selbst!',
        telegraph: 'Der Boss beginnt eine Heilung...',
        cooldown: 4,
        execute: (boss, player) => {
            const healAmount = Math.floor(boss.maxHp * 0.20);
            const actualHeal = Math.min(healAmount, boss.maxHp - boss.hp);
            boss.hp += actualHeal;
            return {
                damage: 0,
                heal: actualHeal,
                message: `${boss.icon} ${boss.name} heilt sich um ${actualHeal} HP!`
            };
        }
    },
    
    RAGE_MODE: {
        name: 'Raserei',
        icon: '🔥',
        description: 'Erhöhter Schaden bei niedriger HP!',
        telegraph: 'Der Boss gerät in Raserei!',
        cooldown: 5,
        execute: (boss, player) => {
            const hpPercent = boss.hp / boss.maxHp;
            const baseDamage = boss.attack || 10;
            let damageMultiplier = 1.2;
            
            if (hpPercent < 0.3) {
                damageMultiplier = 2.0;
            } else if (hpPercent < 0.5) {
                damageMultiplier = 1.6;
            }
            
            const damage = Math.floor(baseDamage * damageMultiplier);
            return {
                damage,
                isCrit: true,
                message: `🔥 ${boss.name} schlägt in Raserei zu für ${damage} Schaden!`
            };
        }
    },
    
    SHIELD: {
        name: 'Schild',
        icon: '🛡️',
        description: 'Reduziert eingehenden Schaden!',
        telegraph: 'Der Boss errichtet einen Schild...',
        cooldown: 4,
        duration: 2,
        execute: (boss, player) => {
            boss.shielded = true;
            boss.shieldTurns = 2;
            return {
                damage: 0,
                shield: true,
                message: `🛡️ ${boss.name} errichtet einen Schild! (Eingehender Schaden -50% für 2 Runden)`
            };
        }
    }
};

/**
 * Initialize boss AI state
 */
export function initBossAI(boss) {
    if (!boss.isBoss) return boss;
    
    // Assign random abilities to boss
    const abilityKeys = Object.keys(BOSS_ABILITIES);
    const numAbilities = 2;
    const selectedAbilities = [];
    
    const shuffled = abilityKeys.sort(() => Math.random() - 0.5);
    for (let i = 0; i < numAbilities && i < shuffled.length; i++) {
        selectedAbilities.push(shuffled[i]);
    }
    
    boss.abilities = selectedAbilities;
    boss.abilityCooldowns = {};
    boss.telegraphing = null;
    boss.turnCount = 0;
    boss.shielded = false;
    boss.shieldTurns = 0;
    
    selectedAbilities.forEach(abilityKey => {
        boss.abilityCooldowns[abilityKey] = 0;
    });
    
    console.log(`👑 Boss ${boss.name} initialized with abilities:`, selectedAbilities);
    return boss;
}

/**
 * Decide if boss should use an ability
 */
export function shouldUseBossAbility(boss) {
    if (!boss.isBoss || !boss.abilities) return false;
    
    const availableAbilities = boss.abilities.filter(abilityKey => {
        return boss.abilityCooldowns[abilityKey] <= 0;
    });
    
    if (availableAbilities.length === 0) return false;
    
    return Math.random() < 0.4;
}

/**
 * Select which ability to use
 */
export function selectBossAbility(boss) {
    if (!boss.abilities) return null;
    
    const availableAbilities = boss.abilities.filter(abilityKey => {
        return boss.abilityCooldowns[abilityKey] <= 0;
    });
    
    if (availableAbilities.length === 0) return null;
    
    if (availableAbilities.includes('HEAL') && (boss.hp / boss.maxHp) < 0.4) {
        return 'HEAL';
    }
    
    if (availableAbilities.includes('RAGE_MODE') && (boss.hp / boss.maxHp) < 0.5) {
        return 'RAGE_MODE';
    }
    
    return availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
}

/**
 * Telegraph a boss ability (warning before use)
 */
export function telegraphBossAbility(boss, abilityKey) {
    const ability = BOSS_ABILITIES[abilityKey];
    if (!ability) return null;
    
    boss.telegraphing = abilityKey;
    
    return {
        icon: ability.icon,
        message: `⚠️ ${ability.telegraph}`,
        abilityName: ability.name
    };
}

/**
 * Execute a telegraphed boss ability
 */
export function executeBossAbility(boss, player) {
    if (!boss.telegraphing) return null;
    
    const abilityKey = boss.telegraphing;
    const ability = BOSS_ABILITIES[abilityKey];
    
    if (!ability) return null;
    
    const result = ability.execute(boss, player);
    
    boss.abilityCooldowns[abilityKey] = ability.cooldown;
    boss.telegraphing = null;
    
    return result;
}

/**
 * Process boss turn (update cooldowns, shields, etc.)
 */
export function processBossTurn(boss) {
    if (!boss.isBoss) return;
    
    boss.turnCount++;
    
    if (boss.abilityCooldowns) {
        Object.keys(boss.abilityCooldowns).forEach(key => {
            if (boss.abilityCooldowns[key] > 0) {
                boss.abilityCooldowns[key]--;
            }
        });
    }
    
    if (boss.shielded && boss.shieldTurns > 0) {
        boss.shieldTurns--;
        if (boss.shieldTurns <= 0) {
            boss.shielded = false;
            return {
                message: `🛡️ ${boss.name}'s Schild ist zusammengebrochen!`
            };
        }
    }
    
    return null;
}

/**
 * Calculate damage to boss (accounting for shield)
 */
export function calculateDamageToBoss(boss, baseDamage) {
    let finalDamage = baseDamage;
    
    if (boss.shielded) {
        finalDamage = Math.floor(baseDamage * 0.5);
    }
    
    return finalDamage;
}

/**
 * Get boss status string for UI
 */
export function getBossStatus(boss) {
    const statuses = [];
    
    if (boss.shielded && boss.shieldTurns > 0) {
        statuses.push(`🛡️ Schild (${boss.shieldTurns} Runden)`);
    }
    
    if (boss.telegraphing) {
        const ability = BOSS_ABILITIES[boss.telegraphing];
        if (ability) {
            statuses.push(`${ability.icon} ${ability.name} vorbereitet`);
        }
    }
    
    return statuses.join(' | ');
}

/**
 * Check if boss is in rage mode threshold
 */
export function isBossEnraged(boss) {
    return boss.isBoss && (boss.hp / boss.maxHp) < 0.3;
}
