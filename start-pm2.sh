#!/bin/bash
# Quick PM2 startup script for Mojave

set -e

echo "🤖 Starting Mojave Bot with PM2..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 not found. Installing PM2..."
    npm install -g pm2
fi

# Build the bot
echo "🔨 Building TypeScript..."
npm run build

# Create logs directory
mkdir -p logs

# Get current directory
CURRENT_DIR=$(pwd)

# Update ecosystem.config.js with current directory
echo "📝 Updating ecosystem.config.js with current directory..."
sed -i "s|cwd: '/path/to/mojave-for-root'|cwd: '$CURRENT_DIR'|g" ecosystem.config.js

# Start with PM2
echo "🚀 Starting bot..."
pm2 start ecosystem.config.js

# Save configuration
echo "💾 Saving PM2 configuration..."
pm2 save

echo ""
echo "✅ Mojave bot started successfully!"
echo ""
echo "📊 View status: pm2 status"
echo "📜 View logs: pm2 logs mojave-bot"
echo "🔄 Restart: pm2 restart mojave-bot"
echo "🛑 Stop: pm2 stop mojave-bot"
echo ""
echo "To enable auto-start on boot, run:"
echo "  pm2 startup"
echo "  Then run the command it prints"
echo "  Then: pm2 save"
