# Sprint 2: Skill Tree System 🌳

## Overview

Sprint 2 introduces a comprehensive **Skill Tree System** with 15 unique skills across 3 specialized trees. Players earn 1 skill point per level (starting at level 2) and can invest these points to unlock powerful passive abilities that enhance combat, defense, and resource gathering.

**Version:** 2.4.0  
**Status:** ✅ Complete

---

## Features

### Core Mechanics
- **1 Skill Point per Level** starting at level 2
- **3 Skill Trees**: Combat, Defense, Utility
- **15 Unique Skills** (5 per tree)
- **5 Ranks per Skill** with increasing power
- **Skill Dependencies** - some skills require others first
- **Respec System** - reset skills for gold (cost scales with level)
- **Real-time Effects** - all skills apply immediately to combat

---

## The 3 Skill Trees

### ⚔️ Combat Tree (Offense)
*"Destroy your enemies with overwhelming power"*

| Skill | Icon | Max Effect | Description |
|-------|------|------------|-------------|
| **Lifesteal** | 🩸 | 15% | Heal for 3-15% of damage dealt |
| **Double Strike** | ⚔️ | 20% | 4-20% chance to attack twice |
| **Execute** | 💀 | +50% | +10-50% damage to enemies below 30% HP (requires Lifesteal) |
| **Berserker** | 🔥 | +25% | Up to +5-25% damage when hero is below 50% HP (requires Double Strike) |
| **Bloodlust** | 🧛 | 5 stacks | Kills grant +5% damage stacking up to 1-5 times (10s duration, requires Execute) |

### 🛡️ Defense Tree (Survival)
*"Outlast your foes with superior defenses"*

| Skill | Icon | Max Effect | Description |
|-------|------|------------|-------------|
| **Dodge** | 💃 | 15% | 3-15% chance to completely avoid attacks |
| **Block** | 🛡️ | -15% | Reduce all incoming damage by 3-15% |
| **Thorns** | 🌵 | 40% | Reflect 8-40% of damage taken back to attackers (requires Block) |
| **Second Wind** | 🌬️ | +20 HP | Heal 4-20 HP every time you kill an enemy (requires Dodge) |
| **Iron Skin** | 🪨 | +10 DEF | Permanent +2-10 Defense bonus (requires Thorns) |

### ⭐ Utility Tree (Rewards)
*"Enhance your progression and rewards"*

| Skill | Icon | Max Effect | Description |
|-------|------|------------|-------------|
| **Gold Find** | 💰 | +50% | Increase gold drops by 10-50% |
| **Magic Find** | ✨ | +25% | Increase rare loot chance by 5-25% |
| **XP Boost** | 🎓 | +50% | Gain 10-50% more XP from monsters (requires Magic Find) |
| **Swift Movement** | 💨 | +50% | Move 10-50% faster in dungeons (requires Gold Find) |
| **Lucky Strike** | 🍀 | +10% | +2-10% Critical Hit Chance (requires XP Boost) |

---

## How to Use

### Learning Skills

1. **Earn Skill Points**
   - Gain 1 point per level (start earning at level 2)
   - Points accumulate if not spent

2. **Choose Your Tree**
   - Click on Combat, Defense, or Utility tab
   - Each tree has different strengths

3. **Unlock Skills**
   - Click on available skills to spend points
   - Some skills require prerequisites
   - Skills can be ranked up to 5 times

4. **Effects Apply Immediately**
   - All skills work automatically
   - Effects stack with equipment bonuses

### Resetting Skills

- Click "Reset Skills" button in Skills tab
- Cost: Scales with level (starts at 100 gold)
- Refunds all spent skill points
- Useful for trying different builds

---

## Build Strategies

### 🗡️ Glass Cannon Build
**Focus: Maximum Damage**
- Max: Lifesteal → Execute → Bloodlust
- Add: Double Strike for burst
- Result: High damage with sustain

### 🛡️ Tank Build
**Focus: Survival**
- Max: Block → Iron Skin → Thorns
- Add: Second Wind for healing
- Result: Very hard to kill

### 💰 Farmer Build
**Focus: Efficient Progression**
- Max: Gold Find → XP Boost → Lucky Strike
- Add: Swift Movement for speed
- Result: Fast leveling and rich

### ⚖️ Balanced Build
**Focus: All-Around**
- Some Combat (Lifesteal, Double Strike)
- Some Defense (Dodge, Block)
- Some Utility (Gold Find, XP Boost)
- Result: Good at everything

---

## Technical Implementation

### File Structure
```
src/
├── skills/
│   ├── skill-tree.js        # Skill definitions & logic
│   └── skill-effects.js     # Combat integration
├── ui/
│   └── skill-tree-ui.js     # UI rendering & interaction
└── core/
    └── game-state.js        # Skills in save state

skill-tree-styles.css        # Skill UI styling
index.html                   # Skills tab
```

### Key Systems

**Skill Storage**
```javascript
gameState.skills = {
  LIFESTEAL: 3,    // Rank 3
  DODGE: 2,        // Rank 2
  GOLD_FIND: 5     // Max rank
};
```

**Effect Application**
- Skills calculate bonuses based on rank
- Effects stored in `gameState.skillEffects`
- Applied in combat calculations automatically
- Bonuses stack additively

**Combat Integration**
- Damage modified by Execute, Berserker, Bloodlust
- Healing from Lifesteal, Second Wind
- Defense from Dodge, Block, Thorns, Iron Skin
- Rewards from Gold Find, Magic Find, XP Boost

---

## Balancing Notes

### Power Scaling
- Early skills (Rank 1-2): Noticeable impact
- Mid skills (Rank 3-4): Significant power
- Max skills (Rank 5): Build-defining

### Synergies
- Combat + Defense: Berserker + low HP tanking
- Lifesteal + Thorns: Damage reflection heals
- Bloodlust + Swift Movement: Fast kill chains
- Gold Find + XP Boost: Fast progression

### Respec Cost
Formula: `100 * 1.5^(floor(level/10))`
- Level 1-9: 100 gold
- Level 10-19: 150 gold
- Level 20-29: 225 gold
- Level 30-39: 337 gold
- And so on...

---

## Testing Checklist

- [x] Skills save and load correctly
- [x] Skill points calculated properly
- [x] All 15 skills function as described
- [x] UI updates on skill changes
- [x] Respec works correctly
- [x] Dependencies enforced
- [x] Combat effects apply
- [x] Resource bonuses work
- [x] Level up grants points
- [x] Active effects display

---

## Future Enhancements (Sprint 3+)

Potential additions:
- **More Skills**: 5-10 additional skills per tree
- **Skill Combos**: Special effects when combining certain skills
- **Prestige Skills**: Unlock after first ascension
- **Skill Presets**: Save and load builds
- **Skill Quests**: Complete challenges to unlock rare skills
- **Skill Mutations**: Upgrade skills beyond rank 5 with special resources

---

## Credits

**Design**: Skill tree inspired by classic ARPGs (Diablo, Path of Exile)  
**Implementation**: Sprint 2 (January 2026)  
**Version**: 2.4.0

---

## Links

- [Main README](../README.md)
- [Game Design Doc](GAME-DESIGN.md)
- [Combat System](COMBAT.md)
- [GitHub Repository](https://github.com/oliverlaudan-ops/Dungeon-Idle-Game)

---

**Last Updated**: January 12, 2026
