# Quick Update Script for Windows
# Updates only code changes to production

# Configuration
$EC2_HOST = "ec2-13-232-108-169.ap-south-1.compute.amazonaws.com"
$EC2_USER = "ubuntu"
$PEM_FILE = "scholarport-frontend.pem"
$APP_DIR = "/home/ubuntu/scholarport-frontend"

Write-Host "Updating Scholarport Frontend on Production..." -ForegroundColor Cyan

# Sync files
Write-Host "[INFO] Syncing files to EC2..." -ForegroundColor Cyan
scp -i $PEM_FILE -r -C public config.js package.json docker-compose.prod.yml nginx "$EC2_USER@$EC2_HOST`:$APP_DIR/"

# Restart application
Write-Host "[INFO] Restarting application..." -ForegroundColor Cyan
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "cd $APP_DIR && sudo docker-compose -f docker-compose.prod.yml up -d --build"

Write-Host "[INFO] Recent logs:" -ForegroundColor Cyan
ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "cd $APP_DIR && sudo docker-compose -f docker-compose.prod.yml logs --tail=20"

Write-Host "[SUCCESS] Update completed successfully!" -ForegroundColor Green
