# Scholarport Frontend - Command Cheat Sheet

Quick reference for all important commands.

## 🎯 Most Used Commands

```bash
# Deploy for the first time
.\scripts\deploy.ps1          # Windows
./scripts/deploy.sh           # Linux/Mac

# Update code changes (30 seconds)
.\scripts\update.ps1          # Windows
./scripts/update.sh           # Linux/Mac

# View live logs
.\scripts\logs.ps1            # Windows
./scripts/logs.sh             # Linux/Mac

# Check status
./scripts/status.sh           # Linux/Mac only
```

## 💻 Local Development

```bash
# Start development server
npm start
npm run dev

# Docker development
npm run docker:dev
npm run docker:dev:build

# Stop Docker
npm run docker:stop
```

## 🚀 Deployment

```bash
# Full deployment
npm run deploy              # Linux/Mac
npm run deploy:win          # Windows

# Quick update
npm run update              # Linux/Mac
npm run update:win          # Windows

# Using scripts directly
.\scripts\deploy.ps1        # Windows
./scripts/deploy.sh         # Linux/Mac
.\scripts\update.ps1        # Windows
./scripts/update.sh         # Linux/Mac
```

## 🐳 Docker Commands

### Local Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down

# Production (local test)
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml logs -f

# General
docker ps                           # List containers
docker logs <container-name>        # View logs
docker exec -it <container> sh      # Enter container
docker system prune -a              # Clean up
```

### Production Server Docker

```bash
# After SSH to server
cd ~/scholarport-frontend

# Check status
docker ps
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml logs --tail=100

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml down

# Start
docker-compose -f docker-compose.prod.yml up -d

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build

# Full reset
docker-compose -f docker-compose.prod.yml down
docker system prune -a
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔌 SSH Commands

```bash
# Connect to EC2
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com

# Test connection
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "echo 'Success'"

# Execute command
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "docker ps"

# Copy files TO server
scp -i scholorport-frontend.pem file.txt ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com:~/

# Copy files FROM server
scp -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com:~/file.txt ./
```

## 🔒 SSL Commands

```bash
# Setup SSL (on server)
cd ~/scholarport-frontend
./scripts/setup-ssl.sh

# Manual certificate obtain
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🔧 System Commands (On Server)

```bash
# Systemd service
sudo systemctl status scholarport-frontend.service
sudo systemctl start scholarport-frontend.service
sudo systemctl stop scholarport-frontend.service
sudo systemctl restart scholarport-frontend.service
sudo systemctl enable scholarport-frontend.service

# Docker service
sudo systemctl status docker
sudo systemctl restart docker

# System info
df -h                    # Disk space
free -h                  # Memory
top                      # CPU usage
htop                     # Better CPU usage (if installed)
docker stats             # Container resources
```

## 📊 Monitoring Commands

```bash
# View logs
.\scripts\logs.ps1                              # Windows
./scripts/logs.sh                               # Linux/Mac
docker-compose -f docker-compose.prod.yml logs -f

# Check status
./scripts/status.sh                             # All status info
docker ps                                       # Container status
curl http://localhost/health                    # Health check

# System resources
df -h                                           # Disk space
free -h                                         # Memory
docker system df                                # Docker disk usage
```

## 🧹 Cleanup Commands

```bash
# Docker cleanup
docker system prune                 # Remove unused data
docker system prune -a              # Remove all unused data
docker container prune              # Remove stopped containers
docker image prune                  # Remove unused images
docker volume prune                 # Remove unused volumes

# Full cleanup
docker-compose down
docker system prune -a --volumes
docker-compose up -d --build
```

## 🔍 Debugging Commands

```bash
# Check application
curl http://localhost                           # Test local
curl http://43.205.213.103                      # Test production
curl http://43.205.213.103/health               # Health check

# Check ports
netstat -tulpn | grep :80                       # Linux
netstat -ano | findstr :80                      # Windows

# Check processes
ps aux | grep node                              # Node processes
ps aux | grep nginx                             # Nginx processes

# Check logs
tail -f /var/log/nginx/access.log               # Nginx access
tail -f /var/log/nginx/error.log                # Nginx errors
journalctl -u scholarport-frontend.service -f   # Service logs
```

## 📦 NPM Scripts Reference

```bash
# Development
npm start                    # Start dev server (port 3000)
npm run dev                  # Same as start

# Docker Development
npm run docker:dev           # Start dev container
npm run docker:dev:build     # Build and start dev container

# Docker Production
npm run docker:prod          # Start prod container
npm run docker:prod:build    # Build and start prod container

# Deployment
npm run deploy               # Full deploy (Linux/Mac)
npm run deploy:win           # Full deploy (Windows)
npm run update               # Quick update (Linux/Mac)
npm run update:win           # Quick update (Windows)

# Docker Management
npm run docker:stop          # Stop containers
npm run docker:logs          # View logs
```

## 🛠️ Makefile Commands (Linux/Mac Only)

```bash
make help                    # Show all commands
make install                 # Install dependencies
make dev                     # Start dev server
make start                   # Same as dev
make docker-dev              # Docker development
make docker-prod             # Docker production
make deploy                  # Deploy to EC2
make update                  # Quick update
make logs                    # View logs
make status                  # Check status
make ssl                     # Setup SSL
make clean                   # Clean Docker
make ssh                     # SSH to server
make test-connection         # Test SSH
```

## 🔐 Git Commands (Optional)

```bash
# Basic workflow
git status                   # Check changes
git add .                    # Stage all changes
git commit -m "message"      # Commit changes
git push                     # Push to remote

# Branches
git branch                   # List branches
git checkout -b feature      # Create new branch
git checkout main            # Switch to main
git merge feature            # Merge branch

# Undo
git reset --hard HEAD        # Discard all changes
git checkout -- file.txt     # Discard file changes
```

## 🆘 Emergency Commands

```bash
# Application not responding
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
cd ~/scholarport-frontend
docker-compose -f docker-compose.prod.yml restart

# Complete reset
docker-compose -f docker-compose.prod.yml down
docker system prune -a
docker-compose -f docker-compose.prod.yml up -d --build

# Rollback changes (if using git)
git reset --hard <previous-commit>
.\scripts\update.ps1

# Reboot server (last resort)
sudo reboot
```

## 📝 Quick Aliases (Add to .bashrc or .zshrc)

```bash
# SSH
alias ssh-scholar='ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com'

# Deploy
alias scholar-deploy='cd ~/scholarport-frontend && ./scripts/deploy.sh'
alias scholar-update='cd ~/scholarport-frontend && ./scripts/update.sh'
alias scholar-logs='cd ~/scholarport-frontend && ./scripts/logs.sh'

# Docker
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias dlogs='docker-compose logs -f'
```

## 🔗 Important URLs

```bash
# Production
http://43.205.213.103
http://ec2-43-205-213-103.ap-south-1.compute.amazonaws.com

# Backend
http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/api/chat

# Local
http://localhost:3000
```

## 💡 Pro Tips

```bash
# View logs during deployment
.\scripts\logs.ps1           # Run in separate terminal

# Quick status check
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "docker ps && docker-compose -f ~/scholarport-frontend/docker-compose.prod.yml logs --tail=20"

# Backup before major changes
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "cd ~/scholarport-frontend && tar -czf backup-$(date +%Y%m%d).tar.gz public config.js"

# Monitor in real-time
watch -n 5 'docker ps'       # Linux
```

---

Print this cheat sheet and keep it handy! 📋
