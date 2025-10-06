#!/bin/bash

##############################################################################
# Status Check Script for Scholarport Frontend
# Check the health and status of the application
##############################################################################

# Configuration
EC2_HOST="ec2-43-205-213-103.ap-south-1.compute.amazonaws.com"
EC2_USER="ubuntu"
PEM_FILE="scholorport-frontend.pem"
APP_DIR="/home/ubuntu/scholarport-frontend"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Scholarport Frontend - Status Check${NC}"
echo ""

ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << EOF
    cd $APP_DIR

    echo "=== Docker Containers ==="
    docker-compose -f docker-compose.prod.yml ps

    echo ""
    echo "=== Systemd Service Status ==="
    sudo systemctl status scholarport-frontend.service --no-pager || echo "Service not configured"

    echo ""
    echo "=== Disk Usage ==="
    df -h /

    echo ""
    echo "=== Memory Usage ==="
    free -h

    echo ""
    echo "=== Recent Logs ==="
    docker-compose -f docker-compose.prod.yml logs --tail=10
EOF

echo ""
echo -e "${GREEN}✓ Status check completed${NC}"
