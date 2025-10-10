# 🚀 FINAL STEPS - ENABLE HTTPS NOW

Your code is deployed! Now follow these exact steps to enable HTTPS.

## ⚠️ CRITICAL: Check AWS Security Group FIRST!

**Before running any commands, verify port 443 is open:**

1. Go to AWS Console → EC2 → Instances
2. Click your instance (13.232.108.169)
3. Click "Security" tab
4. Click on the Security Group name
5. Check "Inbound rules" - you MUST see:
   ```
   Type    Protocol  Port   Source
   HTTP    TCP       80     0.0.0.0/0
   HTTPS   TCP       443    0.0.0.0/0
   ```
6. If port 443 is NOT there, click "Edit inbound rules" → "Add rule":
   - Type: HTTPS
   - Protocol: TCP
   - Port: 443
   - Source: 0.0.0.0/0
   - Click "Save rules"

## 📋 Run These Commands on EC2

### SSH to EC2:
```powershell
ssh -i "scholarport-frontend.pem" ubuntu@ec2-13-232-108-169.ap-south-1.compute.amazonaws.com
```

### Option 1: Automated Setup (Recommended)
```bash
cd ~/scholarport-frontend
chmod +x scripts/quick-ssl-setup.sh
bash scripts/quick-ssl-setup.sh
```

That's it! The script will:
- ✅ Install certbot
- ✅ Get SSL certificate
- ✅ Copy certificates
- ✅ Enable HTTPS in nginx
- ✅ Restart containers
- ✅ Setup auto-renewal

### Option 2: Manual Step-by-Step

If the script fails or you want to do it manually:

```bash
# 1. Navigate to project
cd ~/scholarport-frontend

# 2. Stop containers (REQUIRED for certbot)
docker-compose -f docker-compose.prod.yml down

# 3. Install certbot
sudo apt-get update && sudo apt-get install -y certbot

# 4. Get SSL certificate
sudo certbot certonly --standalone \
    -d scholarport.co \
    -d www.scholarport.co \
    --non-interactive \
    --agree-tos \
    --email tech.scholarport@gmail.com

# 5. Verify certificate exists
sudo ls -la /etc/letsencrypt/live/scholarport.co/
# You should see: fullchain.pem, privkey.pem, chain.pem

# 6. Copy certificates to project
mkdir -p ssl/live/scholarport.co
sudo cp /etc/letsencrypt/live/scholarport.co/fullchain.pem ssl/live/scholarport.co/
sudo cp /etc/letsencrypt/live/scholarport.co/privkey.pem ssl/live/scholarport.co/
sudo cp /etc/letsencrypt/live/scholarport.co/chain.pem ssl/live/scholarport.co/
sudo chown -R ubuntu:ubuntu ssl

# 7. Verify files copied
ls -la ssl/live/scholarport.co/

# 8. Enable HTTPS config
cp nginx/default.conf.https nginx/default.conf

# 9. Start containers with SSL
docker-compose -f docker-compose.prod.yml up -d --build

# 10. Wait 5 seconds then test
sleep 5
docker exec scholarport-frontend-prod nginx -t

# 11. Check logs
docker-compose -f docker-compose.prod.yml logs scholarport-frontend
```

## ✅ Verify It's Working

### On EC2:
```bash
# Test HTTPS locally
curl -I https://scholarport.co

# Should return: HTTP/2 200
```

### In Your Browser:
1. Visit: https://scholarport.co
   - Should show your website ✅
   - Green padlock visible ✅
   - No certificate errors ✅

2. Visit: http://scholarport.co
   - Should redirect to https:// ✅

## 🚨 If Something Goes Wrong

### Error: "Address already in use"
```bash
# Stop containers first
docker-compose -f docker-compose.prod.yml down

# Check what's using port 80
sudo lsof -i :80

# Try certbot again
```

### Error: "Connection refused" on certbot
```bash
# Port 443 not open in AWS Security Group!
# Go back to AWS Console and add port 443
```

### Error: Still getting HTTP, not HTTPS
```bash
# Check if HTTPS is enabled in nginx
docker exec scholarport-frontend-prod grep "listen 443" /etc/nginx/conf.d/default.conf

# Should NOT have # in front of "listen 443"
# If it does:
cd ~/scholarport-frontend
cp nginx/default.conf.https nginx/default.conf
docker-compose -f docker-compose.prod.yml restart
```

### View logs for errors:
```bash
docker-compose -f docker-compose.prod.yml logs --tail=50
```

## 📞 Quick Commands Reference

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml down

# Start
docker-compose -f docker-compose.prod.yml up -d

# Test nginx config
docker exec scholarport-frontend-prod nginx -t

# Check certificate expiry
sudo openssl x509 -in /etc/letsencrypt/live/scholarport.co/fullchain.pem -noout -dates
```

## 🎉 Success Criteria

When everything is working:
- [ ] https://scholarport.co loads ✅
- [ ] https://www.scholarport.co loads ✅
- [ ] http:// URLs redirect to https:// ✅
- [ ] Green padlock in browser ✅
- [ ] No certificate warnings ✅
- [ ] API calls work correctly ✅

---

**Need more help?**
- Check: SSL-FIX-GUIDE.md (detailed troubleshooting)
- Or ask me!
