#!/bin/bash

##############################################################################
# Scholarport Frontend Deployment Script
# This script automates the deployment process to EC2
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
EC2_HOST="ec2-13-232-108-169.ap-south-1.compute.amazonaws.com"
EC2_USER="ubuntu"
PEM_FILE="scholarport-frontend.pem"
APP_DIR="/home/ubuntu/scholarport-frontend"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"

# Functions
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if PEM file exists
check_pem_file() {
    if [ ! -f "$PEM_FILE" ]; then
        print_error "PEM file not found: $PEM_FILE"
        print_info "Please place your PEM file in the project root directory"
        exit 1
    fi

    # Set proper permissions
    chmod 400 "$PEM_FILE"
    print_success "PEM file found and permissions set"
}

# Test SSH connection
test_connection() {
    print_info "Testing SSH connection to EC2..."
    if ssh -i "$PEM_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
        print_success "SSH connection successful"
    else
        print_error "Cannot connect to EC2 instance"
        print_info "Please check your PEM file and EC2 instance status"
        exit 1
    fi
}

# Create app directory on EC2
create_app_directory() {
    print_info "Creating application directory on EC2..."
    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" "mkdir -p $APP_DIR"
    print_success "Application directory created"
}

# Sync files to EC2
sync_files() {
    print_info "Syncing files to EC2..."

    # Exclude unnecessary files
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '*.pem' \
        --exclude '.env.development' \
        --exclude 'ssl' \
        -e "ssh -i $PEM_FILE" \
        ./ "$EC2_USER@$EC2_HOST:$APP_DIR/"

    print_success "Files synced successfully"
}

# Install dependencies on EC2
install_dependencies() {
    print_info "Installing dependencies on EC2..."

    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << 'EOF'
        # Update system
        sudo apt-get update -qq

        # Install Docker if not already installed
        if ! command -v docker &> /dev/null; then
            echo "Installing Docker..."
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            sudo usermod -aG docker ubuntu
            rm get-docker.sh
        fi

        # Install Docker Compose if not already installed
        if ! command -v docker-compose &> /dev/null; then
            echo "Installing Docker Compose..."
            sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
        fi

        echo "Dependencies installed"
EOF

    print_success "Dependencies installed"
}

# Build and start Docker containers
start_application() {
    print_info "Building and starting application..."

    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << EOF
        cd $APP_DIR

        # Stop existing containers
        docker-compose -f $DOCKER_COMPOSE_FILE down || true

        # Build and start new containers
        docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
        docker-compose -f $DOCKER_COMPOSE_FILE up -d

        # Show running containers
        echo ""
        echo "Running containers:"
        docker ps

        echo ""
        echo "Application logs (last 20 lines):"
        docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=20
EOF

    print_success "Application started successfully"
}

# Setup systemd service
setup_systemd_service() {
    print_info "Setting up systemd service..."

    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << EOF
        cd $APP_DIR

        # Copy service file
        sudo cp scripts/scholarport-frontend.service /etc/systemd/system/

        # Reload systemd
        sudo systemctl daemon-reload

        # Enable service
        sudo systemctl enable scholarport-frontend.service

        # Start service
        sudo systemctl restart scholarport-frontend.service

        # Show status
        sudo systemctl status scholarport-frontend.service --no-pager
EOF

    print_success "Systemd service configured"
}

# Main deployment process
main() {
    echo ""
    echo "=========================================="
    echo "  Scholarport Frontend Deployment"
    echo "=========================================="
    echo ""

    check_pem_file
    test_connection
    create_app_directory
    sync_files
    install_dependencies
    start_application
    setup_systemd_service

    echo ""
    print_success "Deployment completed successfully!"
    echo ""
    print_info "Your application is now running at:"
    print_info "  - http://$EC2_HOST"
    print_info "  - http://$(ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" 'curl -s ifconfig.me')"
    echo ""
    print_warning "Next steps:"
    print_info "1. Configure your domain DNS to point to the EC2 IP"
    print_info "2. Run setup-ssl.sh to obtain SSL certificate"
    print_info "3. Update nginx configuration with your domain"
    echo ""
}

# Run main function
main
