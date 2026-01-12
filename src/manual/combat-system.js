/**
 * Combat System
 * Handles combat between hero and monsters
 */

import { gameState } from '../core/game-state.js';
import { 
    shouldUseBossAbility, 
    selectBossAbility, 
    telegraphBossAbility,
    executeBossAbility,
    processBossTurn,
    calculateDamageToBoss
} from './boss-abilities.js';

export class CombatSystem {
    constructor() {
        this.lastCombatTime = 0;
        this.combatCooldown = 500; // ms between attacks
    }

    canAttack() {
        const now = Date.now();
        if (now - this.lastCombatTime < this.combatCooldown) {
            return false;
        }
        this.lastCombatTime = now;
        return true;
    }

    heroAttack(monster) {
        if (!this.canAttack()) return null;

        const hero = gameState.hero;
        const isCrit = Math.random() < hero.critChance;
        let damage = hero.attack;

        if (isCrit) {
            damage = Math.floor(damage * hero.critMultiplier);
        }

        // Apply boss shield if active
        if (monster.isBoss && monster.shielded) {
            damage = calculateDamageToBoss(monster, damage);
        }

        monster.hp -= damage;

        const result = {
            damage,
            isCrit,
            killed: monster.hp <= 0,
            shieldBlocked: monster.isBoss && monster.shielded
        };

        if (result.killed) {
            monster.alive = false;
            hero.xp += monster.xp;
            gameState.resources.gold += monster.gold;
            this.checkLevelUp();
        }

        return result;
    }

    monsterAttack(monster) {
        const hero = gameState.hero;
        
        // Check if boss should use special ability
        if (monster.isBoss && monster.telegraphing) {
            // Execute telegraphed ability
            const abilityResult = executeBossAbility(monster, hero);
            if (abilityResult) {
                if (abilityResult.damage > 0) {
                    const actualDamage = Math.max(1, abilityResult.damage - hero.defense);
                    hero.hp -= actualDamage;
                    
                    return {
                        damage: actualDamage,
                        killed: hero.hp <= 0,
                        isCrit: abilityResult.isCrit,
                        isAbility: true,
                        abilityMessage: abilityResult.message
                    };
                } else if (abilityResult.heal) {
                    // Boss healed
                    return {
                        damage: 0,
                        killed: false,
                        heal: abilityResult.heal,
                        isAbility: true,
                        abilityMessage: abilityResult.message
                    };
                } else if (abilityResult.shield) {
                    // Boss activated shield
                    return {
                        damage: 0,
                        killed: false,
                        shield: true,
                        isAbility: true,
                        abilityMessage: abilityResult.message
                    };
                }
            }
        } else if (monster.isBoss && shouldUseBossAbility(monster)) {
            // Telegraph new ability
            const abilityKey = selectBossAbility(monster);
            if (abilityKey) {
                const telegraph = telegraphBossAbility(monster, abilityKey);
                if (telegraph) {
                    return {
                        damage: 0,
                        killed: false,
                        telegraph: true,
                        telegraphMessage: telegraph.message
                    };
                }
            }
        }
        
        // Normal attack
        const baseDamage = monster.attack;
        const damage = Math.max(1, baseDamage - hero.defense);

        hero.hp -= damage;

        return {
            damage,
            killed: hero.hp <= 0
        };
    }
    
    processBossTurn(monster) {
        if (monster.isBoss) {
            return processBossTurn(monster);
        }
        return null;
    }

    checkLevelUp() {
        const hero = gameState.hero;
        while (hero.xp >= hero.maxXp) {
            hero.xp -= hero.maxXp;
            hero.level++;
            hero.maxXp = Math.floor(hero.maxXp * 1.5);
            
            // Level up bonuses
            hero.maxHp += 10;
            hero.hp = hero.maxHp; // Full heal on level up
            hero.attack += 2;
            hero.defense += 1;

            console.log(`🎉 Level Up! Now level ${hero.level}`);
        }
    }
}
