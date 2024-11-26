<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 10 | Authentication, JWT & Cookies</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [1. Authentication](#1-authentication)
  - [Key Concepts:](#key-concepts)
- [2. Cookies](#2-cookies)
  - [What are Cookies?](#what-are-cookies)
  - [JWT in Cookies](#jwt-in-cookies)
  - [Cookie Expiry](#cookie-expiry)
- [3. JWT (JSON Web Tokens)](#3-jwt-json-web-tokens)
  - [Key Steps in Authentication Using JWT:](#key-steps-in-authentication-using-jwt)
- [4. `res.cookie` Method](#4-rescookie-method)
  - [Cookie Setup:](#cookie-setup)
- [5. JWT.io](#5-jwtio)
  - [Understanding JWT Components:](#understanding-jwt-components)
- [6. Security Concepts](#6-security-concepts)
  - [Cookie Hijacking or Stealing](#cookie-hijacking-or-stealing)
- [7. Middleware: UserAuthentication](#7-middleware-userauthentication)
  - [Purpose:](#purpose)
  - [Process:](#process)
- [8. Schema Methods in Mongoose](#8-schema-methods-in-mongoose)
  - [Definition:](#definition)
  - [Use Cases:](#use-cases)
  - [Advantages of Using `Schema.methods`](#advantages-of-using-schemamethods)
- [Common Use Cases in DevRoot](#common-use-cases-in-devroot)

---

## Overview

This document details the authentication process in the **DevRoot App**, focusing on **JSON Web Tokens (JWT)**, **cookie management**, and **security best practices**. Understanding these concepts ensures secure user authentication and efficient session management.

---

## 1. Authentication

### Key Concepts:

- Authentication verifies the user's identity by matching the email and password with database records.
- Upon successful login:
  1. The server generates a **JWT token**.
  2. The token is sent back to the client and stored in a **cookie**.
  3. Subsequent requests use the token for validation.

---

## 2. Cookies

### What are Cookies?

- Cookies are small pieces of data stored on the client-side and sent to the server with every request.

### JWT in Cookies

- Storing JWT tokens in cookies ensures that the server can validate user sessions without relying on client-side storage like `localStorage`.
- **Validation**:
  - Every request includes the token stored in cookies, allowing the server to verify its authenticity.

### Cookie Expiry

- Cookies can have an expiration time to enforce session time limits, improving security and user control.

---

## 3. JWT (JSON Web Tokens)

### Key Steps in Authentication Using JWT:

1. **Password Validation**:
   - After verifying the email and password, proceed to generate a JWT.
2. **Token Creation**:
   - A JWT token is created using the `jsonwebtoken` package with `jwt.sign`.
   - The token includes:
     - **Header**: Information about the token type and signing algorithm.
     - **Payload**: Contains user-specific data (e.g., user ID).
     - **Signature**: Ensures the token’s integrity.

```javascript
// Create a JWT token
const token = jwt.sign({ _id: user._id }, process.env.secretJWT, {
  expiresIn: "3d",
});
```

3. **Sending Token in Cookies**:
   The generated token is added to cookies and sent back to the user as part of the response.

---

## 4. `res.cookie` Method

### Cookie Setup:

- The `res.cookie` method is used to send cookies from the server to the client.
- Setup:
  - Install `cookie-parser` middleware to parse and manage cookies easily.
- Cookies can include settings like:
  - **Expiration Time**: Defines when the cookie will expire.
  - **HTTPOnly**: Ensures cookies are inaccessible via client-side scripts, reducing XSS risks.

```javascript
res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
```

## 5. JWT.io

### Understanding JWT Components:

1. **Header**:

- Contains metadata about the token, such as type (JWT) and signing algorithm (e.g., HS256).

2. **Payload**:

- Contains claims, which are statements about the user (e.g., user ID).

3. **Signature**:

- Verifies that the token was not tampered with and is signed by the server.

---

## 6. Security Concepts

### Cookie Hijacking or Stealing

- **Definition**:
- Attackers can intercept or steal cookies via network vulnerabilities or client-side attacks.
- **Mitigation**:
- Use `Secure` and `HTTPOnly` attributes for cookies.
- Implement HTTPS to encrypt cookie transmission.
- Rotate tokens periodically to limit exposure.

---

## 7. Middleware: UserAuthentication

### Purpose:

- Verifies the JWT token sent in cookies for every protected route.
- Ensures only authenticated users can access restricted resources.

### Process:

- The middleware uses `jwt.verify` to validate the token.
- If the token is invalid or missing, the request is denied with an appropriate error response.

```javascript
const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from req cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    // validate the token
    const { _id } = await isTokenValid(token);
    console.log(_id);

    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  userAuth,
};
```

---

## 8. Schema Methods in Mongoose

### Definition:

- `Schema.methods` is an object where you can define custom instance methods for a schema.
- These methods are available on all documents created with the schema.

### Use Cases:

1. **Password Management**:

- Use methods to hash passwords, compare hashed passwords during login, or perform other password-related operations.

2. **Token Generation**:

- Attach functions to generate JWT tokens for authentication directly to the schema.

3. **Custom Business Logic**:

- Add reusable methods for specific operations on schema instances, such as calculating derived data or formatting outputs.

```javascript
userSchema.methods.getJWT = function () {
  // create a jwt
  const token = jwt.sign({ _id: this._id }, process.env.secretJWT, {
    expiresIn: "3d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const isPasswordValid = await bcrypt.compare(password, this.password);
  return isPasswordValid;
};
```

### Advantages of Using `Schema.methods`

1. **Encapsulation**:

- Encapsulate document-specific logic within the schema for better modularity and readability.

2. **Reusability**:

- Define functions once and reuse them across all instances of the schema.

3. **Integration with Mongoose Models**:

- Work seamlessly with Mongoose's querying and data manipulation features.

---

## Common Use Cases in DevRoot

1. **Authentication**:

- Attach methods to hash passwords during signup and compare passwords during login.

2. **JWT Integration**:

- Add a method to generate JWT tokens after successful password validation.

3. **Data Transformation**:

- Create methods to sanitize or format data before sending it to the client.

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
