/**
 * Skill Tree System
 * Defines all skills, trees, and progression
 */

// Skill Trees Definition
export const SKILL_TREES = {
    COMBAT: {
        id: 'COMBAT',
        name: '🗡️ Combat',
        description: 'Offensive abilities to deal more damage',
        icon: '⚔️',
        color: '#e74c3c'
    },
    DEFENSE: {
        id: 'DEFENSE',
        name: '🛡️ Defense',
        description: 'Defensive abilities to survive longer',
        icon: '🛡️',
        color: '#3498db'
    },
    UTILITY: {
        id: 'UTILITY',
        name: '⭐ Utility',
        description: 'Utility abilities for better rewards',
        icon: '🔮',
        color: '#f39c12'
    }
};

// All Skills Definition
export const SKILLS = {
    // ========================================
    // COMBAT TREE
    // ========================================
    LIFESTEAL: {
        id: 'LIFESTEAL',
        tree: 'COMBAT',
        name: 'Lifesteal',
        icon: '🩸',
        description: 'Heal for a percentage of damage dealt',
        maxRank: 5,
        requires: null,
        cost: (rank) => rank, // 1, 2, 3, 4, 5 points
        effect: (rank) => ({
            lifestealPercent: rank * 3 // 3%, 6%, 9%, 12%, 15%
        }),
        tooltip: (rank) => `Heal for ${rank * 3}% of damage dealt`
    },
    
    DOUBLE_STRIKE: {
        id: 'DOUBLE_STRIKE',
        tree: 'COMBAT',
        name: 'Double Strike',
        icon: '⚔️',
        description: 'Chance to attack twice',
        maxRank: 5,
        requires: null,
        cost: (rank) => rank,
        effect: (rank) => ({
            doubleStrikeChance: rank * 4 // 4%, 8%, 12%, 16%, 20%
        }),
        tooltip: (rank) => `${rank * 4}% chance to attack twice`
    },
    
    EXECUTE: {
        id: 'EXECUTE',
        tree: 'COMBAT',
        name: 'Execute',
        icon: '💀',
        description: 'Bonus damage to low HP enemies',
        maxRank: 5,
        requires: 'LIFESTEAL',
        cost: (rank) => rank,
        effect: (rank) => ({
            executeDamageBonus: rank * 10, // 10%, 20%, 30%, 40%, 50%
            executeThreshold: 0.3 // Below 30% HP
        }),
        tooltip: (rank) => `+${rank * 10}% damage to enemies below 30% HP`
    },
    
    BERSERKER: {
        id: 'BERSERKER',
        tree: 'COMBAT',
        name: 'Berserker',
        icon: '🔥',
        description: 'More damage at low HP',
        maxRank: 5,
        requires: 'DOUBLE_STRIKE',
        cost: (rank) => rank,
        effect: (rank) => ({
            berserkerBonus: rank * 5 // 5%, 10%, 15%, 20%, 25% max
        }),
        tooltip: (rank) => `Up to +${rank * 5}% damage when below 50% HP`
    },
    
    BLOODLUST: {
        id: 'BLOODLUST',
        tree: 'COMBAT',
        name: 'Bloodlust',
        icon: '🧛',
        description: 'Killing enemies increases damage temporarily',
        maxRank: 5,
        requires: 'EXECUTE',
        cost: (rank) => rank,
        effect: (rank) => ({
            bloodlustStacks: rank, // 1-5 max stacks
            bloodlustBonus: 5, // 5% per stack
            bloodlustDuration: 10 // 10 seconds
        }),
        tooltip: (rank) => `Kills grant +5% damage (stacks up to ${rank} times, 10s duration)`
    },
    
    // ========================================
    // DEFENSE TREE
    // ========================================
    DODGE: {
        id: 'DODGE',
        tree: 'DEFENSE',
        name: 'Dodge',
        icon: '💃',
        description: 'Chance to avoid attacks',
        maxRank: 5,
        requires: null,
        cost: (rank) => rank,
        effect: (rank) => ({
            dodgeChance: rank * 3 // 3%, 6%, 9%, 12%, 15%
        }),
        tooltip: (rank) => `${rank * 3}% chance to dodge attacks`
    },
    
    BLOCK: {
        id: 'BLOCK',
        tree: 'DEFENSE',
        name: 'Block',
        icon: '🛡️',
        description: 'Reduce incoming damage',
        maxRank: 5,
        requires: null,
        cost: (rank) => rank,
        effect: (rank) => ({
            blockReduction: rank * 3 // 3%, 6%, 9%, 12%, 15%
        }),
        tooltip: (rank) => `Reduce incoming damage by ${rank * 3}%`
    },
    
    THORNS: {
        id: 'THORNS',
        tree: 'DEFENSE',
        name: 'Thorns',
        icon: '🌵',
        description: 'Reflect damage back to attackers',
        maxRank: 5,
        requires: 'BLOCK',
        cost: (rank) => rank,
        effect: (rank) => ({
            thornsPercent: rank * 8 // 8%, 16%, 24%, 32%, 40%
        }),
        tooltip: (rank) => `Reflect ${rank * 8}% of damage taken`
    },
    
    SECOND_WIND: {
        id: 'SECOND_WIND',
        tree: 'DEFENSE',
        name: 'Second Wind',
        icon: '🌬️',
        description: 'Heal when killing enemies',
        maxRank: 5,
        requires: 'DODGE',
        cost: (rank) => rank,
        effect: (rank) => ({
            healOnKill: rank * 4 // 4, 8, 12, 16, 20 HP
        }),
        tooltip: (rank) => `Heal ${rank * 4} HP on kill`
    },
    
    IRON_SKIN: {
        id: 'IRON_SKIN',
        tree: 'DEFENSE',
        name: 'Iron Skin',
        icon: '🫨',
        description: 'Permanent defense increase',
        maxRank: 5,
        requires: 'THORNS',
        cost: (rank) => rank,
        effect: (rank) => ({
            defenseBonus: rank * 2 // +2, +4, +6, +8, +10 defense
        }),
        tooltip: (rank) => `+${rank * 2} Defense`
    },
    
    // ========================================
    // UTILITY TREE
    // ========================================
    GOLD_FIND: {
        id: 'GOLD_FIND',
        tree: 'UTILITY',
        name: 'Gold Find',
        icon: '💰',
        description: 'Increase gold drops',
        maxRank: 5,
        requires: null,
        cost: (rank) => rank,
        effect: (rank) => ({
            goldBonus: rank * 10 // 10%, 20%, 30%, 40%, 50%
        }),
        tooltip: (rank) => `+${rank * 10}% Gold from monsters`
    },
    
    MAGIC_FIND: {
        id: 'MAGIC_FIND',
        tree: 'UTILITY',
        name: 'Magic Find',
        icon: '✨',
        description: 'Increase rare loot chance',
        maxRank: 5,
        requires: null,
        cost: (rank) => rank,
        effect: (rank) => ({
            rarityBonus: rank * 5 // 5%, 10%, 15%, 20%, 25%
        }),
        tooltip: (rank) => `+${rank * 5}% chance for better loot rarity`
    },
    
    XP_BOOST: {
        id: 'XP_BOOST',
        tree: 'UTILITY',
        name: 'XP Boost',
        icon: '🎓',
        description: 'Increase XP gain',
        maxRank: 5,
        requires: 'MAGIC_FIND',
        cost: (rank) => rank,
        effect: (rank) => ({
            xpBonus: rank * 10 // 10%, 20%, 30%, 40%, 50%
        }),
        tooltip: (rank) => `+${rank * 10}% XP from monsters`
    },
    
    SWIFT_MOVEMENT: {
        id: 'SWIFT_MOVEMENT',
        tree: 'UTILITY',
        name: 'Swift Movement',
        icon: '💨',
        description: 'Faster dungeon exploration',
        maxRank: 5,
        requires: 'GOLD_FIND',
        cost: (rank) => rank,
        effect: (rank) => ({
            movementSpeed: rank * 10 // 10%, 20%, 30%, 40%, 50% faster
        }),
        tooltip: (rank) => `${rank * 10}% faster movement in dungeons`
    },
    
    LUCKY_STRIKE: {
        id: 'LUCKY_STRIKE',
        tree: 'UTILITY',
        name: 'Lucky Strike',
        icon: '🍀',
        description: 'Increased critical hit chance',
        maxRank: 5,
        requires: 'XP_BOOST',
        cost: (rank) => rank,
        effect: (rank) => ({
            critChanceBonus: rank * 2 // 2%, 4%, 6%, 8%, 10%
        }),
        tooltip: (rank) => `+${rank * 2}% Critical Hit Chance`
    }
};

/**
 * Get all skills for a specific tree
 */
export function getSkillsForTree(treeId) {
    return Object.values(SKILLS).filter(skill => skill.tree === treeId);
}

/**
 * Check if a skill can be learned (requirements met)
 */
export function canLearnSkill(skillId, currentSkills) {
    const skill = SKILLS[skillId];
    if (!skill) return false;
    
    // Check if already at max rank
    const currentRank = currentSkills[skillId] || 0;
    if (currentRank >= skill.maxRank) return false;
    
    // Check requirements
    if (skill.requires) {
        const requiredSkill = currentSkills[skill.requires] || 0;
        if (requiredSkill === 0) return false;
    }
    
    return true;
}

/**
 * Calculate total skill points spent
 */
export function getTotalSkillPointsSpent(skills) {
    return Object.values(skills).reduce((sum, rank) => sum + rank, 0);
}

/**
 * Calculate available skill points based on level
 */
export function getAvailableSkillPoints(level, skills) {
    const totalPoints = level - 1; // 1 point per level starting at level 2
    const spentPoints = getTotalSkillPointsSpent(skills);
    return Math.max(0, totalPoints - spentPoints);
}

/**
 * Get all active skill effects
 */
export function getActiveSkillEffects(skills) {
    const effects = {};
    
    Object.entries(skills).forEach(([skillId, rank]) => {
        if (rank > 0) {
            const skill = SKILLS[skillId];
            if (skill) {
                const skillEffects = skill.effect(rank);
                Object.entries(skillEffects).forEach(([key, value]) => {
                    if (effects[key] !== undefined) {
                        effects[key] += value; // Stack additive bonuses
                    } else {
                        effects[key] = value;
                    }
                });
            }
        }
    });
    
    return effects;
}

/**
 * Calculate respec cost (increases with level)
 */
export function getRespecCost(level) {
    return Math.floor(100 * Math.pow(1.5, Math.floor(level / 10)));
}

/**
 * Reset all skills (costs gold)
 */
export function resetSkills(gameState) {
    const cost = getRespecCost(gameState.hero.level);
    
    if (gameState.resources.gold < cost) {
        return {
            success: false,
            message: `Not enough gold! Need ${cost} gold.`
        };
    }
    
    gameState.resources.gold -= cost;
    gameState.skills = {};
    
    return {
        success: true,
        message: `Skills reset! Spent ${cost} gold.`,
        refundedPoints: getTotalSkillPointsSpent(gameState.skills)
    };
}
