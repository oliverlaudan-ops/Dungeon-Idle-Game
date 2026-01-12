/**
 * Combat Visual Effects
 * Adds visual feedback for combat actions
 * 
 * Features:
 * - Floating damage numbers
 * - Screen shake on hits
 * - Critical hit effects
 * - Hit flash animations
 */

// Active effects storage
const activeEffects = {
    damageNumbers: [],
    screenShake: { active: false, intensity: 0, duration: 0, offsetX: 0, offsetY: 0, startTime: 0 },
    hitFlashes: []
};

/**
 * Floating Damage Number Class
 */
class DamageNumber {
    constructor(x, y, damage, isCrit = false, isHeal = false) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.damage = damage;
        this.isCrit = isCrit;
        this.isHeal = isHeal;
        this.lifetime = 0;
        this.maxLifetime = 1000; // 1 second
        this.alpha = 1.0;
        this.scale = isCrit ? 1.5 : 1.0;
        this.velocity = isCrit ? -80 : -50; // Pixels per second upward
    }
    
    update(deltaTime) {
        this.lifetime += deltaTime;
        
        // Move upward
        this.y += this.velocity * (deltaTime / 1000);
        
        // Fade out in last 30% of lifetime
        if (this.lifetime > this.maxLifetime * 0.7) {
            this.alpha = 1.0 - ((this.lifetime - this.maxLifetime * 0.7) / (this.maxLifetime * 0.3));
        }
        
        // Scale down crits over time
        if (this.isCrit && this.lifetime < 200) {
            this.scale = 1.5 + Math.sin((this.lifetime / 200) * Math.PI) * 0.3;
        }
        
        return this.lifetime < this.maxLifetime;
    }
    
    render(ctx) {
        ctx.save();
        
        ctx.globalAlpha = this.alpha;
        ctx.font = `bold ${Math.floor(24 * this.scale)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Color based on type
        if (this.isHeal) {
            ctx.fillStyle = '#2ecc71'; // Green for heals
        } else if (this.isCrit) {
            ctx.fillStyle = '#f39c12'; // Orange for crits
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            ctx.strokeText(this.damage.toString(), this.x, this.y);
        } else {
            ctx.fillStyle = '#fff'; // White for normal damage
        }
        
        // Draw text
        ctx.fillText(this.damage.toString(), this.x, this.y);
        
        // Add prefix for special types
        if (this.isCrit) {
            ctx.font = `bold ${Math.floor(12 * this.scale)}px Arial`;
            ctx.fillStyle = '#f39c12';
            ctx.fillText('CRIT!', this.x, this.y - 20 * this.scale);
        } else if (this.isHeal) {
            ctx.fillText('+', this.x - 15, this.y);
        }
        
        ctx.restore();
    }
}

/**
 * Hit Flash Class (entity flash when hit)
 */
class HitFlash {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.lifetime = 0;
        this.maxLifetime = 150; // 150ms flash
        this.alpha = 0.6;
    }
    
    update(deltaTime) {
        this.lifetime += deltaTime;
        this.alpha = 0.6 * (1 - (this.lifetime / this.maxLifetime));
        return this.lifetime < this.maxLifetime;
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

/**
 * Add a floating damage number
 */
export function addDamageNumber(x, y, damage, isCrit = false, isHeal = false) {
    // Add some random offset so numbers don't stack perfectly
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 10;
    
    activeEffects.damageNumbers.push(
        new DamageNumber(x + offsetX, y + offsetY, damage, isCrit, isHeal)
    );
}

/**
 * Trigger screen shake effect
 */
export function triggerScreenShake(intensity = 5, duration = 200) {
    activeEffects.screenShake.active = true;
    activeEffects.screenShake.intensity = intensity;
    activeEffects.screenShake.duration = duration;
    activeEffects.screenShake.startTime = Date.now();
}

/**
 * Add hit flash effect
 */
export function addHitFlash(x, y, width, height) {
    activeEffects.hitFlashes.push(new HitFlash(x, y, width, height));
}

/**
 * Update all active effects
 */
export function updateEffects(deltaTime) {
    // Update damage numbers
    activeEffects.damageNumbers = activeEffects.damageNumbers.filter(number => 
        number.update(deltaTime)
    );
    
    // Update screen shake
    if (activeEffects.screenShake.active) {
        const elapsed = Date.now() - activeEffects.screenShake.startTime;
        
        if (elapsed < activeEffects.screenShake.duration) {
            const progress = elapsed / activeEffects.screenShake.duration;
            const intensity = activeEffects.screenShake.intensity * (1 - progress);
            
            activeEffects.screenShake.offsetX = (Math.random() - 0.5) * intensity * 2;
            activeEffects.screenShake.offsetY = (Math.random() - 0.5) * intensity * 2;
        } else {
            activeEffects.screenShake.active = false;
            activeEffects.screenShake.offsetX = 0;
            activeEffects.screenShake.offsetY = 0;
        }
    }
    
    // Update hit flashes
    activeEffects.hitFlashes = activeEffects.hitFlashes.filter(flash => 
        flash.update(deltaTime)
    );
}

/**
 * Render all active effects
 */
export function renderEffects(ctx) {
    // Render hit flashes
    activeEffects.hitFlashes.forEach(flash => flash.render(ctx));
    
    // Render damage numbers
    activeEffects.damageNumbers.forEach(number => number.render(ctx));
}

/**
 * Get current screen shake offset
 */
export function getScreenShakeOffset() {
    return {
        x: activeEffects.screenShake.offsetX,
        y: activeEffects.screenShake.offsetY
    };
}

/**
 * Clear all effects
 */
export function clearAllEffects() {
    activeEffects.damageNumbers = [];
    activeEffects.hitFlashes = [];
    activeEffects.screenShake.active = false;
    activeEffects.screenShake.offsetX = 0;
    activeEffects.screenShake.offsetY = 0;
}

/**
 * Trigger a critical hit effect combo
 */
export function triggerCritEffect(x, y, damage) {
    addDamageNumber(x, y, damage, true, false);
    triggerScreenShake(8, 250);
    addHitFlash(x - 20, y - 20, 80, 80);
}

/**
 * Trigger a normal hit effect combo
 */
export function triggerHitEffect(x, y, damage) {
    addDamageNumber(x, y, damage, false, false);
    triggerScreenShake(3, 150);
    addHitFlash(x - 20, y - 20, 80, 80);
}

/**
 * Trigger a heal effect
 */
export function triggerHealEffect(x, y, healAmount) {
    addDamageNumber(x, y, healAmount, false, true);
}
