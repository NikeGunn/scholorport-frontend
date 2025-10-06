# Scholarport Frontend - Quick Reference

## 🚀 One-Command Deployment

### First Time Setup

**Windows:**
```powershell
.\scripts\deploy.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/*.sh
./scripts/deploy.sh
```

### Update Code (After Changes)

**Windows:**
```powershell
.\scripts\update.ps1
```

**Linux/Mac:**
```bash
./scripts/update.sh
```

## 📝 Common Tasks

### Local Development
```bash
npm start                    # Start dev server at localhost:3000
npm run docker:dev          # Start in Docker container
```

### View Production Logs
```powershell
.\scripts\logs.ps1          # Windows
./scripts/logs.sh           # Linux/Mac
```

### Check Status
```bash
./scripts/status.sh         # Server health check
```

### Setup SSL (One-Time)
```bash
# SSH to server first
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com

# Then run SSL setup
cd ~/scholarport-frontend
./scripts/setup-ssl.sh
```

## 🔗 Important URLs

### Production
- **IP**: http://43.205.213.103
- **DNS**: http://ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
- **After SSL**: https://your-domain.com

### Backend API
- http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/api/chat

### Local Development
- http://localhost:3000

## 🔑 EC2 Access

### SSH Connection
```bash
ssh -i "scholorport-frontend.pem" ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
```

### Instance Details
- **Instance ID**: i-098ed04de82cadf82
- **Name**: scholorport-frontend
- **User**: ubuntu
- **Region**: ap-south-1
- **App Directory**: /home/ubuntu/scholarport-frontend

## 🐳 Docker Commands

### On Production Server
```bash
# Check status
docker ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml down

# Start
docker-compose -f docker-compose.prod.yml up -d

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔧 Configuration Files

### Environment Config
- `config.js` - Auto-detects dev/prod environment
- `.env.development` - Local settings
- `.env.production` - Production settings

### Docker
- `Dockerfile` - Multi-stage build
- `docker-compose.dev.yml` - Development
- `docker-compose.prod.yml` - Production

### Nginx
- `nginx/nginx.conf` - Main config
- `nginx/default.conf` - Server config

## 🆘 Troubleshooting

### Can't Connect to EC2
```bash
# Check PEM permissions (Linux/Mac)
chmod 400 scholorport-frontend.pem

# Test connection
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "echo 'Connected'"
```

### Application Not Loading
```bash
# SSH to server
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com

# Check containers
docker ps

# Check logs
cd ~/scholarport-frontend
docker-compose -f docker-compose.prod.yml logs --tail=50

# Restart
docker-compose -f docker-compose.prod.yml restart
```

### Port 80/443 Not Accessible
1. Check EC2 Security Group in AWS Console
2. Ensure ports 80 and 443 are open (0.0.0.0/0)
3. Verify nginx is running: `docker ps`

### Docker Issues
```bash
# Restart Docker
sudo systemctl restart docker

# Clean up
docker system prune -a

# Rebuild everything
cd ~/scholarport-frontend
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 Monitoring

### Check Container Status
```bash
docker ps                    # Running containers
docker stats                 # Resource usage
```

### View Logs
```bash
# Live logs
docker-compose -f docker-compose.prod.yml logs -f

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100

# Specific service
docker-compose -f docker-compose.prod.yml logs scholarport-frontend
```

### System Health
```bash
# Disk usage
df -h

# Memory
free -h

# Docker disk usage
docker system df
```

## 🔒 SSL Certificate

### Obtain Certificate
```bash
cd ~/scholarport-frontend
./scripts/setup-ssl.sh
```

### Renew Certificate
```bash
sudo certbot renew
```

### Check Certificate Status
```bash
sudo certbot certificates
```

## 📁 File Structure

```
scholarport-frontend/
├── config.js              # Environment config
├── .env.production       # Production variables
├── Dockerfile            # Docker build
├── docker-compose.prod.yml
├── nginx/                # Nginx config
├── scripts/              # Deployment scripts
│   ├── deploy.sh/ps1    # Initial deployment
│   ├── update.sh/ps1    # Quick updates
│   ├── setup-ssl.sh     # SSL setup
│   └── logs.sh/ps1      # Log viewer
└── public/               # Frontend code
```

## 💡 Pro Tips

1. **Quick Updates**: Use `update.sh` for code changes - much faster than full deploy
2. **View Logs**: Keep logs open during deployment: `.\scripts\logs.ps1`
3. **Test First**: Always test locally with `npm start` before deploying
4. **Backup PEM**: Keep your PEM file safe - you can't download it again!
5. **SSL Auto-Renew**: Certificate renews automatically every 60 days

## 📱 Emergency Commands

### Restart Everything
```bash
cd ~/scholarport-frontend
docker-compose -f docker-compose.prod.yml restart
```

### Full Reset
```bash
cd ~/scholarport-frontend
docker-compose -f docker-compose.prod.yml down
docker system prune -a
docker-compose -f docker-compose.prod.yml up -d --build
```

### Rollback (if needed)
```bash
# SSH to server
# Navigate to app directory
cd ~/scholarport-frontend

# Use git to rollback (if using git)
git reset --hard <previous-commit>
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🎯 Daily Workflow

1. **Morning**: Check status
   ```bash
   .\scripts\status.sh
   ```

2. **Make Changes**: Edit code locally

3. **Test**:
   ```bash
   npm start
   ```

4. **Deploy**:
   ```bash
   .\scripts\update.ps1
   ```

5. **Verify**: Check logs
   ```bash
   .\scripts\logs.ps1
   ```

## 📞 Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
2. Check [DOCKER.md](./DOCKER.md) for Docker help
3. View logs: `.\scripts\logs.ps1`
4. Check Docker status: `docker ps`

---

**Last Updated**: October 2025
**Version**: 1.0.0
