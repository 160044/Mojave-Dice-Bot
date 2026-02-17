# Persistence System

Mojave now saves combat state to disk automatically!

## How It Works

### Automatic Saving
- **Auto-save every 30 seconds** - Combat state is automatically saved
- **Saves on init clear** - When you end combat, state is immediately saved
- **Loads on startup** - When bot restarts, it restores all active combats

### What Gets Saved
- ✅ Initiative tracker (all channels)
  - Combatants and their initiative order
  - Current turn and round number
  - HP values (including hidden HP)
  - User IDs for pinging
  
- ✅ Status effects (all channels)
  - All active conditions
  - Duration counters
  - Per-combatant effects

### Storage Location

Data is saved to `./data/` directory:
```
data/
├── initiative.json    # All initiative sessions
└── status.json        # All status effects
```

You can change the location with environment variable:
```bash
DATA_DIR=/path/to/data npm run bot
```

## Benefits

### Survives Bot Restarts
```bash
# Combat in progress
!init add Fighter 18 25 25
!statusadd Fighter blessed 10

# Bot restarts (crash, update, server reboot)
pm2 restart mojave-bot

# Combat state restored!
!init    # Shows Fighter still in combat
!status  # Shows Fighter still blessed
```

### Survives Disconnections
If Root disconnects/reconnects, your combat state is preserved.

### Multiple Channels
Each channel's combat is saved independently. All channels restore on restart.

## Manual Operations

### View Current State
The bot auto-saves, but you can verify data files:
```bash
cat data/initiative.json
cat data/status.json
```

### Backup Data
```bash
cp -r data/ data-backup/
```

### Clear All Data
To start fresh:
```bash
rm -rf data/
# Or use in-game:
!init clear
!statusclear
```

### Restore from Backup
```bash
cp -r data-backup/ data/
pm2 restart mojave-bot
```

## Troubleshooting

### Data Not Saving
1. Check disk space: `df -h`
2. Check permissions: `ls -la data/`
3. Check logs: `pm2 logs mojave-bot`

### Corrupted Data
If data files become corrupted:
```bash
# Remove bad files
rm data/initiative.json data/status.json

# Restart bot
pm2 restart mojave-bot
```

The bot will start fresh with empty state.

### Lost Data
Data is saved every 30 seconds. Maximum loss is 30 seconds of activity if bot crashes.

For critical sessions, manually backup the data directory.

## PM2 Integration

PM2 configuration already includes data directory:
```javascript
{
  cwd: '/your/path/mojave-for-root',  // Data will be in /your/path/mojave-for-root/data/
}
```

## Best Practices

1. **Regular backups** - Backup `data/` directory periodically
2. **Monitor disk space** - JSON files are small but check occasionally  
3. **Clean old data** - Use `!init clear` when combat is done
4. **Check logs** - Watch for save/load errors

## Technical Details

- **Format**: JSON (human-readable, easy to backup/edit)
- **Frequency**: 30-second auto-save
- **Size**: ~1-5 KB per active combat
- **Performance**: Negligible impact
- **Thread-safe**: Single-threaded saves

## Migration

If moving the bot to a new server:
```bash
# On old server
tar -czf mojave-data-backup.tar.gz data/

# On new server
tar -xzf mojave-data-backup.tar.gz
pm2 start ecosystem.config.js
```

Your combats will resume seamlessly!
