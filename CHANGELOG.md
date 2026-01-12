# 📝 Changelog

All notable changes to this project will be documented in this file.

---

## [2.3.0] - 2026-01-12

### ✨ Added - Sprint 1: Combat Polish

#### Boss Abilities System
- **4 unique boss abilities:**
  - **AOE Attack** - 150% damage (Cooldown: 3 turns)
  - **Heal** - Restores 20% of max HP (Cooldown: 4 turns)
  - **Rage Mode** - 120-200% damage based on HP (Cooldown: 5 turns)
  - **Shield** - 50% damage reduction for 2 turns (Cooldown: 4 turns)
- **Telegraph system** - Bosses warn before using special abilities
- **Smart boss AI:**
  - Prioritizes Heal when below 40% HP
  - Prioritizes Rage when below 50% HP
  - Random ability selection when multiple available
  - 40% chance to use ability each turn (if off cooldown)
- **Boss status display** - Shows active buffs and telegraphed abilities
- **Shield visual indicator** - Blue ring around boss when shielded

#### Visual Effects System
- **Floating damage numbers:**
  - Rise upward with smooth animation
  - Fade out over 1 second
  - White for normal damage
  - Orange with outline for crits
  - Green for healing
  - Random offset to prevent stacking
- **Screen shake effects:**
  - 3px intensity for normal hits (150ms)
  - 8px intensity for critical hits (250ms)
  - Smooth decay based on time
  - Applied to entire canvas rendering
- **Hit flash animations:**
  - White flash overlay on damaged entity
  - 150ms duration with fade
  - 60% initial opacity
- **Critical hit effects:**
  - Larger text scale (1.5x → 1.8x with pulse)
  - "CRIT!" label above damage
  - Orange color with red outline
  - Stronger screen shake
  - Combined visual impact

#### Combat Integration
- **Delta time animation** - Smooth 60 FPS effects regardless of frame rate
- **Effect update loop** - All effects update in game loop
- **Position-based effects** - Effects spawn at entity screen positions
- **Effect cleanup** - Automatic cleanup when effects expire
- **Boss turn processing** - Cooldowns and shield duration tracked
- **Ability result handling** - Different visual feedback per ability type

### 🔧 Technical Details

#### New Files Created
```
src/manual/boss-abilities.js (7.1 KB)
- initBossAI() - Initialize boss with random 2 abilities
- shouldUseBossAbility() - 40% chance if abilities available
- selectBossAbility() - Smart ability selection based on HP
- telegraphBossAbility() - Show warning message
- executeBossAbility() - Execute telegraphed ability
- processBossTurn() - Update cooldowns and shield
- calculateDamageToBoss() - Apply shield reduction
- getBossStatus() - Get status string for UI
- isBossEnraged() - Check if boss below 30% HP
```

```
src/manual/combat-effects.js (6.7 KB)
- DamageNumber class - Floating damage text with animation
- HitFlash class - Entity flash on damage
- addDamageNumber() - Spawn damage number at position
- triggerScreenShake() - Start screen shake effect
- addHitFlash() - Add hit flash effect
- updateEffects() - Update all active effects (deltaTime)
- renderEffects() - Render all effects to canvas
- getScreenShakeOffset() - Get current shake offset
- clearAllEffects() - Remove all active effects
- triggerCritEffect() - Combo effect for crits
- triggerHitEffect() - Combo effect for normal hits
- triggerHealEffect() - Effect for healing
```

#### Modified Files
```
src/manual/combat-system.js
- Import boss-abilities functions
- Apply shield reduction to hero attacks
- Check for telegraphed abilities in monster turn
- Execute boss abilities with proper timing
- Return extended combat results (shield, ability, telegraph)
- Added processBossTurn() method
```

```
src/manual/dungeon-renderer.js
- Import combat-effects and boss-abilities
- Apply screen shake offset to canvas transform
- Render boss shield indicator (blue ring)
- Render boss status text below HP bar
- Render all visual effects on top layer
- Added getEntityScreenPosition() for effect spawning
```

```
src/manual/manual-run-controller.js
- Import all combat effect functions
- Import initBossAI function
- Initialize boss AI on dungeon generation
- Track lastFrameTime for delta time calculation
- Update effects in game loop with deltaTime
- Trigger visual effects on combat events:
  - triggerCritEffect() for crits
  - triggerHitEffect() for normal hits
  - triggerHealEffect() for boss healing
- Handle boss ability messages in combat log
- Handle telegraph messages
- Process boss turn after monster attack
- Clear all effects on run end
```

### 🎮 Gameplay Impact

#### Combat Feel
- **Before:** Static numbers, no feedback, predictable bosses
- **After:** Dynamic visual feedback, strategic boss fights, satisfying hit impact

#### Boss Fights
- **Before:** Bosses were just high-HP monsters
- **After:** Bosses use unique abilities, players must react to telegraphs

#### Visual Feedback
- **Before:** Only HP bars showed damage
- **After:** Damage numbers, screen shake, flashes, and crits are visually distinct

#### Player Engagement
- **Before:** Autopilot combat
- **After:** Strategic timing, ability prediction, reactive gameplay

### 📊 Balance Notes

#### Boss Abilities
- AOE: 50% damage increase balances 3-turn cooldown
- Heal: 20% HP recovery prevents early boss deaths, creates tension
- Rage: Up to 2x damage at <30% HP - high risk for players
- Shield: 50% reduction makes boss tankier, encourages skill timing

#### Visual Effects Performance
- All effects use requestAnimationFrame (60 FPS)
- Effect cleanup prevents memory leaks
- Maximum ~10-15 effects on screen at once
- No performance impact on older devices

### 🐛 Bug Fixes
- Fixed: Combat-effects SHA mismatch (file was never committed)
- Fixed: Boss abilities not triggering in manual runs
- Fixed: Screen shake not resetting between runs
- Fixed: Damage numbers stacking on same position

### 🛡️ Safety & Compatibility
- All new features are **additive** - no breaking changes
- Bosses work without abilities (backward compatible)
- Visual effects can be disabled by not importing combat-effects
- No save format changes required
- Existing dungeons work perfectly with new systems

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

- **2.3.0** (2026-01-12) - ✨ Sprint 1: Combat Polish (Boss Abilities + Visual Effects)
- **2.2.0** (2026-01-09) - Combat Balance, Loot Overhaul, Equipment Persistence
- **2.1.0** - Base game features
- **2.0.0** - Equipment system added
- **1.0.0** - Initial release

---

## Next Up (Phase 1)

See ROADMAP.md for complete development plan.

### Sprint 2: Skill Tree System (Next)
- [ ] 3 skill trees (Combat/Defense/Utility)
- [ ] 4-5 skills per tree
- [ ] Respec functionality
- [ ] Skill point allocation UI
- [ ] Save/load skill builds

### Sprint 3: Daily Quests
- [ ] Quest system
- [ ] Daily challenges
- [ ] Reward claiming
- [ ] Quest progress tracking

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

**Last Updated:** January 12, 2026  
**Next Review:** After Sprint 2 completion
