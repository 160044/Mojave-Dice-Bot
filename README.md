# Mojave D&D Bot for Root - v1.3

Complete D&D companion bot with dice rolling, initiative tracking, status effects, and persistence.

## Features

### 🎲 Comprehensive Dice Rolling
- Basic rolls with all modifiers
- Advantage/Disadvantage
- Keep highest/lowest, rerolls, combinations
- Character generation (D&D, Dragon Age)
- FATE and Shadowrun dice

### ⚔️ Initiative Tracker
- Per-channel combat tracking
- Hidden HP with status indicators
- Automatic turn pinging
- HP damage/healing
- **Persistent storage** - survives restarts!

### 🎭 Status Effects System
- 16 D&D 5e core conditions
- 8 custom effects
- Full condition descriptions
- Duration tracking with auto-tick
- Inline display in initiative
- **Persistent storage** - survives restarts!

### 💾 Persistence System
- Auto-saves every 30 seconds
- Survives bot restarts and crashes
- File-based JSON storage
- Multi-channel support
- Easy backup/restore

### 💓 Connection Keepalive
- Automatic heartbeat system
- Connection health monitoring
- Auto-recovery detection
- Graceful shutdown handling

### 🛠️ Utilities
- Visual chat separators
- Categorized help system
- Flexible command syntax

## Quick Start

```bash
# Install
npm install

# Build
npm run build

# Run with PM2 (recommended)
./start-pm2.sh

# Or run directly
npm run bot
```

## Commands Overview

```bash
!help              # Main help menu
!help dice         # Dice commands
!help init         # Initiative commands
!help status       # Status effects commands

!roll 2d20+5       # Dice rolling
!init add Fighter 18 25 25    # Start combat
!statusadd Fighter blessed    # Apply condition
!break             # Insert separator
```

## Documentation

- `KEEPALIVE.md` - Connection keepalive system
- `PERSISTENCE.md` - How persistence works
- `PM2_GUIDE.md` - Running with PM2
- `STATUS_GUIDE.md` - Status effects system
- `CONDITION_DESCRIPTIONS.md` - Full condition reference

## Version History

### v1.3 (Current)
- ✅ **Connection keepalive** - Maintains stable Root connection!
- ✅ Automatic heartbeat monitoring
- ✅ Graceful shutdown handling
- ✅ All v1.2 features

### v1.2
- ✅ Persistent storage
- ✅ Auto-save system

### v1.1
- ✅ Status effects system
- ✅ Categorized help

### v1.0-beta
- Initial release

## Production Ready

This bot is tested and ready for production use:
- Automatic restart on crash (PM2)
- Memory management
- Log rotation
- Boot persistence
- Multi-channel support

## Support

Type `!help` in Root for command reference.

## License

MIT
