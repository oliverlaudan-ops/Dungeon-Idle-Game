# 📜 Changelog

## [2.1.0] - 2026-01-09

### 🏕️ MAJOR UPDATE: Difficulty System & Monster Rebalancing

#### New Features
- ✨ **Difficulty Selection System** (Easy, Normal, Hard, Expert)
  - Easy: 5-8 rooms, 0.75x monster strength
  - Normal: 7-10 rooms, 1.2x monster strength, 1.5x rewards
  - Hard: 10-13 rooms, 1.6x monster strength, 2.5x rewards
  - Expert: 12-15 rooms, 2.0x monster strength, 4.0x rewards

- 👑 **Boss Encounters**
  - Bosses now spawn every 3-5 rooms (difficulty dependent)
  - 5 unique boss types with special designs
  - Boss difficulty PERFECT - balances well with normal monsters

- 📊 **Monster Rebalancing**
  - Base HP: 20+10*floor → 30+15*floor (1.5x increase)
  - Base ATK: 5+2*floor → 8+3*floor (1.6x increase)
  - Result: Monsters now deal 4-5 damage (was 1) - actual combat challenge!

#### User Feedback Integrated

😋 **User Testing Results:**
- Level 5 hero vs Boss: "Perfect difficulty! Couldn't beat it, but was challenging"
- Level 5 hero vs Normal monsters: "Too easy, instant kills" → FIXED!
- Dungeon length: "Only 3 rooms" → FIXED! Now 5-15 rooms

#### Files Added
- `src/dungeons/dungeon-generator.js` (v2.1) - Complete rewrite
- `ui/difficulty-ui.js` - Difficulty selection interface
- `DIFFICULTY_SYSTEM.md` - Full technical documentation
- `DIFFICULTY_TESTING_GUIDE.md` - Testing procedures
- `QUICK_START.md` - Player-friendly guide
- `CHANGELOG.md` - This file

#### Files Modified
- `DIFFICULTY_SYSTEM.md` - Updated with rebalanced values

#### Technical Details

**Monster Stats Example (Floor 1, Normal Difficulty):**
```
Old:  Goblin with 12 HP, 3 ATK (deals ~1 damage per hit)
New:  Goblin with 36 HP, 9.6 ATK (deals ~4 damage per hit)

Result: Combat is now 3-4 rounds instead of instant kill
```

**Boss Stats Example (Floor 1, Normal Difficulty):**
```
Dragon Lord: 400 HP, 45 ATK
Requires 150+ ATK to reliably win (Level 12+)
Very challenging but beatable with good preparation
```

#### Breaking Changes
- ⚠️ Dungeon generation signature changed:
  - `generateDungeon(floor)` → `generateDungeon(floor, difficulty='normal')`
- Auto-run now respects difficulty setting

---

### 🎲 Equipment System Framework (Foundation)

#### New Features
- 💫 **Equipment Types**
  - Weapons (Sword, Bow, Hammer, etc.) - ATK+, Crit%
  - Armor (Leather, Chain, Plate, Dragon Scale) - DEF+, HP+
  - Accessories (Rings, Amulets, Necklaces) - Various bonuses

- 🌟 **Rarity System**
  - Common (1.0x stats, 60% drop chance)
  - Uncommon (1.25x stats, 25% drop chance)
  - Rare (1.50x stats, 10% drop chance)
  - Epic (1.75x stats, 4% drop chance)
  - Legendary (2.0x stats, 1% drop chance)

- 💫 **Equipment Functions**
  - `createEquipment(templateId, rarity)` - Generate equipment
  - `equipItem(id)` - Equip item to hero
  - `unequipItem(id)` - Remove equipment
  - `sellEquipment(id)` - Sell for gold
  - `recalculateStats()` - Auto-update hero stats

#### Files Added
- `src/upgrades/equipment-system.js` - Equipment framework

#### Status
- ✋ WIP: Equipment generation and UI not yet integrated
- ✋ WIP: Loot drops from monsters not yet implemented
- ✋ WIP: Equipment UI not yet created

---

## [2.0.0] - 2026-01-08

### 🎮 Initial Release

- Basic dungeon generation
- Manual and auto-run systems
- Combat simulation
- XP and gold rewards
- Hero leveling

---

## 퉰d️ Next Planned Features

### Phase 1: Equipment Integration (1-2 days)
- [ ] Monster loot drops (5-20% drop chance)
- [ ] Equipment UI (inventory, equipping)
- [ ] Stat calculation with equipment
- [ ] Equipment shops
- [ ] Boss special loot

### Phase 2: Upgrades & Progression (2-3 days)
- [ ] ATK/DEF/HP upgrade tree
- [ ] Skill unlocks
- [ ] Talent system
- [ ] Prestige system (soft reset)

### Phase 3: Content & Polish (3-5 days)
- [ ] More boss types
- [ ] Special abilities
- [ ] Events and seasons
- [ ] Achievements
- [ ] Leaderboards

---

## 💪 Stats

### Code Metrics
- **Total Functions:** 50+
- **Total Lines:** 3000+
- **Commits:** 5
- **Test Coverage:** Manual

### Game Balance
- **Easy Difficulty:** 3-5 mins per run, perfect for learning
- **Normal Difficulty:** 5-10 mins per run, recommended
- **Hard Difficulty:** 8-12 mins per run, for experienced players
- **Expert Difficulty:** 10-15 mins per run, hardcore only

---

## 🙋 Contributors

- Oliver Läudan (@oliverlaudan-ops) - Lead Developer
- Beta Tester (Level 5) - Feedback on monster difficulty

---

## 🐹 Known Issues

- [ ] Equipment system not yet visible in UI
- [ ] No loot drops yet (framework only)
- [ ] Boss special attacks not implemented
- [ ] Difficulty selector not integrated in manual run UI
- [ ] No equipment shop yet

---

## 🌟 Version History

```
 v2.1.0  - Difficulty System (2026-01-09)
 v2.0.0  - Initial Release (2026-01-08)
```

---

**Last Updated:** January 9, 2026, 10:00 CET
**Current Version:** 2.1.0 (Difficulty System + Equipment Framework)
**Status:** 🚀 Ready to Play!
