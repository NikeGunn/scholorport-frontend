# SSL Deployment Guide for scholarport.co

## ✅ Pre-Deployment Checklist

Your setup is complete! Here's what has been configured:

### 1. DNS Configuration ✅
- **Domain**: scholarport.co
- **A Record**: Points to `13.232.108.169` (Your EC2 IP)
- **WWW Subdomain**: CNAME to scholarport.co
- **Verification**: 
  ```
  scholarport.co → 13.232.108.169
  www.scholarport.co → scholarport.co → 13.232.108.169
  ```

### 2. Files Updated ✅
- ✅ `nginx/default.conf` - Domain set to scholarport.co
- ✅ `scripts/setup-ssl.sh` - EC2 IP and default domain configured
- ✅ `config.js` - HTTPS support added for custom domain
- ✅ `docker-compose.prod.yml` - SSL volumes already configured

### 3. EC2 Security Group Requirements
Ensure these ports are open:
- **Port 22** (SSH) - For deployment
- **Port 80** (HTTP) - For Let's Encrypt verification
- **Port 443** (HTTPS) - For secure traffic

## 🚀 Deployment Steps

### Step 1: Deploy Your Code to EC2

From your local machine (Windows PowerShell):

```powershell
# Navigate to your project directory
cd C:\Users\Nautilus\Desktop\frontend\scholarport-frontend

# Deploy using the PowerShell script
pnpm run deploy:win

# OR manually:
# scp -i scholarport-frontend.pem -r * ubuntu@ec2-13-232-108-169.ap-south-1.compute.amazonaws.com:/home/ubuntu/scholarport-frontend/
```

### Step 2: SSH into Your EC2 Instance

```powershell
ssh -i scholarport-frontend.pem ubuntu@ec2-13-232-108-169.ap-south-1.compute.amazonaws.com
```

### Step 3: Build and Start Docker Containers (Without SSL first)

```bash
cd /home/ubuntu/scholarport-frontend

# Build and start the containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check if it's running
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f scholarport-frontend
```

### Step 4: Verify HTTP Access

Test in your browser:
- http://scholarport.co
- http://www.scholarport.co
- http://13.232.108.169

All should show your application.

### Step 5: Setup SSL Certificate

Once HTTP is working, run the SSL setup script:

```bash
cd /home/ubuntu/scholarport-frontend

# Make script executable
chmod +x scripts/setup-ssl.sh

# Run SSL setup (it will default to scholarport.co)
bash scripts/setup-ssl.sh
```

**When prompted:**
- Domain: Just press Enter (defaults to scholarport.co)
- Email: Enter your email for SSL notifications

The script will:
1. Install certbot
2. Stop nginx temporarily
3. Obtain SSL certificate from Let's Encrypt
4. Copy certificates to ssl/ directory
5. Enable HTTPS in nginx configuration
6. Restart nginx with SSL
7. Setup auto-renewal cron job

### Step 6: Verify HTTPS Access

After SSL setup completes, test:
- https://scholarport.co ✅
- https://www.scholarport.co ✅
- http://scholarport.co (should redirect to HTTPS) ✅

## 🔧 Configuration Details

### Nginx Configuration
The nginx config is already set for:
- **Domain**: scholarport.co, www.scholarport.co
- **SSL Certificates**: /etc/nginx/ssl/live/scholarport.co/
- **HTTP → HTTPS Redirect**: Enabled after SSL setup
- **Security Headers**: HSTS, X-Frame-Options, etc.

### API Configuration
Your `config.js` now automatically:
- Detects if you're on scholarport.co domain
- Uses HTTPS for backend API calls when on HTTPS
- Uses WSS (secure WebSocket) when on HTTPS
- Falls back to HTTP when accessed via IP

### Backend API
Current backend: `ec2-43-205-95-162.ap-south-1.compute.amazonaws.com`
- When on HTTPS: Uses https://ec2-43-205-95-162...
- When on HTTP: Uses http://ec2-43-205-95-162...

## 🔄 SSL Auto-Renewal

The setup script configures automatic renewal:
- Checks daily at midnight
- Renews certificate when < 30 days remain
- Restarts nginx after renewal
- Certificates valid for 90 days

## 📝 Troubleshooting

### Issue: Certificate Verification Fails

```bash
# Check if port 80 is accessible
curl http://scholarport.co/.well-known/acme-challenge/test

# Check nginx logs
docker-compose -f docker-compose.prod.yml logs scholarport-frontend

# Verify DNS
nslookup scholarport.co
```

### Issue: "Too Many Requests" from Let's Encrypt

Let's Encrypt has rate limits:
- 5 failed validations per hour
- 50 certificates per domain per week

Wait an hour and try again.

### Issue: Mixed Content Warnings

If you see mixed content warnings, check:
1. All API calls use HTTPS in `config.js` ✅
2. No hardcoded HTTP URLs in your frontend code
3. External resources (CDNs) use HTTPS

### Force HTTPS Check

```bash
# On EC2, check nginx config
docker exec scholarport-frontend-prod nginx -t

# Reload nginx without downtime
docker exec scholarport-frontend-prod nginx -s reload
```

## 🎯 Post-Deployment Verification Checklist

- [ ] https://scholarport.co loads correctly
- [ ] https://www.scholarport.co loads correctly  
- [ ] http:// URLs redirect to https://
- [ ] SSL certificate is valid (check in browser)
- [ ] API calls work correctly
- [ ] WebSocket connections work (if applicable)
- [ ] Browser shows green padlock icon
- [ ] No mixed content warnings in console

## 📊 Monitoring

### Check SSL Certificate Expiry

```bash
# On EC2
echo | openssl s_client -servername scholarport.co -connect localhost:443 2>/dev/null | openssl x509 -noout -dates
```

### Check Auto-Renewal Cron

```bash
# View cron job
sudo cat /etc/cron.d/certbot-renewal

# Test renewal (dry run)
sudo certbot renew --dry-run
```

### View Logs

```bash
# Docker logs
docker-compose -f docker-compose.prod.yml logs -f

# Nginx error logs
docker exec scholarport-frontend-prod cat /var/log/nginx/error.log

# Certbot logs
sudo cat /var/log/letsencrypt/letsencrypt.log
```

## 🔐 Security Best Practices

Your setup includes:
- ✅ TLS 1.2 and 1.3 only
- ✅ Strong cipher suites
- ✅ HSTS header (enforces HTTPS)
- ✅ Security headers (XSS protection, frame options)
- ✅ SSL stapling
- ✅ Session tickets disabled
- ✅ Rate limiting

## 📞 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review EC2 security group settings
3. Check Docker logs
4. Verify DNS propagation (can take up to 48 hours)

## 🎉 Success!

Once deployed, your site will be:
- Accessible at https://scholarport.co
- Secured with Let's Encrypt SSL
- Auto-renewing certificates
- Redirecting HTTP to HTTPS
- Using secure API connections

---

**Last Updated**: October 10, 2025
**Domain**: scholarport.co
**EC2 IP**: 13.232.108.169
**Backend**: ec2-43-205-95-162.ap-south-1.compute.amazonaws.com
