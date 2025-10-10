#!/bin/bash

##############################################################################
# SSL Setup Script for Scholarport Frontend
# This script sets up Let's Encrypt SSL certificate with certbot
##############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
EC2_HOST="ec2-13-232-108-169.ap-south-1.compute.amazonaws.com"
EC2_USER="ubuntu"
PEM_FILE="scholarport-frontend.pem"
APP_DIR="/home/ubuntu/scholarport-frontend"
DEFAULT_DOMAIN="scholarport.co"

# Prompt for domain information
echo -e "${BLUE}=========================================="
echo "  SSL Certificate Setup"
echo "==========================================${NC}"
echo ""
read -p "Enter your domain name (default: $DEFAULT_DOMAIN): " DOMAIN
DOMAIN=${DOMAIN:-$DEFAULT_DOMAIN}
read -p "Enter your email address for SSL notifications: " EMAIL

echo ""
echo -e "${YELLOW}⚠ Important:${NC}"
echo "Before proceeding, make sure:"
echo "1. Your domain $DOMAIN points to EC2 IP: $(ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" 'curl -s ifconfig.me')"
echo "2. Port 80 and 443 are open in your EC2 security group"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Setup SSL on EC2
echo -e "${BLUE}Setting up SSL certificate...${NC}"

ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << EOF
    cd $APP_DIR

    # Install certbot
    sudo apt-get update
    sudo apt-get install -y certbot

    # Stop nginx temporarily
    docker-compose -f docker-compose.prod.yml stop scholarport-frontend

    # Obtain certificate
    sudo certbot certonly --standalone \
        -d $DOMAIN \
        -d www.$DOMAIN \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        --preferred-challenges http

    # Copy certificates to project directory
    sudo mkdir -p ssl/live/$DOMAIN
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/live/$DOMAIN/
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/live/$DOMAIN/
    sudo cp /etc/letsencrypt/live/$DOMAIN/chain.pem ssl/live/$DOMAIN/
    sudo chown -R ubuntu:ubuntu ssl

    # Update nginx configuration (domain should already be set to scholarport.co)
    echo "Nginx configuration already set for $DOMAIN"

    # Uncomment HTTPS server block in nginx/default.conf
    sed -i '/^# server {/,/^# }/ s/^# //' nginx/default.conf | head -1

    # Enable HTTPS redirect in HTTP server block
    sed -i 's/^    # location \/ {$/    location \/ {/' nginx/default.conf
    sed -i 's/^    #     return 301/        return 301/' nginx/default.conf
    sed -i 's/^    # }$/    }/' nginx/default.conf

    # Comment out direct serving in HTTP block (lines 31-38 approximately)
    sed -i '/Serve frontend application (comment out after SSL setup)/,/try_files \$uri \$uri\/ \/index.html;/ {
        /location \/ {/s/^/    # /
        /root \/usr\/share\/nginx\/html;/s/^/        # /
        /index index.html;/s/^/        # /
        /try_files/s/^/        # /
    }' nginx/default.conf

    # Restart nginx
    docker-compose -f docker-compose.prod.yml up -d

    # Setup auto-renewal
    sudo bash -c 'cat > /etc/cron.d/certbot-renewal << EOL
0 0 * * * root certbot renew --quiet --deploy-hook "cd $APP_DIR && docker-compose -f docker-compose.prod.yml restart scholarport-frontend"
EOL'

    echo ""
    echo "SSL certificate installed successfully!"
    echo "Your site is now available at:"
    echo "  - https://$DOMAIN"
    echo "  - https://www.$DOMAIN"
    echo ""
    echo "Certificate will auto-renew every 60 days"
EOF

echo -e "${GREEN}✓ SSL setup completed!${NC}"
