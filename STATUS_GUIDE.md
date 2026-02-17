# Status Effects Guide

## How It Works

Status effects are automatically managed alongside initiative tracking.

### Adding Effects

```bash
!statusadd Fighter blessed           # Indefinite effect
!statusadd Goblin poisoned 3         # Lasts 3 rounds
!sa Wizard concentrating 10          # Short alias
```

### Automatic Duration Tracking

**Status durations automatically decrease at the start of each round!**

When you use `!init next` and the initiative wraps back to the first combatant (new round), the bot will:
1. Decrease all duration counters by 1
2. Remove any effects at 0 rounds
3. Notify you of expired effects

Example:
```bash
Round 1:
!statusadd Goblin poisoned 3         # Goblin has 3 rounds of poison

Round 2 starts:
!init next                           # Auto-ticks: Goblin now has 2 rounds

Round 3 starts:
!init next                           # Auto-ticks: Goblin now has 1 round

Round 4 starts:
!init next                           # Auto-ticks & expires
⏰ Effects expired:
- Goblin: poisoned
```

### Manual Control

You can also manually advance durations:
```bash
!statustick    # Advance all by 1 round
!stk           # Short alias
```

### Viewing Effects

```bash
!status                    # All active effects (summary)
!status Fighter            # Specific combatant (with descriptions)
!init                      # Effects show inline in tracker
!conditions                # List all available conditions
```

### Removing Effects Early

```bash
!statusremove Fighter poisoned    # Remove specific condition
!sr Fighter                        # Remove all conditions
!statusclear                       # Clear everything
```

## Integration with Initiative

Status effects appear directly in the initiative tracker:

```
⚔️ Initiative Tracker - Round 3 ⚔️

→ 18 - **Fighter** | HP: 22/25 | ✨ 🎯(2)
   15 - Goblin [NPC] | HP: Injured 💛 | ☠️(1) 😱
   12 - Wizard | HP: 15/15
```

- ✨ = Blessed (no duration)
- 🎯(2) = Concentrating (2 rounds left)
- ☠️(1) = Poisoned (1 round left)
- 😱 = Frightened (indefinite)

## Tips

1. **Use indefinite durations for ongoing effects:**
   - `!sa Fighter blessed` (Bless spell - lasts 1 minute)
   - `!sa Goblin frightened` (Frightened until conditions change)

2. **Use durations for time-limited effects:**
   - `!sa Wizard concentrating 10` (Concentration spell)
   - `!sa Fighter hasted 10` (Haste spell)

3. **The bot handles the countdown automatically - just use `!init next` normally!**

4. **Check status between rounds:**
   ```bash
   !status    # Quick check of all effects
   ```

## All Available Conditions

### D&D 5e Core
blinded 👁️, charmed 💖, deafened 🔇, frightened 😱, grappled 🤝, incapacitated 😵, invisible 👻, paralyzed 🥶, petrified 🗿, poisoned ☠️, prone ⬇️, restrained ⛓️, stunned 💫, unconscious 😴, exhaustion 😮‍💨, concentrating 🎯

### Custom Effects
blessed ✨, baned 💀, hasted ⚡, slowed 🐌, dodging 🛡️, hiding 🌫️, raging 😡, marked 🎯

Use `!status <combatant> <condition>` to see full rules text!
