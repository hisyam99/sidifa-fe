#!/bin/bash

# 🔧 Deploy Script untuk Reset Password SSG Fix
# Script ini akan membantu Anda build dan deploy dengan konfigurasi SSG yang sudah diperbaiki

set -e  # Exit on any error

echo "🚀 Starting deployment with SSG fix for reset password..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

print_status "Checking current directory structure..."
ls -la

# Step 1: Clean previous builds
print_status "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf server/
rm -rf .qwik/

print_success "Clean completed"

# Step 2: Install dependencies (if needed)
print_status "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    bun install
else
    print_status "Dependencies already installed"
fi

# Step 3: Build with new SSG configuration
print_status "🔨 Building with new SSG configuration..."
print_status "This will exclude /auth/reset-password from static generation"

bun run build.server

if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed!"
    exit 1
fi

# Step 4: Verify build output
print_status "🔍 Verifying build output..."
if [ -d "server" ]; then
    print_success "Server build found in server/ directory"
    ls -la server/
else
    print_error "Server build not found!"
    exit 1
fi

# Step 5: Test build locally (optional)
read -p "Do you want to test the build locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "🧪 Testing build locally..."
    print_status "Starting server on http://localhost:3000"
    print_status "Press Ctrl+C to stop the test server"
    
    # Start the server in background
    bun server/entry.bun.js &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 3
    
    # Test the reset password page
    print_status "Testing reset password page..."
    curl -s "http://localhost:3000/auth/reset-password?token=test-token" | grep -q "Reset Password" && print_success "Reset password page loads correctly" || print_warning "Reset password page might have issues"
    
    # Kill the test server
    kill $SERVER_PID
    print_success "Local test completed"
fi

# Step 6: Deployment instructions
echo
print_status "📋 Deployment Instructions:"
echo
echo "1. Copy the 'server/' directory to your production server"
echo "2. Make sure Bun is installed on your production server"
echo "3. Run: bun server/entry.bun.js"
echo "4. Or use PM2: pm2 start server/entry.bun.js --name sidifa"
echo
echo "🔗 Test URLs after deployment:"
echo "   - Home: https://sidifa.bits.my.id/"
echo "   - Forgot Password: https://sidifa.bits.my.id/auth/forgot-password"
echo "   - Reset Password (with token): https://sidifa.bits.my.id/auth/reset-password?token=test-token"
echo "   - Debug Page: https://sidifa.bits.my.id/test-reset-token?token=test-token"
echo

# Step 7: Verification checklist
print_status "✅ Verification Checklist:"
echo "   [ ] Deploy server/ directory to production"
echo "   [ ] Start the server"
echo "   [ ] Test forgot password flow"
echo "   [ ] Verify token is read correctly in reset password page"
echo "   [ ] Test all other routes still work"
echo "   [ ] Check console logs for token extraction"
echo

print_success "🎉 Deployment script completed!"
print_status "The SSG configuration has been updated to exclude /auth/reset-password from static generation."
print_status "This should fix the token reading issue in production." 