#!/bin/bash
# COPY AND PASTE THIS ENTIRE SCRIPT ON YOUR EC2 SERVER
# This will setup SSL for scholarport.co completely

set -e

echo "🚀 Starting SSL Setup for scholarport.co"
echo "========================================="

# Navigate to project
cd ~/scholarport-frontend

# Step 1: Stop containers
echo ""
echo "⏸️  Step 1: Stopping containers..."
docker-compose -f docker-compose.prod.yml down

# Step 2: Install certbot
echo ""
echo "📦 Step 2: Installing certbot..."
sudo apt-get update -qq
sudo apt-get install -y certbot

# Step 3: Get SSL certificate
echo ""
echo "🔐 Step 3: Obtaining SSL certificate..."
echo "This may take 1-2 minutes..."
sudo certbot certonly --standalone \
    -d scholarport.co \
    -d www.scholarport.co \
    --non-interactive \
    --agree-tos \
    --email tech.scholarport@gmail.com \
    --preferred-challenges http

# Verify
if [ ! -f "/etc/letsencrypt/live/scholarport.co/fullchain.pem" ]; then
    echo "❌ Certificate not obtained!"
    echo "Check:"
    echo "1. Port 80 is open in AWS Security Group"
    echo "2. DNS: nslookup scholarport.co"
    exit 1
fi

echo "✅ Certificate obtained!"

# Step 4: Copy certificates
echo ""
echo "📋 Step 4: Copying certificates to project..."
mkdir -p ssl/live/scholarport.co
sudo cp /etc/letsencrypt/live/scholarport.co/fullchain.pem ssl/live/scholarport.co/
sudo cp /etc/letsencrypt/live/scholarport.co/privkey.pem ssl/live/scholarport.co/
sudo cp /etc/letsencrypt/live/scholarport.co/chain.pem ssl/live/scholarport.co/
sudo chown -R ubuntu:ubuntu ssl

echo "✅ Certificates copied!"
ls -lh ssl/live/scholarport.co/

# Step 5: Enable HTTPS in nginx
echo ""
echo "⚙️  Step 5: Enabling HTTPS in nginx..."
cp nginx/default.conf nginx/default.conf.backup
cp nginx/default.conf.https nginx/default.conf

echo "✅ HTTPS enabled in nginx!"

# Step 6: Start containers with SSL
echo ""
echo "🚀 Step 6: Starting containers with SSL..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for container to be ready
sleep 5

# Step 7: Test nginx config
echo ""
echo "🧪 Step 7: Testing nginx configuration..."
docker exec scholarport-frontend-prod nginx -t

# Step 8: Test HTTPS
echo ""
echo "🌐 Step 8: Testing HTTPS connection..."
sleep 2

if curl -sSf -k -I https://localhost 2>/dev/null | head -n 1; then
    echo "✅ HTTPS is responding!"
else
    echo "⚠️  Could not test HTTPS (might still work externally)"
fi

# Step 9: Setup auto-renewal
echo ""
echo "🔄 Step 9: Setting up auto-renewal..."

sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy

sudo tee /etc/letsencrypt/renewal-hooks/deploy/scholarport.sh > /dev/null << 'EOFSCRIPT'
#!/bin/bash
cd /home/ubuntu/scholarport-frontend
sudo cp /etc/letsencrypt/live/scholarport.co/* ssl/live/scholarport.co/ 2>/dev/null || true
sudo chown -R ubuntu:ubuntu ssl
docker-compose -f docker-compose.prod.yml restart scholarport-frontend
EOFSCRIPT

sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/scholarport.sh

echo "0 2 * * * root certbot renew --quiet" | sudo tee /etc/cron.d/certbot-renewal > /dev/null

echo "✅ Auto-renewal configured!"

# Display results
echo ""
echo "========================================="
echo "✅ SSL SETUP COMPLETE!"
echo "========================================="
echo ""
echo "Your site is now available at:"
echo "  🔒 https://scholarport.co"
echo "  🔒 https://www.scholarport.co"
echo ""
echo "Certificate details:"
sudo openssl x509 -in /etc/letsencrypt/live/scholarport.co/fullchain.pem -noout -dates
echo ""
echo "Next steps:"
echo "1. Test in browser: https://scholarport.co"
echo "2. Verify HTTP redirects to HTTPS"
echo "3. Check for green padlock in browser"
echo ""
echo "Logs: docker-compose -f docker-compose.prod.yml logs -f"
echo ""
