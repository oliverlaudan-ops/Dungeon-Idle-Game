# 👤 Class & Equipment System Design

## 🧁 Should Weapons Define Hero Class?

### Option 1: **Equipment-Based Classes** (Recommended)
Die Waffe bestimmt die Spielweise des Helden.

```
Weapon Type = Playing Style = Class

🗡️ Sword      → Warrior     (ATK+, balanced, no special)
🏹️ Bow        → Ranger      (ATK++, Crit++, range)
🔨1️ Hammer     → Berserker   (ATK+++, slow, heavy damage)
💧 Staff       → Mage        (ATK+, Crit, mana-based)
🐟 Dagger      → Rogue       (ATK++, Crit+++, dodge)
```

**Vorteile:**
- \+ Einfach zu verstehen
- \+ Equipment ist sichtbar und impactful
- \+ Spieler wechselt Klasse durch Ausrüstung
- \+ Macht die Gear-Progression wichtig

**Nachteile:**
- \- Keine permanente Klassen-Identität
- \- Weniger charakteristisch

---

### Option 2: **Permanente Klassen** (Alternative)
Held wählt eine Klasse am Anfang, die Waffe modifiziert die Subklasse.

```
Hero Class = Base Stats
Weapon = Specialization

Swordswoman (Base)
  + Sword       → Swordswoman (Standard)
  + Staff       → Spellblade (Magic hybrid)
  + Bow         → Archer (Ranged)
```

**Vorteile:**
- \+ Mehr Charakteridentität
- \+ Feste Progression
- \+ Komplexer und strategischer

**Nachteile:**
- \- Komplizierter zu implementieren
- \- Mehr Code & Balancing

---

## 📐 EMPFOHLENES SYSTEM: Option 1 (Equipment-Based)

### Warum?

1. **Schneller zu implementieren** (dieses Wochenende spielbar)
2. **Equipment wird relevant** (nicht nur Stats, auch Gameplay)
3. **Flexibilität** (Spieler kann Klasse wechseln)
4. **Idle Game friendly** (Equipment als Progression)

### Implementation Plan

```javascript
// EQUIPPED WEAPON determines Class
const equipped = gameState.equipped;
const weaponClass = getClassFromWeapon(equipped.weapon);

// CLASS modifies how Combat works
switch(weaponClass) {
    case 'WARRIOR':
        baseDamage * 1.0
        defenseBonus = +2
        break;
    case 'RANGER':
        baseDamage * 0.8
        critChance = +0.20
        break;
    case 'BERSERKER':
        baseDamage * 1.5
        defenseBonus = -1  // High risk/reward
        break;
}
```

---

## 📦 Equipment Impact on Auto-Runs

### Ja, Equipment MUSS auch Auto-Runs beeinflussen! ✅

**Warum?**
1. Equipment ist die Hauptprogression
2. Besseres Gear = höhere Erfolgsrate
3. Macht Farming von Equipment sinnvoll

### Implementation

```javascript
// In simulateDungeonRun()
const heroStats = {
    atk: baseATK + equippedWeapon.atk,
    def: baseDEF + equippedArmor.def,
    hp:  baseHP  + equippedArmor.hp
};

// Combat simulation uses these stats
combatResult = simulateCombat(heroStats, monster);
```

---

## 🏀 Complete System Architecture

### Game State

```javascript
gameState = {
    hero: {
        level: 5,
        atk: 20,      // Base ATK
        def: 5,       // Base DEF
        maxHp: 100,   // Base HP
        hp: 100
    },
    equipped: {
        weapon: {     // Determines class
            id: 'steel-sword-123',
            name: 'Steel Sword',
            type: 'weapon',
            class: 'WARRIOR',  // NEW!
            atk: 10,
            crit: 0.05
        },
        armor: {
            id: 'chain-mail-456',
            name: 'Chain Mail',
            type: 'armor',
            def: 7,
            hp: 10
        },
        accessory: {
            id: 'ring-789',
            name: 'Ring of Power',
            type: 'accessory',
            bonusATK: 3
        }
    },
    inventory: [
        { /* other equipment */ }
    ],
    settings: {
        difficulty: 'normal',
        autoClass: false  // Can override for manual
    }
}
```

### Combat Calculation with Class

```javascript
function calculateCombatStats(hero) {
    let stats = {
        atk: hero.attack,
        def: hero.defense,
        hp: hero.maxHp,
        crit: hero.critChance || 0.05
    };

    // Apply equipment
    if (hero.equipped.weapon) {
        stats.atk += hero.equipped.weapon.atk;
        stats.crit += hero.equipped.weapon.crit;
        stats.weaponClass = hero.equipped.weapon.class;  // NEW!
    }
    if (hero.equipped.armor) {
        stats.def += hero.equipped.armor.def;
        stats.hp += hero.equipped.armor.hp;
    }
    if (hero.equipped.accessory) {
        stats.atk += hero.equipped.accessory.bonusATK || 0;
        stats.def += hero.equipped.accessory.bonusDEF || 0;
        stats.hp += hero.equipped.accessory.bonusHP || 0;
    }

    // Apply class modifiers
    stats = applyClassModifiers(stats);

    return stats;
}

function applyClassModifiers(stats) {
    const weaponClass = stats.weaponClass || 'WARRIOR';

    switch(weaponClass) {
        case 'WARRIOR':
            stats.damageMultiplier = 1.0;
            stats.def += 2;
            break;
        case 'RANGER':
            stats.damageMultiplier = 0.8;
            stats.crit += 0.15;
            break;
        case 'BERSERKER':
            stats.damageMultiplier = 1.5;
            stats.def -= 1;  // High risk
            break;
        case 'MAGE':
            stats.damageMultiplier = 0.9;
            stats.crit += 0.10;
            stats.hp += 10;  // Resilience
            break;
        case 'ROGUE':
            stats.damageMultiplier = 1.2;
            stats.crit += 0.25;
            stats.def -= 1;  // Fragile
            break;
    }

    return stats;
}
```

---

## 👤 Weapon Classes Overview

### 🗡️ WARRIOR - Balanced
```
Weapon:  Sword, Mace
ATK:     1.0x base damage
DEF:     +2 defense
CRIT:    5% normal
STYLE:   Tank/Damage balanced
```

### 🏹️ RANGER - High Crit
```
Weapon:  Bow, Crossbow
ATK:     0.8x base damage
DEF:     0 (normal)
CRIT:    +20% extra crit chance
STYLE:   Precision damage
```

### 🔨 BERSERKER - Glass Cannon
```
Weapon:  Hammer, Axe
ATK:     1.5x base damage (HIGHEST)
DEF:     -1 defense (RISKY)
CRIT:    0% (no crit)
STYLE:   All-in aggression
```

### 💧 MAGE - Support
```
Weapon:  Staff, Wand
ATK:     0.9x base damage
DEF:     0 (normal)
CRIT:    +10% crit chance
HP:      +10 bonus HP
STYLE:   Survivability
```

### 🐟 ROGUE - Burst
```
Weapon:  Dagger, Sword (dual)
ATK:     1.2x base damage
DEF:     -1 defense (RISKY)
CRIT:    +25% (HIGHEST CRIT)
STYLE:   High risk/reward
```

---

## 💫 Equipment Quality Improvements

### Common Sword
```
ATK: 5
CRIT: 0%
DEFENSE_MOD: 0
CLASS: WARRIOR
```

### Legendary Sword of Flames
```
ATK: 15  (3x better)
CRIT: 5%
DEFENSE_MOD: +1
CLASS: WARRIOR
BONUS: 10% lifesteal on crit
```

---

## 🔇 Implementation Phases

### Phase 1: Basic Equipment (This Week)
- [x] Equipment framework
- [ ] Loot drops from monsters
- [ ] Equipment in inventory
- [ ] Basic equip/unequip
- [ ] Stat bonuses applied
- [ ] Auto-run respects equipment

### Phase 2: Class System
- [ ] Weapon class assignment
- [ ] Class modifier calculation
- [ ] Visual class indicator
- [ ] Different combat mechanics per class
- [ ] Class-specific abilities (maybe)

### Phase 3: Advanced Features
- [ ] Weapon upgrading
- [ ] Enchanting
- [ ] Set bonuses (2 matching items = bonus)
- [ ] Boss-specific loot
- [ ] Rare special abilities

---

## 💉 Balance Considerations

### Equipment Power Curve

```
Level 1:  Base Stats only (no equipment)
Level 5:  +10 stats from common equipment (10% boost)
Level 10: +30 stats from rare equipment (30% boost)
Level 15: +60 stats from epic equipment (50% boost)
Level 20: +100 stats from legendary equipment (70% boost)
```

### Class Balance

```
Berserker:  1.5x damage but -1 def        (High risk = high reward)
Ranger:     0.8x damage but +20% crit     (Multiplier from crit)
Warrior:    1.0x damage, +2 def           (Most balanced)
Mage:       0.9x damage, +10 HP           (Utility)
Rogue:      1.2x damage, +25% crit, -1 def (High skill)
```

These should feel different but equally viable.

---

## ✅ Next Steps

1. **Decide:** Equipment-Based or Permanent Classes?
   - Recommend: **Equipment-Based**

2. **Implement:** Weapon class system
   - Add `class` field to weapons
   - Create `applyClassModifiers()` function
   - Update combat calculations

3. **Integrate:** Equipment affects auto-runs
   - Update `simulateDungeonRun()`
   - Calculate stats with equipment
   - Test balance

4. **Polish:** Visual indicators
   - Show current class
   - Show class bonuses
   - Preview class changes

---

**Recommendation:** Implement Option 1 (Equipment-Based Classes) - it's simpler, more fun, and makes gear meaningful. 🎮
