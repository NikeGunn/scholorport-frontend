#!/bin/bash

##############################################################################
# Local SSL Setup Script for Scholarport Frontend
# Run this script DIRECTLY on your EC2 instance (not from local machine)
##############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN="scholarport.co"
EMAIL="tech.scholarport@gmail.com"
APP_DIR="/home/ubuntu/scholarport-frontend"

echo -e "${BLUE}=========================================="
echo "  SSL Certificate Setup for $DOMAIN"
echo "==========================================${NC}"
echo ""

# Check if running on EC2
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}❌ Error: App directory not found at $APP_DIR${NC}"
    echo "This script must be run on the EC2 server."
    exit 1
fi

cd "$APP_DIR"

echo -e "${YELLOW}⚠ Important:${NC}"
echo "Before proceeding, make sure:"
echo "1. Your domain $DOMAIN points to this EC2 instance"
echo "2. Port 80 and 443 are open in your EC2 security group"
echo ""
echo "Current IP: $(curl -s ifconfig.me)"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Step 1: Install certbot
echo ""
echo -e "${BLUE}📦 Installing certbot...${NC}"
sudo apt-get update -qq
sudo apt-get install -y certbot

# Step 2: Stop nginx container temporarily
echo ""
echo -e "${BLUE}⏸️  Stopping nginx container...${NC}"
docker-compose -f docker-compose.prod.yml stop scholarport-frontend

# Step 3: Obtain SSL certificate
echo ""
echo -e "${BLUE}🔐 Obtaining SSL certificate from Let's Encrypt...${NC}"
echo "This may take a minute..."

sudo certbot certonly --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --preferred-challenges http

# Check if certificate was obtained successfully
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo -e "${RED}❌ Failed to obtain SSL certificate${NC}"
    echo "Please check:"
    echo "1. DNS is pointing correctly: nslookup $DOMAIN"
    echo "2. Port 80 is accessible from internet"
    echo "3. No firewall blocking port 80"
    docker-compose -f docker-compose.prod.yml start scholarport-frontend
    exit 1
fi

# Step 4: Copy certificates to project directory
echo ""
echo -e "${BLUE}📋 Copying certificates to project...${NC}"
sudo mkdir -p ssl/live/$DOMAIN
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/live/$DOMAIN/
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/live/$DOMAIN/
sudo cp /etc/letsencrypt/live/$DOMAIN/chain.pem ssl/live/$DOMAIN/
sudo chown -R ubuntu:ubuntu ssl

echo -e "${GREEN}✓ Certificates copied${NC}"

# Step 5: Enable HTTPS in nginx configuration
echo ""
echo -e "${BLUE}⚙️  Enabling HTTPS in nginx configuration...${NC}"

# Backup original config
cp nginx/default.conf nginx/default.conf.backup

# Uncomment HTTPS server block (remove leading # and space from lines 52-139)
sed -i '52,139s/^# //' nginx/default.conf

# Enable HTTP to HTTPS redirect (uncomment lines ~26-28)
sed -i '26,28s/^    # /    /' nginx/default.conf

# Comment out HTTP serving (lines ~31-38)
sed -i '31s/^    location/    # location/' nginx/default.conf
sed -i '32s/^        root/        # root/' nginx/default.conf
sed -i '33s/^        index/        # index/' nginx/default.conf
sed -i '34s/^        try_files/        # try_files/' nginx/default.conf

echo -e "${GREEN}✓ Nginx configuration updated${NC}"

# Step 6: Restart nginx with SSL
echo ""
echo -e "${BLUE}🔄 Restarting nginx with SSL...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for container to start
sleep 3

# Step 7: Test nginx configuration
echo ""
echo -e "${BLUE}🧪 Testing nginx configuration...${NC}"
if docker exec scholarport-frontend-prod nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
else
    echo -e "${RED}❌ Nginx configuration error${NC}"
    docker-compose -f docker-compose.prod.yml logs scholarport-frontend | tail -20
    exit 1
fi

# Step 8: Setup auto-renewal
echo ""
echo -e "${BLUE}🔄 Setting up auto-renewal...${NC}"

# Create renewal hook script
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo tee /etc/letsencrypt/renewal-hooks/deploy/scholarport-renewal.sh > /dev/null << 'EOF'
#!/bin/bash
# Copy renewed certificates
cp /etc/letsencrypt/live/scholarport.co/fullchain.pem /home/ubuntu/scholarport-frontend/ssl/live/scholarport.co/
cp /etc/letsencrypt/live/scholarport.co/privkey.pem /home/ubuntu/scholarport-frontend/ssl/live/scholarport.co/
cp /etc/letsencrypt/live/scholarport.co/chain.pem /home/ubuntu/scholarport-frontend/ssl/live/scholarport.co/
chown -R ubuntu:ubuntu /home/ubuntu/scholarport-frontend/ssl

# Reload nginx
cd /home/ubuntu/scholarport-frontend
docker-compose -f docker-compose.prod.yml exec scholarport-frontend nginx -s reload
EOF

sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/scholarport-renewal.sh

# Setup cron for renewal check
sudo bash -c 'cat > /etc/cron.d/certbot-renewal << EOL
# Check for renewal twice daily at 2am and 2pm
0 2,14 * * * root certbot renew --quiet --deploy-hook "/etc/letsencrypt/renewal-hooks/deploy/scholarport-renewal.sh"
EOL'

echo -e "${GREEN}✓ Auto-renewal configured${NC}"

# Step 9: Display status
echo ""
echo -e "${GREEN}=========================================="
echo "  ✅ SSL Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Your site is now available at:"
echo "  🔒 https://$DOMAIN"
echo "  🔒 https://www.$DOMAIN"
echo ""
echo "Certificate details:"
echo "  📅 Valid from: $(sudo openssl x509 -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem -noout -startdate | cut -d= -f2)"
echo "  📅 Expires: $(sudo openssl x509 -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem -noout -enddate | cut -d= -f2)"
echo ""
echo "Certificate will auto-renew every 60 days"
echo ""

# Step 10: Test HTTPS
echo -e "${BLUE}Testing HTTPS connection...${NC}"
if curl -sSf -o /dev/null https://$DOMAIN 2>/dev/null; then
    echo -e "${GREEN}✓ HTTPS is working!${NC}"
else
    echo -e "${YELLOW}⚠ Could not test HTTPS connection${NC}"
    echo "Please manually test: https://$DOMAIN"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete! Visit https://$DOMAIN${NC}"
