<h1 style="text-align: center;">🚀 Namaste Node.js - 11 | Creating a Server 🚀</h1>

# Table of Contents

- [Table of Contents](#table-of-contents)
  - [❓ What is a Server?](#-what-is-a-server)
    - [**A: Understanding Servers: Hardware and Software**](#a-understanding-servers-hardware-and-software)
    - [**Deploying an Application on a Server**](#deploying-an-application-on-a-server)
  - [🖥️ Client-Server Architecture](#️-client-server-architecture)
    - [How It Works:](#how-it-works)
  - [❓ Can I Create Multiple Servers?](#-can-i-create-multiple-servers)
    - [**A: Yes, you can create multiple HTTP servers.**](#a-yes-you-can-create-multiple-http-servers)
    - [Example:](#example)
  - [🌐 Socket vs WebSockets](#-socket-vs-websockets)
    - [**Socket Connection**](#socket-connection)
    - [**WebSockets**](#websockets)
  - [📝 Creating a Server with Node.js](#-creating-a-server-with-nodejs)
    - [Basic HTTP Server](#basic-http-server)
    - [Handling Specific Routes](#handling-specific-routes)
  - [Using Express for Easier Server Creation](#using-express-for-easier-server-creation)

---

## ❓ What is a Server?

### **A: Understanding Servers: Hardware and Software**

The term "server" can refer to both **hardware** and **software**, depending on the context.

- **Hardware**: A physical machine (computer) that provides resources and services to other computers (clients) over a network.
- **Software**: An application or program that handles requests and delivers data to clients.

### **Deploying an Application on a Server**

When someone says, "deploy your app on a server," they usually mean:

1. **Hardware Aspect**: You need a physical machine (server) to run your application. This machine has essential components like **CPU**, **RAM**, **storage**, etc.
2. **Operating System (OS)**: The server hardware runs an operating system (e.g., **Linux** or **Windows**), which is where your application will run.
3. **Server Software**: This refers to the software (e.g., a web server like **Apache** or an application server built with **Node.js**) that handles incoming requests and serves data to users.

---

## 🖥️ Client-Server Architecture

In the **client-server** model, a **client** is an entity that makes requests to a **server**. For example, a user sitting at a computer might want to access a file from a server. The client opens a **socket connection** (not to be confused with WebSockets) to the server.

- **Client**: Has an IP address and initiates the request.
- **Server**: Has an IP address and listens for incoming connections.

### How It Works:

- The client requests a file from the server by opening a socket connection.
- The server has an application that listens for these requests, retrieves the requested data, and sends it back to the client.
- After the data is sent, the socket connection is closed.
- If the client wants to make another request, it opens a new socket connection.

This process can be repeated for multiple clients, where each client opens its own socket connection to the server.

---

## ❓ Can I Create Multiple Servers?

### **A: Yes, you can create multiple HTTP servers.**

When you create multiple servers, each one is distinguished by a **port number**.

- A **port** is a 4-digit number (e.g., `3000`) that specifies which server should handle the incoming request.

### Example:

- An HTTP server running on **IP address `102.209.1.3`** with port **`3000`** would be accessed via the URL `102.209.1.3:3000`.
- This combination of **IP address and port number** identifies the specific server handling the request.

Thus, a **single physical server** can run multiple applications or servers, each with its own port number.

---

## 🌐 Socket vs WebSockets

### **Socket Connection**

- When a user makes a request to a website, a **socket connection** is established between the client and server. This is typically used for a single **request-response cycle**.
- Once the request is made and the response is sent, the socket is closed.

### **WebSockets**

- **WebSockets** allow the connection to remain open after the initial handshake, enabling continuous communication between the client and server.
- Both the client and server can send and receive data at any time, without needing to re-establish the connection. This makes **WebSockets** ideal for real-time applications like:
  - **Chat applications**
  - **Online gaming**
  - **Live updates**

---

## 📝 Creating a Server with Node.js

### Basic HTTP Server

To create a simple HTTP server using **Node.js**:

```javascript
const http = require("node:http");
const port = 999;

const server = http.createServer(function (req, res) {
  res.end("Server Created");
});

server.listen(port, () => {
  console.log("Server running on port " + port);
});
```

### Handling Specific Routes

Now, let's handle different responses based on the URL path. For example, for the route `localhost:3000/getsecretdata`, we can respond with a specific message:

```javascript
const http = require("node:http");
const port = 999;

const server = http.createServer(function (req, res) {
  if (req.url === "/getSecretData") {
    res.end("You are a human and here's the secret—so chill!");
  } else {
    res.end("Server Created");
  }
});

server.listen(port, () => {
  console.log("Server running on port " + port);
});
```

In this example, if the client makes a request to `/getSecretData`, the server will respond with "You are a human and here's the secret—so chill!". For any other request, it will return "Server Created".

## Using Express for Easier Server Creation

While the above examples use plain Node.js HTTP modules, we often use Express, a popular framework built on top of Node.js, to simplify the creation and management of servers.

Express makes routing and server setup more convenient, especially for larger applications.

If you found this useful, **please ⭐ star the repository** to show your support! 😊
