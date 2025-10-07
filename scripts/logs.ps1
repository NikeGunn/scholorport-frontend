# View live logs from production server

# Configuration
$EC2_HOST = "ec2-13-232-108-169.ap-south-1.compute.amazonaws.com"
$EC2_USER = "ubuntu"
$PEM_FILE = "scholarport-frontend.pem"

Write-Host "Scholarport Frontend - Live Logs" -ForegroundColor Blue
Write-Host "Press Ctrl+C to exit" -ForegroundColor Yellow
Write-Host ""

ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "cd /home/ubuntu/scholarport-frontend && docker-compose -f docker-compose.prod.yml logs -f --tail=50"
