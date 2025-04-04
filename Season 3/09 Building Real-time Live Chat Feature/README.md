<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 09 Building Real-time Live Chat Feature</span> 🚀
</h1>

Welcome to the ninth part of the Namaste Node.js series! In this module, implements a **real-time, encrypted chat feature** using Node.js, Express, Socket.io, React, and MongoDB.

---

## 📌 Quick Links

[![Frontend Repo](https://img.shields.io/badge/Frontend-Repository-green)](https://github.com/onlyVishesh/DevRoot-Frontend)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-blue)](https://github.com/onlyVishesh/DevRoot-Backend)

---

## 📋 Table of Contents

- [📌 Quick Links](#-quick-links)
- [📋 Table of Contents](#-table-of-contents)
- [🌟 Features](#-features)
  - [Chat API Response Structure](#chat-api-response-structure)
    - [Chat List Response:](#chat-list-response)
    - [Empty Chat States](#empty-chat-states)
- [🔒 Security](#-security)
- [💡 Customization \& Extending](#-customization--extending)
- [🤝 Contributing](#-contributing)
- [📝 Key Learnings](#-key-learnings)
- [Understanding WebSockets](#understanding-websockets)
- [Introduction to Socket.io](#introduction-to-socketio)
- [Server-Side Implementation](#server-side-implementation)
  - [1. Install Dependencies](#1-install-dependencies)
  - [2. Set Up the Server](#2-set-up-the-server)
  - [3. Create Socket.io Initialization](#3-create-socketio-initialization)
  - [4. Integrate with Express Application](#4-integrate-with-express-application)
- [📱 Client-Side Implementation](#-client-side-implementation)
  - [1. Install Socket.io Client](#1-install-socketio-client)
  - [2. Create Socket Connection Utility](#2-create-socket-connection-utility)
  - [3. Implement Chat Component](#3-implement-chat-component)
- [Real-Time Messaging with Advanced Features](#real-time-messaging-with-advanced-features)
- [Room-Based Chat](#room-based-chat)
  - [Creating Secure Room IDs](#creating-secure-room-ids)
- [Implemented Best Practices](#implemented-best-practices)
  - [1. Performance Optimization](#1-performance-optimization)
  - [2. Enhanced Security](#2-enhanced-security)

---

## 🌟 Features

- **Real-time 1:1 chat** with instant message delivery (Socket.io)
- **Infinite scroll** for chat history with automatic scroll position management
- **Typing indicators** with real-time status updates
- **Online/offline presence** detection with automatic status updates
- **Unread message counts** with automatic sync across devices
- **User blocking and connection management** with proper authorization checks
- **Server-side AES-256 encryption** for all chat messages at rest in the database
- **Modern, responsive UI** (React + TailwindCSS) with mobile-friendly design
- **Empty state handling** for no chat history or no chats
- **Proper user details** including first name, last name, and avatar in chat lists

---


### Chat API Response Structure

#### Chat List Response:

```json
{
  "success": true,
  "chats": [
    {
      "userId": "username1",
      "name": "Vishesh",
      "avatar": "https://avatar-url.com/image.jpg",
      "lastMessage": "Hello, how are you?",
      "time": "2 hours ago",
      "unread": 3
    }
  ]
}
```

#### Empty Chat States

The system handles various empty states:

- No chat history: "No chat history. Start the conversation now!"
- No chats in sidebar: "You haven't chatted with anyone. Start a new chat now!"
- When chat is blocked: "You are not connected with this user. Chat is blocked."

---

## 🔒 Security

- All chat messages are **AES-256 encrypted** at rest on the server.
- JWT authentication for all API endpoints.
- User blocking and connection status enforced on backend.

---

## 💡 Customization & Extending

- Add group chat, file sharing, or notifications easily.
- Integrate with other DevRoot modules (profile, feed, projects).

---

## 🤝 Contributing

Pull requests and issues are welcome! Please star the repo if you find it useful.

## 📝 Key Learnings

Through implementing this chat feature, we've learned:

1. **Full-Stack Real-Time Communication**: How to set up WebSockets for instant messaging
2. **Advanced Socket.io Features**: Rooms, typing indicators, presence management
3. **Message Encryption**: Implementing AES-256 encryption for secure communication
4. **Infinite Scrolling**: Using pagination for efficient loading of chat history
5. **Auth Integration**: Ensuring only connected users can chat with each other
6. **State Management**: Handling complex UI states for loading, empty states, and errors
7. **Responsive Design**: Creating a chat interface that works across device sizes

---

## Understanding WebSockets

WebSockets provide a persistent connection between a client and server that both parties can use to start sending data at any time.

**Key Advantages Over HTTP:**

- **Full-Duplex Communication**: Both client and server can send messages simultaneously
- **Persistent Connection**: No need to establish a new connection for every message
- **Low Latency**: Minimal overhead after the initial handshake
- **Real-Time Updates**: Perfect for applications requiring instant data (chats, games, live updates)

WebSocket connections start as an HTTP request that gets upgraded to a WebSocket connection through a process called the WebSocket handshake.

---

## Introduction to Socket.io

[Socket.io](https://socket.io/) is a JavaScript library that enables real-time, bidirectional communication between web clients and servers. It primarily uses WebSocket protocol but can fall back to other methods when WebSockets aren't supported.

**Key Features:**

- **Reliability**: Fallback to HTTP long-polling when WebSockets aren't available
- **Auto-Reconnection**: Automatically reconnects when the connection drops
- **Room Support**: Group clients for targeted messaging
- **Event-Based Communication**: Clean API for emitting and handling events
- **Cross-Browser Compatibility**: Works across all major browsers

---

## Server-Side Implementation

### 1. Install Dependencies

```bash
npm install socket.io express http
```

### 2. Set Up the Server

```js
// app.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FrontendURL,
    credentials: true,
  },
});

// Start the server with http server, not Express app
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Create Socket.io Initialization

Create a separate file to handle socket initialization:

```js
// utils/socket.js
const { getSecretRoomId } = require("./constants");
const Chat = require("../models/chat");
const { encrypt, decrypt } = require("../utils/encryption");

const initializeSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.FrontendURL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // ... join room, send/receive message, typing indicator, etc.
  });

  return io;
};

module.exports = initializeSocket;
```

### 4. Integrate with Express Application

```js
// app.js
const initializeSocket = require("./utils/socket");

// After creating your server
const server = http.createServer(app);

// Initialize socket.io
initializeSocket(server);
```

---

## 📱 Client-Side Implementation

### 1. Install Socket.io Client

```bash
npm install socket.io-client
```

### 2. Create Socket Connection Utility

```jsx
// utils/socket.jsx
import io from "socket.io-client";

export const createSocketConnection = () => {
  return io(import.meta.env.VITE_BackendURL);
};
```

### 3. Implement Chat Component

```jsx
// Our implemented Chat.jsx has advanced features compared to this basic example
import React, { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { useSelector } from "react-redux";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [noChats, setNoChats] = useState(false);
  const [noHistory, setNoHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const socketRef = useRef(null);
  const chatAreaRef = useRef(null);
  const loggedInUser = useSelector((store) => store.user);

  // Fetch chat list for sidebar with backend data
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BackendURL}/chats`,
          { withCredentials: true }
        );
        if (res.data.success && res.data.chats.length > 0) {
          setChats(res.data.chats); // Contains name, avatar, lastMessage, time, unread
          setNoChats(false);
        } else {
          setChats([]);
          setNoChats(true);
        }
      } catch (err) {
        setNoChats(true);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();

    // Socket setup for real-time updates
    const socket = createSocketConnection();
    socketRef.current = socket;

    // Return cleanup function
    return () => socket.disconnect();
  }, []);

    // Listen for messages
    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUser, selectedUser]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;

    // Send message
    socketRef.current.emit("send_message", {
      roomId,
      message: messageInput,
      sender: currentUser._id,
      receiver: selectedUser._id,
    });

    setMessageInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === currentUser._id ? "sent" : "received"
            }`}
          >
            <p>{msg.message}</p>
            <small>{new Date(msg.time).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
```

---

## Real-Time Messaging with Advanced Features

Our implementation uses an event-based architecture with enhanced features:

1. **Client emits an event** with encrypted message data:

```js
socket.emit("sendMessage", {
  loggedInUsername,
  userId,
  newMessage: {
    userId,
    sender: loggedInUsername,
    text: message.trim(),
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
});
```

2. **Server encrypts and stores messages** before broadcasting:

```js
socket.on("sendMessage", async ({ loggedInUsername, userId, newMessage }) => {
  try {
    // Find users
    const senderUser = await User.findOne({ username: loggedInUsername });
    const receiverUser = await User.findOne({ username: userId });

    // Find or create chat
    const chat =
      (await Chat.findOne({
        participants: { $all: [senderUser._id, receiverUser._id] },
      })) ||
      (await Chat.create({
        participants: [senderUser._id, receiverUser._id],
        messages: [],
      }));

    // Create encrypted message
    const messageDoc = {
      sender: senderUser._id,
      content: encrypt(newMessage.text), // AES-256 encryption
      readBy: [senderUser._id],
      createdAt: new Date(),
    };

    // Save to database
    chat.messages.push(messageDoc);
    chat.lastMessage = messageDoc;
    await chat.save();

    // Emit to both users' rooms
    io.to(getSecretRoomId(loggedInUsername, userId)).emit("messageReceived", {
      newMessage: {
        ...newMessage,
        sender: loggedInUsername,
        time: newMessage.time,
      },
    });
    io.to(getSecretRoomId(userId, loggedInUsername)).emit("messageReceived", {
      newMessage: {
        ...newMessage,
        sender: loggedInUsername,
        time: newMessage.time,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
});
```

3. **Advanced features** beyond basic messaging:

```js
// Real-time typing indicators
socket.on("typing", ({ loggedInUsername, userId }) => {
  const roomId = getSecretRoomId(loggedInUsername, userId);
  socket.to(roomId).emit("typing", { username: loggedInUsername });
});

// Online/offline presence tracking
socket.on("disconnect", () => {
  if (currentUsername) {
    onlineUsers.delete(currentUsername);
    io.emit("userOnlineStatus", {
      username: currentUsername,
      online: false,
    });
  }
});

// Mark messages as read in real-time
chat.messages.forEach((msg) => {
  if (!msg.readBy.some((id) => id.equals(senderUser._id))) {
    msg.readBy.push(senderUser._id);
    updated = true;
  }
});
if (updated) {
  await chat.save();
  io.to(getSecretRoomId(loggedInUsername, userId)).emit("unreadUpdated", {
    userId: loggedInUsername,
  });
}
```

---

## Room-Based Chat

Socket.io's room feature allows organizing clients into named groups. This is particularly useful for:

- Private conversations between two users
- Group chats
- Topic-based channels

### Creating Secure Room IDs

For private chats, we create a unique, consistent room ID for each pair of users:

```js
const crypto = require("crypto");

const getSecretRoomId = (user1, user2) => {
  return crypto
    .createHash("sha256")
    .update([user1, user2].sort().join("_"))
    .digest("hex");
};
```

This ensures:

- The same room ID is generated regardless of who initiates the chat
- Room IDs are not easily guessable
- Each pair of users has a unique room

---

## Implemented Best Practices

Our chat implementation follows industry best practices for real-time applications:

### 1. Performance Optimization

- **Efficient Message Loading**: Only fetch the most recent messages initially
- **Infinite Scroll Pagination**: Load older messages as users scroll up
- **Optimized DOM Updates**: Smart rendering of chat messages
- **Scroll Position Management**: Maintain scroll position when loading older messages

```js
// Scroll to bottom on new message (unless fetching more)
if (chatAreaRef.current && !isFetchingMore) {
  chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
}

// Infinite scroll: fetch older messages when scrolled to top
const handleScroll = async () => {
  if (!hasMore || isFetchingMore || !chatAreaRef.current) return;
  const { scrollTop, scrollHeight } = chatAreaRef.current;
  if (scrollTop <= 100) {
    setIsFetchingMore(true);
    previousScrollHeight.current = scrollHeight;
    await fetchOlderMessages();
    setIsFetchingMore(false);
  }
};
```

### 2. Enhanced Security

- **AES-256 Encryption**: All messages are encrypted at rest in the database
- **JWT Authentication**: All API endpoints are protected
- **Connection Validation**: Users can only chat if they've established a connection
- **Block Functionality**: Blocked users cannot send messages

```js
// Check if users are connected
const connection = await ConnectionRequest.findOne({
  $or: [
    {
      fromUserId: loggedInUser._id,
      toUserId: otherUser._id,
      status: "accepted",
    },
    {
      fromUserId: otherUser._id,
      toUserId: loggedInUser._id,
      status: "accepted",
    },
  ],
});

if (!connection) {
  return res.status(403).json({
    success: false,
    error: "You are not connected with this user. Chat is blocked.",
  });
}
```
---

> ## ⭐ If you found this guide helpful, please star the repository

---
