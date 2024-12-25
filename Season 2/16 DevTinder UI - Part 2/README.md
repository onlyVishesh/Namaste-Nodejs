<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 16 | DevRoot UI - Part 2</span> 🚀
</h1>

## **Backend Setup**

### Install `cors`

Run the following command in your backend project to install `cors`:

```bash
npm install cors
```

### Add CORS Middleware

Configure cors middleware in your backend to allow cross-origin requests with credentials. Example configuration:

```javascript
const cors = require("cors");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
```

## Frontend Setup

### Install `axios`

Run the following command in your frontend project to install axios:

```bash
npm install axios
```

### Configure axios with withCredentials

Enable cookies to be sent along with requests using axios:

```javascript
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // Replace with your backend URL
  withCredentials: true, // Enable cookies
});
export default instance;
```

## Login Page Client-Side Validation

### `Email` Validation

Ensure the `email` follows a proper format (e.g., user@example.com):

```javascript
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

### `Username` Validation

Ensure the `username` is at least 4 characters long:

```javascript
const isValidUsername = (username) => username.length > 3;
```

### `Password` Validation

Ensure the `password` must be least 8 characters long

```javascript
const isValidPassword = (password) => password.trim().length < 8;
```

Add real-time feedback for users based on validation and send the form data using the configured axios instance to the backend.

install react-redux and redux toolkit
configure store
provider to app.jsx
create slice
add reducer to store

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
