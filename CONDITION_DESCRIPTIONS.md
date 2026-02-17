# Status Effect Descriptions - Quick Reference

All D&D 5e condition descriptions are built into Mojave!

## How to View Descriptions

### View Any Condition:
```bash
!status poisoned
!status paralyzed
!status charmed
!status blessed
```

**Output Example:**
```
Poisoned ☠️

A poisoned creature has disadvantage on attack rolls and ability checks.
```

### View Combatant's Active Effects:
```bash
!status Fighter
```
Shows all conditions on Fighter with full descriptions.

### List All Available Conditions:
```bash
!conditions
```

## All Available Conditions with Descriptions

### Core D&D 5e Conditions

**Blinded** 👁️
A blinded creature can't see and automatically fails ability checks that require sight. Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.

**Charmed** 💖
A charmed creature can't attack the charmer or target the charmer with harmful abilities or magical effects. The charmer has advantage on any ability check to interact socially with the creature.

**Deafened** 🔇
A deafened creature can't hear and automatically fails ability checks that require hearing.

**Frightened** 😱
A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature can't willingly move closer to the source of its fear.

**Grappled** 🤝
A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed. The condition ends if the grappler is incapacitated or if an effect removes the grappled creature from the reach of the grappler.

**Incapacitated** 😵
An incapacitated creature can't take actions or reactions.

**Invisible** 👻
An invisible creature is impossible to see without the aid of magic or a special sense. The creature is heavily obscured for the purpose of hiding. Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage.

**Paralyzed** 🥶
A paralyzed creature is incapacitated and can't move or speak. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage. Any attack that hits the creature is a critical hit if the attacker is within 5 feet.

**Petrified** 🗿
A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging. The creature is incapacitated, can't move or speak, and is unaware of its surroundings.

**Poisoned** ☠️
A poisoned creature has disadvantage on attack rolls and ability checks.

**Prone** ⬇️
A prone creature's only movement option is to crawl, unless it stands up. The creature has disadvantage on attack rolls. An attack roll against the creature has advantage if the attacker is within 5 feet. Otherwise, the attack roll has disadvantage.

**Restrained** ⛓️
A restrained creature's speed becomes 0, and it can't benefit from any bonus to its speed. Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage. The creature has disadvantage on Dexterity saving throws.

**Stunned** 💫
A stunned creature is incapacitated, can't move, and can speak only falteringly. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage.

**Unconscious** 😴
An unconscious creature is incapacitated, can't move or speak, and is unaware of its surroundings. The creature drops whatever it's holding and falls prone. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage. Any attack that hits the creature is a critical hit if the attacker is within 5 feet.

**Exhaustion** 😮‍💨
Exhaustion is measured in six levels. Level 1: Disadvantage on ability checks. Level 2: Speed halved. Level 3: Disadvantage on attack rolls and saving throws. Level 4: Hit point maximum halved. Level 5: Speed reduced to 0. Level 6: Death.

**Concentrating** 🎯
Maintaining concentration on a spell. Taking damage or being incapacitated may break concentration.

### Custom Effects

**Blessed** ✨
Whenever you make an attack roll or saving throw, you can roll a d4 and add the number rolled to the attack roll or saving throw.

**Baned** 💀
Whenever you make an attack roll or saving throw, you must roll a d4 and subtract the number rolled from the attack roll or saving throw.

**Hasted** ⚡
Speed doubled, +2 AC, advantage on Dexterity saves, additional action each turn.

**Slowed** 🐌
Speed halved, -2 AC and Dexterity saves, can't use reactions, can use action or bonus action (not both).

**Dodging** 🛡️
Attack rolls against you have disadvantage. You make Dexterity saving throws with advantage.

**Hiding** 🌫️
Hidden from enemies. They don't know your exact location.

**Raging** 😡
Advantage on Strength checks and saves, bonus damage on melee attacks, resistance to physical damage.

**Marked** 🎯
Marked by an attacker. Various effects depending on the marking ability.

## Quick Commands

```bash
!conditions              # List all conditions
!status poisoned         # View description
!status Fighter          # View Fighter's conditions
!statusadd Fighter poisoned 3    # Apply with duration
```

All descriptions are pulled directly from D&D 5e SRD!
