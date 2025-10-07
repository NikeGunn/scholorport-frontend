# Makefile for Scholarport Frontend
# Simplifies common development and deployment tasks

.PHONY: help install dev start docker-dev docker-prod deploy update logs status clean ssl

# Default target
help:
	@echo "Scholarport Frontend - Available Commands"
	@echo ""
	@echo "Development:"
	@echo "  make install       - Install dependencies"
	@echo "  make dev          - Start development server"
	@echo "  make start        - Start development server (alias)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-dev   - Start Docker development environment"
	@echo "  make docker-prod  - Start Docker production environment"
	@echo "  make logs         - View Docker logs"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy       - Deploy to EC2 (first time)"
	@echo "  make update       - Quick update to production"
	@echo "  make status       - Check production status"
	@echo "  make ssl          - Setup SSL certificate"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        - Clean up Docker resources"
	@echo ""

# Install dependencies
install:
	npm install

# Development server
dev:
	npm start

start:
	npm start

# Docker development
docker-dev:
	docker-compose -f docker-compose.dev.yml up

docker-dev-build:
	docker-compose -f docker-compose.dev.yml up --build

# Docker production
docker-prod:
	docker-compose -f docker-compose.prod.yml up -d

docker-prod-build:
	docker-compose -f docker-compose.prod.yml up -d --build

# Deployment scripts
deploy:
	@echo "Starting deployment to EC2..."
	@bash scripts/deploy.sh

update:
	@echo "Updating production code..."
	@bash scripts/update.sh

logs:
	@bash scripts/logs.sh

status:
	@bash scripts/status.sh

ssl:
	@echo "Setting up SSL certificate..."
	@echo "Note: This must be run on the EC2 server"
	@ssh -i scholorport-frontend.pem ubuntu@ec2-13-232-108-169.ap-south-1.compute.amazonaws.com "cd ~/scholarport-frontend && ./scripts/setup-ssl.sh"

# Maintenance
clean:
	docker-compose down
	docker system prune -f

clean-all:
	docker-compose down
	docker system prune -a -f

# SSH to production server
ssh:
	@ssh -i scholorport-frontend.pem ubuntu@ec2-13-232-108-169.ap-south-1.compute.amazonaws.com

# Test SSH connection
test-connection:
	@ssh -i scholorport-frontend.pem ubuntu@ec2-13-232-108-169.ap-south-1.compute.amazonaws.com "echo 'Connection successful!'"
