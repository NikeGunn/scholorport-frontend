# Multi-stage Dockerfile for Scholarport Frontend
# Supports both development and production environments

FROM node:18-alpine AS base
LABEL maintainer="Scholarport Team"
LABEL description="Scholarport Frontend - AI-powered study abroad advisor"

# Set working directory
WORKDIR /app

# Copy package files (only if they exist)
COPY package*.json ./

# Install dependencies only if package.json exists and has dependencies
RUN if [ -f package.json ] && [ "$(cat package.json | grep -c '\"dependencies\"')" -gt 0 ]; then \
  npm install --only=production && npm cache clean --force; \
  else \
  echo "No dependencies to install - using CDN imports"; \
  fi

# Copy application files
COPY . .

# -----------------------------------
# Development Stage
# -----------------------------------
FROM base AS development

# Install http-server for development
RUN npm install -g http-server

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development

# Start development server with hot reload
CMD ["http-server", "public", "-p", "3000", "-c-1"]

# -----------------------------------
# Production Stage
# -----------------------------------
FROM nginx:alpine AS production

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy application files directly (no build needed for CDN-based app)
# Copy everything from public folder to the nginx html root
COPY public/ /usr/share/nginx/html/
COPY config.js /usr/share/nginx/html/config.js

# Create necessary directories
RUN mkdir -p /var/cache/nginx /var/log/nginx /etc/nginx/ssl /var/www/certbot

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/log/nginx && \
  chmod -R 755 /usr/share/nginx/html

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
