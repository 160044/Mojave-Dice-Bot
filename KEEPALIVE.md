# Connection Keepalive System

Mojave includes an automatic keepalive system to maintain stable Root connections.

## How It Works

### Heartbeat System
- **Interval**: Every 60 seconds
- **Monitoring**: Tracks connection health
- **Logging**: Reports connection status
- **Auto-recovery**: Detects and logs reconnections

### What It Does

1. **Periodic Heartbeats**
   - Runs every 60 seconds
   - Checks time since last successful beat
   - Logs warnings if gaps detected

2. **Connection Monitoring**
   - Tracks missed heartbeats
   - Warns after 3 missed beats
   - Logs recovery when connection restores

3. **Health Logging**
   - Every 5 minutes: "Connection healthy" message
   - On issues: Warning messages
   - On recovery: Success messages

### Automatic Features

✅ **Starts automatically** - No configuration needed
✅ **Runs in background** - Non-blocking
✅ **Graceful shutdown** - Handles SIGTERM/SIGINT
✅ **Auto-recovery** - Detects reconnections

## Logs

### Normal Operation
```
💓 Starting connection keepalive (60s interval)
💓 Keepalive: Connection healthy (2026-02-15T20:15:00.000Z)
💓 Keepalive: Connection healthy (2026-02-15T20:20:00.000Z)
```

### Connection Issues
```
⚠️ Long gap since last heartbeat: 127.3s
❌ Missed 3 heartbeats - connection may be lost
```

### Recovery
```
✅ Connection recovered after 2 missed heartbeats
💓 Keepalive: Connection healthy (2026-02-15T20:22:00.000Z)
```

### Shutdown
```
📴 Received SIGTERM, shutting down gracefully...
💔 Keepalive stopped
💾 Data auto-saved (persistence runs every 30s)
👋 Shutdown complete
```

## Monitoring

### Check Logs
```bash
# Real-time
pm2 logs mojave-bot

# Last 50 lines
pm2 logs mojave-bot --lines 50

# Errors only
pm2 logs mojave-bot --err
```

### Look For
- ✅ Regular "Connection healthy" messages
- ⚠️ "Long gap" warnings (temporary issues)
- ❌ "Missed heartbeats" errors (connection problems)
- ✅ "Connection recovered" (automatic fix)

## Troubleshooting

### Frequent Disconnections

If you see many "missed heartbeats":

1. **Check Network**
   ```bash
   ping root-server-address
   ```

2. **Check System Resources**
   ```bash
   pm2 monit
   top
   ```

3. **Check Logs for Errors**
   ```bash
   pm2 logs mojave-bot --lines 200
   ```

### Bot Not Responding

If bot stops responding but keepalive looks healthy:

1. **Check PM2 Status**
   ```bash
   pm2 status
   ```

2. **Restart Bot**
   ```bash
   pm2 restart mojave-bot
   ```

3. **Check for Crashes**
   ```bash
   pm2 logs mojave-bot --err --lines 100
   ```

### False Alarms

Occasional missed heartbeats (1-2) are normal:
- Server restarts
- Network blips
- System load spikes

Only worry if you see:
- 3+ consecutive missed beats
- Frequent warnings
- No recovery messages

## Configuration

Currently no configuration needed. The system uses sensible defaults:
- 60-second heartbeat interval
- 3 missed beats before warning
- 5-minute status logging

If you need to adjust these, edit `src/keepalive.ts`.

## Integration with PM2

PM2 provides additional monitoring:

```bash
# PM2 monitoring dashboard
pm2 monit

# Check uptime
pm2 list

# Restart on errors
pm2 restart mojave-bot --exp-backoff-restart-delay=100
```

## Best Practices

1. **Monitor Regularly**
   - Check logs daily
   - Watch for patterns
   - Note any recurring issues

2. **PM2 Monitoring**
   - Use `pm2 monit` for live stats
   - Set up PM2 alerts (optional)

3. **Network Stability**
   - Ensure stable internet connection
   - Use wired connection if possible
   - Monitor system resources

4. **Graceful Restarts**
   - Use `pm2 restart` not `pm2 stop`
   - Allows graceful shutdown
   - Saves data before exit

## Technical Details

- **Thread**: Runs on Node.js event loop
- **Blocking**: Non-blocking (uses setInterval)
- **Memory**: Minimal (<1KB)
- **CPU**: Negligible (<0.1%)
- **Unref**: Doesn't prevent process exit

## Advanced

### Manual Control

If you need to stop/start keepalive programmatically:

```typescript
import { startKeepalive, stopKeepalive, getKeepaliveStats } from './keepalive';

// Start
startKeepalive();

// Get stats
const stats = getKeepaliveStats();
console.log(stats);

// Stop
stopKeepalive();
```

### Custom Intervals

Edit `src/keepalive.ts`:

```typescript
// Change from 60000 (60s) to desired interval
heartbeatInterval = setInterval(() => {
  sendHeartbeat();
}, 30000); // 30 seconds
```

## Summary

The keepalive system:
- ✅ Runs automatically
- ✅ Monitors connection health
- ✅ Logs issues clearly
- ✅ Handles graceful shutdown
- ✅ Works with PM2
- ✅ Zero configuration

Just start the bot and it works!
