# 📝 Changelog

All notable changes to this project will be documented in this file.

---

## [2.5.0] - 2026-01-12

### ✨ Added - Sprint 3: Prestige System

#### Ascension/Prestige Mechanics
- **Prestige System** - Meta-progression loop with permanent bonuses
  - Unlock at Level 20+
  - Costs 10 keys to ascend
  - Soft reset: Keep keys, prestige upgrades, achievements
  - Reset: Hero level, equipment, gold, skills, inventory
- **Prestige Level Tracking** - Total ascensions counter
- **Prestige Statistics** - Tracks ascensions and keys spent

#### Key Currency System
- **Keys as prestige currency**
  - Start with 0 keys (must earn through gameplay)
  - Boss drops: 30% base chance + prestige bonuses
  - Guaranteed drops at floor milestones (5, 10, 15+)
  - Keys persist through ascension
- **Key drop integration** with auto-run reward system
- **Fortune prestige upgrade** increases key drop chance

#### Prestige Upgrades (12 Total)
**Stats Category (4 upgrades):**
- **Vitality** - +5% max HP per level (max 5 levels)
- **Power** - +3% attack per level (max 5 levels)
- **Resilience** - +3% defense per level (max 5 levels)
- **Precision** - +1% crit chance per level (max 5 levels)

**Resources Category (4 upgrades):**
- **Wealth** - +20% gold find per level (max 5 levels)
- **Experience** - +15% XP gain per level (max 5 levels)
- **Fortune** - +10% key drop chance per level (max 5 levels)
- **Treasure Hunter** - +5% better loot rarity per level (max 5 levels)

**Convenience Category (4 upgrades):**
- **Head Start** - Start at higher level (2/4/6/8/10)
- **Key Reserve** - Start with more keys (1/2/3/5/10)
- **Death Ward** - Survive one fatal hit per run (max 1 level)
- **Skill Master** - Start with bonus skill points (1/2/3/5/10)

#### Prestige UI
- **New Prestige Tab** in navigation
- **Prestige Stats Header** - Shows ascensions, keys, keys spent
- **Ascension Panel** - Warning message and ascension button
- **Upgrade Categories** - Three sections (Stats, Resources, Convenience)
- **Upgrade Cards** - Shows level, cost, next bonus, purchase button
- **Active Bonuses Display** - Summary of all active prestige effects
- **Prestige-specific CSS** - Dedicated styling (prestige-styles.css)

### 🔧 Technical Details

#### New Files Created
```
src/upgrades/prestige-system.js (8.2 KB)
- PRESTIGE_UPGRADES - All 12 upgrade definitions
- canAscend() - Check if player meets requirements
- performAscension() - Execute soft reset
- canPurchaseUpgrade() - Validate upgrade purchase
- purchasePrestigeUpgrade() - Buy and apply upgrade
- getPrestigeBonus() - Calculate total bonus for stat
- applyPrestigeBonuses() - Apply all bonuses to hero
- getActiveUpgrades() - Get list of purchased upgrades
```

```
ui/prestige-ui.js (6.8 KB)
- initPrestigeUI() - Setup prestige tab
- renderPrestigeTab() - Render entire prestige UI
- renderPrestigeStats() - Render stats header
- renderAscensionPanel() - Render ascension button/warning
- renderUpgradeCategories() - Render all upgrade cards
- renderUpgradeCard() - Render single upgrade
- handlePrestigeUpgradePurchase() - Purchase button handler
- handleAscensionClick() - Ascension button handler
```

```
prestige-styles.css (6.0 KB)
- Prestige-specific styling
- Stats header design
- Ascension panel warnings
- Upgrade category grid layout
- Upgrade card styling (locked/unlocked states)
- Purchase button states
- Active bonuses summary panel
```

#### Modified Files
```
src/core/game-state.js
- Added prestigeLevel: 0
- Added prestigeUpgrades: {}
- Added prestigeStats: { ascensions, keysSpent }
- Updated version to 2.5.0
- Keys now start at 0 (was 5)
```

```
src/core/auto-run.js
- Import prestige-system functions
- Added key drops to reward calculation
- 30% base chance for boss key drops
- Guaranteed keys at floor milestones
- Apply prestige Fortune bonus to key chance
```

```
src/manual/combat-system.js
- Import applyPrestigeBonuses
- Apply prestige bonuses to hero stats before combat
```

```
index.html
- Added Prestige tab button
- Added prestige-tab panel
- Linked prestige-styles.css
- Updated version to 2.5.0
```

```
main.js
- Import prestige UI functions
- Initialize prestige UI on load
- Apply prestige bonuses on game start
- Render prestige tab when active
- Update version logs to 2.5.0
```

### 🎮 Gameplay Impact

#### Meta-Progression
- **Before:** No reason to restart after reaching endgame
- **After:** Strategic ascension provides permanent power growth

#### Key Currency
- **Before:** Keys were freely given (5 at start)
- **After:** Keys must be earned, creating value and scarcity

#### Build Diversity
- **Before:** Single playthrough, linear progression
- **After:** Multiple builds through prestige specialization

#### Long-Term Engagement
- **Before:** Game ends when you beat highest difficulty
- **After:** Endless progression loop with prestige levels

### 📊 Balance Notes

#### Ascension Requirements
- Level 20+ ensures players experience core game first
- 10 keys cost creates meaningful decision (not too easy/hard)
- ~3-5 runs needed before first ascension

#### Upgrade Costs
- Exponential scaling: keys * (level + 1)
- Level 1: 1 key, Level 2: 2 keys, Level 3: 3 keys, etc.
- Total to max one upgrade (5 levels): 15 keys
- Total to max all 12 upgrades: 180 keys (long-term goal)

#### Key Drop Rates
- 30% base from bosses (balanced for ~3 keys per 10 runs)
- Fortune upgrade adds +10% per level (max +50%)
- Milestone guarantees prevent bad RNG streaks
- Floor 5: +1 key, Floor 10: +2 keys, Floor 15+: +3 keys

### 🐛 Bug Fixes
- Fixed: Prestige bonuses not applying after page reload
- Fixed: Keys not saving properly in game state
- Fixed: Ascension button clickable when requirements not met
- Fixed: Prestige upgrades not persisting through sessions

### 🛡️ Safety & Compatibility
- Backward compatible with existing saves
- Players without prestige data start at 0 (no prestige)
- All prestige features are optional/additive
- No breaking changes to core gameplay
- Existing game state migrates seamlessly

---

## [2.4.1] - 2026-01-12

### 🔧 Balance & Polish

#### Monster Difficulty Scaling
- **Increased HP scaling:** 1.15^floor → 1.20^floor
- **Increased Attack scaling:** 1.12^floor → 1.18^floor  
- **Increased Boss multiplier:** 5x → 6x (HP and Attack)
- **Floor-based scaling** now uses deepestFloor from stats
- **Example Floor 10:** 6.2x HP (was 3.5x)
- **Example Floor 15:** 15.4x HP (was 8.1x)
- **Example Floor 20:** 38.3x HP (was 18.7x)

#### Class System Removal
- **Removed weapon class system** - never fully implemented
- **Removed WEAPON_CLASSES** constant from equipment
- **Simplified equipment** to pure stat-based system
- **Removed class display** from manual run UI
- Hero is now simply "Adventurer" (no class selection)
- **Rationale:** Skill tree provides build diversity instead

### 📊 Balance Impact
- Endgame significantly more challenging
- Compensates for skill tree power increases
- Forces strategic skill and equipment choices
- Expert difficulty now truly difficult at high floors

### 🐛 Bug Fixes
- Fixed: Floor scaling not applying to dungeon generation
- Fixed: Class references causing confusion in UI

---

## [2.4.0] - 2026-01-12

### ✨ Added - Sprint 2: Skill Tree System

#### Skill Tree Framework
- **3 Skill Trees:** Combat, Defense, Utility
- **15 Unique Skills** (5 per tree)
- **5 Ranks per skill** (75 total progression points)
- **Skill Point System** - Earn 1 point per level up
- **Respec Functionality** - Reset skills for gold cost

#### Combat Tree (5 Skills)
- **Lifesteal** - Heal for 5% of damage dealt per rank (max 25%)
- **Double Strike** - 15% chance to attack twice, +3% per rank (max 30%)
- **Execute** - +10% damage to enemies below 30% HP, +2% per rank (max 20%)
- **Berserker Rage** - +5% damage per 10% missing HP, +1% per rank (max 10%)
- **Bloodlust** - +2% damage per kill (stacks up to 10x), +0.5% per rank

#### Defense Tree (5 Skills)
- **Dodge Chance** - 10% chance to avoid attacks, +2% per rank (max 20%)
- **Block** - Reduce damage by 15%, +3% per rank (max 30%)
- **Thorns** - Reflect 10% of damage taken, +2% per rank (max 20%)
- **Second Wind** - Heal 20% max HP on kill, +4% per rank (max 40%)
- **Iron Skin** - +10% max HP per rank (max 50%)

#### Utility Tree (5 Skills)
- **Gold Find** - +15% gold from all sources, +3% per rank (max 30%)
- **Magic Find** - +10% better loot rarity, +2% per rank (max 20%)
- **XP Boost** - +15% XP gain, +3% per rank (max 30%)
- **Swift Movement** - +10% faster dungeon movement, +2% per rank (max 20%)
- **Lucky Strike** - +5% crit chance per rank (max 25%)

#### Skill Tree UI
- **New Skills Tab** in navigation
- **Skill Tree Selector** - Switch between 3 trees
- **Skill Cards** - Visual skill representation with:
  - Current rank and max rank
  - Description and effects
  - Cost (1 skill point)
  - Lock state indicators
- **Available Points Display** - Shows unspent skill points
- **Respec Button** - Reset all skills (cost scales with spent points)
- **Active Skills Summary** - Shows all bonuses at a glance
- **Skill-specific CSS** - Dedicated styling (skill-tree-styles.css)

#### Skill Integration
- **Combat Skills** - Applied during manual/auto combat
- **Defense Skills** - Dodge, block, thorns work in combat
- **Utility Skills** - Affect gold, XP, loot, movement speed
- **Bloodlust Stacks** - Tracked per combat encounter
- **Skill Persistence** - All skills save/load correctly

### 🔧 Technical Details

#### New Files Created
```
src/upgrades/skill-tree.js (9.5 KB)
- SKILL_TREES - All 15 skill definitions
- MAX_SKILL_RANK = 5
- unlockSkill() - Spend point to learn/upgrade skill
- canUnlockSkill() - Validate skill unlock
- getSkillRank() - Get current skill level
- getTotalSkillPoints() - Calculate total spent points
- getRespecCost() - Calculate respec gold cost
- respecSkills() - Reset all skills and refund points
```

```
src/upgrades/skill-effects.js (7.8 KB)
- applySkillBonuses() - Apply all passive skill effects to hero
- getSkillBonus() - Calculate specific skill bonus
- handleLifesteal() - Lifesteal healing calculation
- handleDoubleStrike() - Check for double attack proc
- handleExecute() - Execute damage bonus calculation
- handleBerserkerRage() - Damage based on missing HP
- handleBloodlust() - Manage bloodlust stacks
- handleDodge() - Dodge chance calculation
- handleBlock() - Block damage reduction
- handleThorns() - Thorns damage reflection
- handleSecondWind() - Heal on kill
- applyCombatSkills() - Apply all combat skills to damage
- applyDefenseSkills() - Apply all defense skills to incoming damage
- applyUtilitySkills() - Apply gold/XP/loot bonuses
```

```
ui/skill-tree-ui.js (8.9 KB)
- initSkillTreeUI() - Setup skill tree tab
- renderSkillTree() - Render entire skill UI
- renderSkillTreeSelector() - Render tree tabs
- renderSkillHeader() - Render points and respec button
- renderSkillCards() - Render all skills in active tree
- renderSkillCard() - Render single skill card
- renderActiveSkillsSummary() - Render active bonus list
- handleSkillUnlock() - Unlock button click handler
- handleTreeSwitch() - Tree tab click handler
- handleRespec() - Respec button click handler
- refreshSkillTree() - Update skill UI display
```

```
skill-tree-styles.css (8.1 KB)
- Skill tree tab selector styling
- Skill header with points display
- Skill card grid layout
- Skill card states (locked/unlockable/maxed)
- Rank indicators and progress
- Unlock button styling
- Respec button design
- Active skills summary panel
- Hover effects and animations
```

#### Modified Files
```
src/core/game-state.js
- Added skills: {} to store skill ranks
- Added skillEffects: {} for active bonuses
- Added bloodlustStacks: 0 for combat tracking
- Updated version to 2.4.0
```

```
src/manual/combat-system.js
- Import skill-effects functions
- Apply skill bonuses to hero stats
- Handle lifesteal healing
- Handle double strike proc
- Apply execute/berserker/bloodlust damage
- Handle dodge/block/thorns/second wind
- Award skill points on level up
- Reset bloodlust stacks on combat end
```

```
src/core/auto-run.js
- Import skill-effects functions
- Apply skill bonuses to auto-run combat
- Apply gold/XP multipliers from skills
```

```
index.html
- Added Skills tab button
- Added skills-tab panel
- Linked skill-tree-styles.css
- Updated version to 2.4.0
```

```
main.js
- Import skill tree UI functions
- Initialize skill tree UI on load
- Refresh skill tree on level up
- Apply skill bonuses on game start
- Update version logs to 2.4.0
```

### 🎮 Gameplay Impact

#### Build Diversity
- **Before:** All players had identical progression
- **After:** Multiple viable builds (DPS, Tank, Balanced, Farmer)

#### Strategic Depth
- **Before:** Level up = automatic stat increase
- **After:** Meaningful choices on every level up

#### Replayability
- **Before:** One playthrough felt identical to another
- **After:** Different skill builds create unique experiences

#### Player Agency
- **Before:** Passive progression, no player input
- **After:** Active decision-making in character development

### 📊 Balance Notes

#### Skill Costs
- All skills cost 1 point per rank (simple, consistent)
- Total points needed for full tree: 25 points (5 skills × 5 ranks)
- Average player at level 20: ~20 skill points available
- Forces specialization (can't max everything)

#### Respec Cost
- Formula: Total spent points × 100 gold
- 10 points spent: 1,000 gold
- 20 points spent: 2,000 gold
- Allows experimentation without being free

#### Skill Power Levels
- Combat tree: High damage output (DPS builds)
- Defense tree: Survivability (Tank builds)
- Utility tree: Faster progression (Farmer builds)
- No single "best" tree - all viable

### 🐛 Bug Fixes
- Fixed: Skills not saving after page reload
- Fixed: Bloodlust stacks not resetting between runs
- Fixed: Skill bonuses not applying to auto-runs
- Fixed: Respec button clickable when no skills learned

### 🛡️ Safety & Compatibility
- Backward compatible with existing saves
- Players without skills start with empty skill tree
- All skills are optional/additive
- No breaking changes to core gameplay
- Existing combat system enhanced, not replaced

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

### Features (Before 2026-01-09)
- Basic manual run system
- Equipment system
- Loot drops
- Save/load functionality
- Upgrade system
- Achievement system
- Auto-run system

---

## Version History

- **2.5.0** (2026-01-12) - 🌟 Sprint 3: Prestige System (Meta-Progression)
- **2.4.1** (2026-01-12) - ⚖️ Balance Patch (Monster Scaling + Class System Removal)
- **2.4.0** (2026-01-12) - 🌳 Sprint 2: Skill Tree System (15 Skills, 3 Trees)
- **2.3.0** (2026-01-12) - ✨ Sprint 1: Combat Polish (Boss Abilities + Visual Effects)
- **2.2.0** (2026-01-09) - Combat Balance, Loot Overhaul, Equipment Persistence
- **2.1.0** - Base game features
- **2.0.0** - Equipment system added
- **1.0.0** - Initial release

---

## Phase 1 Complete! 🎉

**All Phase 1 sprints (Foundation & Quick Wins) are complete:**
- ✅ Sprint 1: Combat Polish
- ✅ Sprint 2: Skill Tree System
- ✅ Sprint 3: Prestige System

**Moving to Phase 2 - Depth & Progression:**
- 🔴 Sprint 4: Equipment Sets (Next)
- 🔴 Sprint 6: Dungeon Modifiers
- 🔴 Sprint 7: Infinite Tower

See ROADMAP.md for complete development plan.

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

**Last Updated:** January 13, 2026, 07:48 CET  
**Current Version:** 2.5.0  
**Next Sprint:** Sprint 4 - Equipment Sets