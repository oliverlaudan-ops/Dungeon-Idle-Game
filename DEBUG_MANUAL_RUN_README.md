# 🎮 Manual Run Debug Dashboard

## 📋 Übersicht

Dieses Debug-Tool (`DEBUG_MANUAL_RUN.html`) ermöglicht es dir, das **Manual Run Canvas-Gameplay** und das **Combat-System** zu testen und zu debuggen, ohne durch das ganze Spiel spielen zu müssen.

**Direkter Link:** [DEBUG_MANUAL_RUN.html](./DEBUG_MANUAL_RUN.html)

---

## 🚀 Schnelleinstieg

1. **Datei öffnen:** `DEBUG_MANUAL_RUN.html` im Browser öffnen
2. **Hero testen:** Werte ändern, Level anpassen
3. **Monster spawnen:** Monster-Typ auswählen und "Spawn Monster" klicken
4. **Combat testen:** Attack/Defend/Monster Attack Buttons verwenden
5. **Canvas testen:** "Initialize Canvas" → "Test Render" → "Test Animation"

---

## 📊 Panel Übersicht

### 🦸 **Hero Status**
- Zeigt alle aktuellen Hero-Stats an
- Level, XP, HP, Attack, Defense, Crit Chance, Crit Damage
- Live-Updates wenn du Stats änderst

**Sichtbare Metriken:**
- HP-Bar mit Farb-Indikator (Grün → Orange → Rot)
- XP-Fortschritt zum nächsten Level
- Alle Kampf-relevanten Stats

---

### ⚙️ **Hero Controls**

#### Level Adjustment
```
Input: Level (1-100)
Aktion: "Update Level"
Effekt: 
  - Attack +2 pro Level
  - Defense +1 pro Level  
  - MaxHP +10 pro Level
  - HP wird wiederhergestellt
```

#### HP Direct Set
```
Input: Beliebige HP-Wert
Aktion: "Set HP"
Effekt: Setzt Hero-HP auf den Wert (max = MaxHP)
```

#### Full Heal
```
Aktion: "🔄 Full Heal"
Effekt: Stellt MaxHP wieder her
```

---

### 👹 **Monster Controls**

#### Monster Type
```
Optionen:
  🟢 Goblin   - 30 HP, 5 ATK
  🔴 Orc      - 50 HP, 8 ATK
  🔥 Dragon   - 150 HP, 15 ATK
  ☠️ Skeleton - 40 HP, 7 ATK
```

#### Spawn & Control
```
Aktion: "Spawn Monster"
Effekt: Erstellt Monster mit max HP

Setzen HP: Ändert Monster-HP direkt
Effekt: Nützlich zum Testen von Critical-Punkte
```

---

### ⚔️ **Combat Simulator**

#### Verfügbare Aktionen

| Button | Effekt |
|--------|--------|
| 🦸 Hero Attack | Hero greift an, berechnet Crit-Chance |
| 🛡️ Defend | Hero verteidigt sich (Placeholder) |
| 👹 Monster Attack | Monster greift zurück an |
| End Combat | Beendet den aktuellen Kampf |

#### Combat Log
- Zeigt jeden Kampf-Schritt an
- Farb-kodiert: Grün (Success), Rot (Fehler), Orange (Warning), Blau (Info)
- Auto-Scroll zum neuesten Eintrag

---

### 🎨 **Canvas Renderer Test**

#### Funktionen

**Initialize Canvas**
```
Aktion: Erstellt ein 800x500px Canvas
Effekt: Bereit für Rendering-Tests
```

**Test Render**
```
Aktion: Zeichnet ein komplettes Dungeon-Szenario
Zeigt:
  ✓ Dungeon-Boden mit Grid
  ✓ Hero-Position (blau)
  ✓ Monster-Position (rot, wenn gespawnt)
  ✓ Treasure-Chest (gelb)
  ✓ HP-Bars
  ✓ UI-Overlay
```

**Test Animation**
```
Aktion: Startet eine 200-Frame Animation
Zeigt:
  ✓ Hero-Bewegung (sinus-Kurve)
  ✓ Floating Damage Numbers
  ✓ Smooth 60 FPS Rendering
Dauer: ~3 Sekunden
```

---

## 🧪 Test-Szenarien

### Szenario 1: Basis-Kampf
```
1. Hero Level: 1 (Standard)
2. Monster: Goblin (30 HP, 5 ATK)
3. Aktion: 3x Hero Attack
4. Erwartung: Monster sollte nach ~3 Hits besiegt sein
```

### Szenario 2: Crit-Test
```
1. Hero-Crit-Chance auf 100% setzen (durch Code-Edit)
2. Monster: Goblin
3. Aktion: Hero Attack
4. Erwartung: Immer kritischer Treffer mit 2.0x Damage
```

### Szenario 3: Tough Monster
```
1. Hero Level: 5 (Attack 18, Defense 9)
2. Monster: Dragon (150 HP, 15 ATK)
3. Aktion: Mehrere Attack-Aktionen
4. Erwartung: Längerer Kampf, Hero nimmt Schaden
```

### Szenario 4: Defense Test
```
1. Hero Defense: 5
2. Monster: Orc (Attack 8)
3. Aktion: Monster Attack
4. Erwartung: Damage = 8 - 5 = 3 HP Verlust
```

### Szenario 5: Canvas Rendering
```
1. Klick: Initialize Canvas
2. Klick: Spawn Monster (Goblin)
3. Klick: Test Render
4. Erwartung: Canvas zeigt Hero + Monster + Items
```

---

## 📈 Debug Log

Alle Aktionen werden im Debug Log protokolliert mit:
- ⏰ Timestamp
- 📝 Nachricht
- 🎨 Farb-Kodierung (Info/Success/Warning/Error)

**Beispiele:**
```
[10:25:34] ✅ Hero level updated to 5
[10:25:45] ⚔️ Hero attacks for 18 damage
[10:25:46] ✨ CRITICAL HIT! +36 damage!
[10:25:47] ✅ Monster defeated! +50 XP
```

---

## 🔧 Technische Details

### Verwendete Technologien
- **HTML5 Canvas** für 2D Rendering
- **Vanilla JavaScript** (keine Abhängigkeiten)
- **CSS Grid** für responsive Layout
- **requestAnimationFrame** für smooth Animations

### Game State Struktur
```javascript
gameState = {
  hero: {
    level, xp, maxXp,
    hp, maxHp,
    attack, defense,
    critChance, critMultiplier,
    x, y (Position)
  },
  monster: { name, icon, hp, maxHp, attack, xp, gold, x, y },
  combat: { active, currentMonster }
}
```

### Canvas Koordinaten
```
Tile Size: 40px
Canvas: 800x500px
Dungeon Area: 100-700 (X), 100-400 (Y)
Player Start: (5, 5) in Tile-Koordinaten
Monster Start: (10, 5) in Tile-Koordinaten
```

---

## 🐛 Häufige Probleme

### Canvas wird nicht angezeigt
**Lösung:** Klick auf "Initialize Canvas" button

### Monster hat 0 HP aber ist nicht besiegt
**Lösung:** Das ist normal im Debug-Tool. Im echten Spiel wird Combat automatisch beendet

### Log wird zu lang
**Lösung:** Klick auf "Clear Log" button zum Leeren

### Animation flackert
**Lösung:** Das ist normal. Teste auf einem schnelleren Computer oder mit Chrome/Firefox

---

## ✅ Testing Checklist

Vor dem Deployment:

- [ ] **Hero Stats** - Alle Werte updatebar und sichtbar
- [ ] **Combat Actions** - Attack, Defend, Monster Attack funktionieren
- [ ] **Damage Calculation** - Korrekte Math (Attack - Defense, Crit-Multiplikation)
- [ ] **Monster Types** - Alle 4 Monster-Typen spawn-bar
- [ ] **Canvas Rendering** - Dungeon wird korrekt gezeichnet
- [ ] **Animation** - 60 FPS möglich, smooth Movement
- [ ] **UI/UX** - Buttons responsive, Log readable
- [ ] **Edge Cases** - HP = 0, Defense > Attack, etc.

---

## 🚀 Nächste Schritte

1. **Mit diesem Tool alle Test-Szenarien durchspielen**
2. **Bugs/Issues dokumentieren** (siehe Debug Log)
3. **In `canvas-renderer.js` & `combat-ui.js` Fixes implementieren**
4. **Reales Gameplay testen** (index.html)
5. **Balancing anpassen** (HP-Werte, Damage, XP-Rewards)

---

## 📞 Support

Wenn du Fehler findest:
1. Notiere den Fehler aus dem Debug Log
2. Dokumentiere die Schritte zur Reproduzierung
3. Erstelle ein GitHub Issue mit dem Log-Output

---

**Happy Debugging! 🎮✨**
