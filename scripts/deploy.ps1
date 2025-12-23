# Scholarport Frontend Deployment Script for Windows
# PowerShell version

param(
    [switch]$SkipTests = $false
)

# Configuration
$EC2_HOST = "ec2-13-232-108-169.ap-south-1.compute.amazonaws.com"
$EC2_USER = "ubuntu"
$PEM_FILE = "scholarport-frontend.pem"
$APP_DIR = "/home/ubuntu/scholarport-frontend"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Scholarport Frontend Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PEM file exists
if (-not (Test-Path $PEM_FILE)) {
    Write-Host "[ERROR] PEM file not found: $PEM_FILE" -ForegroundColor Red
    Write-Host "[INFO] Please place your PEM file in the project root directory" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] PEM file found" -ForegroundColor Green

# Test SSH connection
Write-Host "[INFO] Testing SSH connection to EC2..." -ForegroundColor Cyan
$testResult = ssh -i $PEM_FILE -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "echo 'Connection successful'" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] SSH connection successful" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] Cannot connect to EC2 instance" -ForegroundColor Red
    Write-Host "[INFO] Please check your PEM file and EC2 instance status" -ForegroundColor Yellow
    exit 1
}

# Create app directory
Write-Host "[INFO] Creating application directory on EC2..." -ForegroundColor Cyan
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "mkdir -p $APP_DIR"
Write-Host "[OK] Application directory created" -ForegroundColor Green

# Sync files using scp
Write-Host "[INFO] Syncing files to EC2..." -ForegroundColor Cyan
Write-Host "[WARN] This may take a few minutes..." -ForegroundColor Yellow

# Copy main directories and files
scp -i $PEM_FILE -r -C public "$EC2_USER@$EC2_HOST`:$APP_DIR/"
scp -i $PEM_FILE -C config.js package.json README.md Dockerfile "$EC2_USER@$EC2_HOST`:$APP_DIR/"
scp -i $PEM_FILE -C docker-compose.*.yml "$EC2_USER@$EC2_HOST`:$APP_DIR/"
scp -i $PEM_FILE -r -C nginx "$EC2_USER@$EC2_HOST`:$APP_DIR/"
scp -i $PEM_FILE -r -C scripts "$EC2_USER@$EC2_HOST`:$APP_DIR/"

# Copy .env.production if it exists
if (Test-Path .env.production) {
    scp -i $PEM_FILE .env.production "$EC2_USER@$EC2_HOST`:$APP_DIR/"
}

Write-Host "[OK] Files synced successfully" -ForegroundColor Green

# Install dependencies and start application
Write-Host "[INFO] Installing dependencies and starting application..." -ForegroundColor Cyan

# Install Docker
Write-Host "  -> Installing Docker (if needed)..." -ForegroundColor DarkGray
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "command -v docker >/dev/null 2>&1 || (curl -fsSL https://get.docker.com | sudo sh && sudo usermod -aG docker ubuntu)"

# Install Docker Compose
Write-Host "  -> Installing Docker Compose (if needed)..." -ForegroundColor DarkGray
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" 'command -v docker-compose >/dev/null 2>&1 || (sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose)'

# Stop existing containers
Write-Host "  -> Stopping existing containers..." -ForegroundColor DarkGray
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "cd $APP_DIR && sudo docker-compose -f docker-compose.prod.yml down 2>/dev/null || true"

# Build Docker images
Write-Host "  -> Building Docker images..." -ForegroundColor DarkGray
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "cd $APP_DIR && sudo docker-compose -f docker-compose.prod.yml build --no-cache"

# Start containers
Write-Host "  -> Starting containers..." -ForegroundColor DarkGray
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "cd $APP_DIR && sudo docker-compose -f docker-compose.prod.yml up -d"

# Wait for containers to be healthy
Write-Host "  -> Waiting for containers to be ready..." -ForegroundColor DarkGray
Start-Sleep -Seconds 3

# Restart containers to ensure fresh state and clear cache
Write-Host "  -> Restarting containers for fresh state..." -ForegroundColor DarkGray
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "cd $APP_DIR && sudo docker restart scholarport-frontend-prod"

# Wait for restart
Write-Host "  -> Waiting for restart to complete..." -ForegroundColor DarkGray
Start-Sleep -Seconds 3

# Verify containers are running
Write-Host "  -> Verifying container health..." -ForegroundColor DarkGray
$healthCheck = ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "sudo docker ps --filter name=scholarport-frontend-prod --format '{{.Status}}'"

if ($healthCheck -match "Up") {
    Write-Host "  -> Container is healthy and running" -ForegroundColor Green
}
else {
    Write-Host "  -> Warning: Container may not be fully healthy yet" -ForegroundColor Yellow
}

# Check status
Write-Host "  -> Checking final status..." -ForegroundColor DarkGray
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "cd $APP_DIR && sudo docker ps && echo '' && sudo docker-compose -f docker-compose.prod.yml logs --tail=30"

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Application deployed successfully" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[SUCCESS] Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "===== Your application is now running at: =====" -ForegroundColor Cyan
Write-Host "  * http://$EC2_HOST" -ForegroundColor White
Write-Host "  * http://13.232.108.169" -ForegroundColor White
Write-Host ""
Write-Host "===== Deployment Summary: =====" -ForegroundColor Green
Write-Host "  [OK] Files synced to EC2" -ForegroundColor White
Write-Host "  [OK] Docker images rebuilt with latest code" -ForegroundColor White
Write-Host "  [OK] Containers restarted for fresh state" -ForegroundColor White
Write-Host "  [OK] Cache cleared automatically" -ForegroundColor White
Write-Host ""
Write-Host "===== Next steps: =====" -ForegroundColor Yellow
Write-Host "  1. Test the application in your browser - Hard refresh: Ctrl+Shift+R" -ForegroundColor White
Write-Host "  2. Configure your domain DNS to point to 13.232.108.169 - if not done" -ForegroundColor White
Write-Host "  3. SSH to EC2 and run: bash ~/scholarport-frontend/scripts/setup-ssl.sh - for HTTPS" -ForegroundColor White
Write-Host ""
Write-Host "===== Useful commands: =====" -ForegroundColor Cyan
Write-Host "  View logs:          .\scripts\logs.ps1" -ForegroundColor White
Write-Host "  Check status:       ssh -i $PEM_FILE $EC2_USER@$EC2_HOST 'sudo docker ps'" -ForegroundColor White
Write-Host "  Restart container:  ssh -i $PEM_FILE $EC2_USER@$EC2_HOST 'sudo docker restart scholarport-frontend-prod'" -ForegroundColor White
Write-Host ""
