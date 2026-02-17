/**
 * Simple file-based persistence for initiative and status data
 * Saves to JSON files in the data directory
 */
/**
 * Save initiative data to disk
 */
export declare function saveInitiativeData(data: any): void;
/**
 * Load initiative data from disk
 */
export declare function loadInitiativeData(): any;
/**
 * Save status data to disk
 */
export declare function saveStatusData(data: any): void;
/**
 * Load status data from disk
 */
export declare function loadStatusData(): any;
/**
 * Auto-save every 30 seconds
 */
export declare function startAutoSave(getInitiativeData: () => any, getStatusData: () => any): NodeJS.Timeout;
/**
 * Clear all persisted data
 */
export declare function clearAllData(): void;
