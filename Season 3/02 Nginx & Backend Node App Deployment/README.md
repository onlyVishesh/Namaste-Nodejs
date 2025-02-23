<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 02 Nginx & Backend Node App Deployment</span> 🚀
</h1>

## 📌 Quick Links

[![Frontend Repo](https://img.shields.io/badge/Frontend-Repository-green)](https://github.com/onlyVishesh/DevRoot-Frontend)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-blue)](https://github.com/onlyVishesh/DevRoot-Backend)

## 📑 Table of Contents

## 🎯 Overview

This guide outlines the process of deploying the DevRoot backend on AWS EC2 and configuring Nginx as a reverse proxy.

### Key Components:

- **AWS EC2**: Cloud server hosting
- **PM2**: Process manager for Node.js
- **Nginx**: Reverse proxy server
- **MongoDB Atlas**: Database service

## ✅ Deployment Steps

### 1. Backend Setup on EC2

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Clone and install dependencies
git clone https://github.com/onlyVishesh/DevRoot-Backend.git
cd DevRoot-Backend
npm install
```

### 2. MongoDB Atlas Configuration

1. Open MongoDB Atlas Dashboard
2. Navigate to Network Access
3. Add EC2 IP to allowlist:
   ```
   Description: AWS EC2 Instance
   IP Address: YOUR_EC2_IP
   ```

### 3. Process Management with PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start npm --name "DevRoot-Backend" -- start

# Useful PM2 commands
pm2 status              # Check process status
pm2 logs               # View application logs
pm2 restart all        # Restart all applications
pm2 save               # Save process list
```

### 4. Nginx Reverse Proxy Setup

```nginx
# /etc/nginx/sites-available/default
server {
    listen 80;
    server_name your_domain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}
```

### 5. Security Configuration

```bash
# AWS Security Group Configuration
- Type: Custom TCP
- Port: 3000
- Source: Your frontend server IP

# Nginx SSL Configuration (Optional)
sudo certbot --nginx -d your_domain.com
```

## 🛠️ Command Reference

### SSH Connection

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Backend Management

```bash
# Start backend
npm start

# PM2 Commands
pm2 start npm -- start
pm2 logs
pm2 list
pm2 delete npm
```

### Nginx Management

```bash
# Edit configuration
sudo nano /etc/nginx/sites-available/default

# Test configuration
sudo nginx -t

# Restart service
sudo systemctl restart nginx
```

## 🔍 Deployment Verification

### 1. Backend Health Check

```bash
# Check Node.js service
curl http://localhost:3000/api/health

# Check PM2 processes
pm2 list
```

### 2. Nginx Verification

```bash
# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

## 🎯 Next Steps

### Security Enhancements

- [ ] Implement SSL/TLS certification
- [ ] Set up AWS WAF rules
- [ ] Configure rate limiting

### Performance Optimization

- [ ] Implement caching strategy
- [ ] Set up CDN integration
- [ ] Configure load balancing

### Monitoring

- [ ] Set up AWS CloudWatch
- [ ] Implement error tracking
- [ ] Configure performance monitoring

## ❗ Troubleshooting

### Common Issues

1. **Connection Refused**

   ```bash
   # Check if backend is running
   pm2 list
   # Check port availability
   sudo lsof -i :3000
   ```

2. **Nginx 502 Bad Gateway**

   ```bash
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   # Verify backend service
   pm2 logs
   ```

3. **MongoDB Connection Issues**
   ```bash
   # Verify MongoDB URI
   # Check Network Access settings in Atlas
   # Verify IP whitelist
   ```

## 🔥 Conclusion

The DevRoot Backend is now successfully deployed on AWS EC2 with:

- ✅ Continuous operation via PM2
- ✅ Reverse proxy through Nginx
- ✅ Secure database connection
- ✅ API endpoint accessibility

---

If you found this guide helpful, please ⭐ star the repository!
