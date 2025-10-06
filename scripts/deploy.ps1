# Scholarport Frontend Deployment Script for Windows
# PowerShell version

param(
    [switch]$SkipTests = $false
)

# Configuration
$EC2_HOST = "ec2-43-205-213-103.ap-south-1.compute.amazonaws.com"
$EC2_USER = "ubuntu"
$PEM_FILE = "scholorport-frontend.pem"
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
} else {
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

# Check status
Write-Host "  -> Checking status..." -ForegroundColor DarkGray
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "cd $APP_DIR && sudo docker ps && echo '' && sudo docker-compose -f docker-compose.prod.yml logs --tail=20"

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Application deployed successfully" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[SUCCESS] Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Your application is now running at:" -ForegroundColor Cyan
Write-Host "  * http://$EC2_HOST" -ForegroundColor White
Write-Host "  * http://43.205.213.103" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Configure your domain DNS to point to 43.205.213.103" -ForegroundColor White
Write-Host "  2. SSH to EC2 and run: bash ~/scholarport-frontend/scripts/setup-ssl.sh" -ForegroundColor White
Write-Host "  3. View logs: .\scripts\logs.ps1" -ForegroundColor White
Write-Host ""
