/**
 * Combat System
 * Handles combat between hero and monsters
 */

import { gameState } from '../core/game-state.js';

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

        monster.hp -= damage;

        const result = {
            damage,
            isCrit,
            killed: monster.hp <= 0
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
        const baseDamage = monster.attack;
        const damage = Math.max(1, baseDamage - hero.defense);

        hero.hp -= damage;

        return {
            damage,
            killed: hero.hp <= 0
        };
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
