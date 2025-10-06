# Backend CORS Configuration Fix Guide

## 🎉 Good News: Frontend is Working!

Your frontend is successfully deployed at:
- **http://43.205.213.103**
- **http://ec2-43-205-213-103.ap-south-1.compute.amazonaws.com**

## ❌ Current Issue: CORS Error

The backend is blocking requests from your frontend.

**Error**: `Access to fetch at 'http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/api/chat/start/' from origin 'http://ec2-43-205-213-103.ap-south-1.compute.amazonaws.com' has been blocked by CORS policy`

---

## 🛠️ Quick Fix (Choose One Method)

### Method 1: Update Django Settings (Recommended)

**Step 1**: SSH to your backend server
```bash
ssh -i your-backend-key.pem ubuntu@ec2-13-203-155-163.ap-south-1.compute.amazonaws.com
```

**Step 2**: Install django-cors-headers
```bash
pip install django-cors-headers
```

**Step 3**: Edit `settings.py` and add:

```python
# Add to INSTALLED_APPS
INSTALLED_APPS = [
    ...
    'corsheaders',
]

# Add to MIDDLEWARE (MUST be before CommonMiddleware)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

# Add CORS configuration
CORS_ALLOWED_ORIGINS = [
    'http://43.205.213.103',
    'http://ec2-43-205-213-103.ap-south-1.compute.amazonaws.com',
]

# Also update ALLOWED_HOSTS
ALLOWED_HOSTS = [
    'ec2-13-203-155-163.ap-south-1.compute.amazonaws.com',
    '13.203.155.163',
    'localhost',
]
```

**Step 4**: Restart your backend
```bash
sudo systemctl restart your-service
# OR if using Docker:
sudo docker-compose restart
```

---

### Method 2: Temporary Testing (Quick Test)

Just to confirm everything else works, temporarily allow all origins:

```python
# In settings.py
CORS_ALLOW_ALL_ORIGINS = True  # ONLY FOR TESTING!
```

Then restart backend and test. If it works, replace with Method 1's specific origins.

---

## ✅ Verify It Works

After fixing, test with:
```bash
curl -I -X OPTIONS \
  -H "Origin: http://43.205.213.103" \
  http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/api/chat/start/
```

Should see:
```
Access-Control-Allow-Origin: http://43.205.213.103
```

---

## 🎯 Summary

Your **frontend deployment is complete and working**. You just need to configure the **backend** to accept requests from your frontend's domain.

Once CORS is fixed:
1. ✅ Frontend loads correctly
2. ✅ API calls work
3. ✅ Chat functionality works
4. ✅ Application is fully functional!

**Next**: Fix backend CORS → Test application → Setup SSL (optional)
