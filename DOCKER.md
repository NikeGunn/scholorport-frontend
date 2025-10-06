# Scholarport Frontend - Docker Guide

Complete guide for using Docker with Scholarport Frontend.

## 📦 Docker Setup

### Available Images

The project uses multi-stage Docker builds:

1. **Development**: Hot-reload with node http-server
2. **Production**: Optimized nginx serving static files

## 🔧 Docker Commands Reference

### Development

```bash
# Build development image
docker-compose -f docker-compose.dev.yml build

# Start development server
docker-compose -f docker-compose.dev.yml up

# Start in detached mode (background)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop containers
docker-compose -f docker-compose.dev.yml down

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up -d --build
```

### Production

```bash
# Build production image
docker-compose -f docker-compose.prod.yml build

# Start production server
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop containers
docker-compose -f docker-compose.prod.yml down

# Restart containers
docker-compose -f docker-compose.prod.yml restart

# Update and rebuild
docker-compose -f docker-compose.prod.yml up -d --build
```

### General Docker Commands

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs <container-name>

# Execute command in container
docker exec -it <container-name> sh

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything (containers, images, volumes)
docker system prune -a
```

## 🏗️ Docker Architecture

### Dockerfile Stages

```dockerfile
# Base stage - common setup
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Development stage - with dev tools
FROM base AS development
RUN npm install
CMD ["npm", "start"]

# Production stage - optimized nginx
FROM nginx:alpine AS production
COPY --from=base /app /usr/share/nginx/html
```

### Volume Mounts

**Development** (hot-reload):
- `./public:/app/public` - Source files
- `./config.js:/app/config.js` - Configuration
- `/app/node_modules` - Prevent overwrite

**Production** (read-only):
- `./config.js:/usr/share/nginx/html/config.js:ro`
- `./nginx/:/etc/nginx/:ro`
- `./ssl:/etc/nginx/ssl:ro`

## 🌐 Port Mapping

| Mode | Container Port | Host Port | Service |
|------|---------------|-----------|---------|
| Development | 3000 | 3000 | HTTP Server |
| Production | 80 | 80 | HTTP (Nginx) |
| Production | 443 | 443 | HTTPS (Nginx) |

## 🔍 Troubleshooting Docker

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs scholarport-frontend

# Inspect container
docker inspect <container-name>
```

### Port Already in Use

```bash
# Find process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Linux/Mac

# Kill the process or change port in docker-compose.yml
```

### Permission Issues

```bash
# Fix permissions on Linux/Mac
sudo chown -R $USER:$USER .

# On Windows, run as Administrator
```

### Out of Disk Space

```bash
# Check Docker disk usage
docker system df

# Clean up
docker system prune -a --volumes
```

## 🚀 Best Practices

1. **Use .dockerignore**: Exclude unnecessary files
2. **Multi-stage builds**: Smaller production images
3. **Named volumes**: Persist data across restarts
4. **Health checks**: Monitor container health
5. **Logging**: Configure proper log drivers

## 📊 Monitoring

### Check Container Health

```bash
# Container status
docker ps

# Resource usage
docker stats

# Inspect container
docker inspect <container-name>
```

### View Logs

```bash
# All logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs scholarport-frontend
```

## 🔄 Update Workflow

1. **Make code changes** locally
2. **Test locally**: `npm start`
3. **Commit changes**: `git commit -m "Update"`
4. **Deploy to production**: `./scripts/update.sh`

The update script will:
- Sync files to EC2
- Rebuild containers
- Restart application
- Show logs

## 🐳 Docker Compose Profiles

The main `docker-compose.yml` uses profiles:

```bash
# Start development profile
docker-compose --profile development up

# Start production profile
docker-compose --profile production up
```

Or use specific files:
- `docker-compose.dev.yml` - Development
- `docker-compose.prod.yml` - Production

## 📝 Environment Variables

Set in docker-compose files:

```yaml
environment:
  - NODE_ENV=production
  - PORT=80
  - DEBUG=false
```

Or use `.env` file:

```env
NODE_ENV=production
PORT=80
DEBUG=false
```

## 🔐 Security

1. **Don't expose unnecessary ports**
2. **Use read-only mounts** where possible
3. **Run as non-root user** (nginx user in production)
4. **Keep images updated**: `docker pull nginx:alpine`
5. **Scan for vulnerabilities**: `docker scan <image>`

---

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
