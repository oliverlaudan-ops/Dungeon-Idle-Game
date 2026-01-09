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
Monster HP:   0.75x multiplier
Monster ATK:  0.75x multiplier
Gold Reward:  1.0x base
XP Reward:    1.0x base
Boss Spawn:   Every 5 rooms
Recommended:  New players, learning phase
```

**Use Case:** Learning the game mechanics without pressure

---

### 😀 **Normal** (Default)
```
Rooms:        7-10 rooms per dungeon
Monster HP:   1.2x multiplier (REBALANCED: was 1.0x)
Monster ATK:  1.2x multiplier (REBALANCED: was 1.0x)
Gold Reward:  1.5x base
XP Reward:    1.5x base
Boss Spawn:   Every 5 rooms
Recommended:  Most players, balanced challenge
```

**Use Case:** Standard gameplay loop with good progression
**Change:** Increased from 1.0x to 1.2x to match boss difficulty

---

### 😬 **Hard**
```
Rooms:        10-13 rooms per dungeon
Monster HP:   1.6x multiplier (REBALANCED: was 1.4x)
Monster ATK:  1.6x multiplier (REBALANCED: was 1.4x)
Gold Reward:  2.5x base
XP Reward:    2.5x base
Boss Spawn:   Every 4 rooms (more bosses!)
Recommended:  Experienced players, want more challenge
```

**Use Case:** Testing hero builds, farming better rewards
**Change:** Increased from 1.4x to 1.6x for better challenge

---

### 🔥 **Expert**
```
Rooms:        12-15 rooms per dungeon
Monster HP:   2.0x multiplier (REBALANCED: was 1.8x)
Monster ATK:  2.0x multiplier (REBALANCED: was 1.8x)
Gold Reward:  4.0x base
XP Reward:    4.0x base
Boss Spawn:   Every 3 rooms (boss-heavy!)
Recommended:  Hardcore players only
```

**Use Case:** Maximum challenge and maximum rewards
**Change:** Increased from 1.8x to 2.0x for extreme difficulty

---

## 📊 Monster Stats Comparison

### Base Monster Stats (REBALANCED)

**Floor 1, Normal Mode:**
- Base HP: `30` (was 20)
- Base ATK: `8` (was 5)
- With 1.2x multiplier:
  - HP: ~36
  - ATK: ~9.6 → Deals 4-5 damage per hit (vs old 1 damage)
  - Goblin: 36 HP, 9.6 ATK
  - Orc: 54 HP (1.5x), 8.6 ATK (0.9x)

### Per Floor Scaling
```
Base HP:    +15 per floor (was +10)
Base ATK:   +3 per floor (was +2)
Defense:    +0.5 per floor
XP:         +5 per floor
Gold:       +3 per floor
```

### Example: Floor 5, Normal Difficulty
```
Base Stats (no mult):
  HP:   30 + (5 * 15) = 105
  ATK:  8 + (5 * 3) = 23
  Gold: 5 + (5 * 3) = 20

With 1.2x Multiplier:
  HP:   105 * 1.2 = 126 HP
  ATK:  23 * 1.2 = 27.6 ATK
  Gold: 20 * 1.5 = 30 Gold

VS Hero (Level 5):
  Hero ATK:   10 + (5 * 2) = 20
  Hero DEF:   5
  Damage to Monster: 20 - 0 = 20
  Monster Damage to Hero: 27.6 - 5 = 22.6 damage per hit
  → Monster is now a real threat! ✓
```

---

## 👑 Boss Encounters

### Boss Spawning (UNCHANGED - Bosses were perfect!)
- **Easy:** 1 boss per 5 rooms (1-2 total)
- **Normal:** 1 boss per 5 rooms (1-2 total)
- **Hard:** 1 boss per 4 rooms (2-3 total)
- **Expert:** 1 boss per 3 rooms (3-5 total)

### Boss Types (Random)
1. 🐉 **Dragon Lord** - High HP, High ATK (4.0x / 3.0x)
2. 👑 **Lich King** - Balanced (3.5x / 3.5x)
3. 🤖 **Giant Golem** - Very High HP, Lower ATK (5.0x / 2.0x)
4. 🧙 **Dark Sorcerer** - Lower HP, Very High ATK (2.5x / 4.0x)
5. 🐍 **Ancient Wyvern** - High HP, High ATK (4.5x / 3.5x)

### Boss Stats Example (Floor 1, Normal)
```
Base:  100 HP, 15 ATK
Dragon Lord (4.0x HP, 3.0x ATK):
  HP:   100 * 4.0 * 1.0 = 400 HP
  ATK:  15 * 3.0 * 1.0 = 45 ATK
  → Clearly a boss-level threat!
```

### Boss Rewards
- **Gold:** 200-400 base (+ floor scaling)
- **XP:** 100-200 base (+ floor scaling)
- **Multiplier:** Same as difficulty (1.0x-4.0x)
- **Special Treasure:** Boss rooms always drop treasure

---

## 🎯 Rebalancing Summary

### What Changed?

| Metric | Before | After | Why |
|--------|--------|-------|-----|
| Base Monster HP | 20 + 10*floor | 30 + 15*floor | Too weak, 1-shot kills |
| Base Monster ATK | 5 + 2*floor | 8 + 3*floor | Only 1 damage per hit |
| Easy Mult | 0.6x | 0.75x | Still easy, but not trivial |
| Normal Mult | 1.0x | 1.2x | Matches boss difficulty |
| Hard Mult | 1.4x | 1.6x | Better challenge curve |
| Expert Mult | 1.8x | 2.0x | Extreme difficulty |
| Boss Mult | — | — | UNCHANGED (perfect already!) |

### Result?
✅ **Normal monsters now deal 4-5 damage per hit** (was 1)
✅ **Combat lasts multiple rounds** (was instant kills)
✅ **Boss difficulty matches difficulty curve** perfectly
✅ **Expert feels truly hardcore**

---

## 🎮 Implementation Details

### File Structure
```
src/dungeons/
├── dungeon-generator.js (UPDATED v2.1)
│   ├── DIFFICULTY_CONFIG (rebalanced)
│   ├── generateDungeon(floor, difficulty)
│   ├── generateMonster(floor, room, difficulty, mult)
│   ├── generateBoss(floor, room, difficulty, mult)
│   ├── simulateDungeonRun(floor, difficulty)
│   ├── getDifficultyConfig(difficulty)
│   └── getAvailableDifficulties()
│
ui/
├── difficulty-ui.js (NEW)
│   ├── initDifficultyUI()
│   ├── setDifficulty(difficulty)
│   ├── getDifficultyInfo(difficulty)
│   └── showDifficultyTooltip(difficulty)
```

### Game State
```javascript
gameState.settings.difficulty = 'normal' // Current difficulty
gameState.dungeonRuns[] // Track each run with difficulty
```

---

## 🎯 Progression Guide

### Early Game (Floors 1-3)
- Start on **Easy** to learn mechanics
- Try **Normal** once comfortable
- Focus on leveling, not rewards
- **Expected:** 1-2 rooms before monsters kill you

### Mid Game (Floors 4-10)
- Play on **Normal** for balanced progression
- Occasional **Hard** runs for farming
- Build hero to survive longer
- **Expected:** 5+ rooms before difficulty

### Late Game (Floors 11+)
- Mostly **Hard/Expert** for rewards
- Use upgrades to survive Expert dungeons
- Chase personal best records
- **Expected:** Full dungeon completion possible

---

## 📈 Playtesting Results

### Feedback Incorporated
✅ **Boss Difficulty:** Perfect, no changes needed
✅ **Normal Monster Strength:** Too weak → Increased 0.6x→1.2x
✅ **Combat Duration:** Too fast → Increased HP/ATK significantly
✅ **Difficulty Curve:** Now matches boss encounters

---

## ⚙️ Configuration

To adjust difficulty multipliers, edit `src/dungeons/dungeon-generator.js`:

```javascript
const DIFFICULTY_CONFIG = {
    normal: {
        roomCount: { min: 7, max: 10 },
        monsterMult: 1.2,                   // Adjust monster strength
        bossMult: 1.0,                      // Adjust boss strength
        goldMult: 1.5,                      // Adjust gold rewards
        xpMult: 1.5,                        // Adjust XP rewards
        bossInterval: 5                     // Adjust boss spawn rate
    }
}
```

---

## ✅ Next Steps

- [x] Dungeon generator supports 4 difficulties
- [x] Room count scales with difficulty (5-15)
- [x] Monster stats scale with difficulty
- [x] Boss encounters scale with difficulty
- [x] Rewards scale with difficulty
- [x] UI component for difficulty selection
- [x] Monster balance rebalanced
- [ ] Manual run integrates difficulty selection
- [ ] Difficulty stats tracked in run history
- [ ] Achievements for difficulty milestones
- [ ] **Equipment System** (the real challenge!)
- [ ] **Boss Special Attacks**
- [ ] **Loot Tables**

---

**Last Updated:** January 9, 2026
**Status:** Rebalanced & Ready to Play ✅
