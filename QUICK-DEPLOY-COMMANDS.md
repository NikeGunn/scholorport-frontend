# Quick Deployment Commands - scholarport.co

## 🚀 Quick Start (From Windows)

```powershell
# 1. Deploy code
cd C:\Users\Nautilus\Desktop\frontend\scholarport-frontend
pnpm run deploy:win

# 2. SSH to EC2
ssh -i scholarport-frontend.pem ubuntu@ec2-13-232-108-169.ap-south-1.compute.amazonaws.com
```

## 📦 On EC2 Server

```bash
# Navigate to project
cd /home/ubuntu/scholarport-frontend

# Build & Deploy (first time or updates)
docker-compose -f docker-compose.prod.yml up -d --build

# Setup SSL (one-time, after first deployment)
bash scripts/setup-ssl.sh

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml stop

# Remove containers
docker-compose -f docker-compose.prod.yml down
```

## 🔍 Status Checks

```bash
# Container status
docker-compose -f docker-compose.prod.yml ps

# Test nginx config
docker exec scholarport-frontend-prod nginx -t

# Check SSL certificate
echo | openssl s_client -servername scholarport.co -connect localhost:443 2>/dev/null | openssl x509 -noout -dates

# Check disk space
df -h

# Check memory
free -h
```

## 🔄 After Code Changes

```powershell
# From Windows
cd C:\Users\Nautilus\Desktop\frontend\scholarport-frontend
git add .
git commit -m "your message"
git push
pnpm run deploy:win
```

```bash
# On EC2
cd /home/ubuntu/scholarport-frontend
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🌐 Test URLs

- **Production**: https://scholarport.co
- **WWW**: https://www.scholarport.co
- **Direct IP**: http://13.232.108.169 (redirects to HTTPS)
- **Health Check**: https://scholarport.co/health

## ⚠️ Emergency Commands

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs --tail=100

# Force restart
docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d

# Check nginx error log
docker exec scholarport-frontend-prod cat /var/log/nginx/error.log | tail -50

# Reload nginx (no downtime)
docker exec scholarport-frontend-prod nginx -s reload
```
