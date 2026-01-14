/**
 * Achievement Definitions
 * All achievements with unlock conditions and rewards
 */

export const ACHIEVEMENT_CATEGORIES = {
    PROGRESS: 'progress',
    COMBAT: 'combat',
    WEALTH: 'wealth',
    MASTERY: 'mastery',
    PRESTIGE: 'prestige',
    SKILLS: 'skills',
    EQUIPMENT: 'equipment',
    MANUAL_RUN: 'manual_run'
};

export const ACHIEVEMENTS = {
    // === PROGRESS ACHIEVEMENTS ===
    first_steps: {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Reach Level 5',
        icon: '🌱',
        category: ACHIEVEMENT_CATEGORIES.PROGRESS,
        condition: (state) => state.hero.level >= 5,
        reward: { gold: 100, gems: 5 },
        hidden: false
    },
    apprentice: {
        id: 'apprentice',
        name: 'Apprentice',
        description: 'Reach Level 10',
        icon: '⚔️',
        category: ACHIEVEMENT_CATEGORIES.PROGRESS,
        condition: (state) => state.hero.level >= 10,
        reward: { gold: 500, gems: 10 },
        hidden: false
    },
    veteran: {
        id: 'veteran',
        name: 'Veteran',
        description: 'Reach Level 20',
        icon: '🛡️',
        category: ACHIEVEMENT_CATEGORIES.PROGRESS,
        condition: (state) => state.hero.level >= 20,
        reward: { gold: 2000, gems: 25, souls: 5 },
        hidden: false
    },
    master: {
        id: 'master',
        name: 'Master',
        description: 'Reach Level 50',
        icon: '👑',
        category: ACHIEVEMENT_CATEGORIES.PROGRESS,
        condition: (state) => state.hero.level >= 50,
        reward: { gold: 10000, gems: 100, souls: 20 },
        hidden: false
    },
    legend: {
        id: 'legend',
        name: 'Legend',
        description: 'Reach Level 100',
        icon: '🎯',
        category: ACHIEVEMENT_CATEGORIES.PROGRESS,
        condition: (state) => state.hero.level >= 100,
        reward: { gold: 50000, gems: 500, souls: 100 },
        hidden: false
    },

    // === COMBAT ACHIEVEMENTS ===
    first_run: {
        id: 'first_run',
        name: 'First Exploration',
        description: 'Complete your first run',
        icon: '🎯',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => state.idle.totalAutoRuns >= 1,
        reward: { gold: 50 },
        hidden: false
    },
    dungeon_explorer: {
        id: 'dungeon_explorer',
        name: 'Dungeon Explorer',
        description: 'Complete 50 runs',
        icon: '🗺️',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => state.idle.totalAutoRuns >= 50,
        reward: { gold: 1000, gems: 10 },
        hidden: false
    },
    dungeon_master: {
        id: 'dungeon_master',
        name: 'Dungeon Master',
        description: 'Complete 100 successful runs',
        icon: '🏆',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => state.idle.successfulRuns >= 100,
        reward: { gold: 5000, gems: 50, souls: 10 },
        hidden: false
    },
    perfectionist: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 90% success rate (min. 50 runs)',
        icon: '⭐',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => {
            const total = state.idle.totalAutoRuns;
            const successful = state.idle.successfulRuns;
            return total >= 50 && (successful / total) >= 0.9;
        },
        reward: { gold: 3000, gems: 30, souls: 15 },
        hidden: false
    },
    unstoppable: {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Complete 500 runs',
        icon: '🔥',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        condition: (state) => state.idle.totalAutoRuns >= 500,
        reward: { gold: 20000, gems: 150, souls: 50 },
        hidden: false
    },

    // === WEALTH ACHIEVEMENTS ===
    penny_pincher: {
        id: 'penny_pincher',
        name: 'Penny Pincher',
        description: 'Earn 1,000 Gold',
        icon: '💰',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.stats.totalGoldEarned >= 1000,
        reward: { gems: 5 },
        hidden: false
    },
    treasure_hunter: {
        id: 'treasure_hunter',
        name: 'Treasure Hunter',
        description: 'Earn 10,000 Gold',
        icon: '💎',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.stats.totalGoldEarned >= 10000,
        reward: { gems: 25, souls: 5 },
        hidden: false
    },
    gold_baron: {
        id: 'gold_baron',
        name: 'Gold Baron',
        description: 'Earn 100,000 Gold',
        icon: '👑',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.stats.totalGoldEarned >= 100000,
        reward: { gems: 100, souls: 25 },
        hidden: false
    },
    gem_collector: {
        id: 'gem_collector',
        name: 'Gem Collector',
        description: 'Collect 100 Gems',
        icon: '💠',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.resources.gems >= 100,
        reward: { gold: 5000, souls: 10 },
        hidden: false
    },
    soul_keeper: {
        id: 'soul_keeper',
        name: 'Soul Keeper',
        description: 'Collect 50 Souls',
        icon: '👻',
        category: ACHIEVEMENT_CATEGORIES.WEALTH,
        condition: (state) => state.resources.souls >= 50,
        reward: { gold: 5000, gems: 25 },
        hidden: false
    },

    // === MASTERY ACHIEVEMENTS ===
    upgrade_novice: {
        id: 'upgrade_novice',
        name: 'Upgrade Novice',
        description: 'Buy your first upgrade',
        icon: '⬆️',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => {
            return Object.values(state.upgrades).some(level => level > 0);
        },
        reward: { gold: 200, gems: 5 },
        hidden: false
    },
    upgrade_enthusiast: {
        id: 'upgrade_enthusiast',
        name: 'Upgrade Enthusiast',
        description: 'Buy 10 upgrade levels',
        icon: '📈',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => {
            const totalLevels = Object.values(state.upgrades).reduce((sum, level) => sum + level, 0);
            return totalLevels >= 10;
        },
        reward: { gold: 1000, gems: 20, souls: 5 },
        hidden: false
    },
    upgrade_master: {
        id: 'upgrade_master',
        name: 'Upgrade Master',
        description: 'Max out an upgrade',
        icon: '✨',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => {
            return Object.values(state.upgrades).some(level => level >= 10);
        },
        reward: { gold: 5000, gems: 50, souls: 20 },
        hidden: false
    },
    completionist: {
        id: 'completionist',
        name: 'Completionist',
        description: 'Max out all upgrades',
        icon: '🌟',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => {
            // Check if all 12 upgrades are at level 10
            const upgradeCount = Object.keys(state.upgrades).length;
            if (upgradeCount < 12) return false;
            return Object.values(state.upgrades).every(level => level >= 10);
        },
        reward: { gold: 50000, gems: 500, souls: 100 },
        hidden: false
    },
    dedicated: {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Play for 1 hour',
        icon: '⏰',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => state.totalPlayTime >= 3600,
        reward: { gold: 1000, gems: 25 },
        hidden: false
    },
    no_life: {
        id: 'no_life',
        name: 'Hardcore Gamer',
        description: 'Play for 10 hours',
        icon: '🎮',
        category: ACHIEVEMENT_CATEGORIES.MASTERY,
        condition: (state) => state.totalPlayTime >= 36000,
        reward: { gold: 25000, gems: 200, souls: 50 },
        hidden: false
    },

    // === PRESTIGE ACHIEVEMENTS (NEW!) ===
    key_finder: {
        id: 'key_finder',
        name: 'Key Finder',
        description: 'Collect your first Dungeon Key',
        icon: '🔑',
        category: ACHIEVEMENT_CATEGORIES.PRESTIGE,
        condition: (state) => (state.stats.totalKeysFound || 0) >= 1,
        reward: { gold: 500, gems: 10 },
        hidden: false
    },
    key_hoarder: {
        id: 'key_hoarder',
        name: 'Key Hoarder',
        description: 'Collect 10 Dungeon Keys',
        icon: '🗝️',
        category: ACHIEVEMENT_CATEGORIES.PRESTIGE,
        condition: (state) => state.resources.dungeonKeys >= 10,
        reward: { gold: 2000, gems: 25, souls: 10 },
        hidden: false
    },
    first_prestige: {
        id: 'first_prestige',
        name: 'Born Again',
        description: 'Perform your first Prestige',
        icon: '✨',
        category: ACHIEVEMENT_CATEGORIES.PRESTIGE,
        condition: (state) => (state.prestige?.count || 0) >= 1,
        reward: { gold: 5000, gems: 50, souls: 20 },
        hidden: false
    },
    prestige_veteran: {
        id: 'prestige_veteran',
        name: 'Prestige Veteran',
        description: 'Prestige 5 times',
        icon: '🔄',
        category: ACHIEVEMENT_CATEGORIES.PRESTIGE,
        condition: (state) => (state.prestige?.count || 0) >= 5,
        reward: { gold: 15000, gems: 100, souls: 50 },
        hidden: false
    },
    prestige_master: {
        id: 'prestige_master',
        name: 'Prestige Master',
        description: 'Prestige 10 times',
        icon: '🌠',
        category: ACHIEVEMENT_CATEGORIES.PRESTIGE,
        condition: (state) => (state.prestige?.count || 0) >= 10,
        reward: { gold: 50000, gems: 250, souls: 100 },
        hidden: false
    },

    // === SKILLS ACHIEVEMENTS (NEW!) ===
    skill_unlocked: {
        id: 'skill_unlocked',
        name: 'Skill Unlocked',
        description: 'Unlock your first skill',
        icon: '🌳',
        category: ACHIEVEMENT_CATEGORIES.SKILLS,
        condition: (state) => {
            const skills = state.skills || {};
            return Object.values(skills).some(level => level > 0);
        },
        reward: { gold: 300, gems: 10 },
        hidden: false
    },
    skill_apprentice: {
        id: 'skill_apprentice',
        name: 'Skill Apprentice',
        description: 'Unlock 5 skills',
        icon: '🌿',
        category: ACHIEVEMENT_CATEGORIES.SKILLS,
        condition: (state) => {
            const skills = state.skills || {};
            const unlockedCount = Object.values(skills).filter(level => level > 0).length;
            return unlockedCount >= 5;
        },
        reward: { gold: 1500, gems: 25, souls: 5 },
        hidden: false
    },
    warrior_path: {
        id: 'warrior_path',
        name: 'Path of the Warrior',
        description: 'Max out all Warrior skills',
        icon: '⚔️',
        category: ACHIEVEMENT_CATEGORIES.SKILLS,
        condition: (state) => {
            const skills = state.skills || {};
            return ['power_strike', 'battle_hardened', 'berserker_rage'].every(id => (skills[id] || 0) >= 3);
        },
        reward: { gold: 5000, gems: 50, souls: 20 },
        hidden: false
    },
    tank_path: {
        id: 'tank_path',
        name: 'Path of the Guardian',
        description: 'Max out all Tank skills',
        icon: '🛡️',
        category: ACHIEVEMENT_CATEGORIES.SKILLS,
        condition: (state) => {
            const skills = state.skills || {};
            return ['iron_skin', 'shield_mastery', 'last_stand'].every(id => (skills[id] || 0) >= 3);
        },
        reward: { gold: 5000, gems: 50, souls: 20 },
        hidden: false
    },
    rogue_path: {
        id: 'rogue_path',
        name: 'Path of the Shadow',
        description: 'Max out all Rogue skills',
        icon: '🗡️',
        category: ACHIEVEMENT_CATEGORIES.SKILLS,
        condition: (state) => {
            const skills = state.skills || {};
            return ['critical_strike', 'swift_reflexes', 'assassinate'].every(id => (skills[id] || 0) >= 3);
        },
        reward: { gold: 5000, gems: 50, souls: 20 },
        hidden: false
    },
    skill_master: {
        id: 'skill_master',
        name: 'Skill Master',
        description: 'Max out all skills in the skill tree',
        icon: '🌲',
        category: ACHIEVEMENT_CATEGORIES.SKILLS,
        condition: (state) => {
            const skills = state.skills || {};
            const allSkills = ['power_strike', 'battle_hardened', 'berserker_rage', 'iron_skin', 'shield_mastery', 'last_stand', 'critical_strike', 'swift_reflexes', 'assassinate'];
            return allSkills.every(id => (skills[id] || 0) >= 3);
        },
        reward: { gold: 25000, gems: 200, souls: 100 },
        hidden: false
    },

    // === EQUIPMENT ACHIEVEMENTS (NEW!) ===
    first_loot: {
        id: 'first_loot',
        name: 'First Loot',
        description: 'Find your first equipment piece',
        icon: '🎁',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const inventory = state.inventory || [];
            return inventory.length >= 1;
        },
        reward: { gold: 500, gems: 10 },
        hidden: false
    },
    equipment_collector: {
        id: 'equipment_collector',
        name: 'Equipment Collector',
        description: 'Collect 5 equipment pieces',
        icon: '🎽',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const inventory = state.inventory || [];
            return inventory.length >= 5;
        },
        reward: { gold: 1000, gems: 20, souls: 5 },
        hidden: false
    },
    fully_equipped: {
        id: 'fully_equipped',
        name: 'Fully Equipped',
        description: 'Equip items in all 3 slots',
        icon: '⚙️',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const equipped = state.equipped || {};
            return equipped.weapon && equipped.armor && equipped.accessory;
        },
        reward: { gold: 1500, gems: 25, souls: 10 },
        hidden: false
    },
    set_bonus_2: {
        id: 'set_bonus_2',
        name: 'Set Synergy',
        description: 'Activate a 2-piece set bonus',
        icon: '🔗',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const equipped = state.equipped || {};
            const items = [equipped.weapon, equipped.armor, equipped.accessory].filter(i => i);
            const setCounts = {};
            items.forEach(item => {
                if (item.setId) setCounts[item.setId] = (setCounts[item.setId] || 0) + 1;
            });
            return Object.values(setCounts).some(count => count >= 2);
        },
        reward: { gold: 2000, gems: 30, souls: 15 },
        hidden: false
    },
    set_bonus_3: {
        id: 'set_bonus_3',
        name: 'Perfect Set',
        description: 'Activate a 3-piece set bonus',
        icon: '🌟',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const equipped = state.equipped || {};
            const items = [equipped.weapon, equipped.armor, equipped.accessory].filter(i => i);
            const setCounts = {};
            items.forEach(item => {
                if (item.setId) setCounts[item.setId] = (setCounts[item.setId] || 0) + 1;
            });
            return Object.values(setCounts).some(count => count >= 3);
        },
        reward: { gold: 5000, gems: 75, souls: 30 },
        hidden: false
    },
    dragon_collector: {
        id: 'dragon_collector',
        name: 'Dragon Collector',
        description: 'Collect all pieces of the Dragon Set',
        icon: '🐉',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const inventory = state.inventory || [];
            const dragonPieces = ['dragon-blade', 'dragon-scale', 'dragon-heart'];
            return dragonPieces.every(piece => inventory.some(item => item.templateId === piece));
        },
        reward: { gold: 3000, gems: 50, souls: 20 },
        hidden: false
    },
    guardian_collector: {
        id: 'guardian_collector',
        name: 'Guardian Collector',
        description: 'Collect all pieces of the Guardian Set',
        icon: '🛡️',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const inventory = state.inventory || [];
            const guardianPieces = ['guardian-mace', 'guardian-plate', 'guardian-ring'];
            return guardianPieces.every(piece => inventory.some(item => item.templateId === piece));
        },
        reward: { gold: 3000, gems: 50, souls: 20 },
        hidden: false
    },
    shadow_collector: {
        id: 'shadow_collector',
        name: 'Shadow Collector',
        description: 'Collect all pieces of the Shadow Set',
        icon: '🌙',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const inventory = state.inventory || [];
            const shadowPieces = ['shadow-blade', 'shadow-cloak', 'shadow-ring'];
            return shadowPieces.every(piece => inventory.some(item => item.templateId === piece));
        },
        reward: { gold: 3000, gems: 50, souls: 20 },
        hidden: false
    },
    assassin_collector: {
        id: 'assassin_collector',
        name: 'Assassin Collector',
        description: 'Collect all pieces of the Assassin Set',
        icon: '🗡️',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const inventory = state.inventory || [];
            const assassinPieces = ['assassin-daggers', 'assassin-leather', 'assassin-pendant'];
            return assassinPieces.every(piece => inventory.some(item => item.templateId === piece));
        },
        reward: { gold: 3000, gems: 50, souls: 20 },
        hidden: false
    },
    legendary_collector: {
        id: 'legendary_collector',
        name: 'Legendary Collector',
        description: 'Collect all pieces from all 4 sets',
        icon: '🏆',
        category: ACHIEVEMENT_CATEGORIES.EQUIPMENT,
        condition: (state) => {
            const inventory = state.inventory || [];
            const allPieces = [
                'dragon-blade', 'dragon-scale', 'dragon-heart',
                'guardian-mace', 'guardian-plate', 'guardian-ring',
                'shadow-blade', 'shadow-cloak', 'shadow-ring',
                'assassin-daggers', 'assassin-leather', 'assassin-pendant'
            ];
            return allPieces.every(piece => inventory.some(item => item.templateId === piece));
        },
        reward: { gold: 25000, gems: 300, souls: 150 },
        hidden: false
    },

    // === MANUAL RUN ACHIEVEMENTS (NEW!) ===
    manual_explorer: {
        id: 'manual_explorer',
        name: 'Manual Explorer',
        description: 'Complete your first manual dungeon run',
        icon: '🎮',
        category: ACHIEVEMENT_CATEGORIES.MANUAL_RUN,
        condition: (state) => (state.stats.manualRunsCompleted || 0) >= 1,
        reward: { gold: 500, gems: 15 },
        hidden: false
    },
    difficulty_master: {
        id: 'difficulty_master',
        name: 'Difficulty Master',
        description: 'Complete a manual run on Hard difficulty',
        icon: '🔥',
        category: ACHIEVEMENT_CATEGORIES.MANUAL_RUN,
        condition: (state) => (state.stats.hardRunsCompleted || 0) >= 1,
        reward: { gold: 2000, gems: 40, souls: 15 },
        hidden: false
    },
    nightmare_survivor: {
        id: 'nightmare_survivor',
        name: 'Nightmare Survivor',
        description: 'Complete a manual run on Nightmare difficulty',
        icon: '💀',
        category: ACHIEVEMENT_CATEGORIES.MANUAL_RUN,
        condition: (state) => (state.stats.nightmareRunsCompleted || 0) >= 1,
        reward: { gold: 10000, gems: 100, souls: 50 },
        hidden: false
    }
};

/**
 * Get all achievements as array
 */
export function getAllAchievements() {
    return Object.values(ACHIEVEMENTS);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category) {
    return getAllAchievements().filter(a => a.category === category);
}
