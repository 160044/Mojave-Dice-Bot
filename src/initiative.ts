/**
 * Initiative Tracker - In-Memory Storage
 * Tracks combat initiative per channel
 */

import { ChannelGuid } from "@rootsdk/server-bot";

interface Combatant {
  name: string;
  initiative: number;
  hp?: number;
  maxHp?: number;
  isNpc: boolean;
  hiddenHp: boolean;
  userId?: string;
  notes?: string;
}

interface InitiativeSession {
  channelId: string;
  combatants: Combatant[];
  currentTurn: number;
  roundNumber: number;
  creatorUserId?: string;
}

/**
 * In-memory initiative tracker
 */
export class InitiativeTracker {
  private sessions: Map<string, InitiativeSession> = new Map();
  
  /**
   * Get or create session for channel
   */
  getSession(channelId: string, creatorUserId?: string): InitiativeSession {
    if (!this.sessions.has(channelId)) {
      this.sessions.set(channelId, {
        channelId,
        combatants: [],
        currentTurn: 0,
        roundNumber: 1,
        creatorUserId
      });
    }
    return this.sessions.get(channelId)!;
  }
  
  /**
   * Add combatant to initiative
   */
  addCombatant(
    channelId: string,
    name: string,
    initiative: number,
    hp?: number,
    maxHp?: number,
    isNpc: boolean = false,
    hiddenHp: boolean = false,
    userId?: string
  ): void {
    const session = this.getSession(channelId);
    
    // Check if combatant already exists
    const existing = session.combatants.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      throw new Error(`${name} is already in initiative!`);
    }
    
    session.combatants.push({
      name,
      initiative,
      hp,
      maxHp,
      isNpc,
      hiddenHp,
      userId
    });
    
    // Sort by initiative (highest first)
    session.combatants.sort((a, b) => b.initiative - a.initiative);
    
    // Reset turn to 0
    session.currentTurn = 0;
  }
  
  /**
   * Remove combatant
   */
  removeCombatant(channelId: string, name: string): boolean {
    const session = this.sessions.get(channelId);
    if (!session) return false;
    
    const index = session.combatants.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (index === -1) return false;
    
    session.combatants.splice(index, 1);
    
    // Adjust current turn if needed
    if (session.currentTurn >= session.combatants.length) {
      session.currentTurn = 0;
    }
    
    return true;
  }
  
  /**
   * Next turn
   */
  nextTurn(channelId: string): Combatant | null {
    const session = this.sessions.get(channelId);
    if (!session || session.combatants.length === 0) return null;
    
    session.currentTurn++;
    if (session.currentTurn >= session.combatants.length) {
      session.currentTurn = 0;
      session.roundNumber++;
    }
    
    return session.combatants[session.currentTurn];
  }
  
  /**
   * Previous turn
   */
  previousTurn(channelId: string): Combatant | null {
    const session = this.sessions.get(channelId);
    if (!session || session.combatants.length === 0) return null;
    
    session.currentTurn--;
    if (session.currentTurn < 0) {
      session.currentTurn = session.combatants.length - 1;
      session.roundNumber = Math.max(1, session.roundNumber - 1);
    }
    
    return session.combatants[session.currentTurn];
  }
  
  /**
   * Deal damage to combatant
   */
  damage(channelId: string, name: string, amount: number): number | null {
    const session = this.sessions.get(channelId);
    if (!session) return null;
    
    const combatant = session.combatants.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!combatant || combatant.hp === undefined) return null;
    
    combatant.hp = Math.max(0, combatant.hp - amount);
    return combatant.hp;
  }
  
  /**
   * Heal combatant
   */
  heal(channelId: string, name: string, amount: number): number | null {
    const session = this.sessions.get(channelId);
    if (!session) return null;
    
    const combatant = session.combatants.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!combatant || combatant.hp === undefined) return null;
    
    if (combatant.maxHp !== undefined) {
      combatant.hp = Math.min(combatant.maxHp, combatant.hp + amount);
    } else {
      combatant.hp += amount;
    }
    
    return combatant.hp;
  }
  
  /**
   * Get current combatant
   */
  getCurrentCombatant(channelId: string): Combatant | null {
    const session = this.sessions.get(channelId);
    if (!session || session.combatants.length === 0) return null;
    return session.combatants[session.currentTurn];
  }
  
  /**
   * Generate initiative display
   */
  getDisplay(channelId: string, showHidden: boolean = false, statusTracker?: any): string {
    const session = this.sessions.get(channelId);
    
    if (!session || session.combatants.length === 0) {
      return '**No combatants in initiative.**\nUse `!initadd <n> <init> [hp] [max]` to add combatants.';
    }
    
    let output = `**⚔️ Initiative Tracker - Round ${session.roundNumber} ⚔️**`;
    if (showHidden) output += ' 🔒 (DM View)';
    output += '\n\n';
    
    session.combatants.forEach((c, i) => {
      const marker = i === session.currentTurn ? '→ ' : '   ';
      const bold = i === session.currentTurn ? '**' : '';
      
      // HP display
      let hpStr = '';
      if (c.hp !== undefined) {
        if (c.hiddenHp && !showHidden && c.maxHp !== undefined) {
          // Show health status for hidden HP
          const percent = (c.hp / c.maxHp) * 100;
          if (percent > 75) hpStr = ' | HP: Healthy 💚';
          else if (percent > 50) hpStr = ' | HP: Injured 💛';
          else if (percent > 25) hpStr = ' | HP: Bloodied 🧡';
          else if (percent > 0) hpStr = ' | HP: Critical ❤️';
          else hpStr = ' | HP: Down 💀';
        } else {
          // Show actual HP
          hpStr = c.maxHp !== undefined 
            ? ` | HP: ${c.hp}/${c.maxHp}` 
            : ` | HP: ${c.hp}`;
        }
      }
      
      const npcMarker = c.isNpc ? ' [NPC]' : '';
      const hiddenMarker = c.hiddenHp && showHidden ? ' 🔒' : '';
      
      // Get status effects
      let statusStr = '';
      if (statusTracker) {
        const effectsSummary = statusTracker.getEmojiSummary(channelId, c.name);
        if (effectsSummary) {
          statusStr = ` | ${effectsSummary}`;
        }
      }
      
      output += `${marker}**${c.initiative}** - ${bold}${c.name}${bold}${npcMarker}${hpStr}${hiddenMarker}${statusStr}\n`;
    });
    
    return output;
  }
  
  /**
   * Clear initiative for channel
   */
  clearInitiative(channelId: string): boolean {
    return this.sessions.delete(channelId);
  }
  
  /**
   * Check if channel has active initiative
   */
  hasInitiative(channelId: string): boolean {
    const session = this.sessions.get(channelId);
    return session !== undefined && session.combatants.length > 0;
  }
  /**
   * Export data for persistence
   */
  exportData(): any {
    const data: any = {};
    this.sessions.forEach((session, channelId) => {
      data[channelId] = {
        combatants: session.combatants,
        currentTurn: session.currentTurn,
        roundNumber: session.roundNumber,
        creatorUserId: session.creatorUserId
      };
    });
    return data;
  }

  /**
   * Import data from persistence
   */
  importData(data: any): void {
    if (!data) return;
    
    this.sessions.clear();
    Object.entries(data).forEach(([channelId, sessionData]: [string, any]) => {
      this.sessions.set(channelId, {
        channelId,
        combatants: sessionData.combatants || [],
        currentTurn: sessionData.currentTurn || 0,
        roundNumber: sessionData.roundNumber || 1,
        creatorUserId: sessionData.creatorUserId
      });
    });
    
    console.log(`✅ Restored initiative for ${this.sessions.size} channel(s)`);
  }
}
