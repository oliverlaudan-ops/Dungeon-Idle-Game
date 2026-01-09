/**
 * Skill System v1.0
 * Hero skills earned through leveling, improved with Skill Points
 * Integrates with Equipment Classes for unique skill trees
 */

import { gameState } from '../core/game-state.js';
import { getHeroClass } from './equipment-system.js';

// Base Skill Points gained per level
const SKILL_POINTS_PER_LEVEL = 1;
const STARTING_SKILL_POINTS = 0;

/**
 * Available Skills by Class
 * Each class has unique abilities
 */
const CLASS_SKILLS = {
    WARRIOR: [
        {
            id: 'shield-bash',
            name: 'Shield Bash',
            icon: '🛡️',
            description: 'Powerful defensive counter',
            maxLevel: 5,
            cost: 1,  // Skill Points per upgrade
            effects: {
                1: { damage: 1.2, defense: '+10%' },
                2: { damage: 1.4, defense: '+15%' },
                3: { damage: 1.6, defense: '+20%' },
                4: { damage: 1.8, defense: '+25%' },
                5: { damage: 2.0, defense: '+30%' }
            }
        },
        {
            id: 'iron-skin',
            name: 'Iron Skin',
            icon: '🛡️',
            description: 'Harden your body against damage',
            maxLevel: 3,
            cost: 1,
            effects: {
                1: { defense: '+15%', cost: 10 },
                2: { defense: '+25%', cost: 15 },
                3: { defense: '+40%', cost: 20 }
            }
        }
    ],
    RANGER: [
        {
            id: 'rapid-fire',
            name: 'Rapid Fire',
            icon: '🏹',
            description: 'Attack multiple times in quick succession',
            maxLevel: 5,
            cost: 1,
            effects: {
                1: { hits: 2, damage: 0.9 },
                2: { hits: 3, damage: 0.85 },
                3: { hits: 4, damage: 0.8 },
                4: { hits: 5, damage: 0.75 },
                5: { hits: 6, damage: 0.7 }
            }
        },
        {
            id: 'piercing-shot',
            name: 'Piercing Shot',
            icon: '💥',
            description: 'Ignore enemy defense',
            maxLevel: 3,
            cost: 1,
            effects: {
                1: { damage: 1.5, ignore_def: '25%' },
                2: { damage: 1.75, ignore_def: '50%' },
                3: { damage: 2.0, ignore_def: '75%' }
            }
        }
    ],
    BERSERKER: [
        {
            id: 'whirlwind',
            name: 'Whirlwind',
            icon: '🔨',
            description: 'Spin attack hitting all enemies',
            maxLevel: 4,
            cost: 1,
            effects: {
                1: { damage: 1.8, rage: 10 },
                2: { damage: 2.2, rage: 15 },
                3: { damage: 2.6, rage: 20 },
                4: { damage: 3.0, rage: 25 }
            }
        },
        {
            id: 'berserk',
            name: 'Berserk',
            icon: '🔥',
            description: 'Enrage yourself for massive damage',
            maxLevel: 3,
            cost: 2,
            effects: {
                1: { damage: '+50%', defense: '-20%', duration: 3 },
                2: { damage: '+100%', defense: '-10%', duration: 4 },
                3: { damage: '+150%', defense: '+0%', duration: 5 }
            }
        }
    ],
    MAGE: [
        {
            id: 'fireball',
            name: 'Fireball',
            icon: '🔥',
            description: 'Cast a fireball spell',
            maxLevel: 5,
            cost: 1,
            effects: {
                1: { damage: 1.5, mana: 20 },
                2: { damage: 1.8, mana: 25 },
                3: { damage: 2.2, mana: 30 },
                4: { damage: 2.6, mana: 35 },
                5: { damage: 3.0, mana: 40 }
            }
        },
        {
            id: 'healing-light',
            name: 'Healing Light',
            icon: '✨',
            description: 'Restore health over time',
            maxLevel: 3,
            cost: 1,
            effects: {
                1: { heal: 30, mana: 15 },
                2: { heal: 50, mana: 20 },
                3: { heal: 80, mana: 25 }
            }
        }
    ],
    ROGUE: [
        {
            id: 'backstab',
            name: 'Backstab',
            icon: '🗡️',
            description: 'Critical strike from the shadows',
            maxLevel: 5,
            cost: 1,
            effects: {
                1: { damage: 2.0, crit_bonus: '+20%' },
                2: { damage: 2.5, crit_bonus: '+30%' },
                3: { damage: 3.0, crit_bonus: '+40%' },
                4: { damage: 3.5, crit_bonus: '+50%' },
                5: { damage: 4.0, crit_bonus: '+60%' }
            }
        },
        {
            id: 'shadow-clone',
            name: 'Shadow Clone',
            icon: '🐀',
            description: 'Create a clone to confuse enemies',
            maxLevel: 3,
            cost: 2,
            effects: {
                1: { dodge: '+25%', duration: 2 },
                2: { dodge: '+50%', duration: 3 },
                3: { dodge: '+75%', duration: 4 }
            }
        }
    ]
};

/**
 * Initialize skill system for hero
 */
export function initializeSkillSystem() {
    if (!gameState.skills) {
        gameState.skills = {};
    }
    if (!gameState.skillPoints) {
        gameState.skillPoints = STARTING_SKILL_POINTS;
    }
    
    // Initialize all skill levels to 0
    const heroClass = getHeroClass() || 'WARRIOR';
    const skills = CLASS_SKILLS[heroClass] || [];
    
    skills.forEach(skill => {
        if (!gameState.skills[skill.id]) {
            gameState.skills[skill.id] = 0;
        }
    });
}

/**
 * Add skill points on level up
 */
export function addSkillPointsOnLevelUp() {
    gameState.skillPoints = (gameState.skillPoints || 0) + SKILL_POINTS_PER_LEVEL;
    return gameState.skillPoints;
}

/**
 * Upgrade a skill
 */
export function upgradeSkill(skillId) {
    const heroClass = getHeroClass() || 'WARRIOR';
    const skills = CLASS_SKILLS[heroClass] || [];
    const skill = skills.find(s => s.id === skillId);
    
    if (!skill) {
        console.warn(`Skill not found: ${skillId}`);
        return false;
    }
    
    const currentLevel = gameState.skills[skillId] || 0;
    
    // Check if max level reached
    if (currentLevel >= skill.maxLevel) {
        return false;
    }
    
    // Check if enough skill points
    if ((gameState.skillPoints || 0) < skill.cost) {
        return false;
    }
    
    // Upgrade skill
    gameState.skills[skillId] = currentLevel + 1;
    gameState.skillPoints -= skill.cost;
    
    console.log(`✍️ Upgraded ${skill.name} to Level ${currentLevel + 1}`);
    return true;
}

/**
 * Get current skill level
 */
export function getSkillLevel(skillId) {
    return gameState.skills[skillId] || 0;
}

/**
 * Get skill details by ID
 */
export function getSkillDetails(skillId) {
    const heroClass = getHeroClass() || 'WARRIOR';
    const skills = CLASS_SKILLS[heroClass] || [];
    return skills.find(s => s.id === skillId);
}

/**
 * Get all skills for current class
 */
export function getClassSkills() {
    const heroClass = getHeroClass() || 'WARRIOR';
    return CLASS_SKILLS[heroClass] || [];
}

/**
 * Get skill effect at current level
 */
export function getSkillEffect(skillId) {
    const skill = getSkillDetails(skillId);
    if (!skill) return null;
    
    const level = getSkillLevel(skillId);
    if (level === 0) return null;
    
    return skill.effects[level] || null;
}

/**
 * Calculate skill damage bonus
 */
export function calculateSkillDamage(baseAttack, skillId) {
    const effect = getSkillEffect(skillId);
    if (!effect || !effect.damage) return baseAttack;
    
    if (typeof effect.damage === 'string') {
        // Percentage bonus like '+50%'
        const percent = parseInt(effect.damage) / 100;
        return baseAttack * (1 + percent);
    }
    
    // Multiplier
    return baseAttack * effect.damage;
}

/**
 * Get hero stats with skill bonuses
 */
export function getHeroStatsWithSkills(baseAttack, baseDefense, baseHP) {
    let finalAttack = baseAttack;
    let finalDefense = baseDefense;
    let finalHP = baseHP;
    
    const skills = getClassSkills();
    
    skills.forEach(skill => {
        const effect = getSkillEffect(skill.id);
        if (!effect) return;
        
        // Apply defense bonuses
        if (effect.defense) {
            if (typeof effect.defense === 'string' && effect.defense.includes('%')) {
                const percent = parseInt(effect.defense) / 100;
                finalDefense *= (1 + percent);
            }
        }
        
        // Apply HP bonuses
        if (effect.hp) {
            finalHP += effect.hp;
        }
    });
    
    return {
        attack: Math.floor(finalAttack),
        defense: Math.floor(finalDefense),
        hp: Math.floor(finalHP)
    };
}

/**
 * Get skill point status
 */
export function getSkillPointStatus() {
    return {
        available: gameState.skillPoints || 0,
        used: getTotalUsedSkillPoints(),
        total: getTotalEarnedSkillPoints()
    };
}

/**
 * Calculate total earned skill points
 */
export function getTotalEarnedSkillPoints() {
    const level = gameState.hero?.level || 1;
    return level * SKILL_POINTS_PER_LEVEL;
}

/**
 * Calculate total used skill points
 */
export function getTotalUsedSkillPoints() {
    let used = 0;
    const skills = getClassSkills();
    
    skills.forEach(skill => {
        const level = getSkillLevel(skill.id);
        used += level * skill.cost;
    });
    
    return used;
}

/**
 * Export skills for hero tab display
 */
export function getSkillTreeForDisplay() {
    const skills = getClassSkills();
    const skillPoints = getSkillPointStatus();
    
    return {
        class: getHeroClass(),
        available: skillPoints.available,
        skills: skills.map(skill => ({
            ...skill,
            level: getSkillLevel(skill.id),
            canUpgrade: (skillPoints.available >= skill.cost && 
                        getSkillLevel(skill.id) < skill.maxLevel),
            effect: getSkillEffect(skill.id)
        }))
    };
}
