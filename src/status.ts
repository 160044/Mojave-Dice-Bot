/**
 * Status Effects Tracker - In-Memory Storage
 * D&D 5e Conditions + Custom Effects
 */

interface StatusEffect {
  condition: string;
  duration?: number; // rounds remaining, undefined = indefinite
  description: string;
  emoji: string;
}

interface ChannelEffects {
  [combatantName: string]: StatusEffect[];
}

/**
 * D&D 5e Conditions with descriptions
 */
export const DND_CONDITIONS: { [key: string]: { emoji: string; description: string } } = {
  // Core D&D 5e Conditions
  blinded: {
    emoji: '👁️',
    description: 'A blinded creature can\'t see and automatically fails ability checks that require sight. Attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage.'
  },
  charmed: {
    emoji: '💖',
    description: 'A charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects. The charmer has advantage on any ability check to interact socially with the creature.'
  },
  deafened: {
    emoji: '🔇',
    description: 'A deafened creature can\'t hear and automatically fails ability checks that require hearing.'
  },
  frightened: {
    emoji: '😱',
    description: 'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature can\'t willingly move closer to the source of its fear.'
  },
  grappled: {
    emoji: '🤝',
    description: 'A grappled creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed. The condition ends if the grappler is incapacitated or if an effect removes the grappled creature from the reach of the grappler.'
  },
  incapacitated: {
    emoji: '😵',
    description: 'An incapacitated creature can\'t take actions or reactions.'
  },
  invisible: {
    emoji: '👻',
    description: 'An invisible creature is impossible to see without the aid of magic or a special sense. The creature is heavily obscured for the purpose of hiding. Attack rolls against the creature have disadvantage, and the creature\'s attack rolls have advantage.'
  },
  paralyzed: {
    emoji: '🥶',
    description: 'A paralyzed creature is incapacitated and can\'t move or speak. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage. Any attack that hits the creature is a critical hit if the attacker is within 5 feet.'
  },
  petrified: {
    emoji: '🗿',
    description: 'A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging. The creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.'
  },
  poisoned: {
    emoji: '☠️',
    description: 'A poisoned creature has disadvantage on attack rolls and ability checks.'
  },
  prone: {
    emoji: '⬇️',
    description: 'A prone creature\'s only movement option is to crawl, unless it stands up. The creature has disadvantage on attack rolls. An attack roll against the creature has advantage if the attacker is within 5 feet. Otherwise, the attack roll has disadvantage.'
  },
  restrained: {
    emoji: '⛓️',
    description: 'A restrained creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed. Attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage. The creature has disadvantage on Dexterity saving throws.'
  },
  stunned: {
    emoji: '💫',
    description: 'A stunned creature is incapacitated, can\'t move, and can speak only falteringly. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage.'
  },
  unconscious: {
    emoji: '😴',
    description: 'An unconscious creature is incapacitated, can\'t move or speak, and is unaware of its surroundings. The creature drops whatever it\'s holding and falls prone. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage. Any attack that hits the creature is a critical hit if the attacker is within 5 feet.'
  },
  exhaustion: {
    emoji: '😮‍💨',
    description: 'Exhaustion is measured in six levels. Level 1: Disadvantage on ability checks. Level 2: Speed halved. Level 3: Disadvantage on attack rolls and saving throws. Level 4: Hit point maximum halved. Level 5: Speed reduced to 0. Level 6: Death.'
  },
  concentrating: {
    emoji: '🎯',
    description: 'Maintaining concentration on a spell. Taking damage or being incapacitated may break concentration.'
  },
  
  // Common Custom Effects
  blessed: {
    emoji: '✨',
    description: 'Whenever you make an attack roll or saving throw, you can roll a d4 and add the number rolled to the attack roll or saving throw.'
  },
  baned: {
    emoji: '💀',
    description: 'Whenever you make an attack roll or saving throw, you must roll a d4 and subtract the number rolled from the attack roll or saving throw.'
  },
  hasted: {
    emoji: '⚡',
    description: 'Speed doubled, +2 AC, advantage on Dexterity saves, additional action each turn.'
  },
  slowed: {
    emoji: '🐌',
    description: 'Speed halved, -2 AC and Dexterity saves, can\'t use reactions, can use action or bonus action (not both).'
  },
  dodging: {
    emoji: '🛡️',
    description: 'Attack rolls against you have disadvantage. You make Dexterity saving throws with advantage.'
  },
  hiding: {
    emoji: '🌫️',
    description: 'Hidden from enemies. They don\'t know your exact location.'
  },
  raging: {
    emoji: '😡',
    description: 'Advantage on Strength checks and saves, bonus damage on melee attacks, resistance to physical damage.'
  },
  marked: {
    emoji: '🎯',
    description: 'Marked by an attacker. Various effects depending on the marking ability.'
  }
};

/**
 * In-memory status effects tracker
 */
export class StatusTracker {
  private effects: Map<string, ChannelEffects> = new Map();
  
  /**
   * Add status effect to a combatant
   */
  addStatus(
    channelId: string,
    combatantName: string,
    condition: string,
    duration?: number
  ): void {
    if (!this.effects.has(channelId)) {
      this.effects.set(channelId, {});
    }
    
    const channelEffects = this.effects.get(channelId)!;
    if (!channelEffects[combatantName]) {
      channelEffects[combatantName] = [];
    }
    
    const conditionLower = condition.toLowerCase();
    const conditionData = DND_CONDITIONS[conditionLower];
    
    if (!conditionData) {
      throw new Error(`Unknown condition: ${condition}. Use !conditions to see available conditions.`);
    }
    
    // Check if already has this condition
    const existing = channelEffects[combatantName].find(
      e => e.condition.toLowerCase() === conditionLower
    );
    
    if (existing) {
      // Update duration if provided
      if (duration !== undefined) {
        existing.duration = duration;
      }
    } else {
      // Add new effect
      channelEffects[combatantName].push({
        condition: conditionLower,
        duration,
        description: conditionData.description,
        emoji: conditionData.emoji
      });
    }
  }
  
  /**
   * Remove status effect from combatant
   */
  removeStatus(
    channelId: string,
    combatantName: string,
    condition?: string
  ): boolean {
    const channelEffects = this.effects.get(channelId);
    if (!channelEffects || !channelEffects[combatantName]) return false;
    
    if (condition) {
      // Remove specific condition
      const conditionLower = condition.toLowerCase();
      const index = channelEffects[combatantName].findIndex(
        e => e.condition.toLowerCase() === conditionLower
      );
      
      if (index === -1) return false;
      
      channelEffects[combatantName].splice(index, 1);
      
      // Clean up if no effects left
      if (channelEffects[combatantName].length === 0) {
        delete channelEffects[combatantName];
      }
    } else {
      // Remove all conditions from combatant
      delete channelEffects[combatantName];
    }
    
    return true;
  }
  
  /**
   * Get all status effects for a combatant
   */
  getStatuses(channelId: string, combatantName: string): StatusEffect[] {
    const channelEffects = this.effects.get(channelId);
    if (!channelEffects) return [];
    return channelEffects[combatantName] || [];
  }
  
  /**
   * Get all status effects in channel
   */
  getAllStatuses(channelId: string): ChannelEffects {
    return this.effects.get(channelId) || {};
  }
  
  /**
   * Advance all durations by 1 round
   */
  tickDurations(channelId: string): string[] {
    const channelEffects = this.effects.get(channelId);
    if (!channelEffects) return [];
    
    const expired: string[] = [];
    
    for (const [combatantName, effects] of Object.entries(channelEffects)) {
      for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        if (effect.duration !== undefined) {
          effect.duration--;
          
          if (effect.duration <= 0) {
            expired.push(`${combatantName}: ${effect.condition}`);
            effects.splice(i, 1);
          }
        }
      }
      
      // Clean up if no effects left
      if (effects.length === 0) {
        delete channelEffects[combatantName];
      }
    }
    
    return expired;
  }
  
  /**
   * Clear all status effects for channel
   */
  clearChannel(channelId: string): void {
    this.effects.delete(channelId);
  }
  
  /**
   * Format status effects for display
   */
  formatStatuses(channelId: string, combatantName?: string): string {
    const channelEffects = this.effects.get(channelId);
    if (!channelEffects) {
      return '**No active status effects.**';
    }
    
    if (combatantName) {
      // Show effects for specific combatant
      const effects = channelEffects[combatantName];
      if (!effects || effects.length === 0) {
        return `**${combatantName}** has no status effects.`;
      }
      
      let output = `**${combatantName}** - Status Effects:\n\n`;
      effects.forEach(effect => {
        const duration = effect.duration !== undefined ? ` (${effect.duration} rounds)` : '';
        output += `${effect.emoji} **${effect.condition.charAt(0).toUpperCase() + effect.condition.slice(1)}**${duration}\n`;
        output += `${effect.description}\n\n`;
      });
      
      return output;
    } else {
      // Show all effects in channel
      const combatants = Object.keys(channelEffects);
      if (combatants.length === 0) {
        return '**No active status effects.**';
      }
      
      let output = '**📋 Active Status Effects**\n\n';
      combatants.forEach(name => {
        const effects = channelEffects[name];
        const effectStrs = effects.map(e => {
          const duration = e.duration !== undefined ? `(${e.duration})` : '';
          return `${e.emoji}${duration}`;
        });
        output += `**${name}**: ${effectStrs.join(' ')}\n`;
      });
      
      return output;
    }
  }
  
  /**
   * Get emoji summary for combatant (for initiative display)
   */
  getEmojiSummary(channelId: string, combatantName: string): string {
    const effects = this.getStatuses(channelId, combatantName);
    if (effects.length === 0) return '';
    
    return effects.map(e => {
      const duration = e.duration !== undefined ? `(${e.duration})` : '';
      return `${e.emoji}${duration}`;
    }).join(' ');
  }

  /**
   * Export data for persistence
   */
  exportData(): any {
    const data: any = {};
    this.effects.forEach((channelEffects, channelId) => {
      data[channelId] = channelEffects;
    });
    return data;
  }

  /**
   * Import data from persistence
   */
  importData(data: any): void {
    if (!data) return;
    
    this.effects.clear();
    Object.entries(data).forEach(([channelId, channelEffects]: [string, any]) => {
      this.effects.set(channelId, channelEffects);
    });
    
    const channelCount = this.effects.size;
    if (channelCount > 0) {
      console.log(`✅ Restored status effects for ${channelCount} channel(s)`);
    }
  }
}
