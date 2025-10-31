# Framework Verification Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Mobile Automation Framework Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "1. Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ERROR Node.js not found!" -ForegroundColor Red
    exit 1
}

# Step 2: Check npm
Write-Host "2. Checking npm installation..." -ForegroundColor Yellow
$npmVersion = npm --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK npm version: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "   ERROR npm not found!" -ForegroundColor Red
    exit 1
}

# Step 3: Check dependencies
Write-Host "3. Checking node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   OK Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ERROR Dependencies not installed" -ForegroundColor Red
    exit 1
}

# Step 4: TypeScript check
Write-Host "4. Running TypeScript type check..." -ForegroundColor Yellow
npm run type-check --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK TypeScript compilation successful" -ForegroundColor Green
} else {
    Write-Host "   ERROR TypeScript compilation failed" -ForegroundColor Red
    exit 1
}

# Step 5: Linting
Write-Host "5. Running ESLint..." -ForegroundColor Yellow
npm run lint --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK Linting passed" -ForegroundColor Green
} else {
    Write-Host "   WARNING Linting warnings found" -ForegroundColor Yellow
}

# Step 6: Directory structure
Write-Host "6. Verifying directory structure..." -ForegroundColor Yellow
$dirs = @("src/pages", "src/types", "tests/specs", "tests/data", "utils", "config")
$allDirsOk = $true
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "   OK $dir" -ForegroundColor Green
    } else {
        Write-Host "   ERROR $dir missing" -ForegroundColor Red
        $allDirsOk = $false
    }
}
if (-not $allDirsOk) { exit 1 }

# Step 7: Config files
Write-Host "7. Checking configuration files..." -ForegroundColor Yellow
$files = @("package.json", "tsconfig.json", ".eslintrc.js", "config/wdio.conf.ts")
$allFilesOk = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   OK $file" -ForegroundColor Green
    } else {
        Write-Host "   ERROR $file missing" -ForegroundColor Red
        $allFilesOk = $false
    }
}
if (-not $allFilesOk) { exit 1 }

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Framework is ready for use!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure .env file with your app paths"
Write-Host "2. Start Appium: npm run appium"
Write-Host "3. Run tests: npm run test:android"
Write-Host ""
