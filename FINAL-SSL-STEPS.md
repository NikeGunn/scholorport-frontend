# ✅ FINAL STEPS - Copy SSL Certificates (2 Minutes)

## Your deployment is complete! SSL certificates are already obtained.
## Just run these commands on EC2 to activate HTTPS:

### 1. SSH to EC2
```powershell
ssh -i "scholarport-frontend.pem" ubuntu@ec2-13-232-108-169.ap-south-1.compute.amazonaws.com
```

### 2. Copy SSL Certificates (ONE COMMAND)
```bash
cd ~/scholarport-frontend && \
sudo mkdir -p ssl/live/scholarport.co && \
sudo cp /etc/letsencrypt/live/scholarport.co/fullchain.pem ssl/live/scholarport.co/ && \
sudo cp /etc/letsencrypt/live/scholarport.co/privkey.pem ssl/live/scholarport.co/ && \
sudo cp /etc/letsencrypt/live/scholarport.co/chain.pem ssl/live/scholarport.co/ && \
sudo chown -R $USER:$USER ssl && \
docker-compose -f docker-compose.prod.yml restart && \
echo "✅ HTTPS is now enabled!"
```

### 3. Wait 5 seconds, then test:
```bash
sleep 5
curl -I https://scholarport.co
```

Should see: `HTTP/2 200`

## 🎉 Visit Your Site

- https://scholarport.co
- https://www.scholarport.co

Both should work with green padlock! 🔒

---

## What Changed:
✅ Nginx now has HTTPS enabled
✅ HTTP automatically redirects to HTTPS
✅ SSL certificate expires: 2026-01-08
✅ Auto-renewal is already setup

## If You See Errors:

### "nginx: test failed"
```bash
docker logs scholarport-frontend-prod
```

### "Connection refused"
Check AWS Security Group - port 443 must be open!

### Still HTTP only
```bash
# Check if certificates are there
ls -la ssl/live/scholarport.co/

# Restart
docker-compose -f docker-compose.prod.yml restart
```
