# 🚀 Getting Started with Scholarport Frontend

**Complete guide for absolute beginners to deploy your application in under 10 minutes!**

## ✨ What You'll Accomplish

By the end of this guide, you will have:
- ✅ Your application running on AWS EC2
- ✅ Accessible via public IP address
- ✅ Ability to update code in 30 seconds
- ✅ Understanding of basic operations

**Time Required:** 10-15 minutes
**Difficulty:** Beginner-friendly
**Prerequisites:** Windows PC, Internet connection

---

## 📦 What You Need

### 1. Files You Should Have

In your project folder, you should see:
- `scholorport-frontend.pem` ← Your EC2 key file (you downloaded this)
- `scripts/` folder ← Contains deployment scripts
- `public/` folder ← Your application code
- `package.json` ← Project configuration

### 2. Software Requirements

**Already Installed (most likely):**
- Windows 10/11
- PowerShell (built into Windows)
- SSH client (built into Windows 10/11)

**Need to Install:**
- Node.js (if not installed): https://nodejs.org/
  - Download and run the installer
  - Choose all default options
  - Verify: Open PowerShell and type `node --version`

---

## 🎯 Step-by-Step Deployment

### Step 1: Prepare Your PEM File (2 minutes)

**What is a PEM file?**
It's your digital key to access your EC2 server - like a password, but more secure.

**What to do:**

1. **Find your PEM file**
   - Look for: `scholorport-frontend.pem`
   - It might be in your Downloads folder

2. **Move it to your project folder**
   ```
   📁 scholarport-frontend/
      └── 📄 scholorport-frontend.pem  ← Put it here!
   ```

3. **IMPORTANT:** Don't share this file with anyone!

### Step 2: Open PowerShell (1 minute)

1. **Navigate to your project folder:**
   - Open File Explorer
   - Go to your `scholarport-frontend` folder
   - Hold `Shift` and right-click in the folder
   - Select "Open PowerShell window here"

2. **Verify you're in the right place:**
   ```powershell
   pwd
   ```
   Should show something like: `C:\Users\YourName\...\scholarport-frontend`

### Step 3: Test Your Connection (1 minute)

**Let's make sure you can connect to your server:**

```powershell
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "echo 'Connection successful!'"
```

**What you should see:**
- First time: A message asking "Are you sure you want to continue connecting?"
  - Type: `yes` and press Enter
- Then: "Connection successful!"

**If you see an error:**
- Check that the PEM file is in the current folder
- Make sure you're connected to the internet
- Verify your EC2 instance is running (check AWS Console)

### Step 4: Deploy! (5 minutes)

**Now for the magic moment:**

```powershell
cd scripts
.\deploy.ps1
```

**What will happen:**
1. Script checks your connection ✓
2. Uploads your files to EC2 📤
3. Installs Docker on the server 🐳
4. Builds your application 🔨
5. Starts your application 🚀

**You'll see lots of text scrolling by - this is normal!**

Look for these success messages:
- "✓ SSH connection successful"
- "✓ Files synced successfully"
- "✓ Dependencies installed"
- "✓ Application started successfully"
- "✓ Deployment completed successfully!"

**Total time:** About 5 minutes

### Step 5: Access Your Application! (30 seconds)

**Your application is now live!**

Open your web browser and go to:
- http://43.205.213.103

OR

- http://ec2-43-205-213-103.ap-south-1.compute.amazonaws.com

**You should see:** Your Scholarport landing page! 🎉

---

## 🔄 How to Update Your Code

**Made some changes? Here's how to update production:**

### Quick Update (30 seconds)

1. **Save your changes locally**

2. **Run the update script:**
   ```powershell
   cd scripts
   .\update.ps1
   ```

3. **Wait for completion**
   - You'll see: "✓ Update completed successfully!"

4. **Refresh your browser**
   - Your changes are live!

**That's it! No complex steps.**

---

## 📊 Viewing Logs

**Want to see what's happening on your server?**

```powershell
cd scripts
.\logs.ps1
```

**What you'll see:**
- Application activity
- Any errors (if they occur)
- Real-time updates

**To exit:** Press `Ctrl + C`

---

## 🆘 Common Issues & Solutions

### Issue 1: "Permission denied" for PEM file

**Solution:** The PEM file isn't in the right location.

```powershell
# Check if file exists
ls scholorport-frontend.pem
```

If you see an error, move the PEM file to your project folder.

### Issue 2: "Connection refused"

**Possible causes:**
1. **EC2 instance is stopped**
   - Go to AWS Console
   - Start your instance

2. **Wrong PEM file**
   - Make sure you're using `scholorport-frontend.pem`

3. **Firewall/VPN**
   - Try disabling VPN temporarily
   - Check your firewall settings

### Issue 3: Application doesn't load in browser

**Check these:**

1. **EC2 Security Group:**
   - Log into AWS Console
   - Find your instance
   - Check Security Group
   - Ensure Port 80 is open to 0.0.0.0/0

2. **Docker containers running:**
   ```powershell
   ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "docker ps"
   ```
   Should show running containers.

3. **View logs for errors:**
   ```powershell
   .\scripts\logs.ps1
   ```

### Issue 4: Update script fails

**Solution:** Try full deployment instead:

```powershell
.\deploy.ps1
```

---

## 💡 Important Tips

### DO's ✅
- ✅ Keep your PEM file safe
- ✅ Test changes locally first (`npm start`)
- ✅ Use update script for quick changes
- ✅ Check logs if something seems wrong
- ✅ Bookmark your application URL

### DON'Ts ❌
- ❌ Don't commit PEM file to Git
- ❌ Don't share your PEM file
- ❌ Don't edit files directly on the server
- ❌ Don't delete the Docker containers manually
- ❌ Don't panic - everything is recoverable!

---

## 🎓 What You've Learned

Congratulations! You now know how to:
- ✅ Deploy an application to AWS EC2
- ✅ Update code in production
- ✅ View application logs
- ✅ Troubleshoot basic issues

---

## 🚀 Next Steps

### Level Up Your Skills

1. **Setup SSL (HTTPS):**
   - Buy a domain name
   - Follow: [DEPLOYMENT.md](./DEPLOYMENT.md) → SSL Setup

2. **Learn Docker basics:**
   - Read: [DOCKER.md](./DOCKER.md)

3. **Understand the architecture:**
   - Read: [ARCHITECTURE.md](./ARCHITECTURE.md)

### Daily Workflow

Your typical day will look like:

**Morning:**
```powershell
# Check if everything is running
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "docker ps"
```

**During development:**
```bash
npm start                    # Test locally
# Make changes
# Test again
```

**Deployment:**
```powershell
.\scripts\update.ps1         # Push to production
```

**That's it!** 🎉

---

## 📞 Need More Help?

### Documentation
- [📖 INDEX.md](./INDEX.md) - Complete documentation guide
- [⚡ QUICK-START.md](./QUICK-START.md) - Quick reference
- [🚀 DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide

### Quick Commands

```powershell
# Deploy for first time
.\scripts\deploy.ps1

# Update code
.\scripts\update.ps1

# View logs
.\scripts\logs.ps1

# Connect to server
ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
```

---

## ✅ Checklist - Am I Done?

Before you celebrate, verify:

- [ ] I can access my app at: http://43.205.213.103
- [ ] The landing page loads correctly
- [ ] I can click "Start Your Journey" and see the chat
- [ ] I made a small change and ran `.\scripts\update.ps1`
- [ ] My change appeared on the production site
- [ ] I know how to view logs: `.\scripts\logs.ps1`
- [ ] I've bookmarked my application URL
- [ ] My PEM file is safe and not in Git

**All checked?** Congratulations! You're now a deployment pro! 🎉

---

## 🎊 You Did It!

Your application is:
- ✅ **Live** on the internet
- ✅ **Accessible** from anywhere
- ✅ **Easy to update** (30 seconds!)
- ✅ **Professional** production setup

Share your success! Show your team your live URL:
- http://43.205.213.103

---

**Need help?** Check [INDEX.md](./INDEX.md) for complete documentation.

**Happy coding!** 🚀

---

**Document Version:** 1.0.0
**Difficulty:** Beginner
**Last Updated:** October 2025
