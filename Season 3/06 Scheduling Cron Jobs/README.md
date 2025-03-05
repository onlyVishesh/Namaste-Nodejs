<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 05: Keeping Our Credentials Safe Using dotenv Files</span> 🚀
</h1>

## 📌 Quick Links

[![Frontend Repo](https://img.shields.io/badge/Frontend-Repository-green)](https://github.com/onlyVishesh/DevRoot-Frontend)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-blue)](https://github.com/onlyVishesh/DevRoot-Backend)

---

## 🔐 Secure Your Secrets

1. Create a `.env` file in the **root folder**.
2. Install `dotenv` using:

   ```bash
   npm install dotenv
   ```

3. Use environment variables in your code like:

```js
require("dotenv").config();
const dbPassword = process.env.DB_PASSWORD;
```

✅ No changes were needed in the current project — we’re already following best practices for managing secrets.

If you found this guide helpful, please ⭐ star the repository!
