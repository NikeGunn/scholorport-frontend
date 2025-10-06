# Scholarport Frontend - Deployment Guide

Complete guide for deploying Scholarport Frontend to AWS EC2 with Docker, Nginx, and SSL.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Development Mode](#development-mode)
- [Production Deployment](#production-deployment)
- [SSL Setup](#ssl-setup)
- [Updating Code](#updating-code)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

## 🔧 Prerequisites

### Local Machine
- SSH client (OpenSSH, PuTTY, or Windows Terminal)
- Your EC2 PEM file: `scholorport-frontend.pem`
- Git (for version control)

### EC2 Instance
- Ubuntu 20.04 LTS or later
- Instance ID: `i-098ed04de82cadf82`
- Public DNS: `ec2-43-205-213-103.ap-south-1.compute.amazonaws.com`
- Public IP: `43.205.213.103`
- Security Group: Ports 22, 80, 443 open

## 🚀 Quick Start

### For Windows Users

1. **Place your PEM file** in the project root directory:
   ```
   scholarport-frontend/
   ├── scholorport-frontend.pem
   └── ...
   ```

2. **Run the deployment script**:
   ```powershell
   cd scripts
   .\deploy.ps1
   ```

3. **Access your application**:
   - http://ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
   - http://43.205.213.103

### For Linux/Mac Users

1. **Place your PEM file** and set permissions:
   ```bash
   chmod 400 scholorport-frontend.pem
   ```

2. **Run the deployment script**:
   ```bash
   cd scripts
   chmod +x *.sh
   ./deploy.sh
   ```

3. **Access your application**:
   - http://ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
   - http://43.205.213.103

## 🌍 Environment Setup

### Configuration Files

The application uses environment-based configuration:

- **`config.js`**: Main configuration file (auto-detects environment)
- **`.env.development`**: Local development settings
- **`.env.production`**: Production settings

### API Configuration

Update the backend URL in `.env.production`:

```env
API_BASE_URL=http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/api/chat
```

The application automatically uses:
- **Localhost**: Development API
- **Production**: EC2 backend API

## 💻 Development Mode

### Local Development (Without Docker)

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Access at: http://localhost:3000

### Local Development (With Docker)

```bash
# Start development container
docker-compose -f docker-compose.dev.yml up

# Or in detached mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop containers
docker-compose -f docker-compose.dev.yml down
```

## 🚢 Production Deployment

### Automated Deployment (Recommended)

#### Windows:
```powershell
.\scripts\deploy.ps1
```

#### Linux/Mac:
```bash
./scripts/deploy.sh
```

This script will:
1. ✓ Check SSH connectivity
2. ✓ Sync files to EC2
3. ✓ Install Docker and Docker Compose
4. ✓ Build and start containers
5. ✓ Setup systemd service

### Manual Deployment

1. **Connect to EC2**:
   ```bash
   ssh -i "scholorport-frontend.pem" ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
   ```

2. **Create application directory**:
   ```bash
   mkdir -p ~/scholarport-frontend
   cd ~/scholarport-frontend
   ```

3. **Transfer files** (from local machine):
   ```bash
   # Windows (PowerShell)
   scp -i scholorport-frontend.pem -r public config.js package.json docker-compose.prod.yml nginx ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com:~/scholarport-frontend/

   # Linux/Mac
   rsync -avz -e "ssh -i scholorport-frontend.pem" --exclude 'node_modules' ./ ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com:~/scholarport-frontend/
   ```

4. **Install Docker** (on EC2):
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker ubuntu

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose

   # Logout and login again for group changes
   exit
   ```

5. **Start the application** (on EC2):
   ```bash
   cd ~/scholarport-frontend
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

6. **Setup systemd service** (optional but recommended):
   ```bash
   sudo cp scripts/scholarport-frontend.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable scholarport-frontend.service
   sudo systemctl start scholarport-frontend.service
   ```

## 🔒 SSL Setup (HTTPS)

### Prerequisites
- Domain name pointing to your EC2 IP
- Ports 80 and 443 open in security group

### Automated SSL Setup

#### Windows:
```powershell
# Note: SSL setup requires Linux, run this on EC2
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
cd ~/scholarport-frontend
./scripts/setup-ssl.sh
```

#### Linux/Mac:
```bash
./scripts/setup-ssl.sh
```

The script will prompt for:
- Your domain name (e.g., scholarport.com)
- Your email address

### Manual SSL Setup

1. **Connect to EC2** and install certbot:
   ```bash
   sudo apt-get update
   sudo apt-get install -y certbot
   ```

2. **Stop nginx temporarily**:
   ```bash
   docker-compose -f docker-compose.prod.yml stop scholarport-frontend
   ```

3. **Obtain certificate**:
   ```bash
   sudo certbot certonly --standalone \
     -d yourdomain.com \
     -d www.yourdomain.com \
     --non-interactive \
     --agree-tos \
     --email your-email@example.com
   ```

4. **Copy certificates**:
   ```bash
   sudo mkdir -p ssl/live/yourdomain.com
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/live/yourdomain.com/
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/live/yourdomain.com/
   sudo cp /etc/letsencrypt/live/yourdomain.com/chain.pem ssl/live/yourdomain.com/
   sudo chown -R ubuntu:ubuntu ssl
   ```

5. **Update nginx configuration**:
   - Edit `nginx/default.conf`
   - Replace `your-domain.com` with your actual domain
   - Uncomment the HTTPS server block
   - Comment the HTTP serving block

6. **Restart nginx**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

7. **Setup auto-renewal**:
   ```bash
   sudo bash -c 'cat > /etc/cron.d/certbot-renewal << EOL
   0 0 * * * root certbot renew --quiet --deploy-hook "cd /home/ubuntu/scholarport-frontend && docker-compose -f docker-compose.prod.yml restart scholarport-frontend"
   EOL'
   ```

## 🔄 Updating Code

### Quick Update (Recommended)

After making code changes locally:

#### Windows:
```powershell
.\scripts\update.ps1
```

#### Linux/Mac:
```bash
./scripts/update.sh
```

This will:
1. Sync only changed files
2. Rebuild containers
3. Restart the application
4. Show recent logs

### Manual Update

```bash
# From local machine - sync files
scp -i scholorport-frontend.pem -r public config.js ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com:~/scholarport-frontend/

# On EC2 - restart application
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
cd ~/scholarport-frontend
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 Monitoring and Logs

### View Live Logs

#### Windows:
```powershell
.\scripts\logs.ps1
```

#### Linux/Mac:
```bash
./scripts/logs.sh
```

### Check Application Status

```bash
./scripts/status.sh
```

### Manual Commands

```bash
# SSH to server
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com

# Check container status
docker ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check systemd service
sudo systemctl status scholarport-frontend.service

# Restart application
docker-compose -f docker-compose.prod.yml restart
```

## 🐛 Troubleshooting

### Application Not Accessible

1. **Check if containers are running**:
   ```bash
   docker ps
   ```

2. **Check security group**:
   - Ensure ports 80 and 443 are open
   - Check inbound rules in AWS Console

3. **Check nginx logs**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs scholarport-frontend
   ```

### SSL Certificate Issues

1. **Verify domain DNS**:
   ```bash
   nslookup yourdomain.com
   dig yourdomain.com
   ```

2. **Check certificate expiry**:
   ```bash
   sudo certbot certificates
   ```

3. **Manually renew certificate**:
   ```bash
   sudo certbot renew
   ```

### Docker Issues

1. **Check Docker service**:
   ```bash
   sudo systemctl status docker
   ```

2. **Restart Docker**:
   ```bash
   sudo systemctl restart docker
   ```

3. **Clean up Docker**:
   ```bash
   docker system prune -a
   ```

### Connection Issues

1. **Verify SSH connectivity**:
   ```bash
   ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "echo 'Connected'"
   ```

2. **Check PEM file permissions** (Linux/Mac):
   ```bash
   chmod 400 scholorport-frontend.pem
   ```

## 🏗️ Architecture

### Application Structure

```
scholarport-frontend/
├── config.js                 # Environment configuration
├── .env.production          # Production environment variables
├── Dockerfile               # Multi-stage Docker build
├── docker-compose.prod.yml  # Production orchestration
├── nginx/
│   ├── nginx.conf          # Main nginx config
│   └── default.conf        # Server configuration
├── public/
│   ├── index.html          # Main HTML file
│   └── src/
│       ├── services/
│       │   └── api.js      # API client
│       └── components/     # React components
└── scripts/
    ├── deploy.sh/ps1       # Deployment automation
    ├── update.sh/ps1       # Quick update
    ├── setup-ssl.sh        # SSL configuration
    └── logs.sh/ps1         # Log viewer
```

### Technology Stack

- **Frontend**: React (CDN), Tailwind CSS
- **Server**: Nginx (Alpine Linux)
- **Container**: Docker + Docker Compose
- **SSL**: Let's Encrypt (Certbot)
- **Service Manager**: Systemd

### Network Flow

```
User Request
    ↓
DNS (Domain) / IP Address
    ↓
AWS EC2 Instance (Port 80/443)
    ↓
Docker Network
    ↓
Nginx Container
    ↓
Static Files (React App)
    ↓
API Calls → Backend EC2
```

## 📝 Quick Reference

### Common Commands

```bash
# Deploy
./scripts/deploy.sh (or .ps1)

# Update code
./scripts/update.sh (or .ps1)

# View logs
./scripts/logs.sh (or .ps1)

# Check status
./scripts/status.sh

# Setup SSL
./scripts/setup-ssl.sh

# SSH to server
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com

# Restart application
docker-compose -f docker-compose.prod.yml restart

# Stop application
docker-compose -f docker-compose.prod.yml down

# Start application
docker-compose -f docker-compose.prod.yml up -d
```

### Important URLs

- **Frontend (IP)**: http://43.205.213.103
- **Frontend (DNS)**: http://ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
- **Backend API**: http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/api/chat
- **Health Check**: http://your-domain/health

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. View application logs: `./scripts/logs.sh`
3. Check container status: `docker ps`
4. Verify environment configuration in `config.js`

## 🔐 Security Checklist

- [ ] PEM file has proper permissions (400)
- [ ] PEM file is not committed to Git
- [ ] SSL certificate is installed and valid
- [ ] Security group only allows necessary ports
- [ ] Environment variables are not exposed
- [ ] Auto-renewal is configured for SSL

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Maintainer**: Scholarport Team
