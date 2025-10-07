# 🚨 CRITICAL FIX: Data Saving to OLD Backend

## Problem Identified

Your data is being saved to the **OLD backend** instead of the **NEW backend**:

- ❌ **OLD Backend** (where data is currently going):
  - IP: `13.203.155.163`
  - DNS: `ec2-13-203-155-163.ap-south-1.compute.amazonaws.com`

- ✅ **NEW Backend** (where data should go):
  - IP: `43.205.95.162`
  - DNS: `ec2-43-205-95-162.ap-south-1.compute.amazonaws.com`

## Root Cause

The issue is most likely **browser cache** - your browser is caching the old `config.js` file with the old backend URL, even though the server has the updated file.

## Fixes Applied

### 1. ✅ Added Cache Busting
- Updated `index.html` to load config with version parameter: `config.js?v=2025-10-07`
- This forces browsers to load the new version

### 2. ✅ Added Backend Detection
- Config.js now detects and alerts if OLD backend is being used
- Browser console will show:
  - ✅ Green message if using NEW backend (43.205.95.162)
  - 🚨 Red alert if using OLD backend (13.203.155.163)

### 3. ✅ Created Diagnostic Tool
- New page: `http://13.232.108.169/diagnostic.html`
- Shows which backend is being used
- Test connection button to verify
- Clear instructions for fixing cache issues

## Deployment

Deploy the fixes now:

```powershell
.\scripts\update.ps1
```

## Testing

### Step 1: Clear Browser Cache

**CRITICAL**: You must clear browser cache first!

**Option A: Hard Refresh**
```
Press: Ctrl + Shift + R (Windows)
or: Cmd + Shift + R (Mac)
```

**Option B: Clear All Cache**
```
Press: Ctrl + Shift + Delete
Select "Cached images and files"
Click "Clear data"
```

**Option C: Use Incognito/Private Mode**
```
Open a new Incognito/Private window
This bypasses all cache
```

### Step 2: Open Diagnostic Page

```
http://13.232.108.169/diagnostic.html
```

This page will show you:
- ✅ Which backend is currently configured
- ✅ Whether it's the OLD or NEW backend
- ✅ Test backend connection
- ✅ Instructions to fix if wrong

### Step 3: Check Main Application

```
http://13.232.108.169
```

1. Press **F12** (DevTools)
2. Go to **Console** tab
3. Look for:

**✅ If you see this** = Using NEW backend (CORRECT):
```
✅ Using CORRECT NEW backend: 43.205.95.162
🌍 Environment: production
🔗 API Base URL: http://ec2-43-205-95-162.ap-south-1.compute.amazonaws.com/api/chat
```

**❌ If you see this** = Using OLD backend (WRONG - cache issue):
```
⚠️ WARNING: USING OLD BACKEND! Config not updated!
```

### Step 4: Test Chat Flow

1. Start a new chat
2. Complete the conversation
3. Accept consent to save data
4. Check **NEW backend** admin panel at:
   - `http://ec2-43-205-95-162.ap-south-1.compute.amazonaws.com/admin`

The data should now appear in the NEW backend!

## Why This Happened

1. **Config was correct** on the server ✅
2. **Browser cached old config** from previous deployment ❌
3. **Browser kept using OLD backend URL** ❌
4. **Data saved to OLD backend** ❌

## Why This Fix Works

1. **Cache busting parameter** (`?v=2025-10-07`) forces browser to load new config
2. **Detection alerts** make it obvious if wrong backend is used
3. **Diagnostic page** provides clear verification
4. **After cache clear**, browser will use NEW backend

## Verification Checklist

After deploying and clearing cache:

- [ ] Diagnostic page shows: "✅ Using CORRECT NEW backend"
- [ ] Browser console shows: "43-205-95-162" in API URL
- [ ] No red warning about old backend
- [ ] Chat completes successfully
- [ ] Consent saves data
- [ ] **NEW backend admin panel** shows the record
- [ ] **OLD backend admin panel** does NOT show new records

## If Still Not Working

### Check 1: Verify Config on Server
```powershell
ssh -i "scholarport-frontend.pem" ubuntu@ec2-13-232-108-169.ap-south-1.compute.amazonaws.com
docker exec scholarport-frontend-prod cat /usr/share/nginx/html/config.js | grep "BASE_URL"
```

Should show: `43-205-95-162` NOT `13-203-155-163`

### Check 2: Verify Browser is Loading New Config
1. Open: `http://13.232.108.169/config.js?v=2025-10-07`
2. Search for "BASE_URL"
3. Should show: `43-205-95-162`

### Check 3: Check Network Tab
1. Open DevTools → Network tab
2. Reload page (Ctrl+Shift+R)
3. Look for `config.js` request
4. Click on it
5. Check "Response" tab
6. Should show `43-205-95-162`

### Check 4: Disable Service Worker (if any)
1. DevTools → Application tab
2. Service Workers section
3. Click "Unregister" if any exist
4. Reload page

## Backend CORS Update

Don't forget to update your **NEW backend** CORS settings:

```python
# On ec2-43-205-95-162
# settings.py

CORS_ALLOWED_ORIGINS = [
    'http://13.232.108.169',
    'http://ec2-13-232-108-169.ap-south-1.compute.amazonaws.com',
]
```

## Summary

- ✅ Config files updated with NEW backend
- ✅ Cache busting added
- ✅ Detection alerts added
- ✅ Diagnostic page created
- 🚀 **Deploy now**: `.\scripts\update.ps1`
- 🧹 **Clear browser cache** after deployment
- 🔍 **Use diagnostic page** to verify: `http://13.232.108.169/diagnostic.html`

The data will now save to the **NEW backend** (43.205.95.162)! 🎉
