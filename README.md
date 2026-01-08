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

## 🚀 Geplante Features

### Phase 1: MVP (In Entwicklung)
- [x] Repository Setup
- [ ] Basis-UI mit Tabs (Idle, Manual Run, Upgrades)
- [ ] Einfaches Auto-Run-System
- [ ] 3-4 Basis-Ressourcen
- [ ] Grundlegende Hero-Stats
- [ ] Simpler manueller Dungeon-Run
- [ ] 5-10 permanente Upgrades

### Phase 2: Combat & Dungeons
- [ ] Turn-based Combat-System
- [ ] 5+ Gegnertypen
- [ ] Procedural Dungeon-Generator
- [ ] Loot-System mit Items
- [ ] Verschiedene Raum-Typen

### Phase 3: Tiefe & Balance
- [ ] Boss-Kämpfe
- [ ] Skill-System
- [ ] Equipment-System
- [ ] Achievements
- [ ] Multiple Dungeon-Tiefen

### Phase 4: Polish & Erweiterung
- [ ] Prestige-System
- [ ] Special Events
- [ ] Statistiken & Analytics
- [ ] Sound & Visual Effects

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas für Dungeon-Visualisierung
- **Styling**: Pure CSS
- **State Management**: LocalStorage Persistence
- **Architecture**: Modulares ES6 Module Design

## 📁 Projekt-Struktur

```
Dungeon-Idle-Game/
├── index.html
├── styles.css
├── main.js
├── src/
│   ├── core/
│   │   ├── game-loop.js
│   │   ├── game-state.js
│   │   └── save-manager.js
│   ├── idle/
│   │   ├── auto-run.js
│   │   ├── resources.js
│   │   └── offline-progress.js
│   ├── roguelike/
│   │   ├── dungeon-generator.js
│   │   ├── combat-system.js
│   │   ├── enemy-ai.js
│   │   └── loot-system.js
│   ├── hero/
│   │   ├── hero-stats.js
│   │   ├── skills.js
│   │   └── equipment.js
│   └── meta/
│       ├── upgrades.js
│       └── progression.js
└── ui/
    ├── ui-init.js
    ├── ui-render.js
    └── canvas-renderer.js
```

## 🎮 Spielen

**Live Demo**: [dungeon.future-pulse.tech](https://dungeon.future-pulse.tech/) *(coming soon)*

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

## 📊 Entwicklungs-Status

**Aktuell**: Phase 1 - MVP Development  
**Version**: 0.1.0-alpha  
**Letzte Aktualisierung**: Januar 2026

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