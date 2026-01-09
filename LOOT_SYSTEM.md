# 🎁 Loot System Documentation

Vollständige Dokumentation des Loot-Drop-Systems mit Mechanics, Rarity-Rates und Balance-Formeln.

---

## 💬 Übersicht

Das **Loot System** generiert zufällig Equipment-Drops (Waffen, Rüstungen, Accessoires) bei erfolgreichem Dungeon-Abschluss.

**Kern-Mechaniken:**
- Drop-Raten basieren auf Schwierigkeit
- Rarity wird gewichtet nach Schwierigkeit
- Boss-Kämpfe garantieren Loot
- Alle Drops werden in Inventory gespeichert
- Equipment kann ausgerüstet werden und beeinflusst Hero-Stats

---

## 🎯 Drop-Raten nach Schwierigkeit

### Easy
```
📊 Loot-Chance:      15%
⭐ Rarity-Range:      Common - Uncommon
📦 Quantity:         1 Item
💰 Expected Value:   ~0.15 Items pro Run
```

**Beste für:** Anfänger, Gold/XP Farming ohne Equipment

### Normal
```
📊 Loot-Chance:      25%
⭐ Rarity-Range:      Common - Rare
📦 Quantity:         1-2 Items
💰 Expected Value:   ~0.375 Items pro Run
```

**Beste für:** Standard Progression, Equipment sammeln

### Hard
```
📊 Loot-Chance:      35%
⭐ Rarity-Range:      Uncommon - Epic
📦 Quantity:         1-2 Items
💰 Expected Value:   ~0.525 Items pro Run
```

**Beste für:** Mid-Game Equipment, bessere Rarity

### Expert
```
📊 Loot-Chance:      50%
⭐ Rarity-Range:      Rare - Legendary
📦 Quantity:         1-3 Items
💰 Expected Value:   ~1.25 Items pro Run
```

**Beste für:** End-Game, Legendary Equipment hunting

---

## ⭐ Rarity-System

### Rarity-Tiers

| Rarity | Color | Multiplier | Drop-Chance | Beschreibung |
|--------|-------|-----------|------------||
| **Common** | Grau | 1.0x | 60% | Basic Equipment, alle können es droppen |
| **Uncommon** | Grün | 1.25x | 25% | Bessere Stats, selten |
| **Rare** | Blau | 1.5x | 10% | Gute Stats, schwer zu bekommen |
| **Epic** | Violett | 1.75x | 4% | Sehr gute Stats, selten |
| **Legendary** | Gold | 2.0x | 1% | Beste Stats, ultra-selten |

### Stat-Multiplikatoren

Rarity beeinflusst direkt die Stat-Boni:

```javascript
equippedStats = baseStats * rarityMultiplier

Beispiel (Schwert mit 10 ATK):
- Common:    10 ATK
- Uncommon:  12.5 ATK ≈ 13 ATK
- Rare:      15 ATK
- Epic:      17.5 ATK ≈ 18 ATK
- Legendary: 20 ATK
```

### Rarity-Verteilung pro Schwierigkeit

**Easy:** Mehr Commons
```
Common:    65%
Uncommon:  35%
Rare:      0%
```

**Normal:** Balanced
```
Common:    40%
Uncommon:  40%
Rare:      20%
```

**Hard:** Weniger Commons
```
Uncommon:  50%
Rare:      35%
Epic:      15%
```

**Expert:** Rare+ nur
```
Rare:      50%
Epic:      35%
Legendary: 15%
```

---

## 📦 Loot-Pool

### Waffen (6 Items)
- Iron Sword (Warrior) - ATK: 5
- Steel Sword (Warrior) - ATK: 10
- Elven Bow (Ranger) - ATK: 8, Crit: +15%
- Warhammer (Berserker) - ATK: 15, Def: -1
- Enchanted Blade (Mage) - ATK: 12, HP: +10
- Assassin's Dagger (Rogue) - ATK: 10, Crit: +25%

### Rüstungen (4 Items)
- Leather Armor - DEF: 3
- Chain Mail - DEF: 7, HP: +10
- Plate Armor - DEF: 12, HP: +25
- Dragon Scale - DEF: 15, HP: +40

### Accessoires (3 Items)
- Ring of Power - ATK: +3
- Amulet of Defense - DEF: +3
- Necklace of Vitality - HP: +20

**Gesamt:** 13 verschiedene Items
**Typ-Verteilung:** 46% Waffen, 31% Rüstung, 23% Accessoires

---

## 🔧 Implementierung

### Loot-Generierung

```javascript
// 1. Chance prüfen
if (shouldDropLoot(difficulty)) {
    // 2. Quantity bestimmen
    const drops = generateLootDrops(difficulty, runSuccess);
    
    // 3. Zu Inventory hinzufügen
    addLootToInventory(drops);
    
    // 4. UI aktualisieren
    displayLootNotification(drops);
}
```

### Rarity-Auswahl

```javascript
// Gewichtete Random-Selection
const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const weights = [50, 30, 15, 4, 1];  // Basis-Weights

// Filter nach Difficulty-Range
const filteredRarities = rarities.slice(minIndex, maxIndex + 1);
const filteredWeights = correspondingWeights;

// Gewichtete Selection
const totalWeight = filteredWeights.reduce((a,b) => a+b);
let random = Math.random() * totalWeight;
for each rarity:
    if (random < weight[i]) return rarity;
    random -= weight[i];
```

### Boss-Loot

Bosses haben **spezielle Loot-Drops:**
- **Garantiert** mindestens 1 Item (nicht chance-based)
- Bessere Rarity als normale Mobs
- 1-3 Items je nach Schwierigkeit

```javascript
export function generateBossLoot(difficulty) {
    const baseQuantity = difficulty === 'EXPERT' ? 2 : 1;
    const quantity = baseQuantity + (Math.random() < 0.4 ? 1 : 0);
    // Generate items...
}
```

---

## 📊 Balancing-Beispiele

### Szenario: Expert Run mit 50% Loot-Chance

**100 Expert Runs:**
- ~50 Runs mit Loot
- ~50 Runs ohne Loot
- **Durchschnitt:** 62,5 Items (50 × 1.25 avg)
- **Durchschnitt pro Run:** 0.625 Items
- **Best-Case:** 3 Legendary Items
- **Worst-Case:** Kein Loot

### Progression Timeline

**Early Game (Easy):**
- Hauptsächlich Commons
- Selten Uncommon
- Gear kostet Zeit zum Sammeln

**Mid Game (Normal):**
- Mix aus Common/Uncommon/Rare
- Erste Epic-Items möglich
- Gear-Progression sichtbar

**Late Game (Hard/Expert):**
- Hauptsächlich Rare+
- Legendaries möglich
- Gear ist bedeutungsvoll

---

## 🎮 Gameplay-Integration

### Manual Run Loot-Display

```
✅ Sieg!
Loot erhalten: ⭐ Steel Sword, 🟢 Chain Mail

[Steel Sword Card]
⚔️  Steel Sword
Uncommon
Weapon
```

### Inventory-Management

- Alle Drops landen in `gameState.inventory`
- Spieler können Items **equip/unequip**
- Ausgerüstete Items beeinflussen Hero-Stats
- Items können **verkauft** werden für Gold

### Auto-Runs mit Equipment

Equipptes Equipment wird verwendet:
- Manual Runs: Spieler sieht Stats im Voraus
- Auto-Runs: Simulation nutzt Equipment-Stats
- Equipment macht Hard/Expert machbar

---

## 🔄 Drop-Rate Formeln

### Base Drop Chance
```
DROP_CHANCE[difficulty] = predefined (15%, 25%, 35%, 50%)
roll = Math.random()
drops_loot = roll < DROP_CHANCE
```

### Rarity Selection
```
rarity_index = weighted_random_from_range(minRarity, maxRarity)
rarity = RARITIES[rarity_index]
```

### Quantity Determination
```
min_qty = DROP_RATES[difficulty].minQuantity
max_qty = DROP_RATES[difficulty].maxQuantity
quantity = floor(random * (max_qty - min_qty + 1)) + min_qty
```

### Final Stat Calculation
```
base_stat = item_template.baseValue
rarity_multiplier = RARITY_TIERS[rarity].multiplier
final_stat = floor(base_stat * rarity_multiplier)
```

---

## 📈 Statistiken

### Tracking

```javascript
getLootStatistics() {
    return {
        totalLooted: inventory.length,
        byType: {
            weapon: count,
            armor: count,
            accessory: count
        },
        byRarity: {
            common: count,
            uncommon: count,
            rare: count,
            epic: count,
            legendary: count
        }
    };
}
```

### Tracking-Ausgabe

```
📊 Loot Statistics

Total Looted: 42

By Type:
  ⚔️  Weapons: 19 (45%)
  🛡️  Armor: 13 (31%)
  💍 Accessories: 10 (24%)

By Rarity:
  ⚪ Common: 22 (52%)
  🟢 Uncommon: 15 (36%)
  🔵 Rare: 4 (10%)
  🟣 Epic: 1 (2%)
  🟡 Legendary: 0 (0%)
```

---

## 🧪 Testing Guide

### Manual Testing

```bash
# Test Easy Drops (sollte ~15% Rate sein)
1. Öffne Manual Run
2. Wähle Easy
3. Starte 10 Runs
4. Zähle Loot-Drops
5. Erwartung: ~1-2 Drops

# Test Expert Drops (sollte ~50% Rate sein)
1. Öffne Manual Run
2. Wähle Expert
3. Starte 10 Runs
4. Zähle Loot-Drops
5. Erwartung: ~5 Drops

# Test Rarity Distribution
1. Sammle 50+ Drops
2. Prüfe Rarity-Verteilung
3. Sollte zur Schwierigkeit matchen
```

### Expected vs Actual

| Metric | Expected | Toleranz |
|--------|----------|----------|
| Easy Drop Rate | 15% | ±3% |
| Normal Drop Rate | 25% | ±5% |
| Hard Drop Rate | 35% | ±5% |
| Expert Drop Rate | 50% | ±5% |
| Rarity Distribution | gemäß Tabelle | ±2% |

---

## 🐛 Bekannte Issues & TODOs

- [ ] Inventory UI nicht implementiert (Items sind im Backend gespeichert)
- [ ] Equip/Unequip-Button fehlt
- [ ] Item-Verkauf nicht integriert
- [ ] Boss-Loot-Anzeige minimal
- [ ] Keine Item-Durability (könnte später kommen)
- [ ] Keine Item-Enchanting-System (optional)

---

## 📝 Zukünftige Erweiterungen

### v2.3.0
- Inventory UI mit Equip-Buttons
- Item-Verkauf für Gold
- Equipment-Shop zum Kaufen
- Visual Rarity-Indicator

### v2.4.0+
- Legendary Item-Set-Bonuses
- Enchanting-System
- Gem-Socket-System
- Item-Transmutation

---

**Zuletzt aktualisiert:** 9. Januar 2026
**Version:** 2.2.0
