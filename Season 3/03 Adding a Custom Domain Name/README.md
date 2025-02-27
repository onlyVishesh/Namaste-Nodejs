<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js -  03 Adding a Custom Domain Name</span> 🚀
</h1>

## 📌 Quick Links

[![Frontend Repo](https://img.shields.io/badge/Frontend-Repository-green)](https://github.com/onlyVishesh/DevRoot-Frontend)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-blue)](https://github.com/onlyVishesh/DevRoot-Backend)

## 📑 Table of Contents

- [📌 Quick Links](#-quick-links)
- [📑 Table of Contents](#-table-of-contents)
- [🎯 Overview](#-overview)
- [✅ Steps Completed](#-steps-completed)
  - [**1️⃣ Purchase a Domain Name**](#1️⃣-purchase-a-domain-name)
  - [**2️⃣ Access DNS Management in GoDaddy**](#2️⃣-access-dns-management-in-godaddy)
  - [**3️⃣ Set Up DNS via Cloudflare**](#3️⃣-set-up-dns-via-cloudflare)
  - [**4️⃣ Update Name Servers in GoDaddy**](#4️⃣-update-name-servers-in-godaddy)
  - [**3️⃣ Update DNS/SSL via Cloudflare**](#3️⃣-update-dnsssl-via-cloudflare)
- [❓ FAQ](#-faq)
- [🎯 Next Steps](#-next-steps)
- [🔥 Conclusion](#-conclusion)

## 🎯 Overview

This document outlines the process of mapping a **custom domain name** to the deployed **DevTinder** app using services like **GoDaddy** and **Cloudflare**. Connecting a domain enhances professionalism and makes the app easily accessible.

---

## ✅ Steps Completed

### **1️⃣ Purchase a Domain Name**

- Bought a domain through **GoDaddy** (or any other domain provider, i have used xyz for domain).
- Ensured access to the domain settings from the provider dashboard.

### **2️⃣ Access DNS Management in GoDaddy**

- Navigate to **My Products > DNS Management** in the GoDaddy dashboard.
- Locate the domain to configure DNS records.

### **3️⃣ Set Up DNS via Cloudflare**

- Create a Cloudflare account (or log in if existing).
- Add the purchased domain to Cloudflare.
- Allow Cloudflare to scan existing DNS records.
- Prepare to manage the DNS setup (A records, CNAME, etc.) from Cloudflare.

### **4️⃣ Update Name Servers in GoDaddy**

- Cloudflare provides **new name servers** (e.g., `joel.ns.cloudflare.com`).
- Replace GoDaddy's default name servers with those provided by Cloudflare.
- Save changes and wait for DNS propagation (may take a few minutes to a few hours).

### **3️⃣ Update DNS/SSL via Cloudflare**

- Added A or CNAME records in Cloudflare to point to the EC2 public IP.
- Set up HTTPS using **Cloudflare SSL** or **Let's Encrypt**.
- Turn on **Always Use HTTPS** and **Automatic HTTPS Rewrites** in SSL/TLS > Edge Certificates
- Redirect traffic from **www to non-www** or vice versa.

---

## ❓ FAQ

**Q: How long does DNS propagation take?**  
A: It can take anywhere from a few minutes to 48 hours, but usually, it's much quicker.

**Q: What if my domain doesn't work after setup?**  
A: Double-check your DNS settings in both GoDaddy and Cloudflare. Ensure that the records are correctly pointing to your server.

## 🎯 Next Steps

- Update Nginx configuration to handle the custom domain.

---

## 🔥 Conclusion

Domain mapping is now in progress using **Cloudflare and GoDaddy**. This step is essential for making **DevTinder** publicly available through a branded URL. The next focus will be on DNS record configuration and secure HTTPS setup.

If you found this guide helpful, please ⭐ star the repository!
