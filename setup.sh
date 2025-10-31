#!/bin/bash

# Setup script for Mobile Automation Framework
# This script automates the initial setup process

set -e  # Exit on error

echo "=========================================="
echo "Mobile Automation Framework Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js version 18 or higher is required${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version OK: $(node -v)${NC}"

# Check npm version
echo "Checking npm version..."
NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 9 ]; then
    echo -e "${YELLOW}Warning: npm version 9 or higher is recommended${NC}"
    echo "Current version: $(npm -v)"
fi
echo -e "${GREEN}✓ npm version OK: $(npm -v)${NC}"

# Check Java
echo "Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed${NC}"
    echo "Please install Java JDK 11 or higher"
    exit 1
fi
echo -e "${GREEN}✓ Java installed: $(java -version 2>&1 | head -n 1)${NC}"

# Install npm dependencies
echo ""
echo "Installing npm dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Check if Appium is installed
echo ""
echo "Checking Appium installation..."
if ! command -v appium &> /dev/null; then
    echo -e "${YELLOW}Appium not found. Installing globally...${NC}"
    npm install -g appium@next
    echo -e "${GREEN}✓ Appium installed${NC}"
else
    echo -e "${GREEN}✓ Appium already installed: $(appium -v)${NC}"
fi

# Install Appium drivers
echo ""
echo "Installing Appium drivers..."

# UiAutomator2 for Android
if appium driver list | grep -q "uiautomator2@installed"; then
    echo -e "${GREEN}✓ UiAutomator2 driver already installed${NC}"
else
    echo "Installing UiAutomator2 driver..."
    appium driver install uiautomator2
    echo -e "${GREEN}✓ UiAutomator2 driver installed${NC}"
fi

# XCUITest for iOS (only on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if appium driver list | grep -q "xcuitest@installed"; then
        echo -e "${GREEN}✓ XCUITest driver already installed${NC}"
    else
        echo "Installing XCUITest driver..."
        appium driver install xcuitest
        echo -e "${GREEN}✓ XCUITest driver installed${NC}"
    fi
fi

# Setup environment file
echo ""
if [ -f ".env" ]; then
    echo -e "${YELLOW}.env file already exists. Skipping...${NC}"
else
    echo "Creating .env file from template..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}Please update .env file with your configuration${NC}"
fi

# Create necessary directories
echo ""
echo "Creating directory structure..."
mkdir -p reports/allure-results
mkdir -p reports/allure-report
mkdir -p reports/screenshots
mkdir -p reports/logs
mkdir -p apps/android
mkdir -p apps/ios
echo -e "${GREEN}✓ Directories created${NC}"

# Initialize Git repository if not exists
echo ""
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    echo -e "${GREEN}✓ Git repository initialized${NC}"
    
    # Setup Git hooks
    echo "Setting up Git hooks..."
    npx husky install
    echo -e "${GREEN}✓ Git hooks installed${NC}"
else
    echo -e "${GREEN}✓ Git repository already exists${NC}"
fi

# Run Appium Doctor for Android
echo ""
echo "Running Appium Doctor for Android..."
if command -v appium-doctor &> /dev/null; then
    appium-doctor --android || echo -e "${YELLOW}Some Android dependencies are missing. Please check above.${NC}"
else
    echo -e "${YELLOW}appium-doctor not found. Skipping health check.${NC}"
fi

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your app paths and device configuration"
echo "2. Place your app binaries in apps/android/ or apps/ios/"
echo "3. Start your emulator/simulator"
echo "4. Run: npm test"
echo ""
echo "For detailed instructions, see README.md"
echo "For troubleshooting, see TROUBLESHOOTING.md"
echo ""
echo "Happy Testing! 🚀"
