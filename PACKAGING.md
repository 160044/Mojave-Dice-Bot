# Packaging Mojave for Root Publishing

Based on Root's documentation at https://docs.rootapp.com/docs/bot-docs/publish/package/

## Prerequisites

1. Root CLI installed
2. Bot built and tested locally
3. All files ready

## Packaging Steps

### 1. Clean Build

```bash
# Clean old builds
npm run clean

# Fresh build
npm run build

# Test it works
npm run bot
# Test a command in Root, then Ctrl+C to stop
```

### 2. Prepare Package Structure

Root expects this structure:
```
mojave-bot/
├── dist/           # Built JavaScript files
├── node_modules/   # Dependencies (or let Root install)
├── package.json    # With correct metadata
├── root-manifest.json  # Bot configuration
└── README.md       # Documentation
```

### 3. Update root-manifest.json

```bash
cat > root-manifest.json << 'MANIFEST'
{
  "name": "Mojave D&D Bot",
  "description": "Complete D&D companion with dice rolling, initiative tracking, and status effects",
  "version": "1.3.0",
  "author": "Your Name",
  "icon": "🎲",
  "tags": ["dnd", "dice", "rpg", "gaming", "tabletop"],
  "permissions": {
    "messages": {
      "read": true,
      "write": true
    }
  }
}
MANIFEST
```

### 4. Update package.json Metadata

Ensure your package.json has:
```json
{
  "name": "@mojave/bot",
  "version": "1.3.0",
  "description": "Mojave D&D Bot - Complete dice rolling, initiative tracking, and status effects",
  "keywords": ["dnd", "dice", "rpg", "tabletop", "gaming"],
  "author": "Your Name",
  "license": "MIT",
  ...
}
```

### 5. Package with Root CLI

```bash
# Option 1: Let Root CLI handle it
rootsdk package

# Option 2: Create tarball manually
tar -czf mojave-bot-v1.3.0.tar.gz \
  --exclude=node_modules \
  --exclude=data \
  --exclude=logs \
  --exclude=*.log \
  --exclude=.git \
  .
```

### 6. Upload to Root

```bash
# Using Root CLI
rootsdk publish mojave-bot-v1.3.0.tar.gz

# Or through Root Dashboard
# Upload the .tar.gz file through the web interface
```

## Troubleshooting

### "rootsdk command not found"

Install Root CLI:
```bash
npm install -g @rootsdk/cli
```

### "Package too large"

Exclude unnecessary files:
```bash
tar -czf mojave-bot.tar.gz \
  --exclude=node_modules \
  --exclude=data \
  --exclude=logs \
  --exclude=*.tar.gz \
  dist/ package.json root-manifest.json README.md
```

Root will run `npm install` on their servers.

### "Missing root-manifest.json"

Create it with required fields:
```json
{
  "name": "Mojave D&D Bot",
  "description": "D&D companion bot",
  "version": "1.3.0",
  "author": "Your Name"
}
```

### "Build fails on Root servers"

Make sure:
- `package.json` has all dependencies
- `npm run build` works locally
- TypeScript compiles without errors
- No local-only paths in code

## What to Include

✅ **Include:**
- `dist/` - Compiled JavaScript
- `package.json` - Dependencies
- `root-manifest.json` - Bot config
- `README.md` - Documentation
- `*.md` - Documentation files

❌ **Exclude:**
- `node_modules/` - Root installs these
- `data/` - Local data
- `logs/` - Local logs
- `.env` - Local config
- `.git/` - Git history
- `*.tar.gz` - Old packages

## Minimal Package Command

If `rootsdk package` doesn't work, create minimal package:

```bash
# Create clean directory
mkdir mojave-package
cd mojave-package

# Copy essential files
cp -r ../dist .
cp ../package.json .
cp ../root-manifest.json .
cp ../README.md .
cp ../tsconfig.json .

# Create tarball
tar -czf ../mojave-bot-v1.3.0.tar.gz .

# Go back and upload
cd ..
rootsdk publish mojave-bot-v1.3.0.tar.gz
```

## Alternative: Exclude node_modules

```bash
# From bot directory
tar -czf mojave-bot-v1.3.0.tar.gz \
  --exclude='node_modules' \
  --exclude='data' \
  --exclude='logs' \
  --exclude='.git' \
  --exclude='*.tar.gz' \
  .
```

Root servers will run `npm install` automatically.

## Verify Package

Before uploading, verify contents:
```bash
tar -tzf mojave-bot-v1.3.0.tar.gz | head -20
```

Should show:
- dist/
- package.json
- root-manifest.json
- README.md
- etc.

## Publishing Checklist

- [ ] Built locally (`npm run build`)
- [ ] Tested locally (`npm run bot`)
- [ ] `package.json` has correct version
- [ ] `root-manifest.json` exists
- [ ] Created tarball (with or without node_modules)
- [ ] Verified tarball contents
- [ ] Ready to upload via CLI or dashboard

## Success!

Once uploaded, Root will:
1. Extract the package
2. Run `npm install` (if needed)
3. Run `npm run build` (if needed)
4. Start your bot with `npm run bot`

Your bot will be live in the Root marketplace!
