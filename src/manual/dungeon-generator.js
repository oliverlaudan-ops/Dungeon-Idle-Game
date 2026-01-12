/**
 * Dungeon Generator
 * Generates procedural dungeons with rooms, corridors, monsters, and treasure
 */

export class DungeonGenerator {
    constructor(difficulty = 'NORMAL', floorLevel = 1) {
        this.difficulty = difficulty;
        this.floorLevel = floorLevel;
        this.config = this.getDifficultyConfig(difficulty);
    }

    getDifficultyConfig(difficulty) {
        const configs = {
            EASY: { rooms: [5, 8], monsters: 0.6, treasure: 1.3 },
            NORMAL: { rooms: [7, 10], monsters: 1.0, treasure: 1.0 },
            HARD: { rooms: [10, 13], monsters: 1.8, treasure: 0.9 },
            EXPERT: { rooms: [12, 15], monsters: 2.8, treasure: 0.8 }
        };
        return configs[difficulty] || configs.NORMAL;
    }

    /**
     * Calculate floor scaling multiplier
     * Scales monster difficulty exponentially with floor level
     * 
     * UPDATED v2.4.1: Increased scaling to compensate for skill tree power
     * 
     * Comparison (HP):
     * Floor 1:  1.0x (same)
     * Floor 5:  2.1x (was 1.75x)
     * Floor 10: 6.2x (was 3.5x)
     * Floor 15: 15.4x (was 8.1x)
     * Floor 20: 38.3x (was 18.7x)
     */
    getFloorScaling() {
        // Increased from 1.15 to 1.20 for stronger HP scaling
        const hpScaling = Math.pow(1.20, this.floorLevel - 1);
        
        // Increased from 1.12 to 1.18 for stronger attack scaling
        const attackScaling = Math.pow(1.18, this.floorLevel - 1);
        
        return {
            hp: hpScaling,
            attack: attackScaling,
            xp: 1 + (this.floorLevel - 1) * 0.2, // Linear XP scaling
            gold: 1 + (this.floorLevel - 1) * 0.25 // Linear gold scaling
        };
    }

    generate() {
        const [minRooms, maxRooms] = this.config.rooms;
        const roomCount = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;

        const dungeon = {
            rooms: [],
            currentRoom: 0,
            totalRooms: roomCount,
            difficulty: this.difficulty,
            floorLevel: this.floorLevel
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
            const monsterCount = Math.floor(Math.random() * 3) + 2; // 2-4 monsters
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
            goblin: { name: 'Goblin', icon: '🟢', hp: 40, attack: 8, xp: 25, gold: 10 },
            orc: { name: 'Orc', icon: '🔴', hp: 60, attack: 12, xp: 50, gold: 25 },
            skeleton: { name: 'Skeleton', icon: '☠️', hp: 50, attack: 10, xp: 35, gold: 15 },
            troll: { name: 'Troll', icon: '👹', hp: 80, attack: 15, xp: 75, gold: 40 }
        };

        const template = templates[type];
        const floorScaling = this.getFloorScaling();
        
        // Boss multiplier increased from 5x to 6x for more challenge
        const bossMultiplier = isBoss ? 6.0 : 1.0;
        const difficultyMultiplier = this.config.monsters;
        
        // Apply all multipliers
        const finalHp = Math.floor(template.hp * difficultyMultiplier * bossMultiplier * floorScaling.hp);
        const finalAttack = Math.floor(template.attack * difficultyMultiplier * bossMultiplier * floorScaling.attack);
        const finalXp = Math.floor(template.xp * bossMultiplier * floorScaling.xp);
        const finalGold = Math.floor(template.gold * bossMultiplier * floorScaling.gold);

        return {
            ...template,
            name: isBoss ? `${template.name} Boss` : template.name,
            hp: finalHp,
            maxHp: finalHp,
            attack: finalAttack,
            xp: finalXp,
            gold: finalGold,
            x: Math.floor(Math.random() * 13) + 1,
            y: Math.floor(Math.random() * 6) + 1,
            isBoss,
            alive: true
        };
    }
}
