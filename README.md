# 🏰 Dungeon Idle Game

Ein innovatives Spiel, das Roguelike-Dungeon-Crawling mit Idle-Game-Mechaniken verbindet.

## 🎮 Konzept

**Dungeon Idle** kombiniert das Beste aus zwei Welten:
- **Idle-Mechanik**: Dein Held erkundet automatisch Dungeons im Hintergrund
- **Roguelike-Action**: Spiele manuelle Runs für bessere Belohnungen und taktische Kämpfe
- **Meta-Progression**: Nutze gesammelte Ressourcen für permanente Upgrades
- **Procedural Generation**: Jeder Dungeon ist einzigartig

## 🎯 Gameplay-Features

### Automatische Runs (Idle)
- Dein Held erkundet Dungeons auch wenn du offline bist
- Sammle Gold, XP, Souls und Gems passiv
- Erfolgsrate basiert auf deinen Hero-Stats
- Runs alle paar Sekunden/Minuten

### Manuelle Runs (Roguelike)
- Turn-based Combat-System
- Procedural generierte Dungeon-Layouts
- Verschiedene Gegnertypen mit unterschiedlichen Fähigkeiten
- Bessere Loot-Chancen als Auto-Runs
- Boss-Kämpfe und spezielle Räume

### Meta-Progression
- Permanente Hero-Upgrades (HP, Attack, Defense)
- Skill-Tree für neue Fähigkeiten
- Idle-Effizienz-Verbesserungen
- Freischaltbare Dungeon-Tiefen

## 🚀 Entwicklungs-Status

### Phase 1: MVP ✅ **ABGESCHLOSSEN**
- [x] Repository Setup
- [x] Basis-UI mit Tabs (Idle, Manual Run, Hero, Upgrades)
- [x] Auto-Run-System mit Start/Stop
- [x] 4 Ressourcen (Gold, Gems, Souls, Keys)
- [x] Hero-Level-System mit XP
- [x] Run-History mit visuellen Feedback
- [x] Statistiken-Tracking
- [x] Auto-Save System

### Phase 2: Hero & Upgrades (In Planung)
- [ ] Hero-Tab mit vollständiger Stats-Anzeige
- [ ] Attribute-System und Level-Up-Boni
- [ ] 10-15 permanente Upgrades
- [ ] Upgrade-Kategorien (Attack, Defense, Idle-Speed)
- [ ] Tooltips und Beschreibungen

### Phase 3: Combat & Dungeons
- [ ] Turn-based Combat-System
- [ ] 5+ Gegnertypen
- [ ] Procedural Dungeon-Generator
- [ ] Loot-System mit Items
- [ ] Verschiedene Raum-Typen

### Phase 4: Polish & Erweiterung
- [ ] Boss-Kämpfe
- [ ] Skill-System
- [ ] Equipment-System
- [ ] Achievements
- [ ] Multiple Dungeon-Tiefen
- [ ] Prestige-System

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas für Dungeon-Visualisierung
- **Styling**: Pure CSS mit Custom Properties
- **State Management**: LocalStorage Persistence
- **Architecture**: Modulares ES6 Module Design

## 📁 Projekt-Struktur

```
Dungeon-Idle-Game/
├── index.html              # Haupt-HTML mit Tab-System
├── styles.css             # Komplettes Styling
├── main.js                # Entry Point
├── src/
│   ├── core/
│   │   ├── game-loop.js       # Haupt-Game-Loop
│   │   └── game-state.js      # State Management & Save/Load
│   └── idle/
│       └── auto-run.js        # Auto-Run-System
└── ui/
    ├── ui-init.js         # UI Initialisierung
    └── ui-render.js       # Rendering & Updates
```

## 🎮 Spielen

**Live Demo**: [dungeon.future-pulse.tech](https://dungeon.future-pulse.tech/)

### Lokal ausführen

```bash
# Repository klonen
git clone https://github.com/oliverlaudan-ops/Dungeon-Idle-Game.git
cd Dungeon-Idle-Game

# Mit lokalem Server starten
python -m http.server 8000
# oder
npx http-server

# Im Browser öffnen
open http://localhost:8000
```

## 🎯 Game Design Prinzipien

1. **Dual Gameplay**: Idle für Casual, Roguelike für Engagement
2. **Fair Progression**: Keine Pay-to-Win, alles erspielbar
3. **Strategic Depth**: Sinnvolle Entscheidungen bei Upgrades und Combat
4. **Respekt für Zeit**: Offline-Progress und keine künstlichen Wartezeiten
5. **Wiederspielbarkeit**: Procedural Generation und Meta-Progression

## 👏 Aktueller Stand

**Version**: 0.1.0-alpha  
**Letzte Aktualisierung**: Januar 2026

### Spielbare Features
- ✅ Auto-Run-System aktivieren/deaktivieren
- ✅ Ressourcen sammeln (Gold, Gems, Souls)
- ✅ Hero levelt automatisch durch XP
- ✅ Run-History mit Erfolgen/Fehlschlägen
- ✅ Statistiken-Tracking
- ✅ Auto-Save (alle 30 Sekunden)

### Nächste Schritte
1. Hero-Tab mit Stats-Visualisierung
2. Upgrade-System implementieren
3. Manual Run Grundgerüst

## 👥 Contributing

Das Projekt ist in aktiver Entwicklung. Beiträge, Ideen und Feedback sind willkommen!

1. Forke das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Pushe zum Branch
5. Öffne einen Pull Request

## 📝 Lizenz

MIT License - siehe LICENSE Datei

## 💬 Kontakt

Oliver Laudan - [@oliverlaudan-ops](https://github.com/oliverlaudan-ops)

Projekt Link: [https://github.com/oliverlaudan-ops/Dungeon-Idle-Game](https://github.com/oliverlaudan-ops/Dungeon-Idle-Game)

---

⚔️ Happy Dungeon Crawling! 🏰