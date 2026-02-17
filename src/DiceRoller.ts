/**
 * Dice Roller - Complete implementation with all Fatebinder features
 */

export interface RollResult {
  expression: string;
  total: number;
  rolls: number[];
  keptRolls?: number[];
  details: string;
  criticalSuccess?: boolean;
  criticalFailure?: boolean;
}

export class DiceRoller {
  /**
   * Roll standard dice expression
   * Supports: XdY, XdY+Z, XdYkhN, XdYklN, XdYrrN
   */
  static roll(expression: string): RollResult {
    const cleaned = expression.trim().replace(/\s+/g, '');
    
    // Parse: (count)d(sides)(modifiers)(bonus)
    const match = cleaned.match(/^(\d*)d(\d+)((?:kh|kl|rr)\d+)?([\+\-]\d+)?$/i);
    
    if (!match) {
      throw new Error('Invalid dice expression. Use: XdY, XdY+Z, XdYkh3, etc.');
    }
    
    const count = parseInt(match[1] || '1');
    const sides = parseInt(match[2]);
    const modifier = match[3] || '';
    const bonus = parseInt(match[4] || '0');
    
    if (count < 1 || count > 100) throw new Error('Dice count must be 1-100');
    if (sides < 2 || sides > 1000) throw new Error('Dice sides must be 2-1000');
    
    // Roll dice
    let rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    
    let keptRolls = rolls.slice();
    let modifierText = '';
    
    // Apply modifiers
    if (modifier) {
      const modType = modifier.slice(0, 2).toLowerCase();
      const modValue = parseInt(modifier.slice(2));
      
      if (modType === 'kh') {
        // Keep highest N
        keptRolls = rolls.slice().sort((a, b) => b - a).slice(0, modValue);
        modifierText = ` (keep highest ${modValue})`;
      } else if (modType === 'kl') {
        // Keep lowest N
        keptRolls = rolls.slice().sort((a, b) => a - b).slice(0, modValue);
        modifierText = ` (keep lowest ${modValue})`;
      } else if (modType === 'rr') {
        // Reroll N or lower
        rolls = rolls.map(r => r <= modValue ? Math.floor(Math.random() * sides) + 1 : r);
        keptRolls = rolls.slice();
        modifierText = ` (reroll ${modValue} or lower)`;
      }
    }
    
    const sum = keptRolls.reduce((a, b) => a + b, 0);
    const total = sum + bonus;
    
    // Format details
    let details = `Rolled: [${rolls.join(', ')}]`;
    if (keptRolls.length !== rolls.length) {
      details += ` → [${keptRolls.join(', ')}]`;
    }
    if (bonus !== 0) {
      details += ` ${bonus > 0 ? '+' : ''}${bonus}`;
    }
    details += ` = **${total}**`;
    
    // Check for crits (d20 only)
    const critSuccess = sides === 20 && count === 1 && keptRolls.includes(20);
    const critFailure = sides === 20 && count === 1 && keptRolls.includes(1);
    
    return {
      expression: cleaned,
      total,
      rolls,
      keptRolls,
      details,
      criticalSuccess: critSuccess,
      criticalFailure: critFailure,
    };
  }
  
  /**
   * Roll with advantage (2d20 keep highest)
   */
  static rollAdvantage(): RollResult {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const result = Math.max(roll1, roll2);
    
    return {
      expression: 'Advantage (2d20kh1)',
      total: result,
      rolls: [roll1, roll2],
      keptRolls: [result],
      details: `Rolled: [${roll1}, ${roll2}] → **${result}** (advantage)`,
      criticalSuccess: result === 20,
      criticalFailure: false,
    };
  }
  
  /**
   * Roll with disadvantage (2d20 keep lowest)
   */
  static rollDisadvantage(): RollResult {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const result = Math.min(roll1, roll2);
    
    return {
      expression: 'Disadvantage (2d20kl1)',
      total: result,
      rolls: [roll1, roll2],
      keptRolls: [result],
      details: `Rolled: [${roll1}, ${roll2}] → **${result}** (disadvantage)`,
      criticalSuccess: false,
      criticalFailure: result === 1,
    };
  }
  
  /**
   * Roll ability scores (4d6 drop lowest, 6 times)
   */
  static rollStats(): Array<{ total: number; details: string }> {
    const stats: Array<{ total: number; details: string }> = [];
    
    for (let i = 0; i < 6; i++) {
      const rolls = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      
      rolls.sort((a, b) => b - a);
      const kept = rolls.slice(0, 3);
      const total = kept.reduce((a, b) => a + b, 0);
      
      stats.push({
        total,
        details: `[${rolls.join(', ')}] → ${total}`,
      });
    }
    
    return stats;
  }
  
  /**
   * Roll FATE dice
   */
  static rollFate(count: number = 4): RollResult {
    const symbols = ['-', ' ', '+'];
    const rolls: string[] = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      const symbol = symbols[Math.floor(Math.random() * 3)];
      rolls.push(symbol);
      if (symbol === '+') total++;
      else if (symbol === '-') total--;
    }
    
    return {
      expression: `${count}dF`,
      total,
      rolls: rolls.map(s => s === '+' ? 1 : s === '-' ? -1 : 0),
      details: `[${rolls.join(' ')}] = **${total >= 0 ? '+' : ''}${total}**`,
    };
  }
  
  /**
   * Roll Shadowrun dice (count 5s and 6s)
   */
  static rollShadowrun(count: number): RollResult {
    const rolls: number[] = [];
    
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    
    const hits = rolls.filter(r => r >= 5).length;
    
    const formatted = rolls.map(r => r >= 5 ? `**${r}**` : r.toString());
    
    return {
      expression: `${count}d6 (Shadowrun)`,
      total: hits,
      rolls,
      details: `[${formatted.join(', ')}] = **${hits} hit(s)**`,
    };
  }
  
  /**
   * Roll D&D threshold stat (4d6, reroll 1s and 2s, drop lowest)
   */
  static rollThresholdStat(): { total: number; rolls: number[] } {
    const rolls: number[] = [];
    
    for (let i = 0; i < 4; i++) {
      let roll = Math.floor(Math.random() * 6) + 1;
      if (roll <= 2) {
        roll = Math.floor(Math.random() * 6) + 1; // Reroll
      }
      rolls.push(roll);
    }
    
    rolls.sort((a, b) => b - a);
    const kept = rolls.slice(0, 3);
    const total = kept.reduce((a, b) => a + b, 0);
    
    return { total, rolls };
  }
}
