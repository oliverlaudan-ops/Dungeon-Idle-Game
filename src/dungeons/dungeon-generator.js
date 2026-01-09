/**
 * Dungeon Generator v2.2
 * Generates procedural dungeons with:
 * - Difficulty Scaling (Easy, Normal, Hard, Expert)
 * - Longer Dungeons (5-15 rooms depending on difficulty)
 * - Boss Encounters (every 5 rooms)
 * - Monster Scaling based on floor and difficulty
 * - Boss AI initialization
 */

import { gameState } from '../core/game-state.js';
import { initBossAI } from '../manual-run/boss-abilities.js';

// Difficulty configuration
const DIFFICULTY_CONFIG = {
    easy: {
        roomCount: { min: 5, max: 8 },
        monsterMult: 0.75,
        bossMult: 0.8,
        goldMult: 1.0,
        xpMult: 1.0,
        bossInterval: 5
    },
    normal: {
        roomCount: { min: 7, max: 10 },
        monsterMult: 1.2,
        bossMult: 1.0,
        goldMult: 1.5,
        xpMult: 1.5,
        bossInterval: 5
    },
    hard: {
        roomCount: { min: 10, max: 13 },
        monsterMult: 1.6,
        bossMult: 1.3,
        goldMult: 2.5,
        xpMult: 2.5,
        bossInterval: 4
    },
    expert: {
        roomCount: { min: 12, max: 15 },
        monsterMult: 2.0,
        bossMult: 1.6,
        goldMult: 4.0,
        xpMult: 4.0,
        bossInterval: 3
    }
};

// Boss types
const BOSS_TYPES = [
    { name: 'Dragon Lord', icon: '🐉', hpMult: 4.0, atkMult: 3.0, xpMult: 5.0, goldMult: 5.0 },
    { name: 'Lich King', icon: '👑', hpMult: 3.5, atkMult: 3.5, xpMult: 5.0, goldMult: 5.0 },
    { name: 'Giant Golem', icon: '🗿', hpMult: 5.0, atkMult: 2.0, xpMult: 5.0, goldMult: 5.0 },
    { name: 'Dark Sorcerer', icon: '🧙', hpMult: 2.5, atkMult: 4.0, xpMult: 5.0, goldMult: 5.0 },
    { name: 'Ancient Wyvern', icon: '🐍', hpMult: 4.5, atkMult: 3.5, xpMult: 5.0, goldMult: 5.0 }
];

// Regular monster types
const MONSTER_TYPES = [
    { name: 'Goblin', icon: '👺', hpMult: 1.0, atkMult: 1.0, xpMult: 1.0, goldMult: 1.0 },
    { name: 'Skeleton', icon: '💀', hpMult: 0.8, atkMult: 1.2, xpMult: 0.9, goldMult: 0.8 },
    { name: 'Orc', icon: '👹', hpMult: 1.5, atkMult: 0.9, xpMult: 1.3, goldMult: 1.5 },
    { name: 'Ghost', icon: '👻', hpMult: 0.6, atkMult: 1.3, xpMult: 1.1, goldMult: 0.7 },
    { name: 'Spider', icon: '🕷️', hpMult: 0.7, atkMult: 1.1, xpMult: 0.8, goldMult: 0.9 },
    { name: 'Zombie', icon: '🧟', hpMult: 1.2, atkMult: 0.8, xpMult: 1.0, goldMult: 1.0 },
    { name: 'Troll', icon: '👺', hpMult: 2.0, atkMult: 1.5, xpMult: 2.0, goldMult: 2.0 }
];

/**
 * Generate a dungeon with difficulty scaling
 * @param {number} floor - Dungeon floor/level
 * @param {string} difficulty - 'easy', 'normal', 'hard', 'expert'
 * @returns {Object} Generated dungeon
 */
export function generateDungeon(floor = 1, difficulty = 'normal') {
    // Validate difficulty
    if (!DIFFICULTY_CONFIG[difficulty]) {
        console.warn(`❌ Unknown difficulty: ${difficulty}, defaulting to 'normal'`);
        difficulty = 'normal';
    }

    const config = DIFFICULTY_CONFIG[difficulty];
    const minRooms = config.roomCount.min;
    const maxRooms = config.roomCount.max;
    const numRooms = minRooms + Math.floor(Math.random() * (maxRooms - minRooms + 1));

    const rooms = [];
    let currentX = 0;
    let currentY = 0;

    for (let i = 0; i < numRooms; i++) {
        let room;
        
        // Check if this should be a boss room
        const isBossRoom = (i > 0) && ((i + 1) % config.bossInterval === 0);
        
        if (isBossRoom) {
            room = generateBossRoom(floor, i, currentX, currentY, difficulty);
        } else {
            room = generateRoom(floor, i, currentX, currentY, difficulty);
        }
        
        rooms.push(room);

        // Move to next room position (staggered layout)
        currentX += room.width + 2;
        if (i % 2 === 1) {
            currentY += Math.random() > 0.5 ? 2 : -2;
        }
    }

    // Add doors between rooms
    for (let i = 0; i < rooms.length - 1; i++) {
        addDoorBetweenRooms(rooms[i], rooms[i + 1], i + 1);
    }

    return {
        floor,
        difficulty,
        rooms,
        totalRooms: numRooms,
        completed: false,
        bossCount: Math.floor(numRooms / config.bossInterval)
    };
}

/**
 * Generate a regular room
 */
function generateRoom(floor, roomIndex, x, y, difficulty) {
    const width = 8 + Math.floor(Math.random() * 4); // 8-11 tiles wide
    const height = 6 + Math.floor(Math.random() * 3); // 6-8 tiles tall
    const config = DIFFICULTY_CONFIG[difficulty];

    const room = {
        id: roomIndex,
        x,
        y,
        width,
        height,
        isBoss: false,
        cleared: roomIndex === 0, // First room is always cleared (safe spawn)
        looted: false,
        monsters: [],
        treasure: null,
        doors: []
    };

    // Add monsters (not in first room)
    if (roomIndex > 0) {
        const numMonsters = 1 + Math.floor(Math.random() * 3); // 1-3 monsters
        for (let i = 0; i < numMonsters; i++) {
            room.monsters.push(
                generateMonster(floor, room, difficulty, config.monsterMult)
            );
        }
    }

    // Add treasure (random chance, higher in later rooms and harder difficulties)
    const treasureChance = 0.3 + roomIndex * 0.08 + (difficulty === 'hard' ? 0.1 : difficulty === 'expert' ? 0.15 : 0);
    if (roomIndex > 0 && Math.random() < treasureChance) {
        room.treasure = generateTreasure(floor, room, difficulty, config.goldMult, config.xpMult);
    }

    return room;
}

/**
 * Generate a boss room
 */
function generateBossRoom(floor, roomIndex, x, y, difficulty) {
    const width = 12; // Larger room for boss
    const height = 10;
    const config = DIFFICULTY_CONFIG[difficulty];

    const room = {
        id: roomIndex,
        x,
        y,
        width,
        height,
        isBoss: true,
        cleared: false,
        looted: false,
        monsters: [],
        treasure: null,
        doors: []
    };

    // Add boss monster
    const boss = generateBoss(floor, room, difficulty, config.bossMult);
    room.monsters.push(boss);

    // Boss room always has treasure
    room.treasure = generateBossTreasure(floor, room, difficulty, config.goldMult, config.xpMult);

    return room;
}

/**
 * Generate a regular monster with difficulty scaling
 */
function generateMonster(floor, room, difficulty, monsterMult = 1.0) {
    const type = MONSTER_TYPES[Math.floor(Math.random() * MONSTER_TYPES.length)];
    
    const baseHp = 30 + floor * 15;
    const baseAtk = 8 + floor * 3;
    const baseXp = 10 + floor * 5;
    const baseGold = 5 + floor * 3;

    const scaledMult = monsterMult;

    // Random position within room (avoid edges)
    const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
    const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2));

    return {
        name: type.name,
        icon: type.icon,
        isBoss: false,
        hp: Math.floor(baseHp * type.hpMult * scaledMult),
        maxHp: Math.floor(baseHp * type.hpMult * scaledMult),
        attack: Math.floor(baseAtk * type.atkMult * scaledMult),
        defense: Math.floor(floor * 0.5 * scaledMult),
        xp: Math.floor(baseXp * type.xpMult),
        gold: Math.floor(baseGold * type.goldMult),
        x,
        y
    };
}

/**
 * Generate a boss monster with AI
 */
function generateBoss(floor, room, difficulty, bossMult = 1.0) {
    const type = BOSS_TYPES[Math.floor(Math.random() * BOSS_TYPES.length)];
    
    const baseHp = 100 + floor * 40;
    const baseAtk = 15 + floor * 5;
    const baseXp = 100 + floor * 50;
    const baseGold = 50 + floor * 30;

    const scaledMult = bossMult;

    // Boss spawns in center of room
    const x = room.x + Math.floor(room.width / 2);
    const y = room.y + Math.floor(room.height / 2);

    const boss = {
        name: `${type.name}`,
        icon: type.icon,
        isBoss: true,
        hp: Math.floor(baseHp * type.hpMult * scaledMult),
        maxHp: Math.floor(baseHp * type.hpMult * scaledMult),
        attack: Math.floor(baseAtk * type.atkMult * scaledMult),
        defense: Math.floor(floor * 1.5 * scaledMult),
        xp: Math.floor(baseXp * type.xpMult),
        gold: Math.floor(baseGold * type.goldMult),
        x,
        y
    };

    // INITIALIZE BOSS AI!
    return initBossAI(boss);
}

/**
 * Generate regular treasure
 */
function generateTreasure(floor, room, difficulty, goldMult = 1.0, xpMult = 1.0) {
    const x = room.x + Math.floor(room.width / 2);
    const y = room.y + Math.floor(room.height / 2);

    return {
        x,
        y,
        isBoss: false,
        gold: Math.floor((50 + floor * 25) * goldMult),
        xp: Math.floor((20 + floor * 10) * xpMult)
    };
}

/**
 * Generate boss treasure (better rewards)
 */
function generateBossTreasure(floor, room, difficulty, goldMult = 1.0, xpMult = 1.0) {
    const x = room.x + Math.floor(room.width / 2);
    const y = room.y + Math.floor(room.height / 2);

    return {
        x,
        y,
        isBoss: true,
        gold: Math.floor((200 + floor * 100) * goldMult),
        xp: Math.floor((100 + floor * 50) * xpMult),
        bonus: true
    };
}

/**
 * Add a door between two rooms
 */
function addDoorBetweenRooms(room1, room2, targetRoomIndex) {
    const doorX = room1.x + room1.width;
    const doorY = room1.y + Math.floor(room1.height / 2);

    room1.doors.push({
        x: doorX,
        y: doorY,
        direction: 'east',
        targetRoom: targetRoomIndex,
        isOpen: false
    });
}

/**
 * Simulate a dungeon run (for auto-run system)
 */
export function simulateDungeonRun(floor = 1, difficulty = 'normal') {
    const dungeon = generateDungeon(floor, difficulty);
    const hero = gameState.hero;
    const config = DIFFICULTY_CONFIG[difficulty];

    let totalGold = 0;
    let totalXp = 0;
    let totalBossesDefeated = 0;
    let success = true;

    for (const room of dungeon.rooms) {
        if (room.monsters && room.monsters.length > 0) {
            for (const monster of room.monsters) {
                const heroHpStart = hero.hp;
                
                while (hero.hp > 0 && monster.hp > 0) {
                    const playerDamage = Math.max(1, hero.attack - monster.defense);
                    monster.hp -= playerDamage;

                    if (monster.hp <= 0) break;

                    const monsterDamage = Math.max(1, monster.attack - hero.defense);
                    hero.hp -= monsterDamage;
                }

                if (hero.hp <= 0) {
                    success = false;
                    break;
                }

                totalXp += monster.xp || 10;
                totalGold += monster.gold || 5;

                if (monster.isBoss) {
                    totalBossesDefeated++;
                }
            }
        }

        if (!success) break;

        if (room.treasure) {
            totalGold += room.treasure.gold;
            totalXp += room.treasure.xp;
        }
    }

    if (success) {
        hero.hp = Math.min(hero.maxHp, hero.hp + Math.floor(hero.maxHp * 0.2));
    } else {
        hero.hp = Math.floor(hero.maxHp * 0.5);
    }

    return {
        success,
        gold: totalGold,
        xp: totalXp,
        floor,
        difficulty,
        bossesDefeated: totalBossesDefeated,
        roomsCleared: dungeon.rooms.filter(r => r.cleared).length,
        totalRooms: dungeon.totalRooms
    };
}

/**
 * Get difficulty configuration
 */
export function getDifficultyConfig(difficulty = 'normal') {
    return DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.normal;
}

/**
 * Get all available difficulties
 */
export function getAvailableDifficulties() {
    return Object.keys(DIFFICULTY_CONFIG);
}
