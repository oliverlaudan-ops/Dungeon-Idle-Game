# 🎮 Difficulty System Documentation

## Overview

The Dungeon-Idle-Game now features a comprehensive **Difficulty Scaling System** that adjusts:
- **Dungeon Length** (5-15 rooms based on difficulty)
- **Monster Strength** (HP, Attack, Defense scaling)
- **Boss Encounters** (every 3-5 rooms)
- **Rewards** (Gold & XP multipliers)
- **Challenge** (resource management, survival difficulty)

---

## 🎯 Difficulty Levels

### 😊 **Easy**
```
Rooms:        5-8 rooms per dungeon
Monster HP:   0.6x base
Monster ATK:  0.6x base
Gold Reward:  1.0x base
XP Reward:    1.0x base
Boss Spawn:   Every 5 rooms
Recommended:  New players, casual play
```

**Use Case:** Learning the game mechanics without pressure

---

### 😀 **Normal** (Default)
```
Rooms:        7-10 rooms per dungeon
Monster HP:   1.0x base
Monster ATK:  1.0x base
Gold Reward:  1.5x base
XP Reward:    1.5x base
Boss Spawn:   Every 5 rooms
Recommended:  Most players, balanced challenge
```

**Use Case:** Standard gameplay loop with good progression

---

### 😬 **Hard**
```
Rooms:        10-13 rooms per dungeon
Monster HP:   1.4x base
Monster ATK:  1.4x base
Gold Reward:  2.5x base
XP Reward:    2.5x base
Boss Spawn:   Every 4 rooms (more bosses!)
Recommended:  Experienced players, want more challenge
```

**Use Case:** Testing hero builds, farming better rewards

---

### 🔥 **Expert**
```
Rooms:        12-15 rooms per dungeon
Monster HP:   1.8x base
Monster ATK:  1.8x base
Gold Reward:  4.0x base
XP Reward:    4.0x base
Boss Spawn:   Every 3 rooms (boss-heavy!)
Recommended:  Hardcore players only
```

**Use Case:** Maximum challenge and maximum rewards

---

## 🐉 Boss Encounters

### Boss Spawning
- **Easy:** 1 boss per 10-15 rooms (1-2 total)
- **Normal:** 1 boss per 7-10 rooms (1-2 total)
- **Hard:** 1 boss per 10-13 rooms (2-3 total)
- **Expert:** 1 boss per 3-5 rooms (3-5 total)

### Boss Types (Random)
1. 🐲 **Dragon Lord** - High HP, High ATK (4.0x / 3.0x)
2. 👑 **Lich King** - Balanced (3.5x / 3.5x)
3. 🗿 **Giant Golem** - Very High HP, Lower ATK (5.0x / 2.0x)
4. 🧙 **Dark Sorcerer** - Lower HP, Very High ATK (2.5x / 4.0x)
5. 🐉 **Ancient Wyvern** - High HP, High ATK (4.5x / 3.5x)

### Boss Rewards
- **Gold:** 200-400 base (+ floor scaling)
- **XP:** 100-200 base (+ floor scaling)
- **Multiplier:** Same as difficulty (2.5x-4.0x)
- **Special Treasure:** Boss rooms always drop treasure

---

## 📊 Monster Scaling

### Base Monster Stats (Floor 1)
```
HP:     20
ATK:    5
DEF:    0.5
XP:     10
Gold:   5
```

### Scaling Per Floor
```
HP:     +10 per floor
ATK:    +2 per floor
DEF:    +0.5 per floor
XP:     +5 per floor
Gold:   +3 per floor
```

### Example: Floor 5, Normal Difficulty
```
Base HP:  20 + (5 * 10) = 70
With Mult: 70 * 1.0 = 70 HP

Base ATK: 5 + (5 * 2) = 15
With Mult: 15 * 1.0 = 15 ATK

Base Gold: 5 + (5 * 3) = 20
With Mult: 20 * 1.5 = 30 Gold
```

---

## 🎮 Implementation Details

### File Structure
```
src/dungeons/
├── dungeon-generator.js (UPDATED)
│   └── generateDungeon(floor, difficulty)
│   └── simulateDungeonRun(floor, difficulty)
│   └── getDifficultyConfig(difficulty)
│
ui/
├── difficulty-ui.js (NEW)
│   └── initDifficultyUI()
│   └── setDifficulty(difficulty)
│   └── getDifficultyInfo(difficulty)
```

### Game State
```javascript
gameState.settings.difficulty = 'normal' // Current difficulty
gameState.dungeonRuns[] // Track each run with difficulty
```

### Difficulty in Manual Runs
```
When player starts manual run:
1. Difficulty selection appears
2. Dungeon generated with selected difficulty
3. Monsters spawned with difficulty scaling
4. Bosses appear at correct intervals
5. Rewards scaled accordingly on completion
```

### Difficulty in Auto Runs
```
When auto-run enabled:
1. Uses current gameState.settings.difficulty
2. Simulates dungeon with difficulty scaling
3. Applies difficulty multipliers to rewards
4. Stores difficulty in run history
```

---

## 🎯 Strategy Guide

### Early Game (Floors 1-3)
- Start on **Easy** to learn mechanics
- Progress to **Normal** once comfortable
- Focus on leveling up, not on rewards

### Mid Game (Floors 4-10)
- Play on **Normal** for balanced progression
- Occasional **Hard** runs for farming
- Build hero to survive Hard dungeons

### Late Game (Floors 11+)
- Mostly **Hard/Expert** for rewards
- Use upgrades to survive Expert dungeons
- Chase personal best records

### Farming Strategy
```
Gold Farming:  Expert > Hard > Normal
XP Farming:    Expert > Hard > Normal
Challenge:     Expert > Hard > Normal
Speed Runs:    Easy (3-5 mins) > Normal (5-10 mins)
```

---

## 📈 Progression Math

### Example: Floor 1 → 10 Progression

#### Easy Mode
```
Room Count: 5-8 (average 6.5)
Monsters:   1-3 per room = 6-24 monsters
Bosses:     0-1
Avg Gold:   ~100-200
Avg Time:   3-5 mins
```

#### Expert Mode (Floor 10)
```
Room Count: 12-15 (average 13.5)
Monsters:   1-3 per room = 13-40 monsters
Bosses:     4-5
Avg Gold:   ~2000-4000
Avg Time:   10-15 mins
```

---

## 🐛 Testing Difficulty

Use the **DEBUG_MANUAL_RUN.html** tool:

1. Set Hero Level: 10
2. Select Difficulty: Hard
3. Spawn Monster: Orc
4. Run Combat Simulator
5. Check damage scaling

---

## 🎮 Planned Features

- [ ] **Difficulty-Specific Achievements** ("Beat Expert Floor 5")
- [ ] **Difficulty Modifiers** (Modifiers that increase/decrease difficulty)
- [ ] **Leaderboards by Difficulty** (Separate rankings)
- [ ] **Difficulty Unlocks** (Unlock harder difficulties with progression)
- [ ] **Custom Difficulty** (Player-configurable scaling)

---

## 📝 Configuration

To adjust difficulty multipliers, edit `src/dungeons/dungeon-generator.js`:

```javascript
const DIFFICULTY_CONFIG = {
    easy: {
        roomCount: { min: 5, max: 8 },      // Change dungeon length
        monsterMult: 0.6,                   // Change monster strength
        bossMult: 0.8,                      // Change boss strength
        goldMult: 1.0,                      // Change gold rewards
        xpMult: 1.0,                        // Change XP rewards
        bossInterval: 5                     // Change boss spawn rate
    },
    // ... other difficulties
}
```

---

## ✅ Checklist

- [x] Dungeon generator supports 4 difficulties
- [x] Room count scales with difficulty (5-15)
- [x] Monster stats scale with difficulty
- [x] Boss encounters scale with difficulty
- [x] Rewards scale with difficulty
- [x] UI component for difficulty selection
- [x] Auto-run supports difficulty
- [ ] Manual run integrates difficulty selection
- [ ] Difficulty stats tracked in run history
- [ ] Achievements for difficulty milestones

---

**Next Steps:**
1. Integrate difficulty selection into Manual Run UI
2. Test all 4 difficulties
3. Balance reward multipliers if needed
4. Add difficulty to run history/statistics
5. Create difficulty-specific achievements

---

**Last Updated:** January 9, 2026
**Status:** Core System Ready ✅
