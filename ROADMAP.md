# 🗺️ Dungeon Idle Game - Development Roadmap

**Last Updated:** January 13, 2026 (07:35 CET)  
**Current Phase:** Phase 2 - Depth & Progression  
**Current Sprint:** Sprint 4 - Equipment Sets  
**Completed Sprints:** 3/9

---

## 📊 Current Status

### ✅ Completed Features
- [x] Canvas-based Manual Run System
- [x] Procedural Dungeon Generation
- [x] Real-time Combat System
- [x] Equipment System (Weapons, Armor, Accessories)
- [x] Loot System with Rarity Tiers
- [x] Inventory Management
- [x] Save/Load System (Unicode-safe)
- [x] Export/Import functionality
- [x] Difficulty Scaling (Easy/Normal/Hard/Expert)
- [x] Auto-Run System
- [x] Upgrades System
- [x] Achievement System
- [x] **Boss Special Abilities (4 types)** ✨
- [x] **Damage Numbers (floating text)** ✨
- [x] **Screen Shake effects** ✨
- [x] **Critical Hit Visual Effects** ✨
- [x] **Skill Tree System (15 skills, 3 trees)** 🌳
- [x] **Prestige System (12 upgrades)** 🌟
- [x] **Key Currency & Drop System** 🔑
- [x] **Floor-based Difficulty Scaling** 📈

### 🎯 Current Game State
- Manual Dungeon Runs with full visual effects and boss mechanics ✨
- Skill Tree provides build customization across 3 paths 🌳
- Prestige System enables meta-progression with permanent bonuses 🌟
- Equipment persists across sessions
- Keys are earnable from bosses and floor milestones 🔑
- Floor scaling provides endless difficulty curve
- Combat has full visual feedback
- Ready for Equipment Sets implementation

---

## 🚀 Development Phases

---

## **Phase 1: Foundation & Quick Wins** ⚡
**Goal:** Make the game feel "complete" and polished  
**Timeline:** Week 1-2  
**Progress:** ✅ **3/3 sprints complete (100%)**

### **Sprint 1: Combat Polish** ⚔️
**Status:** ✅ **COMPLETE**  
**Priority:** HIGH  
**Completed:** January 12, 2026

**Completed Tasks:**
- [x] Implement Boss Special Abilities
  - [x] AOE Attack (150% damage)
  - [x] Heal ability (boss restores 20% HP)
  - [x] Rage mode (increased damage at low HP, up to 200%)
  - [x] Shield ability (50% damage reduction for 2 turns)
- [x] Add Damage Numbers (floating text on hit)
- [x] Implement Screen Shake on hits
- [x] Add Critical Hit Visual Effects
- [x] Boss telegraph system (warning before special attack)

**Implementation Details:**
- `src/manual/boss-abilities.js` - Complete boss AI system with 4 abilities
- `src/manual/combat-effects.js` - Floating damage numbers, screen shake, hit flashes
- `src/manual/dungeon-renderer.js` - Integration with visual effects system
- `src/manual/combat-system.js` - Boss ability logic in combat
- `src/manual/manual-run-controller.js` - Full integration with delta time animation
- All effects are animated and fade smoothly
- Crit effects have enhanced visuals (orange, larger, stronger shake)
- Boss AI prioritizes abilities based on HP (heal at <40%, rage at <50%)

**Success Criteria:** ✅ ALL MET
- ✅ Bosses have 4 unique abilities with different effects
- ✅ Combat feels more dynamic and engaging
- ✅ Visual feedback for all damage/crits/heals
- ✅ Players can react to boss telegraph warnings
- ✅ Shield visual indicator shows when boss is protected

---

### **Sprint 2: Skill Tree System** 🌳
**Status:** ✅ **COMPLETE**  
**Priority:** HIGH  
**Completed:** January 12, 2026

**Completed Tasks:**
- [x] Design Skill Tree Structure (3 trees)
- [x] Implement Skill Point System (earn on level up)
- [x] Create Combat Tree
  - [x] Lifesteal (5% damage as HP per rank)
  - [x] Double Strike (15% chance to attack twice, +3% per rank)
  - [x] Execute (bonus damage to low HP enemies)
  - [x] Berserker Rage (damage increases as HP decreases)
  - [x] Bloodlust (stacking damage buff on kills)
- [x] Create Defense Tree
  - [x] Dodge Chance (10% avoid attacks, +2% per rank)
  - [x] Block (reduce damage taken by 15%, +3% per rank)
  - [x] Thorns (reflect 10% damage, +2% per rank)
  - [x] Second Wind (heal 20% HP on kill, +4% per rank)
  - [x] Iron Skin (+10% max HP per rank)
- [x] Create Utility Tree
  - [x] Gold Find (15% increase, +3% per rank)
  - [x] Magic Find (10% rare loot chance, +2% per rank)
  - [x] XP Boost (15% faster leveling, +3% per rank)
  - [x] Swift Movement (10% faster dungeon movement, +2% per rank)
  - [x] Lucky Strike (+5% crit chance per rank)
- [x] Build Skill Tree UI
- [x] Add Respec functionality (cost gold)
- [x] Save/Load skill allocations
- [x] Integrate skills into combat system

**Implementation Details:**
- `src/upgrades/skill-tree.js` - Skill definitions and tree structure
- `src/upgrades/skill-effects.js` - Skill bonuses and combat integration
- `ui/skill-tree-ui.js` - UI rendering and interaction
- `skill-tree-styles.css` - Dedicated styling for skill UI
- All 15 skills fully functional in combat
- Skills persist across sessions
- Build diversity with multiple viable paths

**Success Criteria:** ✅ ALL MET
- ✅ 3 skill trees with 5 skills each (15 total)
- ✅ Players can experiment with different builds
- ✅ Skills provide meaningful gameplay changes
- ✅ Respec is available but has a cost
- ✅ All skills integrated into combat mechanics

---

### **Sprint 3: Prestige System** 🌟
**Status:** ✅ **COMPLETE**  
**Priority:** HIGH  
**Completed:** January 12, 2026

**Completed Tasks:**
- [x] Design Prestige Mechanics
- [x] Implement Ascension System
  - [x] Soft reset at Level 20+ for 10 keys
  - [x] Keep: Keys, Prestige Upgrades, Achievements
  - [x] Reset: Hero level, equipment, gold, skills
- [x] Create Key Currency System
  - [x] Keys as prestige currency (start with 0)
  - [x] Boss drops (30% base chance + prestige bonuses)
  - [x] Guaranteed drops at floor milestones (5, 10, 15+)
- [x] Design Prestige Upgrades (12 total)
  - [x] **Stats Category** (4 upgrades)
    - [x] Vitality: +5% max HP per level
    - [x] Power: +3% attack per level
    - [x] Resilience: +3% defense per level
    - [x] Precision: +1% crit chance per level
  - [x] **Resources Category** (4 upgrades)
    - [x] Wealth: +20% gold find per level
    - [x] Experience: +15% XP gain per level
    - [x] Fortune: +10% key drop chance per level
    - [x] Treasure Hunter: +5% better loot per level
  - [x] **Convenience Category** (4 upgrades)
    - [x] Head Start: Start at higher level
    - [x] Key Reserve: Start with more keys
    - [x] Death Ward: Survive fatal hit once per run
    - [x] Skill Master: Start with bonus skill points
- [x] Build Prestige UI
  - [x] Prestige tab with ascension button
  - [x] Stats overview (ascensions, keys spent)
  - [x] Upgrade cards with purchase buttons
  - [x] Active bonuses display
- [x] Add Prestige Statistics
- [x] Save prestige progress
- [x] Apply prestige bonuses to hero stats

**Implementation Details:**
- `src/upgrades/prestige-system.js` - Core prestige logic and calculations
- `ui/prestige-ui.js` - UI rendering and interaction
- `prestige-styles.css` - Dedicated styling for prestige UI
- Keys integrated into auto-run reward system
- Prestige bonuses apply on game start and after ascension
- Exponential cost scaling for upgrades

**Success Criteria:** ✅ ALL MET
- ✅ Players can ascend after reaching Level 20
- ✅ Prestige provides meaningful permanent bonuses
- ✅ Meta-progression loop is engaging
- ✅ Players feel rewarded for restarting
- ✅ Keys are scarce but earnable through gameplay
- ✅ Multiple prestige runs incentivized

---

## **Phase 2: Depth & Progression** 🎮
**Goal:** Add long-term motivation and build diversity  
**Timeline:** Week 2-3  
**Progress:** 0/3 sprints complete (0%)

### **Sprint 4: Equipment Sets** 👔
**Status:** 🔴 Not Started  
**Priority:** HIGH  
**Estimated Time:** 3-4 hours

**Tasks:**
- [ ] Implement Set Bonus System
- [ ] Design Equipment Sets
  - [ ] Dragon Set (high damage, crit focused)
  - [ ] Guardian Set (tank/defense focused)
  - [ ] Shadow Set (crit chance, dodge)
  - [ ] Mage Set (magic damage, utility)
- [ ] Add Set Bonuses
  - [ ] 2-piece bonus
  - [ ] 3-piece bonus (full set)
- [ ] Update Loot Tables for set items
- [ ] Build Set Collection UI
- [ ] Show active set bonuses in UI

**Success Criteria:**
- 3-4 complete equipment sets
- Set bonuses provide meaningful build options
- Players have incentive to collect full sets
- Sets synergize with skill tree choices

---

### **Sprint 5: ~~Prestige System~~ (MERGED INTO SPRINT 3)** 🌟
**Status:** ✅ **COMPLETED IN SPRINT 3**  

This sprint was merged into Sprint 3 and completed on January 12, 2026.
See Sprint 3 above for full details.

---

### **Sprint 6: Dungeon Modifiers** 🎲
**Status:** 🔴 Not Started  
**Priority:** MEDIUM  
**Estimated Time:** 3-4 hours

**Tasks:**
- [ ] Implement Modifier System
- [ ] Create Dungeon Affixes
  - [ ] Cursed: +50% monster HP, +100% loot
  - [ ] Speed Run: 60 second time limit
  - [ ] Elite: Only bosses, better rewards
  - [ ] Fragile: -50% hero HP, +150% gold
  - [ ] Chaotic: Random effects each room
  - [ ] Infernal: Fire damage over time
  - [ ] Frozen: Slowed movement
  - [ ] Lucky: Double loot chance
- [ ] Show modifiers in dungeon selection
- [ ] Scale rewards based on difficulty
- [ ] Random modifier assignment
- [ ] Optional: Let players choose modifiers for bonus rewards

**Success Criteria:**
- 8-10 different modifiers
- Each run feels unique
- High-risk modifiers have high rewards
- Players can strategize around modifiers

---

## **Phase 3: Endgame & Polish** 🏆
**Goal:** Long-term content and replayability  
**Timeline:** Week 4+

### **Sprint 7: Infinite Tower** 🗼
**Status:** 🔴 Not Started  
**Priority:** HIGH  
**Estimated Time:** 4-5 hours

**Tasks:**
- [ ] Design Infinite Tower Mode
- [ ] Implement Floor Scaling (exponential difficulty)
- [ ] Create Tower-specific Loot
- [ ] Build Leaderboard System (localStorage-based)
- [ ] Add Tower Entry Cost (keys/gems)
- [ ] Scale rewards with floor number
- [ ] Add Tower Statistics
- [ ] Special bosses every 10 floors

**Success Criteria:**
- Endless progression mode
- Difficulty scales infinitely
- Leaderboard tracks best runs
- Provides true endgame challenge

---

### **Sprint 8: Crafting System** 🔨
**Status:** 🔴 Not Started  
**Priority:** MEDIUM  
**Estimated Time:** 5-6 hours

**Tasks:**
- [ ] Design Crafting Mechanics
- [ ] Add Material Drops from Monsters
- [ ] Implement Material Types
  - [ ] Leather, Iron, Steel, Mithril, etc.
- [ ] Create Crafting Recipes
- [ ] Build Crafting UI
- [ ] Add Equipment Upgrade System
  - [ ] Upgrade rarity (Common → Uncommon, etc.)
  - [ ] Upgrade stats (+1/+2/+3)
- [ ] Implement Reforge System (re-roll stats)
- [ ] Add Socket System (insert gems for bonuses)
- [ ] Save crafting materials

**Success Criteria:**
- Players can upgrade existing equipment
- Materials have value (not just sell)
- Crafting provides alternative to pure RNG
- Bad loot becomes useful (salvage for materials)

---

### **Sprint 9: Pets & Companions** 🐕
**Status:** 🔴 Not Started  
**Priority:** LOW  
**Estimated Time:** 4-5 hours

**Tasks:**
- [ ] Design Pet System
- [ ] Create Pet Types
  - [ ] Dog: +5% gold find
  - [ ] Cat: +5% crit chance
  - [ ] Dragon: deals fire damage
  - [ ] Wolf: increases attack speed
  - [ ] Owl: +10% XP gain
- [ ] Implement Pet Drops (rare from bosses)
- [ ] Build Pet UI & Management
- [ ] Add Pet Leveling System
- [ ] Pet active abilities in combat
- [ ] Pet collection tracking
- [ ] Save pet data

**Success Criteria:**
- 5-8 different pets
- Pets provide meaningful bonuses
- Pet combat is visible/impactful
- Collection aspect is engaging

---

## **Phase 4: Extra Polish** ✨
**Goal:** Game juice and quality of life  
**Timeline:** Ongoing

### **Polish Tasks** (No specific sprint)
- [ ] Add Sound Effects
  - [ ] Sword slash sounds
  - [ ] Loot drop "ding"
  - [ ] Level up fanfare
  - [ ] Boss roar
  - [ ] UI click sounds
- [ ] Enhanced Particle Systems
  - [ ] Damage particles
  - [ ] Loot sparkle
  - [ ] Level up burst
  - [ ] Critical hit explosion
- [ ] Story/Lore
  - [ ] Boss defeat flavor text
  - [ ] NPC in hub with quests
  - [ ] Unlockable lore snippets
  - [ ] Achievement lore descriptions
- [ ] Quality of Life
  - [ ] Minimap for dungeons
  - [ ] Auto-loot option
  - [ ] Quick-equip from loot screen
  - [ ] Bulk sell items
  - [ ] Item comparison tooltips
- [ ] Seasonal Events Framework
  - [ ] Halloween theme
  - [ ] Christmas theme
  - [ ] Limited-time dungeons
- [ ] Hardcore/Permadeath Mode
  - [ ] One life challenge
  - [ ] Separate leaderboard
  - [ ] Better rewards

---

## 📈 Success Metrics

### Engagement
- Average session length
- Daily return rate
- Prestige count per player
- Skill tree diversity (build variety)

### Balance
- Win rate per difficulty
- Average run completion time
- Equipment distribution
- Skill usage statistics
- Prestige upgrade popularity

### Progression
- Average level reached
- Deepest floor reached
- Prestige level distribution
- Key earning rate

---

## 🔄 Development Workflow

### For Each Sprint:
1. **Read existing code** - Understand current implementation
2. **Plan changes** - Design without breaking existing features
3. **Implement incrementally** - Test after each major change
4. **Add safety checks** - Null checks, fallbacks, error handling
5. **Update CHANGELOG.md** - Document all changes
6. **Test thoroughly** - Verify no regressions
7. **Update STATUS.md** - Reflect current state
8. **Mark sprint complete** - Update this roadmap

### Safety Guidelines:
- ✅ Never overwrite working functions without backup
- ✅ Add new features as optional/toggleable when possible
- ✅ Defensive coding (null checks, try-catch)
- ✅ Test existing features after changes
- ✅ Keep save/load compatibility

---

## 📝 Notes

### Current Technical Debt
- None significant - codebase is clean and modular
- Documentation slightly behind (being updated Jan 13)

### Recent Achievements
- Triple sprint completion in one day (Jan 12)!
- Phase 1 completed (100%)
- Meta-progression fully implemented
- Build diversity with skill trees
- Visual polish with effects system

### Future Considerations
- Mobile responsiveness
- Touch controls for canvas
- Cloud save backup
- Multiplayer/Co-op (far future)

---

## 🎯 Next Steps

**When resuming development:**
1. Check this ROADMAP.md for current phase
2. Review CHANGELOG.md for recent changes
3. Read STATUS.md for current game state
4. Read the relevant system files before modifying
5. Follow the current sprint tasks
6. Update all documentation after completing work

**Current Sprint:** Sprint 4 - Equipment Sets  
**Next Task:** Design 3-4 Equipment Sets with synergies

**Current Version:** 2.5.0  
**Current Phase:** Phase 2 - Depth & Progression (0/3 sprints)

---

## 🏆 Completed Sprints

### ✅ Sprint 1: Combat Polish (Jan 12, 2026)
**What was added:**
- Boss abilities system with 4 unique abilities (AOE, Heal, Rage, Shield)
- Telegraph system for boss attacks (warnings before special moves)
- Floating damage numbers with smooth animations
- Screen shake on hits (3px normal, 8px for crits)
- Critical hit visual effects (orange text, outline, larger scale)
- Hit flash animations (white flash on damage)
- Boss shield visual indicator (blue ring around boss)
- Smart boss AI (prioritizes heal at <40% HP, rage at <50% HP)

**Files Created/Modified:**
- `src/manual/boss-abilities.js` - New file
- `src/manual/combat-effects.js` - New file
- `src/manual/combat-system.js` - Updated
- `src/manual/dungeon-renderer.js` - Updated
- `src/manual/manual-run-controller.js` - Updated

**Impact:**
- Combat feels dynamic and engaging with real-time feedback
- Visual feedback makes hits feel impactful and satisfying
- Boss fights are strategic, not just stat checks
- Players can react to telegraphed abilities
- Screen shake and damage numbers add "juice" to combat

---

### ✅ Sprint 2: Skill Tree System (Jan 12, 2026)
**What was added:**
- Skill Tree System with 3 trees (Combat, Defense, Utility)
- 15 unique skills with 5 ranks each (75 total progression points)
- Skill Point System (1 point per level up)
- Combat Tree: Lifesteal, Double Strike, Execute, Berserker, Bloodlust
- Defense Tree: Dodge, Block, Thorns, Second Wind, Iron Skin
- Utility Tree: Gold Find, Magic Find, XP Boost, Swift Movement, Lucky Strike
- Skill Tree UI with 3 tabs and visual indicators
- Respec functionality (costs gold based on total spent points)
- Full combat integration for all skill effects
- Active skills summary display

**Files Created:**
- `src/upgrades/skill-tree.js` - Skill definitions and logic
- `src/upgrades/skill-effects.js` - Skill bonus calculations
- `ui/skill-tree-ui.js` - UI rendering and interaction
- `skill-tree-styles.css` - Dedicated styling

**Files Modified:**
- `src/core/game-state.js` - Added skills and skillEffects
- `src/manual/combat-system.js` - Integrated skill effects
- `index.html` - Added Skills tab
- `main.js` - Initialize and update skill tree

**Impact:**
- Build diversity - multiple viable skill paths
- Player agency in character development
- Replayability through different builds
- Skills synergize with equipment choices
- Meaningful choices on every level up

---

### ✅ Sprint 3: Prestige System (Jan 12, 2026)
**What was added:**
- Prestige/Ascension system (unlock at Level 20)
- Keys as prestige currency (start with 0, must earn)
- Soft reset mechanic (costs 10 keys)
- 12 Prestige Upgrades across 3 categories:
  - **Stats:** Vitality, Power, Resilience, Precision
  - **Resources:** Wealth, Experience, Fortune, Treasure Hunter
  - **Convenience:** Head Start, Key Reserve, Death Ward, Skill Master
- Key drop system:
  - 30% base chance from bosses
  - Guaranteed drops at floor milestones (5, 10, 15+)
  - Prestige bonuses increase drop rate
- Prestige UI with stats tracking
- Prestige level tracking (total ascensions)
- Active bonuses display
- Integration with hero stats calculation

**Files Created:**
- `src/upgrades/prestige-system.js` - Core prestige logic
- `ui/prestige-ui.js` - UI rendering and interaction
- `prestige-styles.css` - Dedicated styling

**Files Modified:**
- `src/core/game-state.js` - Added prestige data
- `src/core/auto-run.js` - Added key drops to rewards
- `src/core/combat.js` - Apply prestige bonuses
- `index.html` - Added Prestige tab
- `main.js` - Initialize and integrate prestige

**Impact:**
- Meta-progression loop for long-term engagement
- Incentive to restart and optimize builds
- Permanent character power growth
- Strategic decision-making on when to prestige
- Multiple runs feel meaningful and rewarding

---

**Remember:** Quality over speed. Each feature should feel polished and not break existing gameplay! 🛡️

**Phase 1 Complete!** 🎉 Moving to Phase 2 - Equipment Sets next!