<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 01 Launching a AWS Instance and Deploying Frontend</span> 🚀
</h1>

## 📑 Table of Contents

- [📑 Table of Contents](#-table-of-contents)
- [🎯 Overview](#-overview)
- [⚡ Prerequisites](#-prerequisites)
- [🔑 Key Concepts](#-key-concepts)
  - [SSH (Secure Shell)](#ssh-secure-shell)
  - [systemctl](#systemctl)
  - [Nginx](#nginx)
- [🔄 Deployment Steps](#-deployment-steps)
  - [1. AWS EC2 Instance Setup](#1-aws-ec2-instance-setup)
  - [2. Instance Connection](#2-instance-connection)
  - [3. Environment Setup](#3-environment-setup)
  - [4. Application Deployment](#4-application-deployment)
  - [5. Nginx Configuration](#5-nginx-configuration)
- [🛠️ Security Configuration](#️-security-configuration)
  - [Configure AWS Security Group](#configure-aws-security-group)
  - [SSH Key Management](#ssh-key-management)
- [📝 Post-Deployment Steps](#-post-deployment-steps)
- [❗ Troubleshooting](#-troubleshooting)
  - [Common Issues and Solutions](#common-issues-and-solutions)
- [🔍 Additional Resources](#-additional-resources)
- [🤝 Contributing](#-contributing)

## 🎯 Overview

This guide provides step-by-step instructions for deploying a frontend application on AWS EC2, including instance setup, dependency installation, and Nginx configuration for web serving.

## ⚡ Prerequisites

- AWS Account with access credentials
- Frontend application codebase
- Basic understanding of Linux commands
- SSH client installed on your local machine

## 🔑 Key Concepts

### SSH (Secure Shell)

SSH is a secure protocol used to operate network services safely over an unsecured network. We use it to:

- Securely connect to our EC2 instance
- Execute commands remotely
- Transfer files securely
- Manage the server without physical access

### systemctl

`systemctl` is a command-line tool for controlling the systemd system and service manager. It's used to:

- Manage system services (start, stop, restart)
- Enable/disable services at boot time
- Check service status
- View service logs

Example usage:

```bash
# Start a service
sudo systemctl start nginx

# Enable service to start on boot
sudo systemctl enable nginx

# Check service status
sudo systemctl status nginx
```

### Nginx

Nginx is a powerful web server that can act as a:

- Reverse proxy
- Load balancer
- HTTP cache
- Static file server

We use it because:

- High performance and stability
- Low resource usage
- Excellent for serving static content
- Built-in load balancing capabilities

## 🔄 Deployment Steps

### 1. AWS EC2 Instance Setup

1. Log into AWS Management Console
2. Navigate to EC2 Dashboard
3. Click "Launch Instance"
4. Configure instance:
   - Name: Your application name
   - OS: Ubuntu Server (LTS)
   - Instance type: t2.micro (or as needed)
   - Create new key pair
   - Configure security group

### 2. Instance Connection

1. Download and secure your key pair (.pem file)
2. Set appropriate permissions:
   ```bash
   # Restrict key file access to only your user
   chmod 400 your-key.pem
   ```
3. Connect via SSH:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

### 3. Environment Setup

1. Update system packages:
   ```bash
   # Update package list and upgrade installed packages
   sudo apt update && sudo apt upgrade -y
   ```
2. Install Node.js:

   ```bash
   # Add NodeSource repository
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

   # Install Node.js and npm
   sudo apt-get install -y nodejs
   ```

3. Verify installation:
   ```bash
   node -v
   npm -v
   ```

### 4. Application Deployment

1. Clone your repository:
   ```bash
   git clone your-frontend-repo-url
   cd your-frontend-directory
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the application:
   ```bash
   npm run build  # Creates optimized production build
   ```

### 5. Nginx Configuration

1. Install Nginx:
   ```bash
   sudo apt install nginx -y
   ```
2. Configure Nginx:

   ```bash
   # Create a new site configuration
   sudo nano /etc/nginx/sites-available/your-app
   ```

   Basic Nginx configuration:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # Or your EC2 public IP

       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;  # For SPA routing
       }

       # Enable gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
   sudo nginx -t  # Test configuration
   sudo systemctl restart nginx
   ```

## 🛠️ Security Configuration

### Configure AWS Security Group

Security groups act as a virtual firewall for your EC2 instances. Configure:

1. Navigate to EC2 Security Groups
2. Add inbound rules:
   ```
   Type        Port    Source          Description
   SSH         22      Your IP         Secure shell access
   HTTP        80      0.0.0.0/0       Web traffic
   HTTPS       443     0.0.0.0/0       Secure web traffic
   ```

### SSH Key Management

```bash
# On your local machine
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Add to SSH agent
eval $(ssh-agent -s)
ssh-add ~/.ssh/your-key
```

## 📝 Post-Deployment Steps

1. Set up SSL/TLS with Let's Encrypt:

   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. Enable automatic security updates:
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

## ❗ Troubleshooting

### Common Issues and Solutions

1. **SSH Connection Issues**

   ```bash
   # Check SSH service status
   sudo systemctl status ssh

   # View SSH logs
   sudo tail -f /var/log/auth.log
   ```

2. **Nginx Issues**

   ```bash
   # Check Nginx error logs
   sudo tail -f /var/log/nginx/error.log

   # Test Nginx configuration
   sudo nginx -t
   ```

3. **Permission Issues**
   ```bash
   # Fix web root permissions
   sudo chown -R www-data:www-data /var/www/html
   sudo chmod -R 755 /var/www/html
   ```

## 🔍 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [systemd Documentation](https://www.freedesktop.org/wiki/Software/systemd/)

## 🤝 Contributing

Feel free to contribute to this guide by creating pull requests or reporting issues.

---

If you found this guide helpful, please ⭐ star the repository!
