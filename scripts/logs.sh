#!/bin/bash

##############################################################################
# Logs Viewer Script for Scholarport Frontend
# View application logs from the production server
##############################################################################

# Configuration
EC2_HOST="ec2-43-205-213-103.ap-south-1.compute.amazonaws.com"
EC2_USER="ubuntu"
PEM_FILE="scholorport-frontend.pem"
APP_DIR="/home/ubuntu/scholarport-frontend"

# Colors
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Scholarport Frontend - Live Logs${NC}"
echo "Press Ctrl+C to exit"
echo ""

ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << EOF
    cd $APP_DIR
    docker-compose -f docker-compose.prod.yml logs -f --tail=50
EOF
