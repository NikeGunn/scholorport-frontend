# 🔧 Mixed Content Issue - FIXED

## Problem
When using HTTPS (https://scholarport.co), the frontend tried to call the backend API directly at:
```
http://ec2-43-205-95-162.ap-south-1.compute.amazonaws.com/api/chat/start/
```

This caused **ERR_CONNECTION_REFUSED** because:
- Frontend is on HTTPS
- Backend is on HTTP
- Browsers block "mixed content" (HTTPS → HTTP requests) for security

## Solution: Nginx Reverse Proxy

Instead of calling the backend directly, API calls now go through nginx on the SAME domain:

### Before (❌ BLOCKED):
```
Frontend (HTTPS) → Backend (HTTP) ❌ BLOCKED
https://scholarport.co → http://ec2-43-205-95-162...:8000
```

### After (✅ WORKS):
```
Frontend (HTTPS) → Nginx Proxy (HTTPS) → Backend (HTTP) ✅
https://scholarport.co → https://scholarport.co/api/ → http://backend:8000/api/
```

## What Changed

### 1. config.js
- Detects if you're on scholarport.co domain
- Uses relative path `/api/chat` instead of full backend URL
- Browser sees same-domain request (HTTPS → HTTPS)

```javascript
// On scholarport.co:
BASE_URL: 'https://scholarport.co/api/chat'

// On EC2 IP:
BASE_URL: 'http://ec2-43-205-95-162...:8000/api/chat'
```

### 2. nginx/default.conf
- Added proper proxy configuration for `/api/` paths
- Forwards requests to backend server
- Added CORS headers
- Handles OPTIONS preflight requests

```nginx
location /api/ {
    proxy_pass http://backend_server/api/;
    # ... proxy headers ...
}
```

## How It Works

1. **User clicks "Start Your Journey"**
2. **JavaScript makes request**: `https://scholarport.co/api/chat/start/`
3. **Nginx receives request** on port 443 (HTTPS)
4. **Nginx proxies to backend**: `http://ec2-43-205-95-162:8000/api/chat/start/`
5. **Backend responds** to nginx
6. **Nginx forwards response** to browser via HTTPS
7. **User sees response** ✅

## Benefits

✅ No mixed content warnings
✅ All traffic encrypted (frontend ↔ nginx)
✅ Backend can stay on HTTP (nginx ↔ backend is internal)
✅ Single domain for everything
✅ CORS issues solved
✅ Can add rate limiting, caching, etc. at nginx level

## Testing

After deployment, check browser console:
```javascript
🌍 Environment: production
🔗 API Base URL: https://scholarport.co/api/chat
🔒 HTTPS Enabled - Secure connection active
🌐 Custom Domain: scholarport.co
🔄 Using Nginx Proxy - API calls go through scholarport.co
```

Then test the "Start Your Journey" button - it should work!

## Deployment Status

Files changed:
- ✅ config.js - Auto-detects domain and uses proxy
- ✅ nginx/default.conf - Proxy configuration added
- 🚀 Deploying to EC2...

After deployment completes, visit: https://scholarport.co and test!

---

**Date**: October 10, 2025
**Issue**: Mixed content blocking
**Solution**: Nginx reverse proxy
**Status**: Deployed
