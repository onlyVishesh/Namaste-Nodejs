<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 04 | Routing and Request Handlers</span> 🚀
</h1>


## Table of Contents

- [Advanced Routing in Node.js](#advanced-routing-in-nodejs)
  - [Overview](#overview)
  - [Retrieving Query Parameters](#retrieving-query-parameters)
    - [Example:](#example)
  - [Dynamic Routing](#dynamic-routing)
    - [Example:](#example-1)
  - [Special Characters in Routing](#special-characters-in-routing)
    - [1. Optional Letters (`?`)](#1-optional-letters-)
    - [2. Grouping (())](#2-grouping-)
    - [3. Repetition (+)](#3-repetition-)
    - [4. Wildcard (\*)](#4-wildcard-)
  - [Regular Expressions in Routes](#regular-expressions-in-routes)
    - [Examples:](#examples)
      - [1. Match numbers only](#1-match-numbers-only)
      - [2. Match alphanumeric usernames](#2-match-alphanumeric-usernames)
  - [Conclusion](#conclusion)

## What is HTTP?

HTTP (Hypertext Transfer Protocol) is the foundation of data communication on the web. It is a protocol that defines how requests and responses are structured and transmitted between clients (e.g., web browsers) and servers. HTTP is stateless, meaning each request is independent and unrelated to previous ones.

---

## HTTP Methods

### 1. POST

- **Purpose**: Used to create a new resource.
- **Details**: The request body contains the data to be created.
- **Example**: Creating a new user account.

### 2. GET

- **Purpose**: Used to retrieve a resource.
- **Details**: Query parameters can be used to filter or sort data.
- **Example**: Retrieving a list of users.

### 3. PATCH

- **Purpose**: Used to partially update a resource.
- **Details**: The request body contains the changes to be made.
- **Example**: Updating a user's profile information.

### 4. DELETE

- **Purpose**: Used to delete a resource.
- **Example**: Deleting a user account.

### 5. PUT

- **Purpose**: Used to replace a resource entirely.
- **Details**: The request body contains the new data.
- **Example**: Updating a user's entire profile information.

---

## Notes

- HTTP methods enable CRUD (Create, Read, Update, Delete) operations on resources.
- Understanding the differences between these methods is crucial for building a robust and scalable backend.

---

## API Testing with Postman

### What is Postman?

Postman is a popular API testing tool that allows you to send HTTP requests and view responses in a user-friendly interface.

### Why Use Postman?

- Simplifies API testing and debugging.
- Essential for backend development.

### How to Use Postman?

1. Download and install Postman from the official website.
2. Create a new request:
   - Select the HTTP method (e.g., GET, POST, PUT, DELETE).
   - Enter the API endpoint URL.
3. Add request headers, query parameters, and body data as needed.
4. Send the request and view the response in the Postman interface.

---

# Advanced Routing in Node.js

## Overview

Routing in Node.js allows you to define how the server responds to various HTTP requests. Advanced routing techniques enable dynamic and flexible routes by using query parameters, route parameters, and special characters like `+`, `?`, `*`, as well as regular expressions.

---

## Retrieving Query Parameters

Query parameters are key-value pairs appended to the URL after the `?`. They are used to pass data to the server.

### Example:

```javascript
app.get("/userData", (req, res) => {
  console.log(req.query); //{"userId":"103","password":"1234"}
  res.send(`getting the data of ${JSON.stringify(req.query)}`);
});
```

URL: `/userData?userId=103&password=1234`

Output: `getting the data of {"userId":"103","password":"1234"}`

## Dynamic Routing

Dynamic routing allows for flexible route definitions using parameters in the URL.

### Example:

```javascript
app.get("/userProfile/:userId/:collageId", (req, res) => {
  console.log(req.params); //{"userId":"123","collageId":"12"}
  res.send(`showing the profile of ${JSON.stringify(req.params)}`);
});
```

URL: `/user/123/12`

Output: `showing the profile of {"userId":"123","collageId":"12"}`

---

## Special Characters in Routing

Node.js routing supports special patterns for matching routes:

### 1. Optional Letters (`?`)

Matches routes where a specific character is optional.

```javascript
app.get("/ab?c", (req, res) => {
  res.send({
    //data
  });
});
```

Routes: `/abc`, `/ac`

### 2. Grouping (())

Groups part of a route, making it optional works with all other special characters.

```javascript
app.get("/a(bc)?d", (req, res) => {
  res.send({
    // data
  });
});
```

Routes: `/abcd`, `/ad`

### 3. Repetition (+)

Matches one or more repetitions of the preceding character.

```javascript
app.get("/pq+r", (req, res) => {
  res.send({
    // data
  });
});
```

Routes: `/pqr`, `/pqqqr`, `/pqqqq...r`

### 4. Wildcard (\*)

Matches any sequence of characters.

```javascript
app.get("/xy*z", (req, res) => {
  // Handles /xyz, /xy123z, /xyabcxyz, etc. (any characters between x and z)
  res.send({
    // data
  });
});
```

Routes: `/xyz`, `/xyabcdeyz`, `/xy{anything}z`

## Regular Expressions in Routes

You can define route patterns using regular expressions for advanced matching.

### Examples:

#### 1. Match numbers only

```javascript
app.get(/^\/user\/\d+$/, (req, res) => {
  res.send("Matched user with numeric ID");
});
```

Routes: `/user/123`, `/user/123423`

#### 2. Match alphanumeric usernames

```javascript
app.get(/^\/user\/[a-zA-Z0-9]+$/, (req, res) => {
  res.send("Matched user with alphanumeric username");
});
```

Routes: `/user/Vishesh123`

## Conclusion

> Mastering routing techniques in Node.js, including query parameters, dynamic routes, and route patterns, enables the creation of scalable and flexible APIs. Tools like Postman further simplify API testing and debugging during development.

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
