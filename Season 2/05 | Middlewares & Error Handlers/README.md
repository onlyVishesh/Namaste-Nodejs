<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 05 | Middlewares & Error Handlers</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Middlewares and Error Handlers in Express](#middlewares-and-error-handlers-in-express)
  - [What are Middlewares?](#what-are-middlewares)
  - [Why Use Middleware?](#why-use-middleware)
    - [Example:](#example)
- [Route Handlers in Express](#route-handlers-in-express)
  - [Overview](#overview)
    - [Example with Multiple Handlers:](#example-with-multiple-handlers)
- [Understanding `next()` in Express](#understanding-next-in-express)
  - [What is `next()`?](#what-is-next)
  - [Skipping Route Handlers:](#skipping-route-handlers)
    - [Example:](#example-1)
- [HTTP Status Codes](#http-status-codes)
  - [Categories:](#categories)
  - [Common Codes:](#common-codes)
    - [Example Usage:](#example-usage)
- [Difference Between `app.use()` and `app.all()`](#difference-between-appuse-and-appall)
    - [Examples:](#examples)
- [Error-Handling Middleware](#error-handling-middleware)
  - [Defining Error Middleware:](#defining-error-middleware)
    - [Example:](#example-2)
- [Authentication Middleware](#authentication-middleware)
    - [Example:](#example-3)
- [Summary](#summary)

## Middlewares and Error Handlers in Express

### What are Middlewares?

- Middleware functions have access to the request (`req`), response (`res`), and the next middleware in the stack.
- **Purpose**:
  - Execute code.
  - Modify `req` and `res` objects.
  - End the request-response cycle.
  - Call the next middleware using `next()`.

### Why Use Middleware?

- **Modularity**: Simplifies authentication, logging, validation, etc.
- **Error Handling**: Handles errors gracefully.
- **Pre-Processing**: Modifies requests before reaching route handlers.
- **Authorization/Authentication**: Middleware ensures that only authorized users can access certain routes.

#### Example:

```javascript
const express = require("express");
const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

---

## Route Handlers in Express

### Overview

- Functions that process requests to specific endpoints.
- Support multiple handlers for a single route.

#### Example with Multiple Handlers:

```javascript
app.get(
  "/example",
  (req, res, next) => {
    console.log("First handler");
    next(); // Move to the next handler if there is no res
  },
  (req, res) => {
    res.send("Second handler");
  }
);
```

---

## Understanding `next()` in Express

### What is `next()`?

- A callback to control the flow between middleware functions and route handlers.

### Skipping Route Handlers:

- Use `next('route')` to skip to the next route handler.

#### Example:

```javascript
app.get(
  "/skip",
  (req, res, next) => {
    console.log("This will be skipped");
    next("route");
  },
  (req, res) => {
    res.send("You won’t see this");
  }
);

app.get("/skip", (req, res) => {
  res.send("Skipped to this handler");
});
```

---

## HTTP Status Codes

### Categories:

- **1xx Informational**: Processing continues.
- **2xx Success**: Request was successful.
- **3xx Redirection**: Further action required.
- **4xx Client Error**: Request issue.
- **5xx Server Error**: Server failure.

### Common Codes:

- **200 OK**: Success.
- **404 Not Found**: Resource missing.
- **401 Unauthorized**: client is not authenticate.
- **403 Forbidden**: no rights to access content.
- **500 Internal Server Error**: Unexpected error.

#### Example Usage:

```javascript
app.get("/success", (req, res) => {
  res.status(200).send("Success");
});

app.get("/error", (req, res) => {
  res.status(404).send("Not Found");
});
```

---

## Difference Between `app.use()` and `app.all()`

| Feature              | `app.use()`                              | `app.all()`                                |
| -------------------- | ---------------------------------------- | ------------------------------------------ |
| **Purpose**          | Mount middleware for all/specific routes | Match all HTTP methods on a specific route |
| **Path Requirement** | Optional                                 | Mandatory                                  |
| **Common Use Case**  | Middleware logic                         | Handle all HTTP methods                    |

#### Examples:

- **`app.use()`**:

```javascript
app.use((req, res, next) => {
  console.log("Middleware for all routes");
  next();
});
```

- **`app.all()`**:

```javascript
app.all("/about", (req, res) => {
  res.send("Handles all HTTP methods");
});
```

---

## Error-Handling Middleware

### Defining Error Middleware:

- Requires **four parameters**: `(err, req, res, next)`.

#### Example:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
```

---

## Authentication Middleware

#### Example:

```javascript
app.use("/admin", (req, res, next) => {
  const token = req.headers["authorization"];
  if (token !== "valid-token") {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
});

app.get("/admin/data", (req, res) => {
  res.send("Authorized admin data");
});
```

---

## Summary

- Middleware modularizes functionality and ensures request processing is seamless.
- `next()` is crucial for controlling middleware flow.
- Proper use of HTTP status codes ensures clear communication between client and server.
- Authentication and error-handling middleware are essential for secure and robust applications.

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
