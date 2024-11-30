<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 11 | Diving into the APls and express Router</span> 🚀
</h1>

# DevRoot API Documentation

## Overview

The **DevRoot** backend system is built with a modular and scalable architecture using **Express Router**. It provides APIs for user authentication, profile management, connections, search, and more. This document outlines all API endpoints, their purpose, and implementation details.

## Table of Contents

- [DevRoot API Documentation](#devroot-api-documentation)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Authentication APIs (`authRouter`)](#authentication-apis-authrouter)
  - [Profile Management APIs (`profileRouter`)](#profile-management-apis-profilerouter)
  - [Connection APIs (`connectionRequestRouter` \& `userConnections`)](#connection-apis-connectionrequestrouter--userconnections)
    - [**Connection Request APIs (`connectionRequestRouter`)**](#connection-request-apis-connectionrequestrouter)
    - [**User Connections APIs (`userConnections`)**](#user-connections-apis-userconnections)
  - [Search APIs (`searchRouter`)](#search-apis-searchrouter)
  - [Future Scope](#future-scope)
    - [Post Management APIs](#post-management-apis)
    - [Messaging APIs](#messaging-apis)
    - [Project Management APIs](#project-management-apis)
  - [Benefits of Modular Structure](#benefits-of-modular-structure)
  - [Conclusion](#conclusion)

---

## Authentication APIs (`authRouter`)

Endpoints to manage user authentication.

| Method | Endpoint          | Description                                  |
| ------ | ----------------- | -------------------------------------------- |
| POST   | `/signup`         | Register a new user.                         |
| POST   | `/login`          | Authenticate and log in a user.              |
| POST   | `/logout`         | Log out a user securely.                     |
| PATCH  | `/forgetPassword` | Change user password when user is not login. |
| PATCH  | `/changePassword` | Change user password when user is login.     |

---

## Profile Management APIs (`profileRouter`)

Endpoints to manage user profiles.

| Method | Endpoint                | Description                                                                                |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------ |
| GET    | `/profile/view`         | View the logged-in user's profile.                                                         |
| PATCH  | `/profile/edit`         | Edit the logged-in user's profile.                                                         |
| DELETE | `/profile/delete`       | Delete the user's account.                                                                 |
| PATCH  | `/profile/changeStatus` | Temporarily deactivate a user's account if active or reactive user account if deactivated. |
| GET    | `/profile/:userId`      | View another user's public profile.                                                        |

---

## Connection APIs (`connectionRequestRouter` & `userConnections`)

### **Connection Request APIs (`connectionRequestRouter`)**

Manage connection requests between users.

| Method | Endpoint                              | Description                            |
| ------ | ------------------------------------- | -------------------------------------- |
| POST   | `/request/send/interested/:userId`    | Send a connection request.             |
| POST   | `/request/send/ignored/:userId`       | Ignore a user.                         |
| GET    | `/requests/send`                      | View all sent connection requests.     |
| GET    | `/requests/received`                  | View all received connection requests. |
| POST   | `/request/review/accepted/:requestId` | Accept a connection request.           |
| POST   | `/request/review/rejected/:requestId` | Reject a connection request.           |
| POST   | `/request/review/retrieve/:requestId` | Retrieve a sent connection request.    |

### **User Connections APIs (`userConnections`)**

Manage user connections and view suggestions.

| Method | Endpoint                          | Description                       |
| ------ | --------------------------------- | --------------------------------- |
| GET    | `/user/feed`                      | View profiles of suggested users. |
| POST   | `/user/connections`               | View all connections.             |
| DELETE | `/user/connections/:connectionId` | Remove a connection.              |

---

## Search APIs (`searchRouter`)

Endpoints to search for users, skills, or topics.

| Method | Endpoint  | Description                                              |
| ------ | --------- | -------------------------------------------------------- |
| GET    | `/search` | Search using query parameters like `name`, `skill`, etc. |

---

## Future Scope

### Post Management APIs

Endpoints for managing user-generated posts in a feed.

| Method | Endpoint                     | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| GET    | `/feed/posts`                | View posts shared by connections. |
| POST   | `/feed/post`                 | Create a new post in the feed.    |
| DELETE | `/feed/post/:postId`         | Delete a post from the feed.      |
| POST   | `/feed/post/:postId/like`    | Like a post.                      |
| POST   | `/feed/post/:postId/comment` | Add a comment to a post.          |

### Messaging APIs

Endpoints for user-to-user messaging.

| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| POST   | `/message/send/:userId`         | Send a direct message to a user. |
| GET    | `/message/conversation/:userId` | View conversation with a user.   |

### Project Management APIs

Endpoints for adding and managing user projects.

| Method | Endpoint                      | Description                      |
| ------ | ----------------------------- | -------------------------------- |
| POST   | `/projects/add`               | Add a project to a profile.      |
| PATCH  | `/projects/edit/:projectId`   | Edit an existing project.        |
| DELETE | `/projects/remove/:projectId` | Remove a project from a profile. |

---

## Benefits of Modular Structure

The **Express Router** architecture offers the following advantages:

1. **Modularity**: Separate files for different routers improve code organization.
2. **Scalability**: Easily expandable as the application grows.
3. **Reusability**: Middleware and logic can be reused across routes.

---

## Conclusion

The **DevRoot API** offers a robust and scalable backend for user management, connections, and more. Its modular structure ensures maintainability, and the outlined future scope allows for seamless feature expansion.

---

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
