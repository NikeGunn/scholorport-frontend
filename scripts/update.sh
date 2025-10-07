#!/bin/bash

##############################################################################
# Quick Update Script for Scholarport Frontend
# Use this script to quickly deploy code changes to production
##############################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
EC2_HOST="ec2-13-232-108-169.ap-south-1.compute.amazonaws.com"
EC2_USER="ubuntu"
PEM_FILE="scholarport-frontend.pem"
APP_DIR="/home/ubuntu/scholarport-frontend"

echo -e "${BLUE}Updating Scholarport Frontend on Production...${NC}"

# Sync only changed files
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '*.pem' \
    --exclude '.env.development' \
    --exclude 'ssl' \
    -e "ssh -i $PEM_FILE" \
    ./ "$EC2_USER@$EC2_HOST:$APP_DIR/"

# Restart the application
ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << EOF
    cd $APP_DIR
    docker-compose -f docker-compose.prod.yml up -d --build
    echo ""
    echo "Application restarted. Recent logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=20
EOF

echo -e "${GREEN}✓ Update completed successfully!${NC}"
