# Scholarport Frontend

A modern, responsive chatbot interface for Scholarport's AI-powered university recommendation system. Built with React (CDN), Tailwind CSS, and optimized for mobile-first experience. Fully dockerized with production-ready deployment scripts.

## 🎉 NEW: Complete Deployment System

**Your app is now production-ready with one-command deployment!**

### Quick Deploy (5 minutes)
```powershell
# Windows
.\scripts\deploy.ps1

# Linux/Mac
./scripts/deploy.sh
```

### Quick Update (30 seconds)
```powershell
# After making code changes
.\scripts\update.ps1    # Windows
./scripts/update.sh     # Linux/Mac
```

**That's it!** Your changes are live! ✨

## 📚 Documentation

- **[🎓 Getting Started](./GETTING-STARTED.md)** ⭐ **START HERE** - Beginner's guide
- **[📖 Documentation Index](./INDEX.md)** - Complete documentation guide
- **[⚡ Quick Start](./QUICK-START.md)** - Daily reference (most used!)
- **[🚀 Deployment Guide](./DEPLOYMENT.md)** - Complete deployment instructions
- **[🐳 Docker Guide](./DOCKER.md)** - Docker usage and troubleshooting
- **[🏗️ Architecture](./ARCHITECTURE.md)** - System architecture overview
- **[💻 Commands](./COMMANDS.md)** - Command reference cheat sheet
- **[✅ Checklist](./CHECKLIST.md)** - Deployment verification checklist
- **[📋 Implementation Complete](./IMPLEMENTATION-COMPLETE.md)** - What was built

**Total Documentation: 26,000+ words covering everything you need!**

## 🚀 Quick Start

### Local Development (Without Docker)

Since this project uses CDN imports instead of npm packages to avoid installation issues, you can run it directly in any modern browser.

### Method 1: Live Server (Recommended)
1. Install a simple HTTP server like Live Server in VS Code
2. Right-click on `index.html` and select "Open with Live Server"
3. The application will open in your browser at `http://127.0.0.1:5500`

### Method 2: Python HTTP Server
```bash
# Navigate to the project directory
cd scholarport-frontend

# Start Python HTTP server (Python 3)
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Open browser to http://localhost:8000
```

### Method 3: Node.js HTTP Server (Recommended for Development)
```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
```

### Method 4: Docker (For Production-like Environment)
```bash
# Start development container
npm run docker:dev

# Or with rebuild
npm run docker:dev:build

# Access at http://localhost:3000
```

## 🚢 Production Deployment

### Quick Deploy to EC2

**Windows:**
```powershell
# Run deployment script
npm run deploy:win
```

**Linux/Mac:**
```bash
# Run deployment script
npm run deploy
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Docker Production Mode
```bash
# Build and start production containers
npm run docker:prod:build

# View logs
npm run docker:logs

# Access at http://localhost
```

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide for EC2
- **[DOCKER.md](./DOCKER.md)** - Docker usage and troubleshooting

## 🔧 Environment Configuration

The application automatically detects the environment:

- **Development** (localhost): Uses `http://127.0.0.1:8000/api/chat`
- **Production** (EC2/domain): Uses production backend URL

Configuration files:
- `config.js` - Main configuration (auto-detection)
- `.env.development` - Local development settings
- `.env.production` - Production settings

Update backend URL in `.env.production`:
```env
API_BASE_URL=http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/api/chat
```

## 📁 Project Structure

```
scholarport-frontend/
├── index.html                 # Main HTML file with CDN imports
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.js      # Reusable button component
│   │   │   ├── Header.js      # App header with navigation
│   │   │   ├── Footer.js      # App footer
│   │   │   └── Components.js  # Loading, Toast, Modal components
│   │   ├── chat/              # Chat-specific components
│   │   ├── landing/           # Landing page components
│   │   └── consent/           # Data consent components
│   ├── services/
│   │   └── api.ts             # API service layer for Django backend
│   ├── types/                 # TypeScript type definitions
│   ├── utils/
│   │   └── helpers.ts         # Utility functions
│   └── main.js                # Main React application
└── README.md
```

## 🎯 Features Implemented

### ✅ Core Features
- **Landing Page**: Hero section with call-to-action
- **Chat Interface**: 7-question conversation flow
- **University Display**: Beautiful card-based recommendations
- **Progress Tracking**: Visual progress bar
- **Responsive Design**: Mobile-first approach
- **Hash Routing**: Simple client-side navigation

### ✅ UI Components
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Header**: Navigation with back button support
- **Footer**: Company info and links
- **Loading States**: Spinner and typing indicators
- **Progress Bar**: Step tracking visualization
- **University Cards**: Rich display of recommendations

### ✅ Chat Flow (7 Questions)
1. Name collection
2. Education level
3. Test scores (IELTS/TOEFL)
4. Budget preferences
5. Country preferences
6. Email address
7. Phone number

## 🎨 Design System

### Colors
- **Primary**: #0066CC (Scholarport Blue)
- **Secondary**: #0EA5E9 (Light Blue)
- **Success**: #00B050 (Green)
- **Warning**: #FF9500 (Orange)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Animations
- Fade in effects for messages
- Slide up animations for elements
- Hover lift effects for interactive elements
- Typing indicator with animated dots

## � Available Scripts

```bash
# Development
npm start              # Start development server (port 3000)
npm run dev           # Same as start

# Docker Development
npm run docker:dev          # Start dev container
npm run docker:dev:build    # Build and start dev container

# Docker Production
npm run docker:prod         # Start production container
npm run docker:prod:build   # Build and start production

# Deployment
npm run deploy        # Deploy to EC2 (Linux/Mac)
npm run deploy:win    # Deploy to EC2 (Windows)
npm run update        # Quick update to production (Linux/Mac)
npm run update:win    # Quick update to production (Windows)

# Docker Management
npm run docker:stop   # Stop all containers
npm run docker:logs   # View container logs
```

## 🔧 Backend Integration

The frontend integrates with the Django backend API. Configuration is automatic based on environment:

- **Development**: `http://127.0.0.1:8000/api/chat`
- **Production**: `http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/api/chat`

### API Endpoints Used
- `POST /start/` - Initialize conversation
- `POST /send/` - Send message in conversation
- `POST /consent/` - Handle data consent
- `GET /universities/` - Get university listings
- `GET /health/` - Health check

## 📱 Mobile Optimization

The application is built mobile-first with responsive breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interface
- Optimized chat input
- Responsive university cards
- Mobile navigation patterns

## 🚦 Testing

### Manual Testing Checklist
1. **Landing Page**
   - [ ] Hero section displays correctly
   - [ ] Statistics cards are responsive
   - [ ] "Start Your Journey" button navigates to chat

2. **Chat Interface**
   - [ ] Welcome messages appear
   - [ ] 7-question flow works properly
   - [ ] Progress bar updates correctly
   - [ ] University recommendations display
   - [ ] Mobile interface is usable

3. **Navigation**
   - [ ] Hash routing works (/#home, /#chat)
   - [ ] Back button returns to home
   - [ ] Browser back/forward buttons work

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🏗️ Technology Stack

- **Frontend Framework**: React 18 (CDN)
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide Icons
- **HTTP Server**: Node.js http-server (dev) / Nginx (prod)
- **Container**: Docker + Docker Compose
- **Web Server**: Nginx with SSL support
- **SSL**: Let's Encrypt (Certbot)
- **Deployment**: AWS EC2 + Systemd

## 🔄 Development Workflow

1. **Local Development**
   ```bash
   npm start
   ```

2. **Make Changes** to files in `public/` or `src/`

3. **Test Locally** - Changes reflect immediately

4. **Quick Update to Production**
   ```bash
   npm run update:win   # Windows
   # or
   npm run update       # Linux/Mac
   ```

That's it! Your changes are live in ~30 seconds.

## 🔄 Future Enhancements

### Phase 2 Features
- [ ] Enhanced guided suggestions
- [ ] AI processing feedback display
- [ ] Advanced university filtering
- [ ] Application tracking
- [ ] Multi-language support
- [ ] User dashboard

### Technical Improvements
- [ ] Bundle optimization
- [ ] Service worker for offline support
- [ ] Advanced error handling
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Automated testing

## 🛠️ Development Notes

### Why CDN Approach?
- Avoids npm installation issues
- Quick setup and testing
- Easy deployment to any static host
- No build process required
- Perfect for prototyping and demos

### Converting to Bundled Version
To convert this to a standard React project with bundling:
1. Initialize npm project: `npm init -y`
2. Install dependencies: `npm install react react-dom`
3. Add build tools: `npm install -D vite @vitejs/plugin-react`
4. Convert components to JSX format
5. Set up proper module imports/exports

## 📞 Support

For technical support or questions:
- Check browser console for any errors
- Ensure all JavaScript files are loading correctly
- Verify that the Django backend is running (if testing API integration)
- Test in different browsers for compatibility

## 📄 License

© 2025 Scholarport Ltd. All rights reserved.