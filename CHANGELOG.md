# 📜 Changelog

Alle wichtigen Änderungen am Dungeon Idle Game, dokumentiert nach Version.

---

## [2.2.0] - 2026-01-09

### ✨ Neu hinzugefügt
- **🎭 Fantasy UI Theme** - Komplette Neugestaltung mit mittelalterlichem Fantasy-Design
  - Neue Farbpalette (Dunkelrot, Gold, Dunkelgrün)
  - Serif-Schriftart (Georgia/Garamond) für mittelalterliches Flair
  - Stone-Texturen und dekorative Elemente
  - Bucheffekte und Shadow-Glow auf interaktiven Elementen
  - Goldene Borders und mittelalterliche Dekoration

- **🎁 Loot Drop System** - Equipment-Drops bei Dungeon-Abschluss
  - Schwierigkeits-basierte Drop-Raten:
    - Easy: 15% Chance, Common/Uncommon
    - Normal: 25% Chance, Common/Rare
    - Hard: 35% Chance, Uncommon/Epic
    - Expert: 50% Chance, Rare/Legendary
  - Gewichtete Rarity-Zuweisung
  - Boss-spezifische Loot-Generierung
  - Loot-Quote Display in Manual Run UI

- **📊 Equipment Preview in Manual Run**
  - Zeigt ausgerüstete Items (Waffe, Rüstung, Accessory)
  - Live Hero-Stats Preview (ATK, DEF, HP, CRIT)
  - Klassenanzeige basierend auf Waffe
  - Visual Equipment Slots mit Icons

- **🎨 Fantasy Manual Run UI**
  - Mittelalterliches Difficulty-Selector mit farbigen Buttons
  - Detaillierte Schwierigkeits-Beschreibungen
  - Equipment-Vorschau mit Stat-Anzeige
  - Loot-History Display nach Dungeon
  - Fantasy-themisches Design mit Gold/Rot-Farben

### 🔧 Technische Änderungen
- Neue Datei: `src/upgrades/loot-system.js` - Loot-Generierung und Drop-Logik
- Neue Datei: `loot-styles.css` - Styling für Loot-System und Manual Run
- `ui/manual-run-ui.js` - Komplette Überarbeitung mit Loot-Integration
- `styles.css` - Ganzes Styling auf Fantasy-Theme umgestellt

### 🎮 Gameplay-Verbesserungen
- Equipment wird bedeutungsvoller (nicht nur Stat-Zahlen)
- Visuelle Belohnungen beim Dungeon-Abschluss
- Bessere Immersion durch Fantasy-Theme
- Loot-Rarity visuell codiert (Farben)

---

## [2.1.0] - 2026-01-08

### ✨ Neu hinzugefügt
- **🎯 Difficulty System** - 4 Schwierigkeitsgrade
  - Easy (5-8 Räume, 0.75x Monster, 1.0x Rewards)
  - Normal (7-10 Räume, 1.2x Monster, 1.5x Rewards)
  - Hard (10-13 Räume, 1.6x Monster, 2.5x Rewards)
  - Expert (12-15 Räume, 2.0x Monster, 4.0x Rewards)
- **👑 Equipment & Klassensystem Framework**
  - Equipment-basierte Klassen (Waffe bestimmt Klasse)
  - 5 Klassen: Warrior, Ranger, Berserker, Mage, Rogue
  - Stat-Modifiers für jede Klasse
  - Rarity-System: Common bis Legendary
- **📊 Schwierigkeits-Skalierung** - Monster & Rewards passen sich an
- **💼 Equipment-Vorschau** in Manual Run
- **📖 Umfangreiche Dokumentation**

### 🔧 Technische Änderungen
- Neue Datei: `src/upgrades/equipment-system.js` - Equipment & Klassen Framework
- Neue Datei: `src/dungeons/dungeon-generator.js` v2.1 - Difficulty-Scaling
- `ui/manual-run-ui.js` - Difficulty Selector UI
- Neue Docs: `DIFFICULTY_SYSTEM.md`, `CLASS_AND_EQUIPMENT_SYSTEM.md`, etc.

### 🎮 Gameplay-Verbesserungen
- Dungeons skalieren mit Spieler-Progression
- Expert-Runs belohnen 4x besser
- Equipment macht combat-mechaniken vielfältiger
- Klassen geben verschiedene Playstyles

---

## [2.0.0] - 2026-01-07

### ✨ Neu hinzugefügt
- **🗺️ Dungeon Generator v2.0** - Procedural Dungeon-Generierung
  - 7 verschiedene Raum-Typen
  - Boss-Räume am Ende
  - Monster-Spawning nach Raumtyp
  - Gold/XP-Rewards pro Raum
- **⚔️ Turn-Based Combat System** - Grundgerüst
  - Hero vs Monster Combat
  - Damage Calculation
  - Status tracking
- **👾 5+ Monster-Typen** mit verschiedenen Stats
- **💬 Umfangreiche Dokumentation** (README, Design Docs)

### 🔧 Technische Änderungen
- Neue Datei: `src/dungeons/dungeon-generator.js` - Dungeon-Logik
- Neue Datei: `src/combat/combat-system.js` - Combat Simulation
- Canvas-Integration für Dungeon-Visualisierung
- Dungeon-History Tracking

### 🎮 Gameplay-Verbesserungen
- Manual Runs sind jetzt vollständig spielbar
- Jeder Dungeon ist unikat (procedural)
- Bosses für Epic-Momente

---

## [1.5.0] - 2026-01-06

### ✨ Neu hinzugefügt
- **🎰 Auto-Run System** - Vollständige Idle-Funktionalität
  - Start/Stop-Button
  - Interval-basierte Auto-Runs
  - Run-History mit Success/Failure
  - Statistik-Tracking
- **📊 Statistics Tab** - Umfangreiche Stats
  - Runs played, Won, Lost
  - Total Gold/XP earned
  - Best/Average performance
- **💾 Auto-Save System** - Alle 30 Sekunden gespeichert

### 🔧 Technische Änderungen
- `src/idle/auto-run.js` - Auto-Run Logik
- `src/core/game-state.js` - State Management überarbeitet
- LocalStorage-Integration für Persistence

---

## [1.0.0] - 2026-01-01

### ✨ Neu hinzugefügt
- **🎮 MVP Released**
  - 4 Tabs: Idle, Manual Run, Hero, Upgrades
  - Resource-System (Gold, Gems, Souls, Keys)
  - Hero-Leveling mit XP
  - Basic Upgrade-System
  - HTML/CSS/JS Frontend
  - LocalStorage State Management

### 🔧 Technische Änderungen
- Basis-Repository Setup
- Modular Architecture (ES6 Modules)
- Tab-System in HTML
- Basis-Styling mit Dark Theme

---

## 📝 Legende

- **✨ Neu hinzugefügt** - Neue Features
- **🔧 Technische Änderungen** - Code-Updates
- **🎮 Gameplay-Verbesserungen** - Gameplay-Impact
- **🐛 Bugfixes** - Behobene Bugs
- **📚 Dokumentation** - Docs Updates
- **⚡ Performance** - Performance-Verbesserungen
- **🎨 UI/UX** - Interface-Updates

---

## Nächste geplante Features (Roadmap)

### Version 2.3.0
- [ ] Equipment-Inventar UI
- [ ] Equip/Unequip funktional
- [ ] Equipment-Shop
- [ ] Visual Class Indicator
- [ ] Equipment-Stats auf Auto-Runs anwenden

### Version 2.4.0
- [ ] Skill-Tree System
- [ ] Advanced Combat Features
- [ ] Prestige-System
- [ ] Achievements

### Version 3.0.0
- [ ] Multiple Dungeon-Tiefen
- [ ] Leaderboards
- [ ] Co-op Features (geplant)
- [ ] Mobile Optimization

---

**Zuletzt aktualisiert:** 9. Januar 2026
