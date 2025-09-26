# Scholarport Frontend - React + CDN Version

A modern, responsive chatbot interface for Scholarport's AI-powered university recommendation system. Built with React (CDN), Tailwind CSS, and optimized for mobile-first experience.

## 🚀 Quick Start

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

### Method 3: Node.js HTTP Server
```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Navigate to project directory and start server
cd scholarport-frontend
http-server -p 8000

# Open browser to http://localhost:8000
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

## 🔧 Backend Integration

The frontend is designed to integrate with the Django backend API. Update the API base URL in `src/services/api.ts`:

```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api/chat';
```

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

## 🔄 Future Enhancements

### Phase 2 Features
- [ ] Real API integration with Django backend
- [ ] Data consent form with GDPR compliance
- [ ] Enhanced guided suggestions
- [ ] AI processing feedback display
- [ ] University filtering and search
- [ ] Application tracking
- [ ] Multi-language support

### Technical Improvements
- [ ] Bundle optimization
- [ ] Service worker for offline support
- [ ] Advanced error handling
- [ ] Analytics integration
- [ ] SEO optimization

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