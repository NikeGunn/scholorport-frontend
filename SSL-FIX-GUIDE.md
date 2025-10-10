# 🔧 SSL SETUP FIX GUIDE

## Problem Analysis

Based on your error, here's what's wrong:
1. ❌ SSL certificates NOT obtained yet (setup-ssl.sh failed)
2. ❌ HTTPS server block still commented in nginx
3. ❌ ERR_QUIC_PROTOCOL_ERROR = nginx trying to serve HTTP on port 443

## ✅ SOLUTION - Run These Commands on EC2

### Step 1: Stop Everything and Clean Up

```bash
# You're already on EC2, so just run:
cd ~/scholarport-frontend

# Stop containers
docker-compose -f docker-compose.prod.yml down
```

### Step 2: Check Security Group (CRITICAL!)

**Before proceeding, verify in AWS Console:**
- Go to EC2 → Security Groups
- Find your instance's security group
- Verify these rules exist:

```
Type        Protocol  Port Range  Source
SSH         TCP       22          0.0.0.0/0
HTTP        TCP       80          0.0.0.0/0
HTTPS       TCP       443         0.0.0.0/0
```

If port 443 is NOT open, add it now!

### Step 3: Install Certbot and Obtain Certificate

```bash
# Update system
sudo apt-get update

# Install certbot
sudo apt-get install -y certbot

# Obtain SSL certificate (containers must be STOPPED!)
sudo certbot certonly --standalone \
    -d scholarport.co \
    -d www.scholarport.co \
    --non-interactive \
    --agree-tos \
    --email tech.scholarport@gmail.com \
    --preferred-challenges http

# Verify certificate was created
sudo ls -la /etc/letsencrypt/live/scholarport.co/
# You should see: fullchain.pem, privkey.pem, chain.pem
```

### Step 4: Copy Certificates to Project

```bash
cd ~/scholarport-frontend

# Create directory
mkdir -p ssl/live/scholarport.co

# Copy certificates
sudo cp /etc/letsencrypt/live/scholarport.co/fullchain.pem ssl/live/scholarport.co/
sudo cp /etc/letsencrypt/live/scholarport.co/privkey.pem ssl/live/scholarport.co/
sudo cp /etc/letsencrypt/live/scholarport.co/chain.pem ssl/live/scholarport.co/

# Set ownership
sudo chown -R ubuntu:ubuntu ssl

# Verify files
ls -la ssl/live/scholarport.co/
```

### Step 5: Enable HTTPS in Nginx Config

**Option A: Use the automated script**
```bash
cd ~/scholarport-frontend

# Make script executable
chmod +x scripts/setup-ssl-local.sh

# Run it (it will do steps 3, 4, and 5 automatically)
bash scripts/setup-ssl-local.sh
```

**Option B: Manual configuration**
```bash
cd ~/scholarport-frontend

# Backup current config
cp nginx/default.conf nginx/default.conf.backup

# Replace with HTTPS-enabled config
cp nginx/default.conf.https nginx/default.conf

# Verify the change
grep -A 5 "listen 443" nginx/default.conf
```

### Step 6: Restart Docker with SSL

```bash
cd ~/scholarport-frontend

# Start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs scholarport-frontend

# Test nginx config inside container
docker exec scholarport-frontend-prod nginx -t
```

### Step 7: Verify Everything Works

```bash
# Test HTTPS locally
curl -I https://scholarport.co

# Check certificate
echo | openssl s_client -servername scholarport.co -connect localhost:443 2>/dev/null | openssl x509 -noout -dates

# Check what's listening on ports
sudo netstat -tlnp | grep -E ':(80|443)'
```

## 🧪 Expected Results

After completing the steps:

1. **Port 80 (HTTP)**
   ```bash
   curl -I http://scholarport.co
   # Should return: 301 redirect to https://
   ```

2. **Port 443 (HTTPS)**
   ```bash
   curl -I https://scholarport.co
   # Should return: 200 OK with HTML content
   ```

3. **Browser Tests**
   - http://scholarport.co → Redirects to https://scholarport.co
   - https://scholarport.co → Shows your website
   - Green padlock icon visible
   - No certificate errors

## 🚨 Common Issues & Fixes

### Issue 1: Certbot Fails with "Address already in use"

**Fix:**
```bash
# Stop docker containers
docker-compose -f docker-compose.prod.yml down

# Check if anything is using port 80
sudo lsof -i :80

# Kill any process using port 80
sudo systemctl stop apache2  # if apache is running
sudo systemctl stop nginx     # if nginx is running

# Try certbot again
sudo certbot certonly --standalone -d scholarport.co -d www.scholarport.co --email tech.scholarport@gmail.com
```

### Issue 2: "SSL certificate not found" in nginx logs

**Fix:**
```bash
# Check if certificates exist in container
docker exec scholarport-frontend-prod ls -la /etc/nginx/ssl/live/scholarport.co/

# If empty, certificates weren't copied
cd ~/scholarport-frontend
sudo cp /etc/letsencrypt/live/scholarport.co/* ssl/live/scholarport.co/
sudo chown -R ubuntu:ubuntu ssl
docker-compose -f docker-compose.prod.yml restart
```

### Issue 3: ERR_QUIC_PROTOCOL_ERROR or ERR_SSL_PROTOCOL_ERROR

**This means HTTPS is not configured in nginx!**

**Fix:**
```bash
# Check if HTTPS server block is enabled
docker exec scholarport-frontend-prod grep -A 3 "listen 443" /etc/nginx/conf.d/default.conf

# If you see "# listen 443" (commented), HTTPS is NOT enabled
# Enable it:
cd ~/scholarport-frontend
cp nginx/default.conf.https nginx/default.conf
docker-compose -f docker-compose.prod.yml restart
```

### Issue 4: Connection Refused on Port 443

**Fix:**
```bash
# Check if port 443 is exposed
docker ps | grep scholarport-frontend
# Should show: 0.0.0.0:443->443/tcp

# If not, check docker-compose.prod.yml
grep -A 3 "ports:" docker-compose.prod.yml
# Should have both:
#   - "80:80"
#   - "443:443"

# Check AWS Security Group (most common issue!)
# Port 443 must be open in AWS Console
```

## 📋 Complete Command Sequence (Copy-Paste)

**Run this entire block on your EC2:**

```bash
# Navigate to project
cd ~/scholarport-frontend

# Stop containers
docker-compose -f docker-compose.prod.yml down

# Install certbot
sudo apt-get update && sudo apt-get install -y certbot

# Get certificate
sudo certbot certonly --standalone \
    -d scholarport.co \
    -d www.scholarport.co \
    --non-interactive \
    --agree-tos \
    --email tech.scholarport@gmail.com

# Copy certificates
mkdir -p ssl/live/scholarport.co
sudo cp /etc/letsencrypt/live/scholarport.co/fullchain.pem ssl/live/scholarport.co/
sudo cp /etc/letsencrypt/live/scholarport.co/privkey.pem ssl/live/scholarport.co/
sudo cp /etc/letsencrypt/live/scholarport.co/chain.pem ssl/live/scholarport.co/
sudo chown -R ubuntu:ubuntu ssl

# Enable HTTPS config
cp nginx/default.conf.https nginx/default.conf

# Start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Test
sleep 5
docker exec scholarport-frontend-prod nginx -t
curl -I https://scholarport.co

echo "✅ Done! Visit https://scholarport.co"
```

## 🔐 Setup Auto-Renewal

After SSL is working, set up auto-renewal:

```bash
# Create renewal hook
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy

sudo tee /etc/letsencrypt/renewal-hooks/deploy/scholarport.sh > /dev/null << 'EOF'
#!/bin/bash
cd /home/ubuntu/scholarport-frontend
sudo cp /etc/letsencrypt/live/scholarport.co/* ssl/live/scholarport.co/
sudo chown -R ubuntu:ubuntu ssl
docker-compose -f docker-compose.prod.yml restart scholarport-frontend
EOF

sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/scholarport.sh

# Add cron job
echo "0 2 * * * root certbot renew --quiet" | sudo tee /etc/cron.d/certbot-renewal
```

## ✅ Final Verification Checklist

- [ ] Port 443 open in AWS Security Group
- [ ] Certificate files exist: `ls ssl/live/scholarport.co/`
- [ ] Nginx config has `listen 443 ssl`
- [ ] Docker exposes port 443
- [ ] https://scholarport.co loads in browser
- [ ] http://scholarport.co redirects to https://
- [ ] No certificate errors in browser
- [ ] Green padlock visible

## 📞 Need Help?

If still not working, check:
```bash
# Container logs
docker-compose -f docker-compose.prod.yml logs --tail=50

# Nginx error log
docker exec scholarport-frontend-prod cat /var/log/nginx/error.log

# Check what's listening
sudo netstat -tlnp | grep -E ':(80|443)'

# Test SSL locally
openssl s_client -connect localhost:443 -servername scholarport.co
```
