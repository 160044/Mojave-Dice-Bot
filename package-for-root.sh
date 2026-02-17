#!/bin/bash
# Package Mojave for Root Publishing

set -e

echo "📦 Packaging Mojave Bot for Root..."

# 1. Clean old builds
echo "🧹 Cleaning old builds..."
npm run clean

# 2. Reinstall dependencies
echo "📥 Installing dependencies..."
npm install

# 3. Fresh build
echo "🔨 Building..."
npm run build

# 4. Check dist exists
if [ ! -d "dist" ]; then
    echo "❌ dist/ directory not found. Build failed?"
    exit 1
fi

# 5. Create package (excluding node_modules - Root will install)
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

# 6. Verify package
echo "✅ Package created: mojave-bot-v1.3.0.tar.gz"
echo ""
echo "📋 Package contents:"
tar -tzf mojave-bot-v1.3.0.tar.gz | head -20
echo "..."
echo ""
echo "📊 Package size:"
ls -lh mojave-bot-v1.3.0.tar.gz
echo ""
echo "✅ Ready to upload!"
echo ""
echo "Next steps:"
echo "1. Upload via Root CLI:"
echo "   rootsdk publish mojave-bot-v1.3.0.tar.gz"
echo ""
echo "2. Or upload via Root Dashboard:"
echo "   https://root.app/dashboard/bots"
