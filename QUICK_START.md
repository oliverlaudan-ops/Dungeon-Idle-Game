# 🚀 Dungeon Idle Game - Quick Start Guide

## 🎲 What Just Changed?

### Difficulty System v2.1 (JUST IMPLEMENTED)

✅ **Dungeons are now LONGER** (5-15 rooms instead of just 3)
✅ **Bosses actually appear** (every 3-5 rooms depending on difficulty)
✅ **Monsters are MUCH STRONGER** (deal 4-5 damage now, not 1)
✅ **Combat is actually challenging** (takes multiple rounds, not instant kills)
✅ **Difficulty settings matter** (Easy vs Expert is a HUGE difference)

---

## 🌟 Starting the Game

### First Time?

1. Open **index.html**
2. Start with **Easy Difficulty**
3. Play a few Manual Runs to learn combat
4. Progress to **Normal Difficulty** when comfortable
5. Unlock Hard/Expert as you level up

---

## 🎯 Choosing Your Difficulty

### 😊 EASY
- **5-8 rooms** per dungeon
- **Monsters deal ~3 damage** per hit
- **Perfect for:** Learning, Level 1-3 heroes
- **Time:** 3-5 mins per run
- **Rewards:** 1.0x base (no bonus)

### 😀 NORMAL (Recommended)
- **7-10 rooms** per dungeon
- **Monsters deal ~4-5 damage** per hit
- **Perfect for:** Most players, Level 4+ heroes
- **Time:** 5-10 mins per run
- **Rewards:** 1.5x (bonus!)
- **Boss:** 1 every 5 rooms

### 😬 HARD
- **10-13 rooms** per dungeon
- **Monsters deal ~5-7 damage** per hit
- **Perfect for:** Level 8+ heroes, experienced players
- **Time:** 8-12 mins per run
- **Rewards:** 2.5x (big bonus!)
- **Bosses:** More frequent (every 4 rooms)

### 🔥 EXPERT
- **12-15 rooms** per dungeon
- **Monsters deal ~6-8 damage** per hit
- **Perfect for:** Level 12+ heroes, hardcore only
- **Time:** 10-15 mins per run
- **Rewards:** 4.0x (massive bonus!)
- **Bosses:** VERY frequent (every 3 rooms)

---

## 🧁 Combat System

### How Combat Works

```
1. You attack monster: Damage = (Your ATK - Monster DEF)
2. Monster attacks you: Damage = (Monster ATK - Your DEF)
3. Combat continues until someone dies
4. Winner gets XP and Gold
```

### Example: Level 5 Hero vs Normal Monster (Floor 1)

**Your Stats:**
- ATK: 20 (base 10 + 5 levels * 2)
- DEF: 5 (base)
- HP: 100+ (depending on upgrades)

**Monster Stats:**
- HP: ~36 (Goblin, 1.2x multiplier)
- ATK: ~9.6 (deals ~4 damage to you)
- DEF: 0-2

**Combat:**
```
Round 1: You hit for 20 damage  (20 - 0) → Monster takes 20 damage (16 HP left)
Round 1: Monster hits for 4 damage (9.6 - 5) → You take 4 damage

Round 2: You hit for 20 damage (16 - 20 = dead)
Monster defeated!
```

**Result:**
- You lose ~4 HP
- You gain ~20 XP + 5 Gold

---

## 📄 Progression Path

### Week 1: Learn the Game

**Day 1-2:** Easy Difficulty
- Rooms 1-3: No monsters (warm-up)
- Rooms 4-8: Learn combat patterns
- Focus: Understanding how damage works

**Day 3-4:** Normal Difficulty (if Level 3+)
- Rooms 1-10: Real challenge begins
- You should win 70%+ of runs
- Focus: Consistency and survival

**Day 5-7:** Try Hard Difficulty (if Level 6+)
- Rooms 1-13: Serious challenge
- You might lose some runs
- Focus: Building better strategies

### Week 2+: Grind & Farm

**Level 5-7:** Normal difficulty, 1.5x rewards
**Level 8-10:** Hard difficulty, 2.5x rewards
**Level 12+:** Expert difficulty, 4.0x rewards!

---

## 🌟 Boss Encounters

### When Do You Meet Bosses?

- **Easy:** Every 5 rooms (rooms 5, 10, 15...)
- **Normal:** Every 5 rooms
- **Hard:** Every 4 rooms (more frequent!)
- **Expert:** Every 3 rooms (almost every other room!)

### Boss Types

| Boss | Icon | Specialty | When |
|------|------|-----------|------|
| Dragon Lord | 🐉 | High HP + High ATK | Balanced threat |
| Lich King | 👑 | Medium stats | Consistent threat |
| Giant Golem | 🤖 | VERY high HP | Wall boss |
| Dark Sorcerer | 🧙 | Very high ATK | Glass cannon |
| Ancient Wyvern | 🐍 | High HP + High ATK | Tough fight |

### Boss Example: Dragon Lord (Floor 1, Normal)

**Stats:**
- HP: ~400 (massive!)
- ATK: ~45 (deals ~40 damage per hit to you!)
- Rewards: 100+ XP, 50+ Gold

**Strategy:**
- You CANNOT kill this at Level 5
- Need 150+ ATK (Level 12+) to reliably win
- OR Equipment with big stat boosts
- Early game: Skip boss rooms, come back later

---

## 📊 Upgrade System (Coming Soon!)

Right now you can only grind for XP and Gold.

Soon you'll be able to:
- 💫 Upgrade Attack power
- 💫 Upgrade Defense
- 💫 Upgrade Max HP
- 💎 Equip gear for stat boosts
- 🌟 Unlock special abilities

This will make bosses actually beatable!

---

## 🎮 Game Tips & Tricks

### Tip 1: Start on Easy
Don't jump into Hard right away. Easy teaches you the game rhythm.

### Tip 2: Longer dungeons = More rewards
Normal gives 1.5x rewards for slightly harder combat.
**Best value:** Normal difficulty!

### Tip 3: Level up first
Don't try Expert at Level 5. Get to Level 10+.

### Tip 4: Bosses are optional early
You can retreat from boss rooms before reaching them.
Come back when you're stronger.

### Tip 5: Watch your HP
If you get to 25% HP, leave the dungeon to heal.
Lose resources but keep your hero alive.

---

## 🐛 Known Issues & Feedback

### What's Working Great

✅ Longer dungeons feel satisfying
✅ Bosses are challenging but beatable
✅ Difficulty curve makes sense
✅ Combat is now interesting (not instant kills)

### What's Coming Next

- [ ] Equipment system (gear, weapons, armor)
- [ ] Upgrade trees (ATK/DEF/HP improvements)
- [ ] Special abilities for bosses
- [ ] Loot drops from monsters
- [ ] Difficulty-specific achievements
- [ ] Leaderboards

---

## 📚 Resources

- **DIFFICULTY_SYSTEM.md** - Full technical documentation
- **DIFFICULTY_TESTING_GUIDE.md** - How to test each difficulty
- **DEBUG_MANUAL_RUN.html** - Debug tool for testing combat

---

## 🧐 FAQ

### Q: Why are monsters so hard now?
**A:** They weren't supposed to one-shot kill you. Now they deal realistic damage!

### Q: Can I beat a boss at Level 5?
**A:** Not the early ones. You need 150+ ATK (Level 12+) or equipment.

### Q: Which difficulty should I play?
**A:** Normal if you're 4+, Hard if you're 8+, Expert if you're 12+.

### Q: Why do some dungeons have more rooms?
**A:** Difficulty! Hard has 10-13 rooms, Easy has 5-8.

### Q: What's the best way to grind?
**A:** Play Normal difficulty. 1.5x rewards, good challenge, 5-10 mins per run.

---

## 🚀 Next Steps

1. **Open the game** (index.html)
2. **Select Easy or Normal**
3. **Start a Manual Run**
4. **Learn combat** through a few dungeons
5. **Progress to the next difficulty** when ready
6. **Report any balance issues!**

---

**Have fun dungeon crawling!** 🐉👑😬🔥

**Last Updated:** January 9, 2026
**Version:** 2.1 (Rebalanced)
