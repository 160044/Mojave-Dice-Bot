# Running Mojave with PM2

PM2 keeps your bot running 24/7 with automatic restarts and monitoring.

## Quick Start

```bash
# 1. Install PM2 globally (if not installed)
npm install -g pm2

# 2. Build the bot
npm run build

# 3. Edit ecosystem.config.js
# Update the 'cwd' path to your bot directory
nano ecosystem.config.js

# 4. Start with PM2
pm2 start ecosystem.config.js

# 5. Save PM2 configuration
pm2 save

# 6. Set PM2 to start on boot
pm2 startup
# Follow the command it prints
```

## Configuration

Edit `ecosystem.config.js`:

```javascript
cwd: '/home/youruser/mojave-for-root',  // Your bot directory
env: {
  NODE_ENV: 'production',
  BOT_PREFIX: '!'  // Change prefix if needed
}
```

## PM2 Commands

### Basic Operations
```bash
pm2 start ecosystem.config.js    # Start bot
pm2 stop mojave-bot              # Stop bot
pm2 restart mojave-bot           # Restart bot
pm2 delete mojave-bot            # Remove from PM2
```

### Monitoring
```bash
pm2 list                         # Show all processes
pm2 status                       # Same as list
pm2 monit                        # Live monitoring dashboard
pm2 logs mojave-bot              # View logs (live tail)
pm2 logs mojave-bot --lines 100  # Last 100 lines
```

### Log Management
```bash
pm2 logs mojave-bot              # Tail logs
pm2 logs mojave-bot --err        # Error logs only
pm2 flush                        # Clear all logs
```

### After Code Changes
```bash
# 1. Rebuild
npm run build

# 2. Restart
pm2 restart mojave-bot

# Or do both:
npm run build && pm2 restart mojave-bot
```

## Directory Structure

PM2 will create logs directory:
```
mojave-for-root/
├── logs/
│   ├── out.log          # Standard output
│   ├── err.log          # Error output
│   └── combined.log     # Combined logs
├── ecosystem.config.js
├── dist/                # Built files
└── src/                 # Source files
```

## Automatic Startup on Boot

```bash
# Generate startup script
pm2 startup

# This will print a command like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u youruser --hp /home/youruser

# Run that command, then save:
pm2 save
```

Now Mojave will automatically start when the server reboots!

## Monitoring & Maintenance

### Check Status
```bash
pm2 status
```

Output:
```
┌─────┬──────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ mode    │ ↺       │ status  │ cpu      │
├─────┼──────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ mojave-bot   │ fork    │ 0       │ online  │ 0.1%     │
└─────┴──────────────┴─────────┴─────────┴─────────┴──────────┘
```

### Memory Usage
```bash
pm2 monit
```

Shows live CPU and memory usage.

### View Logs in Real-Time
```bash
pm2 logs mojave-bot --lines 50
```

Press Ctrl+C to exit.

## Troubleshooting

### Bot Won't Start
```bash
# Check logs
pm2 logs mojave-bot --err

# Common issues:
# 1. Path in ecosystem.config.js is wrong
# 2. npm run bot fails (test manually first)
# 3. Port already in use
```

### Bot Keeps Restarting
```bash
# View recent errors
pm2 logs mojave-bot --err --lines 100

# Check if build is up to date
npm run build

# Restart with fresh state
pm2 delete mojave-bot
pm2 start ecosystem.config.js
```

### High Memory Usage
PM2 will automatically restart if memory exceeds 500MB (configured in ecosystem.config.js).

### Update Bot Code
```bash
# 1. Pull new code
git pull  # or however you update

# 2. Install dependencies (if package.json changed)
npm install

# 3. Rebuild
npm run build

# 4. Restart
pm2 restart mojave-bot

# 5. Verify
pm2 status
pm2 logs mojave-bot --lines 20
```

## Production Best Practices

### 1. Always build before starting
```bash
npm run build
pm2 restart mojave-bot
```

### 2. Monitor logs regularly
```bash
pm2 logs mojave-bot
```

### 3. Save PM2 state after changes
```bash
pm2 save
```

### 4. Keep logs under control
```bash
# Set up log rotation
pm2 install pm2-logrotate

# Configure (optional)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 5. Backup your data
Initiative data is in-memory only. Consider:
- Using multiple channels (each has separate tracker)
- Documenting important combat states
- Taking notes outside bot for critical sessions

## Environment Variables

Add to ecosystem.config.js `env` section:

```javascript
env: {
  NODE_ENV: 'production',
  BOT_PREFIX: '!',
  // Add more as needed
}
```

## PM2 Web Interface (Optional)

For advanced monitoring:

```bash
pm2 install pm2-server-monit
```

Access at: http://localhost:9615

## Complete Setup Example

```bash
# Fresh setup
cd ~/bots
tar -xzf mojave-root-with-descriptions.tar.gz
cd mojave-for-root

# Install
npm install

# Build
npm run build

# Configure PM2
nano ecosystem.config.js
# Change cwd to: /home/youruser/bots/mojave-for-root

# Create logs directory
mkdir -p logs

# Start
pm2 start ecosystem.config.js

# Save
pm2 save

# Setup autostart
pm2 startup
# Run the command it gives you
pm2 save

# Check status
pm2 status
pm2 logs mojave-bot

# Test in Root
!ping
!help
```

## Summary

```bash
# Daily commands
pm2 status                 # Check if running
pm2 logs mojave-bot        # View logs
pm2 restart mojave-bot     # Restart after updates

# After code updates
npm run build && pm2 restart mojave-bot

# Monitoring
pm2 monit                  # Live dashboard
```

That's it! Your Mojave bot is now running 24/7 under PM2! 🚀
