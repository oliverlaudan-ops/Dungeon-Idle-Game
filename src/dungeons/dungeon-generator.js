/**
 * Dungeon Generator
 * Generates procedural dungeons with rooms, monsters, and loot
 */

import { gameState } from '../core/game-state.js';

/**
 * Generate a dungeon for the given floor
 */
export function generateDungeon(floor = 1) {
    const numRooms = 3 + Math.floor(floor / 2); // 3-6 rooms depending on floor
    const rooms = [];

    let currentX = 0;
    let currentY = 0;

    for (let i = 0; i < numRooms; i++) {
        const room = generateRoom(floor, i, currentX, currentY);
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
        rooms,
        completed: false
    };
}

/**
 * Generate a single room
 */
function generateRoom(floor, roomIndex, x, y) {
    const width = 8 + Math.floor(Math.random() * 4); // 8-11 tiles wide
    const height = 6 + Math.floor(Math.random() * 3); // 6-8 tiles tall

    const room = {
        id: roomIndex,
        x,
        y,
        width,
        height,
        cleared: false,
        looted: false,
        monsters: [],
        treasure: null,
        doors: []
    };

    // Add monsters (not in first room)
    if (roomIndex > 0) {
        const numMonsters = 1 + Math.floor(Math.random() * 3); // 1-3 monsters
        for (let i = 0; i < numMonsters; i++) {
            room.monsters.push(generateMonster(floor, room));
        }
    }

    // Add treasure (random chance, higher in later rooms)
    if (roomIndex > 0 && Math.random() < 0.3 + roomIndex * 0.1) {
        room.treasure = generateTreasure(floor, room);
    }

    return room;
}

/**
 * Generate a monster
 */
function generateMonster(floor, room) {
    const types = [
        { name: 'Goblin', icon: '👺', hpMult: 1.0, atkMult: 1.0 },
        { name: 'Skeleton', icon: '💀', hpMult: 0.8, atkMult: 1.2 },
        { name: 'Orc', icon: '👹', hpMult: 1.5, atkMult: 0.9 },
        { name: 'Ghost', icon: '👻', hpMult: 0.6, atkMult: 1.3 },
        { name: 'Spider', icon: '🕷️', hpMult: 0.7, atkMult: 1.1 }
    ];

    const type = types[Math.floor(Math.random() * types.length)];
    const baseHp = 20 + floor * 10;
    const baseAtk = 5 + floor * 2;

    // Random position within room
    const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
    const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2));

    return {
        name: type.name,
        icon: type.icon,
        hp: Math.floor(baseHp * type.hpMult),
        maxHp: Math.floor(baseHp * type.hpMult),
        attack: Math.floor(baseAtk * type.atkMult),
        defense: Math.floor(floor * 0.5),
        x,
        y
    };
}

/**
 * Generate treasure
 */
function generateTreasure(floor, room) {
    const x = room.x + Math.floor(room.width / 2);
    const y = room.y + Math.floor(room.height / 2);

    return {
        x,
        y,
        gold: 50 + floor * 25,
        xp: 20 + floor * 10
    };
}

/**
 * Add a door between two rooms
 */
function addDoorBetweenRooms(room1, room2, targetRoomIndex) {
    // Door at the right edge of room1
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
export function simulateDungeonRun(floor = 1) {
    const dungeon = generateDungeon(floor);
    const hero = gameState.hero;

    let totalGold = 0;
    let totalXp = 0;
    let success = true;

    // Simulate each room
    for (const room of dungeon.rooms) {
        // Fight monsters
        if (room.monsters && room.monsters.length > 0) {
            for (const monster of room.monsters) {
                // Simple combat simulation
                while (hero.hp > 0 && monster.hp > 0) {
                    // Player attacks
                    const playerDamage = Math.max(1, hero.attack - monster.defense);
                    monster.hp -= playerDamage;

                    if (monster.hp <= 0) break;

                    // Monster attacks
                    const monsterDamage = Math.max(1, monster.attack - hero.defense);
                    hero.hp -= monsterDamage;
                }

                if (hero.hp <= 0) {
                    success = false;
                    break;
                }

                totalXp += 10 + floor * 5;
            }
        }

        if (!success) break;

        // Collect treasure
        if (room.treasure) {
            totalGold += room.treasure.gold;
            totalXp += room.treasure.xp;
        }
    }

    // Restore some HP after run
    if (success) {
        hero.hp = Math.min(hero.maxHp, hero.hp + Math.floor(hero.maxHp * 0.2));
    } else {
        hero.hp = Math.floor(hero.maxHp * 0.5); // Restore 50% on failure
    }

    return {
        success,
        gold: totalGold,
        xp: totalXp,
        floor
    };
}