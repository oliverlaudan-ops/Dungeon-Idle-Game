# 📝 Design Decisions Document

## Your Questions Answered

### ❔ "Wo kann ich eine Schwierigkeit in Manual Runs auswählen?"

**Problem:** Difficulty selector war nicht sichtbar in Manual Runs

**Solution:** ✅ FIXED
- Added visual difficulty selector with 4 buttons
- Difficulty buttons have color coding and description
- Current selection is highlighted with glow effect
- Selected difficulty is shown in the UI

**Files Changed:**
- `ui/manual-run-ui.js` - Complete rewrite with difficulty selector

**What it looks like now:**
```
┌─────────────────────────────────────────┐
│  Manual Dungeon Run                     │
│  Select difficulty and click START      │
├─────────────────────────────────────────┤
│  [🙂Easy] [😀Normal] [😠Hard] [🔥Expert]│
├─────────────────────────────────────────┤
│  ⚔️ Current Equipment & Stats:          │
│  Weapon: None (Base ATK only)          │
│  Armor: None (Base DEF only)           │
│  Expected ATK: 20, DEF: 5, HP: 100     │
├─────────────────────────────────────────┤
│      [🎮 Start Manual Run]              │
└─────────────────────────────────────────┘
```

---

### ❔ "Das Gear System sollte auch auf Auto-Runs wirken, oder?"

**Frage:** Sollten ausgerüstete Items auch Auto-Runs beeinflussen?

**Antwort:** ✅ **JA, absolut!**

**Warum?**
1. Equipment ist die Hauptprogression des Spiels
2. Besseres Gear = höhere Erfolgsrate in schweren Dungeons
3. Macht Gear-Farming sinnvoll ("Ich brauche bessere Rüstung für Expert")
4. Idle-Loops respektieren Spieler-Entscheidungen

**Implementation:**
```javascript
// In auto-run simulation:
const heroStats = {
    atk: baseATK + equippedWeapon.atk,
    def: baseDEF + equippedArmor.def,
    hp:  baseHP  + equippedArmor.hp,
    crit: baseCrit + equippedWeapon.crit
};

// Use these stats for combat simulation
result = simulateCombat(heroStats, monster);
```

**What changes:**
- ✅ Auto-runs calculate hero stats WITH equipment
- ✅ Better gear = more auto-run wins
- ✅ Equipment makes difficult dungeons achievable
- ✅ Gear progression becomes meaningful

---

### ❔ "Bestimmt die Waffe die Klasse meines Helden?"

**Frage:** Sollte die Waffe die Spielklasse definieren?

**Antwort:** ✅ **JA - Equipment-Based Classes**

#### Warum diese Entscheidung?

**Option A: Equipment-Based Classes** (WIR WÄHLEN DAS)
```
⚔️ Sword      → Warrior (balanced)
🏹 Bow        → Ranger (crit-focused)
🔨 Hammer     → Berserker (high damage, low defense)
📚 Staff      → Mage (utility, survivability)
🗡️ Dagger     → Rogue (very high crit, fragile)
```

**Vorteile:**
- ✅ Equipment wird bedeutungsvoll (nicht nur Stats)
- ✅ Spieler kann Klasse durch Waffe ändern
- ✅ Macht Gear-Farming strategisch
- ✅ Schnell zu implementieren
- ✅ Weniger Code = schneller spielbar

**Option B: Permanente Klassen** (NICHT GEWÄHLT)
```
Held wählt am Start: Warrior/Ranger/Mage
Waffe modifiziert nur die Specs
```

**Nachteile:**
- ❌ Mehr komplexer Code
- ❌ Länger zu implementieren
- ❌ Klassenwahl ist "locked"
- ❌ Weniger Flexibilität

---

## 💯 How Weapons Define Classes

### Example: Level 5 Hero with 20 ATK

#### ⚔️ WARRIOR (Sword)
```
Base ATK:        20
Weapon Bonus:    +10
Total ATK:       30

Class Modifier:  1.0x
Final ATK:       30

Extra Benefit:   +2 Defense
```

#### 🏹 RANGER (Bow)
```
Base ATK:        20
Weapon Bonus:    +8
Total ATK:       28

Class Modifier:  0.8x
Final ATK:       22.4 ≈ 22

Extra Benefit:   +15% Crit Chance
Strategy:        Hit harder when it counts
```

#### 🔨 BERSERKER (Hammer)
```
Base ATK:        20
Weapon Bonus:    +15
Total ATK:       35

Class Modifier:  1.5x
Final ATK:       52 (HIGHEST!)

Extra Penalty:   -1 Defense (risky!)
Strategy:        DESTROY everything, risk death
```

#### 📚 MAGE (Staff)
```
Base ATK:        20
Weapon Bonus:    +12
Total ATK:       32

Class Modifier:  0.9x
Final ATK:       28.8 ≈ 29

Extra Benefit:   +10 HP bonus
Strategy:        Survive more hits
```

#### 🗡️ ROGUE (Dagger)
```
Base ATK:        20
Weapon Bonus:    +10
Total ATK:       30

Class Modifier:  1.2x
Final ATK:       36

Extra Bonus:     +25% Crit Chance
Extra Penalty:   -1 Defense
Strategy:        High risk/reward crit assassin
```

---

## 📚 Implementation Timeline

### What's Done ✅
- [x] Equipment System Framework
- [x] Weapon Class System
- [x] Equipment stat calculation
- [x] Class modifier calculation
- [x] Manual Run Difficulty Selector
- [x] Equipment Preview in Manual Run
- [x] Class-based stat modifiers

### What's Next ⏳
- [ ] Loot drops from monsters
- [ ] Equipment UI/Inventory display
- [ ] Equip/Unequip buttons
- [ ] Equipment shop
- [ ] Visual class indicator
- [ ] Auto-run integration with equipment
- [ ] Monster level scaling
- [ ] Boss-specific loot

---

## 🎯 Class Balance Philosophy

### Each class should feel DIFFERENT but VIABLE

```
WARRIOR:    "I attack reasonably hard and defend well"
RANGER:     "I attack medium but crit a lot"
BERSERKER: "I one-shot everything but I die easily"
MAGE:       "I survive longer with survivability bonus"
ROGUE:      "I crit constantly but I'm fragile"
```

No class is objectively better - it depends on:
- Player skill
- Hero level
- Equipment quality
- Dungeon difficulty
- Enemy types

---

## 💉 Balancing Examples

### Against a Goblin (100 HP)

#### Warrior (30 ATK)
- 3-4 hits to kill
- Takes 4-5 hits
- Result: WIN (takes 20-25 damage)

#### Ranger (22 ATK, +15% crit)
- 4-5 hits normally
- 2-3 with crits
- Takes 4-5 hits
- Result: WIN (takes 20-25 damage)

#### Berserker (52 ATK, -1 def)
- 2 hits to kill
- Takes 5-6 hits
- Result: WIN (takes 25-30 damage - riskier!)

#### Rogue (36 ATK, +25% crit, -1 def)
- 3 hits normally
- 2 with crits
- Takes 5-6 hits
- Result: WIN (takes 25-30 damage - balanced risk)

---

## 📈 Data Structure

### Equipment Object
```javascript
equipped.weapon = {
    id: 'steel-sword-12345',
    templateId: 'steel-sword',
    name: 'Steel Sword',
    type: 'weapon',
    icon: '⚔️',
    class: 'WARRIOR',                    // NEW!
    classInfo: {                         // NEW!
        name: 'Warrior',
        damageMultiplier: 1.0,
        defenseBenefit: 2,
        critBonus: 0.0
    },
    rarity: 'uncommon',
    color: '#2ecc71',
    atk: 12,          // 10 base * 1.25 rarity
    crit: 0.05,
    equipped: true
}
```

### Hero Stats (with equipment)
```javascript
gameState.hero = {
    level: 5,
    attack: 30,       // 20 base + 10 from weapon
    defense: 7,       // 5 base + 2 from warrior class
    maxHp: 100,
    hp: 100,
    critChance: 0.05,
    currentClass: 'WARRIOR'  // NEW!
}
```

---

## 🌟 Key Insights

### 1. Equipment is Progression
Better gear = harder dungeons become achievable. This is the MAIN progression path.

### 2. Class Adds Variety
Different weapons feel different to play, not just different stats.

### 3. Equipment affects BOTH Play Modes
- Manual Runs: Player sees equipment bonuses in preview
- Auto-Runs: Simulation uses equipped stats

### 4. Risk/Reward
Classes like Berserker are INTENTIONALLY risky (high damage, low defense) for players who want to gamble.

---

## ✅ Design Philosophy Summary

**Goal:** Make equipment feel meaningful

**How:**
1. ✅ Equipment changes your stats
2. ✅ Equipment changes your playstyle (class)
3. ✅ Equipment affects both manual and auto-runs
4. ✅ Different weapons feel different
5. ✅ No single "best" class

**Result:** Players care about gear drops and farming for better equipment.

---

**Next Session:** Integrate loot drops and equipment UI! 🎁
