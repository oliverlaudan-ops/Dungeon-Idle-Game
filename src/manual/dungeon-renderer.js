/**
 * Dungeon Renderer
 * Renders the dungeon on canvas with hero, monsters, and treasure
 */

export class DungeonRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = 40;
        this.offsetX = 100;
        this.offsetY = 100;
    }

    render(dungeon, hero) {
        this.clear();
        
        const room = dungeon.rooms[dungeon.currentRoom];
        if (!room) return;

        this.renderRoom(room);
        this.renderGrid(room);
        this.renderTreasure(room);
        this.renderMonsters(room);
        this.renderHero(hero);
        this.renderUI(dungeon, room, hero);
    }

    clear() {
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderRoom(room) {
        const width = room.width * this.tileSize;
        const height = room.height * this.tileSize;

        // Floor
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(this.offsetX, this.offsetY, width, height);

        // Walls
        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(this.offsetX, this.offsetY, width, height);
    }

    renderGrid(room) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= room.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + x * this.tileSize, this.offsetY);
            this.ctx.lineTo(this.offsetX + x * this.tileSize, this.offsetY + room.height * this.tileSize);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= room.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + y * this.tileSize);
            this.ctx.lineTo(this.offsetX + room.width * this.tileSize, this.offsetY + y * this.tileSize);
            this.ctx.stroke();
        }
    }

    renderHero(hero) {
        const x = this.offsetX + hero.x * this.tileSize + this.tileSize / 2;
        const y = this.offsetY + hero.y * this.tileSize + this.tileSize / 2;

        // Circle background
        this.ctx.fillStyle = '#3498db';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.fill();

        // Hero icon
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🦸', x, y);

        // HP bar
        this.renderHealthBar(x, y - 25, hero.hp, hero.maxHp, 30);
    }

    renderMonsters(room) {
        room.monsters.forEach(monster => {
            if (!monster.alive) return;

            const x = this.offsetX + monster.x * this.tileSize + this.tileSize / 2;
            const y = this.offsetY + monster.y * this.tileSize + this.tileSize / 2;

            // Circle background
            this.ctx.fillStyle = monster.isBoss ? '#8e44ad' : '#e74c3c';
            this.ctx.beginPath();
            this.ctx.arc(x, y, monster.isBoss ? 20 : 15, 0, Math.PI * 2);
            this.ctx.fill();

            // Monster icon
            this.ctx.font = monster.isBoss ? '24px Arial' : '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(monster.icon, x, y);

            // HP bar
            this.renderHealthBar(x, y - (monster.isBoss ? 35 : 30), monster.hp, monster.maxHp, 40);
        });
    }

    renderTreasure(room) {
        if (!room.treasure || room.treasure.collected) return;

        const x = this.offsetX + room.treasure.x * this.tileSize + this.tileSize / 2;
        const y = this.offsetY + room.treasure.y * this.tileSize + this.tileSize / 2;

        // Treasure chest
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.fillRect(x - 15, y - 15, 30, 30);
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('💰', x, y);
    }

    renderHealthBar(x, y, hp, maxHp, width) {
        const height = 6;
        const hpPercent = hp / maxHp;

        // Background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x - width / 2, y, width, height);

        // HP fill
        this.ctx.fillStyle = hpPercent > 0.5 ? '#2ecc71' : hpPercent > 0.25 ? '#f39c12' : '#e74c3c';
        this.ctx.fillRect(x - width / 2, y, width * hpPercent, height);

        // Border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x - width / 2, y, width, height);
    }

    renderUI(dungeon, room, hero) {
        // Info panel
        this.ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, 80);

        // Title
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Room ${dungeon.currentRoom + 1} / ${dungeon.totalRooms}`, 20, 25);
        this.ctx.fillText(`${room.type.toUpperCase()} ROOM`, 20, 50);

        // Hero stats
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`HP: ${hero.hp} / ${hero.maxHp}`, 300, 25);
        this.ctx.fillText(`ATK: ${hero.attack} | DEF: ${hero.defense}`, 300, 50);

        // Controls hint
        this.ctx.fillStyle = '#aaa';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('Use WASD or Arrow Keys to move', this.canvas.width - 20, 25);
        this.ctx.fillText('Walk into monsters to attack', this.canvas.width - 20, 45);
    }
}
