/**
 * Status Effects Tracker - In-Memory Storage
 * D&D 5e Conditions + Custom Effects
 */
interface StatusEffect {
    condition: string;
    duration?: number;
    description: string;
    emoji: string;
}
interface ChannelEffects {
    [combatantName: string]: StatusEffect[];
}
/**
 * D&D 5e Conditions with descriptions
 */
export declare const DND_CONDITIONS: {
    [key: string]: {
        emoji: string;
        description: string;
    };
};
/**
 * In-memory status effects tracker
 */
export declare class StatusTracker {
    private effects;
    /**
     * Add status effect to a combatant
     */
    addStatus(channelId: string, combatantName: string, condition: string, duration?: number): void;
    /**
     * Remove status effect from combatant
     */
    removeStatus(channelId: string, combatantName: string, condition?: string): boolean;
    /**
     * Get all status effects for a combatant
     */
    getStatuses(channelId: string, combatantName: string): StatusEffect[];
    /**
     * Get all status effects in channel
     */
    getAllStatuses(channelId: string): ChannelEffects;
    /**
     * Advance all durations by 1 round
     */
    tickDurations(channelId: string): string[];
    /**
     * Clear all status effects for channel
     */
    clearChannel(channelId: string): void;
    /**
     * Format status effects for display
     */
    formatStatuses(channelId: string, combatantName?: string): string;
    /**
     * Get emoji summary for combatant (for initiative display)
     */
    getEmojiSummary(channelId: string, combatantName: string): string;
    /**
     * Export data for persistence
     */
    exportData(): any;
    /**
     * Import data from persistence
     */
    importData(data: any): void;
}
export {};
