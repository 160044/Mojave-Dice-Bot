/**
 * Simple file-based persistence for initiative and status data
 * Saves to JSON files in the data directory
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = process.env.DATA_DIR || './data';
const INITIATIVE_FILE = path.join(DATA_DIR, 'initiative.json');
const STATUS_FILE = path.join(DATA_DIR, 'status.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Save initiative data to disk
 */
export function saveInitiativeData(data: any): void {
  try {
    const newData = JSON.stringify(data, null, 2);
    
    // Only log if data actually changed
    let changed = true;
    if (fs.existsSync(INITIATIVE_FILE)) {
      const oldData = fs.readFileSync(INITIATIVE_FILE, 'utf8');
      changed = oldData !== newData;
    }
    
    if (changed) {
      fs.writeFileSync(INITIATIVE_FILE, newData);
      console.log('💾 Initiative data saved (changes detected)');
    }
  } catch (error) {
    console.error('❌ Failed to save initiative data:', error);
  }
}

/**
 * Load initiative data from disk
 */
export function loadInitiativeData(): any {
  try {
    if (fs.existsSync(INITIATIVE_FILE)) {
      const data = fs.readFileSync(INITIATIVE_FILE, 'utf8');
      console.log('✅ Initiative data loaded from disk');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Failed to load initiative data:', error);
  }
  return null;
}

/**
 * Save status data to disk
 */
export function saveStatusData(data: any): void {
  try {
    const newData = JSON.stringify(data, null, 2);
    
    // Only log if data actually changed
    let changed = true;
    if (fs.existsSync(STATUS_FILE)) {
      const oldData = fs.readFileSync(STATUS_FILE, 'utf8');
      changed = oldData !== newData;
    }
    
    if (changed) {
      fs.writeFileSync(STATUS_FILE, newData);
      console.log('💾 Status data saved (changes detected)');
    }
  } catch (error) {
    console.error('❌ Failed to save status data:', error);
  }
}

/**
 * Load status data from disk
 */
export function loadStatusData(): any {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const data = fs.readFileSync(STATUS_FILE, 'utf8');
      console.log('✅ Status data loaded from disk');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Failed to load status data:', error);
  }
  return null;
}

/**
 * Auto-save every 2 minutes
 */
export function startAutoSave(
  getInitiativeData: () => any,
  getStatusData: () => any
): NodeJS.Timeout {
  const interval = setInterval(() => {
    saveInitiativeData(getInitiativeData());
    saveStatusData(getStatusData());
  }, 120000); // 2 minutes

  console.log('🔄 Auto-save enabled (every 2 minutes, only logs on changes)');
  return interval;
}

/**
 * Clear all persisted data
 */
export function clearAllData(): void {
  try {
    if (fs.existsSync(INITIATIVE_FILE)) {
      fs.unlinkSync(INITIATIVE_FILE);
    }
    if (fs.existsSync(STATUS_FILE)) {
      fs.unlinkSync(STATUS_FILE);
    }
    console.log('🗑️ All persisted data cleared');
  } catch (error) {
    console.error('❌ Failed to clear data:', error);
  }
}
