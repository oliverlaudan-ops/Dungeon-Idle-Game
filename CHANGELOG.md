# 📝 Changelog

All notable changes to this project will be documented in this file.

---

## [2.2.0] - 2026-01-09

### ✨ Added

#### Manual Run System Restoration
- **Canvas-based dungeon renderer** (800x500px canvas)
- **Procedural dungeon generation** with rooms, corridors, and exit doors
- **Real-time combat system** - walk into monsters to attack
- **Keyboard controls** - WASD and Arrow keys
- **Exit door rendering** - now visible on canvas
- **Combat victory/defeat handling** with proper UI feedback

#### Loot System Overhaul
- **Massively increased drop rates:**
  - Easy: 15% → 50% (1-2 items)
  - Normal: 25% → 75% (1-2 items)
  - Hard: 35% → 85% (2-3 items)
  - Expert: 50% → **100% GUARANTEED** (2-4 items)
- **Debug logging** for loot generation (console)
- **Boss loot** - guaranteed drops with higher quantities
- **Loot notifications** with rarity emojis

#### Equipment Persistence
- **Added `inventory` array to gameState** - stores all equipment
- **Added `equipped` object to gameState** - tracks equipped items
- **Auto-save on equipment operations:**
  - Save when equipping items
  - Save when unequipping items
  - Save when selling items
- **Equipment survives page refresh** (F5)
- **Debug logging** for save/load operations

#### Export/Import System Fix
- **Unicode-safe export/import** using TextEncoder/TextDecoder
- **Supports emojis and all Unicode characters** in save data
- **Fixed btoa/atob** Latin1 limitation
- **Both game-state.js and save-manager.js updated**

### 🔧 Fixed

#### Canvas & Rendering
- **Fixed canvas size** - increased from 600x400 to 800x500
- **Fixed grid rendering** - all rooms now visible (no more off-screen)
- **Fixed exit door visibility** - properly rendered at bottom of dungeon
- **Fixed room offsets** - adjusted to 50px X, 80px Y

#### Combat & Balance
- **Increased monster base stats:**
  - Goblin: 30→40 HP, 5→8 ATK
  - Orc: 50→60 HP, 8→12 ATK
  - Skeleton: 40→50 HP, 7→10 ATK
  - Troll: 70→80 HP, 10→15 ATK
- **Adjusted difficulty multipliers:**
  - Easy: 0.6x (unchanged)
  - Normal: 1.0x (unchanged)
  - Hard: 1.3x → 1.8x
  - Expert: 1.6x → 2.8x
- **Increased boss multiplier:** 3x → 4x
- **More monsters per room:** 1-3 → 2-4
- **Expert difficulty is now significantly harder**

#### Equipment System
- **Fixed equipment disappearing on page reload**
- **Fixed stats not recalculating properly**
- **Added proper null checks** for inventory/equipped
- **Fixed equipped items not showing in UI after reload**
- **Improved equipment ID generation** to prevent duplicates

#### Save System
- **Fixed export failing with Unicode characters**
- **Fixed import not preserving emoji icons**
- **Added inventory/equipped to save state**
- **Improved save/load validation**
- **Better error messages** for failed imports

### 🐛 Bug Fixes
- Fixed: Manual run grid was partially off-screen
- Fixed: No loot received after completing dungeons
- Fixed: Expert difficulty was too easy (completable without equipment)
- Fixed: Equipment disappeared after F5 refresh
- Fixed: Export save crashed with "Latin1 range" error
- Fixed: Equipped items not persisting across sessions

### 📊 Balance Changes

#### Drop Rates
```
Easy:   15% → 50%  (+233% increase)
Normal: 25% → 75%  (+200% increase)
Hard:   35% → 85%  (+143% increase)
Expert: 50% → 100% (GUARANTEED)
```

#### Difficulty Scaling
```
Hard:   1.3x → 1.8x  (+38% harder)
Expert: 1.6x → 2.8x  (+75% harder)
Boss:   3.0x → 4.0x  (+33% harder)
```

#### Example Expert Difficulty Stats
- Goblin: 112 HP, 22 ATK
- Orc: 168 HP, 34 ATK
- Skeleton: 140 HP, 28 ATK
- Troll: 224 HP, 42 ATK
- Boss Troll: **896 HP, 168 ATK**

### 📝 Documentation
- **Added ROADMAP.md** - Complete development roadmap
- **Added CHANGELOG.md** - This file
- **Improved code comments** throughout codebase
- **Added debug logging** for key systems

### ⚙️ Technical Changes

#### game-state.js
- Added `inventory: []`
- Added `equipped: { weapon, armor, accessory }`
- Bumped version to `2.2.0`
- Enhanced save/load with debug logging
- Implemented Unicode-safe export/import
- Added TextEncoder/TextDecoder for UTF-8 support

#### equipment-system.js
- Imported `saveGame` from game-state
- Added `saveGame()` calls to:
  - `equipItem()`
  - `unequipItem()`
  - `sellEquipment()`
- Improved `recalculateStats()` to account for hero level
- Added crit chance cap at 100%
- Better equipment ID generation
- Enhanced debug logging

#### loot-system.js
- Increased all drop rates significantly
- Added comprehensive debug logging
- Enhanced `generateLootDrops()` with console output
- Improved `addLootToInventory()` logging
- Boss loot now drops 2-3+ items

#### save-manager.js
- Updated `exportSave()` to use Unicode-safe method
- Updated `importSave()` with TextDecoder
- Added inventory/equipped validation
- Better error handling

#### manual-run-renderer.js
- Increased canvas size to 800x500
- Adjusted room rendering offsets
- Fixed exit door rendering
- Improved grid visibility

#### monster-stats.js
- Increased base HP/ATK for all monsters
- Adjusted difficulty multipliers
- Increased boss multiplier to 4x
- More monsters spawn per room

### 🛡️ Safety & Stability
- All changes are backward compatible
- Existing saves will load correctly
- New properties have fallback defaults
- No breaking changes to existing features
- Extensive null checks added throughout

---

## [2.1.0] - Previous Version

### Features (Before Today)
- Basic manual run system
- Equipment system
- Loot drops
- Save/load functionality
- Upgrade system
- Achievement system
- Auto-run system

---

## Version History

- **2.2.0** (2026-01-09) - Combat Polish, Loot Overhaul, Equipment Persistence
- **2.1.0** - Base game features
- **2.0.0** - Equipment system added
- **1.0.0** - Initial release

---

## Next Up (Phase 1)

See ROADMAP.md for complete development plan.

### Sprint 1: Combat Polish (Next)
- [ ] Boss special abilities
- [ ] Damage numbers
- [ ] Screen shake
- [ ] Critical hit effects

### Sprint 2: Skill Tree
- [ ] 3 skill trees (Combat/Defense/Utility)
- [ ] 4-5 skills per tree
- [ ] Respec functionality

### Sprint 3: Daily Quests
- [ ] Quest system
- [ ] Daily challenges
- [ ] Reward claiming

---

## Notes

### Development Workflow
1. Each sprint gets its own changelog section when complete
2. Document ALL changes (additions, fixes, balance)
3. Include code file names that were modified
4. Note any breaking changes or migration steps
5. Update version number in game-state.js

### Commit Message Format
```
type: short description

Longer explanation if needed.

Affects: file1.js, file2.js
Closes: #issue-number (if applicable)
```

**Types:** feat, fix, docs, style, refactor, test, chore

---

**Last Updated:** January 9, 2026  
**Next Review:** After Sprint 1 completion
