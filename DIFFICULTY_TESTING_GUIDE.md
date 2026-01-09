# 🧪 Difficulty System Testing Guide

## 🎯 Quick Test (5 mins)

### Test 1: Room Count Verification
```
1. Open DEBUG_MANUAL_RUN.html
2. Set Hero Level: 10
3. Run test:
   Easy:   Should generate 5-8 rooms
   Normal: Should generate 7-10 rooms
   Hard:   Should generate 10-13 rooms
   Expert: Should generate 12-15 rooms

✅ PASS: Room count matches difficulty
```

### Test 2: Monster Scaling Verification
```
In console, check monster HP:

Floor 1, Easy:   ~12 HP (20 * 0.6)
Floor 1, Normal: ~20 HP (20 * 1.0)
Floor 1, Hard:   ~28 HP (20 * 1.4)
Floor 1, Expert: ~36 HP (20 * 1.8)

✅ PASS: Monster scaling correct
```

### Test 3: Boss Spawning
```
Run simulateDungeonRun(1, 'easy'):
- Should have 1 room with isBoss = true every 5 rooms

Run simulateDungeonRun(1, 'expert'):
- Should have 1 room with isBoss = true every 3 rooms

✅ PASS: Bosses spawn at correct intervals
```

---

## 🏰 Full Difficulty Testing (15 mins)

### Test Suite: Dungeon Generation

#### Setup
```javascript
// In browser console
import { generateDungeon, getDifficultyConfig } from './src/dungeons/dungeon-generator.js';

// Test each difficulty
const difficulties = ['easy', 'normal', 'hard', 'expert'];
difficulties.forEach(diff => {
    const dungeon = generateDungeon(1, diff);
    console.log(`\n${diff.toUpperCase()}:`);
    console.log(`Rooms: ${dungeon.rooms.length}`);
    console.log(`Bosses: ${dungeon.rooms.filter(r => r.isBoss).length}`);
    console.log(`Total Monsters: ${dungeon.rooms.reduce((sum, r) => sum + r.monsters.length, 0)}`);
});
```

#### Expected Output
```
EASY:
  Rooms: 5-8
  Bosses: 1-2
  Monsters: 5-20

NORMAL:
  Rooms: 7-10
  Bosses: 1-2
  Monsters: 7-25

HARD:
  Rooms: 10-13
  Bosses: 2-3
  Monsters: 10-35

EXPERT:
  Rooms: 12-15
  Bosses: 3-5
  Monsters: 12-40
```

---

### Test Suite: Monster Stats

#### Check Floor 5 Monsters
```javascript
import { generateDungeon } from './src/dungeons/dungeon-generator.js';

const dungeons = {
    easy: generateDungeon(5, 'easy'),
    normal: generateDungeon(5, 'normal'),
    hard: generateDungeon(5, 'hard'),
    expert: generateDungeon(5, 'expert')
};

// Log first non-boss monster from each difficulty
Object.entries(dungeons).forEach(([diff, dungeon]) => {
    const monster = dungeon.rooms.find(r => !r.isBoss && r.monsters.length > 0)?.monsters[0];
    if (monster) {
        console.log(`${diff.toUpperCase()}: ${monster.name} - ${monster.hp}/${monster.maxHp} HP, ${monster.attack} ATK`);
    }
});
```

#### Expected Values
```
BASE (Floor 5): HP = 70, ATK = 15

EASY:   HP ~42 (70*0.6),  ATK ~9 (15*0.6)
NORMAL: HP ~70 (70*1.0),  ATK ~15 (15*1.0)
HARD:   HP ~98 (70*1.4),  ATK ~21 (15*1.4)
EXPERT: HP ~126 (70*1.8), ATK ~27 (15*1.8)
```

---

### Test Suite: Boss Encounters

#### Check Boss Properties
```javascript
import { generateDungeon } from './src/dungeons/dungeon-generator.js';

const dungeon = generateDungeon(1, 'expert');
const bosses = dungeon.rooms
    .filter(r => r.isBoss)
    .flatMap(r => r.monsters);

console.log(`Found ${bosses.length} bosses:`);
bosses.forEach(boss => {
    console.log(`- ${boss.name}: ${boss.hp}/${boss.maxHp} HP, ${boss.attack} ATK, ${boss.xp} XP, ${boss.gold} GOLD`);
});
```

#### Expected
```
Should have:
- Icon (one of: 🐉, 👑, 🧙, 🦑, etc.)
- High HP (150+ for floor 1)
- High Attack (15+ for floor 1)
- High XP rewards (100+ for floor 1)
- High Gold rewards (50+ for floor 1)
- isBoss = true flag
```

---

### Test Suite: Rewards Scaling

#### Check Gold/XP Multipliers
```javascript
import { simulateDungeonRun, getDifficultyConfig } from './src/dungeons/dungeon-generator.js';

const difficulties = ['easy', 'normal', 'hard', 'expert'];
const results = {};

difficulties.forEach(diff => {
    const run = simulateDungeonRun(1, diff);
    results[diff] = {
        gold: run.gold,
        xp: run.xp,
        config: getDifficultyConfig(diff)
    };
});

Object.entries(results).forEach(([diff, data]) => {
    console.log(`${diff.toUpperCase()}:`);
    console.log(`  Gold: ${data.gold} (multiplier: ${data.config.goldMult}x)`);
    console.log(`  XP: ${data.xp} (multiplier: ${data.config.xpMult}x)`);
});
```

#### Expected Ratio
```
If Easy gives 100 gold:
  Easy:   100 gold
  Normal: 150 gold
  Hard:   250 gold
  Expert: 400 gold
```

---

## 🏰 Integration Testing (20 mins)

### Test 1: Manual Run with Difficulty
```
1. Open index.html (main game)
2. Click "Manual Run" tab
3. Look for difficulty selector
4. Select different difficulties
5. Start run
6. Verify:
   - Room count matches difficulty
   - Monster strength increases
   - Bosses appear at right times
   - Canvas renders correctly

✅ PASS: Manual run works with difficulty
```

### Test 2: Auto-Run with Difficulty
```
1. Open index.html
2. Verify gameState.settings.difficulty = 'normal'
3. Start auto-runs
4. Watch run history
5. Verify rewards scale with difficulty
6. Check that difficulty appears in run stats

✅ PASS: Auto-run respects difficulty setting
```

### Test 3: Difficulty Persistence
```
1. Set difficulty to 'hard'
2. Close and reopen the game
3. Verify difficulty is still 'hard' (from localStorage)

✅ PASS: Difficulty saves and loads correctly
```

---

## 📄 Stress Testing (Optional)

### Generate 100 Dungeons
```javascript
import { generateDungeon } from './src/dungeons/dungeon-generator.js';

console.time('Generate 100 dungeons');

for (let i = 0; i < 100; i++) {
    ['easy', 'normal', 'hard', 'expert'].forEach(diff => {
        generateDungeon(Math.floor(i / 4) + 1, diff);
    });
}

console.timeEnd('Generate 100 dungeons');
```

#### Expected
```
✅ Should complete in < 100ms
✅ No memory leaks
✅ Consistent distribution
```

---

## 🐛 Debugging Tips

### Enable Debug Logging
```javascript
// Add to dungeon-generator.js
const DEBUG = true;

if (DEBUG) {
    console.log(`🎲 Generating ${numRooms} rooms (${difficulty})`);
    console.log(`👹 Boss interval: ${config.bossInterval} rooms`);
    console.log(`⚔️ Monster multiplier: ${config.monsterMult}x`);
}
```

### Check Game State
```javascript
// In browser console
console.log(gameState.settings.difficulty);
console.log(gameState.currentDungeon);
console.log(gameState.runHistory[gameState.runHistory.length - 1]);
```

### Monitor Performance
```javascript
console.time('Dungeon generation');
const dungeon = generateDungeon(10, 'expert');
console.timeEnd('Dungeon generation');
```

---

## ✅ Test Checklist

### Core Features
- [ ] Easy difficulty generates 5-8 rooms
- [ ] Normal difficulty generates 7-10 rooms
- [ ] Hard difficulty generates 10-13 rooms
- [ ] Expert difficulty generates 12-15 rooms
- [ ] Bosses spawn every 3-5 rooms (difficulty dependent)
- [ ] Monster HP scales with difficulty
- [ ] Monster ATK scales with difficulty
- [ ] Rewards scale with difficulty

### Integration
- [ ] Manual run can select difficulty
- [ ] Auto-run uses selected difficulty
- [ ] Difficulty persists after reload
- [ ] Run history includes difficulty
- [ ] Canvas renders longer dungeons correctly
- [ ] Combat system handles boss monsters

### Balance
- [ ] Expert is clearly harder than Easy
- [ ] Rewards are proportional to difficulty
- [ ] Player can survive Hard with level 5+ hero
- [ ] Player struggles with Expert at level 5
- [ ] No difficulty spikes between levels

### Performance
- [ ] Dungeon generation < 100ms
- [ ] No lag during gameplay
- [ ] Canvas renders smooth
- [ ] No memory leaks

---

## 📚 Test Results Template

When you run tests, document here:

```
Test Date: [DATE]
Tester: [NAME]

Easy Mode:
- [ ] Room count: 5-8 ✓/✗
- [ ] Monster HP scaling ✓/✗
- [ ] Boss spawning ✓/✗

Normal Mode:
- [ ] Room count: 7-10 ✓/✗
- [ ] Monster HP scaling ✓/✗
- [ ] Boss spawning ✓/✗

Hard Mode:
- [ ] Room count: 10-13 ✓/✗
- [ ] Monster HP scaling ✓/✗
- [ ] Boss spawning ✓/✗

Expert Mode:
- [ ] Room count: 12-15 ✓/✗
- [ ] Monster HP scaling ✓/✗
- [ ] Boss spawning ✓/✗

Integration:
- [ ] Manual run difficulty selector ✓/✗
- [ ] Auto-run respects difficulty ✓/✗
- [ ] Difficulty persistence ✓/✗

Bugs Found:
- [Bug 1]
- [Bug 2]

Notes:
[Any observations or suggestions]
```

---

**Good luck testing!** 🎮🚀
