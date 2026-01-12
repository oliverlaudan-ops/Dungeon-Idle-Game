/**
 * Skill Effects System
 * Applies skill bonuses in combat and gameplay
 */

import { getActiveSkillEffects } from './skill-tree.js';
import { gameState } from '../core/game-state.js';

/**
 * Apply all skill bonuses to hero stats
 * Call this when skills change or on game load
 */
export function applySkillBonuses() {
    const skills = gameState.skills || {};
    const effects = getActiveSkillEffects(skills);
    
    // Store in gameState for easy access
    gameState.skillEffects = effects;
    
    console.log('🌳 Skill effects applied:', effects);
}

/**
 * Calculate modified attack damage with skills
 */
export function calculateSkillModifiedDamage(baseDamage, targetHpPercent) {
    const effects = gameState.skillEffects || {};
    let damage = baseDamage;
    
    // Execute: Bonus damage to low HP enemies
    if (effects.executeThreshold && targetHpPercent <= effects.executeThreshold) {
        const bonus = effects.executeDamageBonus || 0;
        damage *= (1 + bonus / 100);
    }
    
    // Berserker: More damage at low HP
    if (effects.berserkerBonus) {
        const heroHpPercent = gameState.hero.hp / gameState.hero.maxHp;
        if (heroHpPercent <= 0.5) {
            // Scale from 0% to max bonus as HP decreases
            const bonusPercent = effects.berserkerBonus * (1 - heroHpPercent / 0.5);
            damage *= (1 + bonusPercent / 100);
        }
    }
    
    // Bloodlust: Stacking damage buff
    if (gameState.bloodlustStacks > 0) {
        const bonus = gameState.bloodlustStacks * 5; // 5% per stack
        damage *= (1 + bonus / 100);
    }
    
    return Math.floor(damage);
}

/**
 * Check if attack should trigger double strike
 */
export function shouldDoubleStrike() {
    const effects = gameState.skillEffects || {};
    const chance = effects.doubleStrikeChance || 0;
    return Math.random() * 100 < chance;
}

/**
 * Apply lifesteal healing
 */
export function applyLifesteal(damageDealt) {
    const effects = gameState.skillEffects || {};
    const lifestealPercent = effects.lifestealPercent || 0;
    
    if (lifestealPercent > 0) {
        const healAmount = Math.floor(damageDealt * (lifestealPercent / 100));
        if (healAmount > 0) {
            gameState.hero.hp = Math.min(
                gameState.hero.hp + healAmount,
                gameState.hero.maxHp
            );
            return healAmount;
        }
    }
    
    return 0;
}

/**
 * Check if attack is dodged
 */
export function shouldDodgeAttack() {
    const effects = gameState.skillEffects || {};
    const dodgeChance = effects.dodgeChance || 0;
    return Math.random() * 100 < dodgeChance;
}

/**
 * Calculate damage reduction from block
 */
export function applyBlockReduction(incomingDamage) {
    const effects = gameState.skillEffects || {};
    const blockReduction = effects.blockReduction || 0;
    
    if (blockReduction > 0) {
        const reduction = incomingDamage * (blockReduction / 100);
        return Math.floor(incomingDamage - reduction);
    }
    
    return incomingDamage;
}

/**
 * Calculate thorns damage reflection
 */
export function calculateThornsDamage(damageTaken) {
    const effects = gameState.skillEffects || {};
    const thornsPercent = effects.thornsPercent || 0;
    
    if (thornsPercent > 0) {
        return Math.floor(damageTaken * (thornsPercent / 100));
    }
    
    return 0;
}

/**
 * Heal on kill (Second Wind)
 */
export function applySecondWind() {
    const effects = gameState.skillEffects || {};
    const healAmount = effects.healOnKill || 0;
    
    if (healAmount > 0) {
        gameState.hero.hp = Math.min(
            gameState.hero.hp + healAmount,
            gameState.hero.maxHp
        );
        return healAmount;
    }
    
    return 0;
}

/**
 * Get bonus defense from Iron Skin
 */
export function getDefenseBonus() {
    const effects = gameState.skillEffects || {};
    return effects.defenseBonus || 0;
}

/**
 * Calculate gold bonus
 */
export function calculateGoldBonus(baseGold) {
    const effects = gameState.skillEffects || {};
    const goldBonus = effects.goldBonus || 0;
    
    if (goldBonus > 0) {
        return Math.floor(baseGold * (1 + goldBonus / 100));
    }
    
    return baseGold;
}

/**
 * Calculate XP bonus
 */
export function calculateXPBonus(baseXP) {
    const effects = gameState.skillEffects || {};
    const xpBonus = effects.xpBonus || 0;
    
    if (xpBonus > 0) {
        return Math.floor(baseXP * (1 + xpBonus / 100));
    }
    
    return baseXP;
}

/**
 * Get additional crit chance from Lucky Strike
 */
export function getCritChanceBonus() {
    const effects = gameState.skillEffects || {};
    return (effects.critChanceBonus || 0) / 100; // Convert to decimal
}

/**
 * Get movement speed multiplier
 */
export function getMovementSpeedMultiplier() {
    const effects = gameState.skillEffects || {};
    const speedBonus = effects.movementSpeed || 0;
    return 1 + (speedBonus / 100);
}

/**
 * Get rarity bonus for loot
 */
export function getRarityBonus() {
    const effects = gameState.skillEffects || {};
    return effects.rarityBonus || 0;
}

/**
 * Add bloodlust stack on kill
 */
export function addBloodlustStack() {
    const effects = gameState.skillEffects || {};
    
    if (effects.bloodlustStacks) {
        // Initialize if needed
        if (!gameState.bloodlustStacks) {
            gameState.bloodlustStacks = 0;
        }
        
        // Add stack (max is from skill rank)
        if (gameState.bloodlustStacks < effects.bloodlustStacks) {
            gameState.bloodlustStacks++;
            
            // Reset timer
            clearTimeout(gameState.bloodlustTimer);
            gameState.bloodlustTimer = setTimeout(() => {
                gameState.bloodlustStacks = 0;
            }, effects.bloodlustDuration * 1000);
            
            return true;
        }
    }
    
    return false;
}

/**
 * Get current bloodlust stacks
 */
export function getBloodlustStacks() {
    return gameState.bloodlustStacks || 0;
}

/**
 * Clear all temporary skill effects
 */
export function clearTemporaryEffects() {
    gameState.bloodlustStacks = 0;
    if (gameState.bloodlustTimer) {
        clearTimeout(gameState.bloodlustTimer);
        gameState.bloodlustTimer = null;
    }
}

/**
 * Get skill effect summary for UI
 */
export function getSkillEffectSummary() {
    const effects = gameState.skillEffects || {};
    const summary = [];
    
    // Combat effects
    if (effects.lifestealPercent) {
        summary.push(`🩸 Lifesteal: ${effects.lifestealPercent}%`);
    }
    if (effects.doubleStrikeChance) {
        summary.push(`⚔️ Double Strike: ${effects.doubleStrikeChance}%`);
    }
    if (effects.executeDamageBonus) {
        summary.push(`💀 Execute: +${effects.executeDamageBonus}%`);
    }
    if (effects.berserkerBonus) {
        summary.push(`🔥 Berserker: up to +${effects.berserkerBonus}%`);
    }
    if (effects.bloodlustStacks) {
        summary.push(`🧛 Bloodlust: ${gameState.bloodlustStacks || 0}/${effects.bloodlustStacks} stacks`);
    }
    
    // Defense effects
    if (effects.dodgeChance) {
        summary.push(`💃 Dodge: ${effects.dodgeChance}%`);
    }
    if (effects.blockReduction) {
        summary.push(`🛡️ Block: -${effects.blockReduction}% damage`);
    }
    if (effects.thornsPercent) {
        summary.push(`🌵 Thorns: ${effects.thornsPercent}% reflect`);
    }
    if (effects.healOnKill) {
        summary.push(`🌬️ Second Wind: +${effects.healOnKill} HP/kill`);
    }
    if (effects.defenseBonus) {
        summary.push(`🫨 Iron Skin: +${effects.defenseBonus} DEF`);
    }
    
    // Utility effects
    if (effects.goldBonus) {
        summary.push(`💰 Gold Find: +${effects.goldBonus}%`);
    }
    if (effects.rarityBonus) {
        summary.push(`✨ Magic Find: +${effects.rarityBonus}%`);
    }
    if (effects.xpBonus) {
        summary.push(`🎓 XP Boost: +${effects.xpBonus}%`);
    }
    if (effects.movementSpeed) {
        summary.push(`💨 Swift: +${effects.movementSpeed}%`);
    }
    if (effects.critChanceBonus) {
        summary.push(`🍀 Lucky: +${effects.critChanceBonus}% crit`);
    }
    
    return summary;
}
