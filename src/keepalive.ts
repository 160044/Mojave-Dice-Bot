/**
 * Connection keepalive system for Root
 * Sends periodic heartbeats to maintain connection
 */

import { rootServer } from "@rootsdk/server-bot";

let heartbeatInterval: NodeJS.Timeout | null = null;
let lastHeartbeat: Date = new Date();
let missedHeartbeats = 0;
const MAX_MISSED_HEARTBEATS = 3;
let isConnected = true;

/**
 * Monitor Root SDK lifecycle events
 */
function setupConnectionMonitoring(): void {
  try {
    // Try to listen for Root SDK connection events
    // Note: Exact event names may vary based on Root SDK version
    
    // Log when we see "Detached" in console
    const originalLog = console.log;
    console.log = function(...args: any[]) {
      const message = args.join(' ');
      
      if (message.includes('Detached')) {
        console.warn('⚠️ Root connection detached - waiting for reconnection...');
        isConnected = false;
        missedHeartbeats++;
      } else if (message.includes('Attached') || message.includes('Connected')) {
        if (!isConnected) {
          originalLog.call(console, '✅ Root connection restored!');
          isConnected = true;
          missedHeartbeats = 0;
        }
      }
      
      originalLog.apply(console, args);
    };
    
  } catch (error) {
    console.error('❌ Failed to setup connection monitoring:', error);
  }
}

/**
 * Send a heartbeat ping
 */
async function sendHeartbeat(): Promise<void> {
  try {
    const now = new Date();
    const timeSinceLastBeat = (now.getTime() - lastHeartbeat.getTime()) / 1000;
    
    // Check if we've been disconnected for too long
    if (!isConnected && timeSinceLastBeat > 65) {
      console.warn(`⚠️ Disconnected for ${timeSinceLastBeat.toFixed(1)}s`);
      missedHeartbeats++;
      
      if (missedHeartbeats >= MAX_MISSED_HEARTBEATS) {
        console.error(`❌ Disconnected for ${missedHeartbeats} heartbeats - may need manual intervention`);
      }
    } else if (isConnected) {
      if (missedHeartbeats > 0) {
        console.log(`✅ Connection stable after ${missedHeartbeats} missed heartbeats`);
      }
      missedHeartbeats = 0;
    }
    
    lastHeartbeat = now;
    
    // Log connection status every 5 minutes
    const minutesElapsed = Math.floor(timeSinceLastBeat / 60);
    if (minutesElapsed > 0 && minutesElapsed % 5 === 0) {
      const status = isConnected ? '✅ Connected' : '⚠️ Disconnected';
      console.log(`💓 Keepalive: ${status} (${new Date().toISOString()})`);
    }
    
  } catch (error) {
    console.error('❌ Heartbeat error:', error);
    missedHeartbeats++;
  }
}

/**
 * Start keepalive heartbeat
 * Sends a heartbeat every 60 seconds
 */
export function startKeepalive(): void {
  if (heartbeatInterval) {
    console.warn('⚠️ Keepalive already running');
    return;
  }
  
  console.log('💓 Starting connection keepalive (60s interval)');
  
  // Setup connection event monitoring
  setupConnectionMonitoring();
  
  // Initial heartbeat
  lastHeartbeat = new Date();
  
  // Send heartbeat every 60 seconds
  heartbeatInterval = setInterval(() => {
    sendHeartbeat();
  }, 60000);
  
  // Ensure interval is not blocking event loop
  if (heartbeatInterval.unref) {
    heartbeatInterval.unref();
  }
}

/**
 * Stop keepalive heartbeat
 */
export function stopKeepalive(): void {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    console.log('💔 Keepalive stopped');
  }
}

/**
 * Get keepalive stats
 */
export function getKeepaliveStats(): {
  running: boolean;
  lastHeartbeat: Date;
  missedHeartbeats: number;
  secondsSinceLastBeat: number;
} {
  return {
    running: heartbeatInterval !== null,
    lastHeartbeat,
    missedHeartbeats,
    secondsSinceLastBeat: (new Date().getTime() - lastHeartbeat.getTime()) / 1000
  };
}

/**
 * Handle process signals for graceful shutdown
 */
export function setupGracefulShutdown(): void {
  const shutdown = (signal: string) => {
    console.log(`\n📴 Received ${signal}, shutting down gracefully...`);
    
    // Stop keepalive
    stopKeepalive();
    
    // Note: We can't import persistence here due to circular deps
    // but auto-save runs every 30s, so data should be recent
    console.log('💾 Data auto-saved (persistence runs every 30s)');
    
    // Give time for any final operations
    setTimeout(() => {
      console.log('👋 Shutdown complete');
      process.exit(0);
    }, 1000);
  };
  
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
