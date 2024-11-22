<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 09 | Encrypting Passwords</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [1. Data Validation](#1-data-validation)
  - [Signup Data Validation Example](#signup-data-validation-example)
    - [Key Validations](#key-validations)
- [2. Password Encryption](#2-password-encryption)
  - [Why Encrypt Passwords?](#why-encrypt-passwords)
  - [Hashing Passwords](#hashing-passwords)
- [3. Login Authentication](#3-login-authentication)
  - [Verifying Passwords](#verifying-passwords)
    - [Advantages:](#advantages)
- [4. Benefits of Encrypting Passwords](#4-benefits-of-encrypting-passwords)

---

## Overview

Properly handling passwords is crucial for user security. This guide details:

- Validating user input during signup.
- Encrypting passwords securely.
- Verifying credentials during login.

---

## 1. Data Validation

Validating user input ensures data integrity and protects against malicious entries.

### Signup Data Validation Example

Using reusable helper functions and libraries like `validator` simplifies input validation.

```javascript
const validator = require("validator");

// Validate signup data
const validateSignUpData = (res) => {
  const { username, firstName, email, password } = res.body;

  if (!username) {
    throw new Error("Enter a username");
  } else if (username.length > 30 || username.length < 3) {
    throw new Error("Username must be 3-30 characters");
  } else if (!firstName) {
    throw new Error("Enter a name");
  } else if (firstName.length > 25 || firstName.length < 3) {
    throw new Error("First name must be 3-25 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

module.exports = { validateSignupData };
```

#### Key Validations

- **Name Validation:** Ensure required fields are not empty.
- **Email Validation:** Check email format using validator.isEmail.
- **Password Validation:** Enforce strong password policies (e.g., length, complexity).

---

## 2. Password Encryption

Storing plaintext passwords is insecure. Encrypting passwords mitigates risks even if the database is compromised.

### Why Encrypt Passwords?

- Ensures sensitive data cannot be easily exposed.
- Protects against brute force and other attacks.

### Hashing Passwords

1. **Install `bcryptjs`:** Install the `bcryptjs` package for password hashing:

```bash
npm install bcryptjs
```

2. **Hash the Password:** Use `bcrypt.hash` to create an irreversible hashed string:

```javascript
const bcrypt = require("bcryptjs");

// Hash password with salt rounds
const passwordHash = async (password) => {
  // Recommended salt rounds: 10
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
};
```

---

## 3. Login Authentication

### Verifying Passwords

Use `bcrypt.compare` to match the provided plaintext password with the hashed password stored in the database:

```javascript
const bcrypt = require("bcryptjs");

// Verify the password during login
const isPasswordValid = async (password, passwordHash) => {
  return await bcrypt.compare(password, hashedPassword);
};
```

#### Advantages:

Ensures no plaintext passwords are exposed.
Efficiently validates credentials securely.

## 4. Benefits of Encrypting Passwords

**Enhanced Security**

- Prevents exposure of plaintext passwords during breaches.

**Compliance**

- Meets regulatory requirements (e.g., GDPR, HIPAA) for secure data handling.

**Trust**

- Strengthens user confidence in the platform’s security.

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
