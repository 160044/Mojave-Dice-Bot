#!/bin/bash
# Simple packaging for Root (doesn't delete node_modules)

set -e

echo "📦 Packaging Mojave Bot for Root..."

# 1. Build fresh
echo "🔨 Building..."
npm run build

# 2. Check dist exists
if [ ! -d "dist" ]; then
    echo "❌ dist/ directory not found. Build failed?"
    exit 1
fi

# 3. Create package (excluding node_modules - Root will install them)
echo "📦 Creating tarball..."
tar -czf mojave-bot-v1.3.0.tar.gz \
  --exclude='node_modules' \
  --exclude='data' \
  --exclude='logs' \
  --exclude='*.log' \
  --exclude='.git' \
  --exclude='*.tar.gz' \
  --exclude='.pm2' \
  --exclude='.env' \
  .

# 4. Verify
echo "✅ Package created: mojave-bot-v1.3.0.tar.gz"
echo ""
echo "📊 Package size:"
ls -lh mojave-bot-v1.3.0.tar.gz
echo ""
echo "📋 First 20 files:"
tar -tzf mojave-bot-v1.3.0.tar.gz | head -20
echo ""
echo "✅ Ready to upload!"
echo ""
echo "Upload via:"
echo "  rootsdk publish mojave-bot-v1.3.0.tar.gz"
echo "Or upload through Root Dashboard"
