# Scholarport Frontend - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                             │
│  (Desktop, Tablet, Mobile - All Browsers)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS/HTTP
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                     INTERNET / DNS                               │
│  • Domain: your-domain.com → 43.205.213.103                     │
│  • AWS DNS: ec2-43-205-213-103.ap-south-1.compute.amazonaws.com│
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Port 80/443
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   AWS EC2 INSTANCE                               │
│  Instance ID: i-098ed04de82cadf82                               │
│  Public IP: 43.205.213.103                                      │
│  Region: ap-south-1 (Mumbai)                                    │
│  OS: Ubuntu 20.04 LTS                                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              SYSTEMD SERVICE                            │   │
│  │  scholarport-frontend.service                          │   │
│  │  • Auto-start on boot                                  │   │
│  │  • Auto-restart on failure                             │   │
│  └──────────────────┬─────────────────────────────────────┘   │
│                     │                                           │
│  ┌──────────────────▼─────────────────────────────────────┐   │
│  │           DOCKER COMPOSE                                │   │
│  │  docker-compose.prod.yml                               │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │    NGINX CONTAINER (Production)                 │  │   │
│  │  │    Image: nginx:alpine                          │  │   │
│  │  │                                                 │  │   │
│  │  │    • Port 80 → HTTP                            │  │   │
│  │  │    • Port 443 → HTTPS (with SSL)              │  │   │
│  │  │    • Gzip Compression                          │  │   │
│  │  │    • Security Headers                          │  │   │
│  │  │    • Rate Limiting                             │  │   │
│  │  │    • Static File Serving                       │  │   │
│  │  │                                                 │  │   │
│  │  │    Files: /usr/share/nginx/html/               │  │   │
│  │  │    ├── public/                                 │  │   │
│  │  │    │   ├── index.html                          │  │   │
│  │  │    │   └── src/                                │  │   │
│  │  │    │       ├── services/api.js                 │  │   │
│  │  │    │       ├── components/                     │  │   │
│  │  │    │       └── main.js                         │  │   │
│  │  │    └── config.js (Environment Config)          │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │    CERTBOT CONTAINER                            │  │   │
│  │  │    Image: certbot/certbot:latest                │  │   │
│  │  │                                                 │  │   │
│  │  │    • SSL Certificate Management                │  │   │
│  │  │    • Auto-renewal (every 12h)                  │  │   │
│  │  │    • Let's Encrypt Integration                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Storage:                                                        │
│  • /home/ubuntu/scholarport-frontend/ (App Directory)          │
│  • /etc/letsencrypt/ (SSL Certificates)                        │
│  • Docker Volumes (Persistent Data)                            │
└──────────────────────────────────────────────────────────────────┘
                         │
                         │ API Calls
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND SERVER                                │
│  http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com    │
│  Endpoint: /api/chat                                            │
│                                                                  │
│  • Django REST Framework                                        │
│  • Chat Conversation API                                        │
│  • University Database                                          │
│  • AI Processing                                                │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### Development Environment (Localhost)

```
User Browser
     ↓
http://localhost:3000
     ↓
Node.js HTTP Server (Port 3000)
     ↓
Static Files (public/index.html)
     ↓
React App Loads
     ↓
config.js detects localhost → Development Mode
     ↓
API calls to: http://127.0.0.1:8000/api/chat
     ↓
Local Backend Server
```

### Production Environment (EC2)

```
User Browser
     ↓
https://your-domain.com or http://43.205.213.103
     ↓
DNS Resolution → EC2 Public IP
     ↓
AWS Security Group (Firewall)
     ↓
EC2 Instance (Port 80/443)
     ↓
Docker Network
     ↓
Nginx Container
     ↓
SSL Termination (if HTTPS)
     ↓
Static Files Served
     ↓
React App Loads in Browser
     ↓
config.js detects production domain → Production Mode
     ↓
API calls to: http://ec2-13-203-155-163.../api/chat
     ↓
Backend EC2 Instance
     ↓
Django API Response
     ↓
University Recommendations
```

## 📦 Component Architecture

### Frontend Stack

```
┌──────────────────────────────────────┐
│     User Interface Layer             │
│  • React 18 (CDN)                    │
│  • Tailwind CSS 3                    │
│  • Lucide Icons                      │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│     Application Layer                │
│  • Router (Hash-based)               │
│  • State Management (React Hooks)    │
│  • Components (Landing, Chat, etc)   │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│     Service Layer                    │
│  • API Client (api.js)               │
│  • Error Handling                    │
│  • Request/Response Interceptors     │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│     Configuration Layer              │
│  • config.js (Environment Detection) │
│  • .env files                        │
│  • API Base URLs                     │
└──────────────────────────────────────┘
```

## 🐳 Docker Architecture

### Multi-Stage Build

```
┌─────────────────────────────────────┐
│  BASE STAGE                         │
│  • Node.js 18 Alpine                │
│  • Install dependencies             │
│  • Copy application files           │
└────────┬────────────────────────────┘
         │
    ┌────▼──────────────┬──────────────┐
    │                   │              │
┌───▼──────────────┐ ┌─▼──────────────▼──┐
│ DEVELOPMENT      │ │ PRODUCTION        │
│ • Node.js        │ │ • Nginx Alpine    │
│ • http-server    │ │ • Static files    │
│ • Hot reload     │ │ • SSL ready       │
│ • Port 3000      │ │ • Ports 80/443    │
└──────────────────┘ └───────────────────┘
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: Network Security              │
│  • AWS Security Groups                  │
│  • Firewall Rules                       │
│  • IP Whitelisting (SSH)                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 2: SSL/TLS                       │
│  • HTTPS Encryption                     │
│  • Let's Encrypt Certificates           │
│  • TLS 1.2/1.3                          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 3: Web Server                    │
│  • Nginx Security Headers               │
│  • Rate Limiting                        │
│  • DDoS Protection                      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 4: Application                   │
│  • CORS Configuration                   │
│  • Input Validation                     │
│  • API Authentication                   │
└─────────────────────────────────────────┘
```

## 📊 Deployment Pipeline

```
┌────────────────────────────────────────────────────────────┐
│  DEVELOPMENT CYCLE                                         │
└────────────────────────────────────────────────────────────┘

Local Development
     │
     ├─→ Edit Code (VSCode)
     │
     ├─→ Test Locally (npm start)
     │        http://localhost:3000
     │
     ├─→ Commit Changes (git)
     │        optional but recommended
     │
     └─→ Deploy to Production
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│  DEPLOYMENT PROCESS (update.ps1)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Sync Files to EC2                                       │
│     ├─→ rsync/scp (Windows: scp, Linux: rsync)            │
│     ├─→ Exclude: node_modules, .git, *.pem                │
│     └─→ Include: public/, config.js, docker files         │
│                                                             │
│  2. SSH to EC2                                             │
│     └─→ ssh -i scholorport-frontend.pem ubuntu@...        │
│                                                             │
│  3. Build Docker Image                                     │
│     └─→ docker-compose build --no-cache                   │
│                                                             │
│  4. Start Containers                                       │
│     └─→ docker-compose up -d                              │
│                                                             │
│  5. Show Logs                                              │
│     └─→ docker-compose logs --tail=20                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│  PRODUCTION LIVE                                            │
│  ✓ Application running at http://43.205.213.103            │
│  ✓ Systemd ensures auto-restart                           │
│  ✓ Docker containers are healthy                          │
└─────────────────────────────────────────────────────────────┘

Total Time: ~30 seconds ⚡
```

## 🔄 Data Flow

```
User Action (Browser)
     │
     ├─→ Landing Page Visit
     │       │
     │       └─→ Static HTML served from Nginx
     │               │
     │               └─→ React initializes
     │
     ├─→ Start Chat
     │       │
     │       └─→ POST /api/chat/start/
     │               │
     │               ├─→ Backend creates session
     │               └─→ Returns session_id
     │
     ├─→ Send Message
     │       │
     │       └─→ POST /api/chat/send/
     │               │
     │               ├─→ Backend processes question
     │               ├─→ AI determines next question
     │               └─→ Returns bot_response
     │
     └─→ Get Recommendations
             │
             └─→ GET /api/chat/universities/
                     │
                     ├─→ Backend queries database
                     ├─→ Applies filters
                     └─→ Returns university list
                             │
                             └─→ Frontend displays cards
```

## 🏠 Directory Structure

```
scholarport-frontend/
│
├── 🔧 Configuration
│   ├── config.js              # Environment auto-detection
│   ├── .env.development       # Dev settings
│   ├── .env.production        # Prod settings
│   └── .env.example           # Template
│
├── 🐳 Docker
│   ├── Dockerfile             # Multi-stage build
│   ├── docker-compose.yml     # Main compose (profiles)
│   ├── docker-compose.dev.yml # Development
│   ├── docker-compose.prod.yml# Production
│   └── .dockerignore          # Docker exclusions
│
├── 🌐 Nginx
│   ├── nginx.conf             # Main config
│   └── default.conf           # Server blocks
│
├── 🚀 Deployment Scripts
│   ├── deploy.sh / .ps1       # Full deployment
│   ├── update.sh / .ps1       # Quick update
│   ├── setup-ssl.sh           # SSL automation
│   ├── logs.sh / .ps1         # Log viewer
│   ├── status.sh              # Health check
│   └── scholarport-frontend.service # Systemd
│
├── 📱 Application Code
│   └── public/
│       ├── index.html         # Entry point
│       └── src/
│           ├── services/      # API layer
│           ├── components/    # React components
│           ├── utils/         # Helpers
│           └── main.js        # App logic
│
└── 📚 Documentation
    ├── README.md              # Main docs
    ├── DEPLOYMENT.md          # Deploy guide
    ├── DOCKER.md              # Docker guide
    ├── QUICK-START.md         # Quick ref
    ├── SETUP-SUMMARY.md       # Implementation summary
    ├── CHECKLIST.md           # Task checklist
    ├── COMMANDS.md            # Command reference
    └── ARCHITECTURE.md        # This file
```

## 🎯 Key Design Decisions

### Why Nginx?
- **Performance**: Handles static files efficiently
- **SSL Termination**: Manages certificates
- **Reverse Proxy**: Can proxy to backend if needed
- **Caching**: Built-in static asset caching
- **Production Ready**: Battle-tested and reliable

### Why Docker?
- **Consistency**: Same environment everywhere
- **Isolation**: Contained dependencies
- **Easy Updates**: Simple container replacement
- **Portability**: Run anywhere
- **Scaling**: Easy to replicate

### Why Systemd?
- **Auto-start**: Boots with system
- **Auto-restart**: Recovers from crashes
- **Logging**: Integrated with journald
- **Dependencies**: Waits for Docker
- **Standard**: Native to Ubuntu

### Why Multi-stage Build?
- **Smaller Images**: Production only has needed files
- **Security**: Fewer attack surfaces
- **Efficiency**: Faster deployments
- **Clean Separation**: Dev vs Prod environments

## 📈 Scalability Considerations

### Horizontal Scaling
```
Load Balancer (Future)
     │
     ├─→ EC2 Instance 1 (Frontend)
     ├─→ EC2 Instance 2 (Frontend)
     └─→ EC2 Instance 3 (Frontend)
            │
            └─→ Shared Backend API
```

### Vertical Scaling
- Increase EC2 instance size
- More CPU/RAM for Docker
- Optimize Nginx workers

### CDN Integration (Future)
```
User → CloudFront CDN → EC2 Instance
                │
                └─→ Cache static assets
                    at edge locations
```

## 🔍 Monitoring Points

```
1. Application Level
   └─→ React Error Boundaries
   └─→ API Response Times
   └─→ Browser Console Logs

2. Server Level
   └─→ Nginx Access Logs
   └─→ Nginx Error Logs
   └─→ Docker Container Logs

3. System Level
   └─→ CPU Usage
   └─→ Memory Usage
   └─→ Disk Space
   └─→ Network Traffic

4. Service Level
   └─→ Systemd Status
   └─→ Docker Health Checks
   └─→ Port Accessibility
```

---

This architecture provides:
- ✅ High availability
- ✅ Easy maintenance
- ✅ Quick deployments
- ✅ Security
- ✅ Scalability
- ✅ Monitoring capabilities
