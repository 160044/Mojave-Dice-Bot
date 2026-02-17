/**
 * Initiative Tracker - In-Memory Storage
 * Tracks combat initiative per channel
 */
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
export declare class InitiativeTracker {
    private sessions;
    /**
     * Get or create session for channel
     */
    getSession(channelId: string, creatorUserId?: string): InitiativeSession;
    /**
     * Add combatant to initiative
     */
    addCombatant(channelId: string, name: string, initiative: number, hp?: number, maxHp?: number, isNpc?: boolean, hiddenHp?: boolean, userId?: string): void;
    /**
     * Remove combatant
     */
    removeCombatant(channelId: string, name: string): boolean;
    /**
     * Next turn
     */
    nextTurn(channelId: string): Combatant | null;
    /**
     * Previous turn
     */
    previousTurn(channelId: string): Combatant | null;
    /**
     * Deal damage to combatant
     */
    damage(channelId: string, name: string, amount: number): number | null;
    /**
     * Heal combatant
     */
    heal(channelId: string, name: string, amount: number): number | null;
    /**
     * Get current combatant
     */
    getCurrentCombatant(channelId: string): Combatant | null;
    /**
     * Generate initiative display
     */
    getDisplay(channelId: string, showHidden?: boolean, statusTracker?: any): string;
    /**
     * Clear initiative for channel
     */
    clearInitiative(channelId: string): boolean;
    /**
     * Check if channel has active initiative
     */
    hasInitiative(channelId: string): boolean;
}
export {};
