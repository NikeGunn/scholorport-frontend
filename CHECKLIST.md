# Scholarport Frontend - Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## 📋 Pre-Deployment Checklist

### Local Setup
- [ ] Node.js installed (v14 or higher)
- [ ] npm installed and working
- [ ] Git installed (optional but recommended)
- [ ] SSH client available (Windows: OpenSSH, PuTTY, or WSL)

### EC2 Instance
- [ ] EC2 instance is running
- [ ] Instance ID confirmed: `i-098ed04de82cadf82`
- [ ] Public IP noted: `43.205.213.103`
- [ ] Public DNS noted: `ec2-43-205-213-103.ap-south-1.compute.amazonaws.com`

### Security Group
- [ ] Port 22 (SSH) is open to your IP
- [ ] Port 80 (HTTP) is open to 0.0.0.0/0
- [ ] Port 443 (HTTPS) is open to 0.0.0.0/0 (for SSL later)

### PEM File
- [ ] PEM file downloaded: `scholorport-frontend.pem`
- [ ] PEM file placed in project root directory
- [ ] PEM file permissions set (Linux/Mac): `chmod 400 scholorport-frontend.pem`
- [ ] PEM file is in .gitignore (don't commit it!)

### Configuration Files
- [ ] `.env.production` has correct backend URL
- [ ] `config.js` is configured properly
- [ ] Backend API is accessible and running

## 🚀 First Deployment Checklist

### Test Connection
- [ ] SSH connection tested successfully
  ```bash
  ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com "echo 'Success'"
  ```

### Run Deployment
- [ ] Deployment script executed:
  - Windows: `.\scripts\deploy.ps1`
  - Linux/Mac: `./scripts/deploy.sh`

### Verify Deployment
- [ ] Deployment completed without errors
- [ ] Docker containers are running
- [ ] Application accessible via IP: http://43.205.213.103
- [ ] Application accessible via DNS: http://ec2-43-205-213-103...
- [ ] Health check endpoint works: http://43.205.213.103/health

### Test Functionality
- [ ] Landing page loads correctly
- [ ] Chat interface works
- [ ] API calls to backend succeed
- [ ] University recommendations display
- [ ] Mobile view is responsive

## 🔄 Code Update Checklist

### Before Update
- [ ] Changes tested locally: `npm start`
- [ ] No console errors in browser
- [ ] Git commit made (optional but recommended)
- [ ] Backup of current production (optional)

### Run Update
- [ ] Update script executed:
  - Windows: `.\scripts\update.ps1`
  - Linux/Mac: `./scripts/update.sh`

### Verify Update
- [ ] Update completed without errors
- [ ] Containers rebuilt successfully
- [ ] Application still accessible
- [ ] Changes visible in production
- [ ] No new errors in logs

## 🔒 SSL Setup Checklist (Optional)

### Prerequisites
- [ ] Domain name registered
- [ ] DNS A record points to EC2 IP: `43.205.213.103`
- [ ] DNS propagation complete (test with `nslookup yourdomain.com`)
- [ ] Email address for SSL notifications ready

### Run SSL Setup
- [ ] SSH to EC2 server
- [ ] Navigate to app directory: `cd ~/scholarport-frontend`
- [ ] Run SSL setup: `./scripts/setup-ssl.sh`
- [ ] Follow prompts for domain and email

### Verify SSL
- [ ] Certificate obtained successfully
- [ ] HTTPS site loads: `https://yourdomain.com`
- [ ] HTTP redirects to HTTPS
- [ ] Certificate is valid (green padlock)
- [ ] Auto-renewal configured

## 🔧 Systemd Service Checklist

### Setup
- [ ] Service file copied to systemd
- [ ] Service enabled: `sudo systemctl enable scholarport-frontend.service`
- [ ] Service started: `sudo systemctl start scholarport-frontend.service`

### Verify
- [ ] Service status is active: `sudo systemctl status scholarport-frontend.service`
- [ ] Service starts on boot (test with reboot if possible)
- [ ] Service restarts on failure

## 📊 Monitoring Checklist

### Initial Setup
- [ ] Log viewer script tested: `.\scripts\logs.ps1`
- [ ] Status script tested: `.\scripts\status.sh`
- [ ] Docker commands work: `docker ps`, `docker logs`

### Regular Monitoring
- [ ] Check logs daily for errors
- [ ] Monitor disk space: `df -h`
- [ ] Monitor memory usage: `free -h`
- [ ] Check container health: `docker ps`
- [ ] Verify SSL certificate expiry: `sudo certbot certificates`

## 🔐 Security Checklist

### Files and Permissions
- [ ] PEM file not committed to Git
- [ ] PEM file has 400 permissions (Linux/Mac)
- [ ] `.env` files not committed to Git
- [ ] Sensitive data not in code

### Server Security
- [ ] SSH key-based authentication only
- [ ] Security group rules are minimal (only necessary ports)
- [ ] SSL certificate installed (if using domain)
- [ ] Nginx security headers configured
- [ ] Rate limiting enabled

### Application Security
- [ ] CORS configured properly in backend
- [ ] API endpoints validated
- [ ] No sensitive data in client-side code
- [ ] Environment variables used for config

## 📝 Documentation Checklist

- [ ] README.md read and understood
- [ ] DEPLOYMENT.md reviewed for detailed steps
- [ ] DOCKER.md reviewed for Docker commands
- [ ] QUICK-START.md bookmarked for reference
- [ ] SETUP-SUMMARY.md reviewed for overview

## 🆘 Troubleshooting Checklist

### If Application Won't Load
- [ ] Check EC2 instance is running
- [ ] Verify security group rules
- [ ] Check Docker containers: `docker ps`
- [ ] View logs: `.\scripts\logs.ps1`
- [ ] Test backend API separately

### If Deployment Fails
- [ ] Verify SSH connection works
- [ ] Check PEM file location and permissions
- [ ] Ensure EC2 has enough disk space: `df -h`
- [ ] Check Docker is running: `sudo systemctl status docker`
- [ ] Review error messages carefully

### If Update Fails
- [ ] Check if changes break the build locally
- [ ] Verify Docker has enough resources
- [ ] Try full deployment instead: `.\scripts\deploy.ps1`
- [ ] Check logs for specific errors

### If SSL Fails
- [ ] Verify DNS points to correct IP
- [ ] Check port 80 is accessible
- [ ] Ensure domain is propagated: `nslookup yourdomain.com`
- [ ] Try manual certbot command
- [ ] Check certbot logs: `/var/log/letsencrypt/`

## ✅ Post-Deployment Tasks

### Immediate
- [ ] Test all functionality thoroughly
- [ ] Monitor logs for first hour
- [ ] Verify backend integration works
- [ ] Test on multiple devices (desktop, mobile, tablet)
- [ ] Test on multiple browsers

### Within 24 Hours
- [ ] Setup monitoring/alerting (optional)
- [ ] Configure backup strategy (optional)
- [ ] Document any issues encountered
- [ ] Share access with team members

### Within 1 Week
- [ ] Setup SSL if not done yet
- [ ] Configure custom domain if available
- [ ] Optimize performance if needed
- [ ] Setup CI/CD pipeline (optional)

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Application loads at IP address
- ✅ All features work as expected
- ✅ API integration is functioning
- ✅ Logs show no critical errors
- ✅ Update script works for code changes
- ✅ Docker containers restart automatically
- ✅ Application survives server reboot
- ✅ SSL is configured (if using domain)

## 📞 Support Resources

If you get stuck:

1. **Check Documentation**:
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed guide
   - [QUICK-START.md](./QUICK-START.md) - Quick reference
   - [DOCKER.md](./DOCKER.md) - Docker help

2. **Check Logs**:
   ```bash
   .\scripts\logs.ps1
   ```

3. **Check Status**:
   ```bash
   .\scripts\status.sh
   ```

4. **Test Connection**:
   ```bash
   ssh -i scholorport-frontend.pem ubuntu@ec2-43-205-213-103.ap-south-1.compute.amazonaws.com
   ```

## 🎉 Completion

When all items are checked:

- [ ] **First deployment completed successfully** ✓
- [ ] **Application is live and accessible** ✓
- [ ] **Monitoring is in place** ✓
- [ ] **Team is informed** ✓
- [ ] **Documentation is accessible** ✓

Congratulations! Your Scholarport Frontend is now live! 🚀

---

**Checklist Version**: 1.0.0
**Last Updated**: October 2025
