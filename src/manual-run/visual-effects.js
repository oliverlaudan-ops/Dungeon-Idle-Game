/**
 * Visual Effects Bridge v1.0
 * Connects combat UI with canvas-based visual effects
 */

import {
    addDamageNumber,
    triggerScreenShake,
    triggerCritEffect,
    triggerHitEffect,
    triggerHealEffect
} from './combat-effects.js';

import { TILE_SIZE } from './canvas-renderer.js';

// Canvas reference
let canvas = null;

/**
 * Initialize visual effects system
 */
export function initVisualEffects() {
    canvas = document.getElementById('dungeon-canvas');
    if (!canvas) {
        console.warn('⚠️ Canvas not found for visual effects');
        return false;
    }
    console.log('✅ Visual effects initialized');
    return true;
}

/**
 * Show damage number on canvas
 * @param {number} damage
 * @param {string} target - 'player' or 'monster'
 * @param {boolean} isCrit
 * @param {boolean} isHeal
 */
export function showCombatDamageNumber(damage, target, isCrit = false, isHeal = false) {
    if (!canvas) initVisualEffects();
    
    // Calculate position based on target
    // Monster is typically on left side, player on right
    const x = target === 'monster' ? canvas.width * 0.3 : canvas.width * 0.7;
    const y = canvas.height * 0.5;
    
    addDamageNumber(x, y, damage, isCrit, isHeal);
}

/**
 * Trigger screen shake
 * @param {string} intensity - 'light', 'medium', 'heavy'
 */
export function screenShake(intensity = 'medium') {
    const intensityMap = {
        light: 3,
        medium: 6,
        heavy: 10
    };
    
    const shakeIntensity = intensityMap[intensity] || 6;
    const duration = intensity === 'heavy' ? 300 : intensity === 'light' ? 150 : 200;
    
    triggerScreenShake(shakeIntensity, duration);
}

/**
 * Show critical hit effect
 * @param {string} target - 'player' or 'monster'
 */
export function showCritEffect(target) {
    if (!canvas) initVisualEffects();
    
    const x = target === 'monster' ? canvas.width * 0.3 : canvas.width * 0.7;
    const y = canvas.height * 0.5;
    
    triggerCritEffect(x, y, 0); // Damage will be shown separately
}

/**
 * Show hit effect (flash)
 * @param {string} target - 'player' or 'monster'
 */
export function showHitEffect(target) {
    if (!canvas) initVisualEffects();
    
    const x = target === 'monster' ? canvas.width * 0.25 : canvas.width * 0.65;
    const y = canvas.height * 0.4;
    
    triggerHitEffect(x, y, 0); // Simple hit, no damage number
}

/**
 * Show boss ability effect
 * @param {string} abilityKey - Ability identifier
 */
export function showBossAbilityEffect(abilityKey) {
    // Heavy shake for boss abilities
    screenShake('heavy');
    
    console.log(`💥 Boss ability effect: ${abilityKey}`);
}

/**
 * Show telegraph warning (boss charging ability)
 */
export function showTelegraphWarning() {
    // Medium shake as warning
    screenShake('light');
    
    console.log('⚠️ Boss telegraphing ability!');
}

/**
 * Show victory effect
 */
export function showVictoryEffect() {
    // Light celebratory shake
    setTimeout(() => screenShake('light'), 100);
    setTimeout(() => screenShake('light'), 300);
    
    console.log('🎉 Victory effect!');
}

/**
 * Show defeat effect
 */
export function showDefeatEffect() {
    // Heavy shake on defeat
    screenShake('heavy');
    
    console.log('💀 Defeat effect!');
}

/**
 * Show heal effect
 * @param {string} target - 'player' or 'monster'
 * @param {number} healAmount
 */
export function showHealEffect(target, healAmount) {
    if (!canvas) initVisualEffects();
    
    const x = target === 'monster' ? canvas.width * 0.3 : canvas.width * 0.7;
    const y = canvas.height * 0.5;
    
    triggerHealEffect(x, y, healAmount);
}
