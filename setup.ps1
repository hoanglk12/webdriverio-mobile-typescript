# Setup script for Mobile Automation Framework (Windows PowerShell)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Mobile Automation Framework Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node -v
$nodeMajorVersion = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
if ($nodeMajorVersion -lt 20) {
    Write-Host "Error: Node.js version 20.19+, 22.12+, or 24+ is required (appium@3 / eslint@10)" -ForegroundColor Red
    Write-Host "Current version: $nodeVersion" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js version OK: $nodeVersion" -ForegroundColor Green

# Check npm version
Write-Host "Checking npm version..." -ForegroundColor Yellow
$npmVersion = npm -v
$npmMajorVersion = [int]($npmVersion -split '\.')[0]
if ($npmMajorVersion -lt 9) {
    Write-Host "Warning: npm version 9 or higher is recommended" -ForegroundColor Yellow
    Write-Host "Current version: $npmVersion" -ForegroundColor Yellow
}
Write-Host "✓ npm version OK: $npmVersion" -ForegroundColor Green

# Check Java
Write-Host "Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✓ Java installed: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Java is not installed" -ForegroundColor Red
    Write-Host "Please install Java JDK 11 or higher" -ForegroundColor Red
    exit 1
}

# Install npm dependencies
Write-Host ""
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Check if Appium is installed
Write-Host ""
Write-Host "Checking Appium installation..." -ForegroundColor Yellow
$appiumInstalled = Get-Command appium -ErrorAction SilentlyContinue
if (-not $appiumInstalled) {
    Write-Host "Appium not found. Installing globally..." -ForegroundColor Yellow
    npm install -g appium@next
    Write-Host "✓ Appium installed" -ForegroundColor Green
} else {
    $appiumVersion = appium -v
    Write-Host "✓ Appium already installed: $appiumVersion" -ForegroundColor Green
}

# Install Appium drivers
Write-Host ""
Write-Host "Installing Appium drivers..." -ForegroundColor Yellow

# UiAutomator2 for Android
$driverList = appium driver list
if ($driverList -match "uiautomator2@installed") {
    Write-Host "✓ UiAutomator2 driver already installed" -ForegroundColor Green
} else {
    Write-Host "Installing UiAutomator2 driver..." -ForegroundColor Yellow
    appium driver install uiautomator2
    Write-Host "✓ UiAutomator2 driver installed" -ForegroundColor Green
}

# Setup environment file
Write-Host ""
if (Test-Path ".env") {
    Write-Host ".env file already exists. Skipping..." -ForegroundColor Yellow
} else {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "Please update .env file with your configuration" -ForegroundColor Yellow
}

# Create necessary directories
Write-Host ""
Write-Host "Creating directory structure..." -ForegroundColor Yellow
$directories = @(
    "reports\allure-results",
    "reports\allure-report",
    "reports\screenshots",
    "reports\logs",
    "apps\android",
    "apps\ios"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}
Write-Host "✓ Directories created" -ForegroundColor Green

# Initialize Git repository if not exists
Write-Host ""
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
    
    # Setup Git hooks
    Write-Host "Setting up Git hooks..." -ForegroundColor Yellow
    npx husky install
    Write-Host "✓ Git hooks installed" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Update .env file with your app paths and device configuration"
Write-Host "2. Place your app binaries in apps\android\ or apps\ios\"
Write-Host "3. Start your emulator/simulator"
Write-Host "4. Run: npm test"
Write-Host ""
Write-Host "For detailed instructions, see README.md"
Write-Host "For troubleshooting, see TROUBLESHOOTING.md"
Write-Host ""
Write-Host "Happy Testing! 🚀" -ForegroundColor Cyan
