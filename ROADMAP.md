# 🗺️ Dungeon Idle Game - Development Roadmap

**Last Updated:** January 12, 2026 (08:20 CET)  
**Current Phase:** Phase 1 - Foundation & Quick Wins  
**Current Sprint:** Sprint 2 - Skill Tree System  
**Completed Sprints:** 1/9

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

### 🎯 Current Game State
- Manual Dungeon Runs working perfectly with visual effects
- Equipment persists across sessions
- Loot drops with balanced rates (Expert = 100% guaranteed)
- Combat has full visual feedback and boss mechanics ✨
- Boss AI with 4 unique abilities and telegraph system
- Ready for skill tree implementation

---

## 🚀 Development Phases

---

## **Phase 1: Foundation & Quick Wins** ⚡
**Goal:** Make the game feel "complete" and polished  
**Timeline:** Week 1-2  
**Progress:** 1/3 sprints complete

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
**Status:** 🔴 Not Started  
**Priority:** HIGH  
**Estimated Time:** 4-5 hours

**Tasks:**
- [ ] Design Skill Tree Structure (3 trees)
- [ ] Implement Skill Point System (earn on level up)
- [ ] Create Combat Tree
  - [ ] Lifesteal (5% damage as HP)
  - [ ] Double Strike (15% chance to attack twice)
  - [ ] Execute (bonus damage to low HP enemies)
  - [ ] Berserker Rage (damage increases as HP decreases)
- [ ] Create Defense Tree
  - [ ] Dodge Chance (10% avoid attacks)
  - [ ] Block (reduce damage taken)
  - [ ] Thorns (reflect damage)
  - [ ] Second Wind (heal on kill)
- [ ] Create Utility Tree
  - [ ] Gold Find (increase gold drops)
  - [ ] Magic Find (increase rare loot chance)
  - [ ] XP Boost (faster leveling)
  - [ ] Swift Movement (faster dungeon movement)
- [ ] Build Skill Tree UI
- [ ] Add Respec functionality (cost gold/gems)
- [ ] Save/Load skill allocations

**Success Criteria:**
- 3 skill trees with 4-5 skills each
- Players can experiment with different builds
- Skills provide meaningful gameplay changes
- Respec is available but has a cost

---

### **Sprint 3: Daily Engagement** 📅
**Status:** 🔴 Not Started  
**Priority:** MEDIUM  
**Estimated Time:** 2-3 hours

**Tasks:**
- [ ] Implement Daily Quest System
- [ ] Create Quest Types
  - [ ] "Complete X dungeons"
  - [ ] "Defeat X monsters"
  - [ ] "Earn X gold"
  - [ ] "Find X rare items"
  - [ ] "Defeat boss without taking damage"
- [ ] Build Daily Quest UI
- [ ] Add Quest Tracking
- [ ] Implement Reward System (gold/gems/items)
- [ ] Daily reset at midnight
- [ ] Save quest progress

**Success Criteria:**
- 3-5 daily quests available
- Quests refresh daily
- Rewards are meaningful
- Encourages daily login

---

## **Phase 2: Depth & Progression** 🎮
**Goal:** Add long-term motivation and build diversity  
**Timeline:** Week 2-3

### **Sprint 4: Equipment Sets** 👔
**Status:** 🔴 Not Started  
**Priority:** MEDIUM  
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

---

### **Sprint 5: Prestige System** 🌟
**Status:** 🔴 Not Started  
**Priority:** HIGH  
**Estimated Time:** 5-6 hours

**Tasks:**
- [ ] Design Prestige Mechanics
- [ ] Implement Rebirth System
  - [ ] Reset hero level, equipment, gold
  - [ ] Keep: Souls (prestige currency)
  - [ ] Unlock requirement (e.g., reach Floor 50)
- [ ] Create Soul Currency System
- [ ] Design Prestige Upgrades
  - [ ] Permanent +1% ATK per soul
  - [ ] Permanent +1% HP per soul
  - [ ] Permanent +0.5% Crit per soul
  - [ ] Gold multiplier upgrades
  - [ ] XP multiplier upgrades
- [ ] Build Prestige UI
- [ ] Add Prestige Statistics
- [ ] Save prestige progress

**Success Criteria:**
- Players can rebirth after reaching milestone
- Prestige provides meaningful permanent bonuses
- Meta-progression loop is engaging
- Players feel rewarded for restarting

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
- [ ] Particle Systems
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

### Balance
- Win rate per difficulty
- Average run completion time
- Equipment distribution

### Progression
- Average level reached
- Tower floor reached
- Prestige level distribution

---

## 🔄 Development Workflow

### For Each Sprint:
1. **Read existing code** - Understand current implementation
2. **Plan changes** - Design without breaking existing features
3. **Implement incrementally** - Test after each major change
4. **Add safety checks** - Null checks, fallbacks, error handling
5. **Update CHANGELOG.md** - Document all changes
6. **Test thoroughly** - Verify no regressions
7. **Mark sprint complete** - Update this roadmap

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
3. Read the relevant system files before modifying
4. Follow the current sprint tasks
5. Update both files after completing work

**Current Sprint:** Sprint 2 - Skill Tree System  
**Next Task:** Design Skill Tree Structure (3 trees)

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

**Remember:** Quality over speed. Each feature should feel polished and not break existing gameplay! 🛡️
