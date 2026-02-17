"use strict";
/**
 * Simple file-based persistence for initiative and status data
 * Saves to JSON files in the data directory
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveInitiativeData = saveInitiativeData;
exports.loadInitiativeData = loadInitiativeData;
exports.saveStatusData = saveStatusData;
exports.loadStatusData = loadStatusData;
exports.startAutoSave = startAutoSave;
exports.clearAllData = clearAllData;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
function saveInitiativeData(data) {
    try {
        fs.writeFileSync(INITIATIVE_FILE, JSON.stringify(data, null, 2));
        console.log('💾 Initiative data saved');
    }
    catch (error) {
        console.error('❌ Failed to save initiative data:', error);
    }
}
/**
 * Load initiative data from disk
 */
function loadInitiativeData() {
    try {
        if (fs.existsSync(INITIATIVE_FILE)) {
            const data = fs.readFileSync(INITIATIVE_FILE, 'utf8');
            console.log('✅ Initiative data loaded from disk');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('❌ Failed to load initiative data:', error);
    }
    return null;
}
/**
 * Save status data to disk
 */
function saveStatusData(data) {
    try {
        fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2));
        console.log('💾 Status data saved');
    }
    catch (error) {
        console.error('❌ Failed to save status data:', error);
    }
}
/**
 * Load status data from disk
 */
function loadStatusData() {
    try {
        if (fs.existsSync(STATUS_FILE)) {
            const data = fs.readFileSync(STATUS_FILE, 'utf8');
            console.log('✅ Status data loaded from disk');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('❌ Failed to load status data:', error);
    }
    return null;
}
/**
 * Auto-save every 30 seconds
 */
function startAutoSave(getInitiativeData, getStatusData) {
    const interval = setInterval(() => {
        saveInitiativeData(getInitiativeData());
        saveStatusData(getStatusData());
    }, 30000); // 30 seconds
    console.log('🔄 Auto-save enabled (every 30 seconds)');
    return interval;
}
/**
 * Clear all persisted data
 */
function clearAllData() {
    try {
        if (fs.existsSync(INITIATIVE_FILE)) {
            fs.unlinkSync(INITIATIVE_FILE);
        }
        if (fs.existsSync(STATUS_FILE)) {
            fs.unlinkSync(STATUS_FILE);
        }
        console.log('🗑️ All persisted data cleared');
    }
    catch (error) {
        console.error('❌ Failed to clear data:', error);
    }
}
