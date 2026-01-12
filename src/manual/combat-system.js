/**
 * Combat System
 * Handles combat between hero and monsters
 */

import { gameState, saveGame } from '../core/game-state.js';
import { 
    shouldUseBossAbility, 
    selectBossAbility, 
    telegraphBossAbility,
    executeBossAbility,
    processBossTurn,
    calculateDamageToBoss
} from './boss-abilities.js';
import {
    calculateSkillModifiedDamage,
    shouldDoubleStrike,
    applyLifesteal,
    shouldDodgeAttack,
    applyBlockReduction,
    calculateThornsDamage,
    applySecondWind,
    getDefenseBonus,
    calculateGoldBonus,
    calculateXPBonus,
    getCritChanceBonus,
    addBloodlustStack
} from '../skills/skill-effects.js';

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
        
        // Calculate crit with skill bonus
        const totalCritChance = hero.critChance + getCritChanceBonus();
        const isCrit = Math.random() < totalCritChance;
        
        let damage = hero.attack;

        if (isCrit) {
            damage = Math.floor(damage * hero.critMultiplier);
        }
        
        // Apply skill-modified damage (execute, berserker, bloodlust)
        const targetHpPercent = monster.hp / monster.maxHp;
        damage = calculateSkillModifiedDamage(damage, targetHpPercent);

        // Apply boss shield if active
        if (monster.isBoss && monster.shielded) {
            damage = calculateDamageToBoss(monster, damage);
        }

        monster.hp -= damage;
        
        // Apply lifesteal
        const lifestealHealing = applyLifesteal(damage);

        const result = {
            damage,
            isCrit,
            killed: monster.hp <= 0,
            shieldBlocked: monster.isBoss && monster.shielded,
            lifesteal: lifestealHealing,
            doubleStrike: false
        };

        if (result.killed) {
            monster.alive = false;
            
            // Calculate XP with skill bonus
            const xpGained = calculateXPBonus(monster.xp);
            hero.xp += xpGained;
            
            // Calculate gold with skill bonus
            const goldGained = calculateGoldBonus(monster.gold);
            gameState.resources.gold += goldGained;
            
            // Apply Second Wind (heal on kill)
            const secondWindHealing = applySecondWind();
            if (secondWindHealing > 0) {
                result.secondWind = secondWindHealing;
            }
            
            // Add Bloodlust stack
            const bloodlustAdded = addBloodlustStack();
            if (bloodlustAdded) {
                result.bloodlust = true;
            }
            
            // Update stats
            gameState.stats.totalMonstersKilled++;
            
            this.checkLevelUp();
        }
        
        // Check for double strike (after first hit)
        if (!result.killed && shouldDoubleStrike()) {
            result.doubleStrike = true;
            
            // Second attack with same logic
            let secondDamage = hero.attack;
            if (isCrit) {
                secondDamage = Math.floor(secondDamage * hero.critMultiplier);
            }
            secondDamage = calculateSkillModifiedDamage(secondDamage, monster.hp / monster.maxHp);
            
            if (monster.isBoss && monster.shielded) {
                secondDamage = calculateDamageToBoss(monster, secondDamage);
            }
            
            monster.hp -= secondDamage;
            result.damage += secondDamage;
            
            // Lifesteal from second hit
            const secondLifesteal = applyLifesteal(secondDamage);
            result.lifesteal += secondLifesteal;
            
            // Check if second hit killed
            if (monster.hp <= 0 && !result.killed) {
                result.killed = true;
                monster.alive = false;
                
                const xpGained = calculateXPBonus(monster.xp);
                hero.xp += xpGained;
                
                const goldGained = calculateGoldBonus(monster.gold);
                gameState.resources.gold += goldGained;
                
                const secondWindHealing = applySecondWind();
                if (secondWindHealing > 0) {
                    result.secondWind = secondWindHealing;
                }
                
                const bloodlustAdded = addBloodlustStack();
                if (bloodlustAdded) {
                    result.bloodlust = true;
                }
                
                gameState.stats.totalMonstersKilled++;
                this.checkLevelUp();
            }
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
                    // Apply defense with skill bonus
                    const totalDefense = hero.defense + getDefenseBonus();
                    let actualDamage = Math.max(1, abilityResult.damage - totalDefense);
                    
                    // Apply block reduction
                    actualDamage = applyBlockReduction(actualDamage);
                    
                    hero.hp -= actualDamage;
                    
                    // Calculate thorns damage
                    const thornsDamage = calculateThornsDamage(actualDamage);
                    if (thornsDamage > 0) {
                        monster.hp -= thornsDamage;
                        if (monster.hp <= 0) {
                            monster.alive = false;
                        }
                    }
                    
                    return {
                        damage: actualDamage,
                        killed: hero.hp <= 0,
                        isCrit: abilityResult.isCrit,
                        isAbility: true,
                        abilityMessage: abilityResult.message,
                        thorns: thornsDamage
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
        
        // Check for dodge
        if (shouldDodgeAttack()) {
            return {
                damage: 0,
                killed: false,
                dodged: true
            };
        }
        
        // Normal attack
        const baseDamage = monster.attack;
        const totalDefense = hero.defense + getDefenseBonus();
        let damage = Math.max(1, baseDamage - totalDefense);
        
        // Apply block reduction
        damage = applyBlockReduction(damage);

        hero.hp -= damage;
        
        // Calculate thorns damage
        const thornsDamage = calculateThornsDamage(damage);
        if (thornsDamage > 0) {
            monster.hp -= thornsDamage;
            if (monster.hp <= 0) {
                monster.alive = false;
            }
        }

        return {
            damage,
            killed: hero.hp <= 0,
            thorns: thornsDamage
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
        let leveledUp = false;
        
        while (hero.xp >= hero.maxXp) {
            hero.xp -= hero.maxXp;
            hero.level++;
            hero.maxXp = Math.floor(hero.maxXp * 1.5);
            
            // Level up bonuses
            hero.maxHp += 10;
            hero.hp = hero.maxHp; // Full heal on level up
            hero.attack += 2;
            hero.defense += 1;
            
            leveledUp = true;

            console.log(`🎉 Level Up! Now level ${hero.level}`);
            console.log(`🌳 Skill point available! (${hero.level - 1} total)`);
        }
        
        if (leveledUp) {
            saveGame(); // Save after level up
        }
    }
}
