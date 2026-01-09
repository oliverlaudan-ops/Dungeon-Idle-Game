/**
 * Dungeon Generator
 * Generates procedural dungeons with rooms, corridors, monsters, and treasure
 */

export class DungeonGenerator {
    constructor(difficulty = 'NORMAL') {
        this.difficulty = difficulty;
        this.config = this.getDifficultyConfig(difficulty);
    }

    getDifficultyConfig(difficulty) {
        const configs = {
            EASY: { rooms: [5, 8], monsters: 0.75, treasure: 1.2 },
            NORMAL: { rooms: [7, 10], monsters: 1.0, treasure: 1.0 },
            HARD: { rooms: [10, 13], monsters: 1.3, treasure: 0.9 },
            EXPERT: { rooms: [12, 15], monsters: 1.6, treasure: 0.8 }
        };
        return configs[difficulty] || configs.NORMAL;
    }

    generate() {
        const [minRooms, maxRooms] = this.config.rooms;
        const roomCount = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;

        const dungeon = {
            rooms: [],
            currentRoom: 0,
            totalRooms: roomCount,
            difficulty: this.difficulty
        };

        // Generate rooms
        for (let i = 0; i < roomCount; i++) {
            dungeon.rooms.push(this.generateRoom(i, roomCount));
        }

        return dungeon;
    }

    generateRoom(index, total) {
        const isBossRoom = index === total - 1;
        
        const room = {
            index,
            type: isBossRoom ? 'boss' : (Math.random() < 0.3 ? 'treasure' : 'combat'),
            width: 15,
            height: 8,
            monsters: [],
            treasure: null,
            cleared: false
        };

        // Add monsters
        if (room.type === 'combat') {
            const monsterCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < monsterCount; i++) {
                room.monsters.push(this.generateMonster(false));
            }
        } else if (room.type === 'boss') {
            room.monsters.push(this.generateMonster(true));
        }

        // Add treasure
        if (room.type === 'treasure' || isBossRoom) {
            room.treasure = {
                x: Math.floor(Math.random() * (room.width - 2)) + 1,
                y: Math.floor(Math.random() * (room.height - 2)) + 1,
                collected: false
            };
        }

        return room;
    }

    generateMonster(isBoss) {
        const types = ['goblin', 'orc', 'skeleton', 'troll'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const templates = {
            goblin: { name: 'Goblin', icon: '🟢', hp: 30, attack: 5, xp: 25, gold: 10 },
            orc: { name: 'Orc', icon: '🔴', hp: 50, attack: 8, xp: 50, gold: 25 },
            skeleton: { name: 'Skeleton', icon: '☠️', hp: 40, attack: 7, xp: 35, gold: 15 },
            troll: { name: 'Troll', icon: '👹', hp: 70, attack: 10, xp: 75, gold: 40 }
        };

        const template = templates[type];
        const multiplier = this.config.monsters * (isBoss ? 3 : 1);

        return {
            ...template,
            hp: Math.floor(template.hp * multiplier),
            maxHp: Math.floor(template.hp * multiplier),
            attack: Math.floor(template.attack * multiplier),
            xp: Math.floor(template.xp * multiplier),
            gold: Math.floor(template.gold * multiplier),
            x: Math.floor(Math.random() * 13) + 1,
            y: Math.floor(Math.random() * 6) + 1,
            isBoss,
            alive: true
        };
    }
}
