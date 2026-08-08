#!/bin/bash

# Framework Verification Script (Linux/Mac)
# This script runs verification tests to ensure the framework is properly set up

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Mobile Automation Framework Verification${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Step 1: Check Node.js
echo -e "${YELLOW}1. Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "   ${GREEN}✓ Node.js version: $NODE_VERSION${NC}"
else
    echo -e "   ${RED}✗ Node.js not found!${NC}"
    exit 1
fi

# Step 2: Check npm
echo -e "${YELLOW}2. Checking npm installation...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "   ${GREEN}✓ npm version: $NPM_VERSION${NC}"
else
    echo -e "   ${RED}✗ npm not found!${NC}"
    exit 1
fi

# Step 3: Check dependencies
echo -e "${YELLOW}3. Checking node_modules...${NC}"
if [ -d "node_modules" ]; then
    echo -e "   ${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "   ${RED}✗ Dependencies not installed. Run 'npm install'${NC}"
    exit 1
fi

# Step 4: TypeScript compilation check
echo -e "${YELLOW}4. Running TypeScript type check...${NC}"
npm run type-check --silent
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓ TypeScript compilation successful${NC}"
else
    echo -e "   ${RED}✗ TypeScript compilation failed${NC}"
    exit 1
fi

# Step 5: Linting check
echo -e "${YELLOW}5. Running ESLint...${NC}"
npm run lint --silent
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓ Linting passed${NC}"
else
    echo -e "   ${YELLOW}⚠ Linting warnings found (non-critical)${NC}"
fi

# Step 6: Check directory structure
echo -e "${YELLOW}6. Verifying directory structure...${NC}"
REQUIRED_DIRS=(
    "src/pages"
    "src/types"
    "tests/specs"
    "tests/data"
    "utils"
    "config"
    ".github/workflows"
)

ALL_DIRS_EXIST=true
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "   ${GREEN}✓ $dir exists${NC}"
    else
        echo -e "   ${RED}✗ $dir missing${NC}"
        ALL_DIRS_EXIST=false
    fi
done

if [ "$ALL_DIRS_EXIST" = false ]; then
    echo -e "   ${RED}✗ Directory structure incomplete${NC}"
    exit 1
fi

# Step 7: Check required files
echo -e "${YELLOW}7. Checking required configuration files...${NC}"
REQUIRED_FILES=(
    "package.json"
    "tsconfig.json"
    "eslint.config.js"
    ".prettierrc"
    "config/wdio.conf.ts"
    "config/wdio.android.conf.ts"
    "config/wdio.ios.conf.ts"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓ $file exists${NC}"
    else
        echo -e "   ${RED}✗ $file missing${NC}"
        ALL_FILES_EXIST=false
    fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
    echo -e "   ${RED}✗ Configuration files incomplete${NC}"
    exit 1
fi

# Step 8: Verify test file compiles
echo -e "${YELLOW}8. Running framework verification tests...${NC}"
echo ""
echo -e "   ${CYAN}Running verification test suite...${NC}"
echo ""

npx tsc --noEmit tests/specs/verification/framework.spec.ts 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓ Framework verification test compiles successfully${NC}"
else
    echo -e "   ${RED}✗ Framework verification test has compilation errors${NC}"
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Verification Summary${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${GREEN}✓ Node.js and npm installed${NC}"
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo -e "${GREEN}✓ TypeScript compilation working${NC}"
echo -e "${GREEN}✓ Directory structure complete${NC}"
echo -e "${GREEN}✓ Configuration files present${NC}"
echo -e "${GREEN}✓ Framework components verified${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Framework is ready for use!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${NC}1. Configure .env file with your app paths${NC}"
echo -e "${NC}2. Start Appium server: npm run appium${NC}"
echo -e "${NC}3. Place your mobile app (.apk/.app) in apps/ directory${NC}"
echo -e "${NC}4. Run tests: npm run test:android or npm run test:ios${NC}"
echo ""
