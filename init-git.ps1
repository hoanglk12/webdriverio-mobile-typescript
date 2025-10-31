# Initialize Git Repository

Write-Host "Initializing Git repository..." -ForegroundColor Cyan

# Initialize Git
git init

# Create initial commit
git add .
git commit -m "Initial commit: Mobile Automation Framework v1.0.0"

# Setup Husky hooks
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

Write-Host ""
Write-Host "✓ Git repository initialized successfully!" -ForegroundColor Green
Write-Host "✓ Pre-commit hooks configured" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Add remote repository: git remote add origin <your-repo-url>"
Write-Host "2. Push to remote: git push -u origin main"
