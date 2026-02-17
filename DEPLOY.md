# Deployment Guide

## Quick Deploy

```bash
tar -xzf mojave-root-beta-v1.0.tar.gz
cd mojave-for-root
npm install
npm run build
npm run bot
```

## Test

```bash
!ping
!help
!roll 2d20+5
!init add Fighter 18 25 25
!init next
```

## Known Issues

1. Initiative resets on restart (in-memory)
2. Message deletion may not work
3. Expected: Each channel has separate tracker

See README.md for full documentation.
