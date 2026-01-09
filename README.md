# 🏰 Dungeon Idle Game

Ein innovatives Spiel, das Roguelike-Dungeon-Crawling mit Idle-Game-Mechaniken verbindet.

## 🎮 Konzept

**Dungeon Idle** kombiniert das Beste aus zwei Welten:
- **Idle-Mechanik**: Dein Held erkundet automatisch Dungeons im Hintergrund
- **Roguelike-Action**: Spiele manuelle Runs für bessere Belohnungen und taktische Kämpfe
- **Meta-Progression**: Nutze gesammelte Ressourcen für permanente Upgrades
- **Procedural Generation**: Jeder Dungeon ist einzigartig

---

## 🚀 Aktueller Entwicklungsstand

### Version & Status

- **Aktuelle Version:** `2.1.0`
- **Status:** Spielbar, mit Difficulty-System & vorbereitetem Equipment-Framework
- **Live Demo:** https://idle.future-pulse.tech

> Details zum Fortschritt findest du in [`STATUS.md`](./STATUS.md)

### Wichtige Systeme (Stand 2.1.0)

- ✅ Dungeon-Generator v2.1 (längere Dungeons, Boss-Räume, Difficulty-Scaling)
- ✅ 4 Schwierigkeitsgrade (Easy, Normal, Hard, Expert)
- ✅ Monster-Rebalancing (keine 1-Hit-„Witzmonster“ mehr)
- ✅ Boss-System mit mehreren Boss-Typen
- ✅ Manual Runs inkl. Difficulty-Auswahl
- ✅ Auto-Run-System (Idle)
- ✅ Grundlegendes Equipment-System (Framework)
- ✅ Umfangreiche Dokumentation

Weitere Details zu den Features findest du in [`CHANGELOG.md`](./CHANGELOG.md).

---

## 🎯 Gameplay-Features

### Automatische Runs (Idle)
- Held erkundet Dungeons automatisch im Hintergrund
- Gold, XP, Souls und weitere Ressourcen werden passiv gesammelt
- Erfolgsrate hängt von Hero-Stats (und später Equipment) ab
- Läuft in Intervallen und kann an/aus geschaltet werden

### Manuelle Runs (Roguelike)
- Turn-based Combat auf einem Dungeon-Canvas
- Procedural generierte Dungeons mit mehreren Räumen
- Unterschiedliche Gegnertypen und Boss-Räume
- Höhere Loot- und XP-Ausbeute als Auto-Runs
- Ab Version 2.1.0: Schwierigkeitsauswahl + längere Dungeons

> Siehe [`DIFFICULTY_SYSTEM.md`](./DIFFICULTY_SYSTEM.md) für alle Details zum Difficulty-System.

### Difficulty-System (NEU in 2.1.0)

- **Easy:** 5–8 Räume, 0,75× Monsterstärke, 1,0× Rewards
- **Normal:** 7–10 Räume, 1,2× Monsterstärke, 1,5× Rewards
- **Hard:** 10–13 Räume, 1,6× Monsterstärke, 2,5× Rewards
- **Expert:** 12–15 Räume, 2,0× Monsterstärke, 4,0× Rewards
- Boss-Räume erscheinen abhängig von der Schwierigkeit alle 3–5 Räume

Detaillierte Formeln, Beispiele und Balancing-Notizen findest du in:
- [`DIFFICULTY_SYSTEM.md`](./DIFFICULTY_SYSTEM.md)
- [`DIFFICULTY_TESTING_GUIDE.md`](./DIFFICULTY_TESTING_GUIDE.md)
- Spieler-orientiert: [`QUICK_START.md`](./QUICK_START.md)

### Equipment- & Klassensystem (Framework vorhanden)

- Waffen, Rüstungen und Accessoires mit Attribut-Boni
- Rarity-Tiers: Common → Legendary
- **Waffen bestimmen die „Klasse“ des Helden** (Equipment-based Classes):
  - Sword → Warrior (balanced)
  - Bow → Ranger (Crit-fokussiert)
  - Hammer → Berserker (hoher Schaden, geringere Defense)
  - Staff → Mage (Utility/Survivability)
  - Dagger → Rogue (hoher Crit, riskant)
- Stats (ATK/DEF/HP/Crit) werden beim Ausrüsten neu berechnet
- Framework vorbereitet, UI & Loot-Drops folgen

Details zum Design:
- [`equipment-system.js`](./src/upgrades/equipment-system.js)
- [`CLASS_AND_EQUIPMENT_SYSTEM.md`](./CLASS_AND_EQUIPMENT_SYSTEM.md)
- [`DESIGN_DECISIONS.md`](./DESIGN_DECISIONS.md)
- Kurze Q&A: [`YOUR_QUESTIONS_ANSWERED.md`](./YOUR_QUESTIONS_ANSWERED.md)

---

## 📚 Dokumentation

Die wichtigsten Design- und Technik-Dokumente im Überblick:

- 📌 **Projektstatus & Roadmap:** [`STATUS.md`](./STATUS.md)
- 📝 **Changelog:** [`CHANGELOG.md`](./CHANGELOG.md)
- 🚀 **Quick Start (für Spieler):** [`QUICK_START.md`](./QUICK_START.md)
- 🎯 **Difficulty-System (Design & Formeln):** [`DIFFICULTY_SYSTEM.md`](./DIFFICULTY_SYSTEM.md)
- 🧪 **Difficulty Testing Guide:** [`DIFFICULTY_TESTING_GUIDE.md`](./DIFFICULTY_TESTING_GUIDE.md)
- ⚔️ **Class & Equipment Design:** [`CLASS_AND_EQUIPMENT_SYSTEM.md`](./CLASS_AND_EQUIPMENT_SYSTEM.md)
- 🧠 **Designentscheidungen:** [`DESIGN_DECISIONS.md`](./DESIGN_DECISIONS.md)
- ❓ **Q&A zu deinen Fragen:** [`YOUR_QUESTIONS_ANSWERED.md`](./YOUR_QUESTIONS_ANSWERED.md)

Damit dient die README als Einstiegspunkt, während die verlinkten Dateien jeweils tiefer ins Detail gehen.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+)
- **Rendering:** HTML5 Canvas für Dungeon-Visualisierung
- **Styling:** CSS mit Custom Properties
- **State Management:** `gameState` + LocalStorage Persistence
- **Architektur:** Modulares ES6-Module-Design

Details zur aktuellen Struktur siehe [`STATUS.md`](./STATUS.md).

---

## 📁 Projekt-Struktur (vereinfacht)

```bash
Dungeon-Idle-Game/
├── index.html                # Haupt-HTML mit Tabs (Idle, Manual Run, Hero, Upgrades)
├── styles.css                # Styling
├── main.js                   # Entry Point
├── src/
│   ├── core/
│   │   ├── game-state.js     # State Management & Save/Load
│   │   └── ...
│   ├── dungeons/
│   │   └── dungeon-generator.js  # Dungeon & Difficulty-Logik
│   └── upgrades/
│       └── equipment-system.js   # Equipment & Klassen-Framework
├── ui/
│   ├── ui-init.js
│   ├── ui-render.js
│   ├── manual-run-ui.js          # Manual Run UI + Difficulty Selection
│   └── ...
├── QUICK_START.md
├── DIFFICULTY_SYSTEM.md
├── DIFFICULTY_TESTING_GUIDE.md
├── CLASS_AND_EQUIPMENT_SYSTEM.md
├── DESIGN_DECISIONS.md
├── YOUR_QUESTIONS_ANSWERED.md
├── STATUS.md
└── CHANGELOG.md
```

---

## 🎮 Spielen

### Live Demo

- **Idle Game Demo:** https://idle.future-pulse.tech

### Lokal ausführen

```bash
# Repository klonen
git clone https://github.com/oliverlaudan-ops/Dungeon-Idle-Game.git
cd Dungeon-Idle-Game

# Mit lokalem Server starten (ein Beispiel)
python -m http.server 8000
# oder
npx http-server

# Im Browser öffnen
http://localhost:8000
```

---

## 🎯 Game Design Prinzipien

1. **Dual Gameplay**: Idle für entspanntes Progressen, Manual Runs für aktive Sessions
2. **Fair Progression**: Keine Pay-to-Win-Mechaniken geplant, alles erspielbar
3. **Strategic Depth**: Entscheidungen bei Dungeons, Difficulty, Upgrades und Equipment
4. **Respect for Time**: Offline-Progress, sinnvolle Run-Dauer, kein künstliches Warten
5. **Replayability**: Procedural Dungeons, Meta-Progression, verschiedene Builds

---

## 👏 Contributing

Das Projekt ist in aktiver Entwicklung. Beiträge, Ideen und Feedback sind willkommen!

1. Repository forken
2. Feature-Branch erstellen
3. Änderungen committen
4. Branch pushen
5. Pull Request eröffnen

Bitte lies vorher kurz [`STATUS.md`](./STATUS.md) und [`CHANGELOG.md`](./CHANGELOG.md), um den aktuellen Stand zu verstehen.

---

## 📝 Lizenz

MIT License – siehe [`LICENSE`](./LICENSE)

---

## 💬 Kontakt

- **Autor:** Oliver Laudan – [@oliverlaudan-ops](https://github.com/oliverlaudan-ops)
- **Repository:** https://github.com/oliverlaudan-ops/Dungeon-Idle-Game

---

⚔️ Happy Dungeon Crawling & Idle Farming! 🏰
