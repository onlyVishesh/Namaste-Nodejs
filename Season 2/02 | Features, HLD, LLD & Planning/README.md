<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>02 | Features, HLD, LLD & Planning</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Development Approach](#development-approach)
  - [1. Requirements Gathering](#1-requirements-gathering)
  - [2. High-Level Design (HLD)](#2-high-level-design-hld)
  - [3. Low-Level Design (LLD)](#3-low-level-design-lld)
    - [Database Design](#database-design)
- [API Design](#api-design)
  - [What are REST APIs?](#what-are-rest-apis)
  - [How REST APIs Work](#how-rest-apis-work)
  - [Difference Between PUT and PATCH](#difference-between-put-and-patch)
  - [REST APIs Needed](#rest-apis-needed)
    - [**User Management APIs**](#user-management-apis)
    - [**Connection Management APIs**](#connection-management-apis)
- [Next Steps](#next-steps)

---

## Development Approach

The **DevRoot** app is being developed using a structured development lifecycle akin to industry standards. This approach ensures clarity, smooth transitions between phases, and a robust application.

---

### 1. Requirements Gathering

- **Understanding the Project**:

  - **Project Name**: DevRoot
  - **Concept**: A Tinder-like platform tailored for developers to connect and collaborate.

- **Features**:
  1. **User Account Management**:
     - Account creation.
     - Signup and login functionality.
     - Profile updates.
  2. **Developer Exploration**:
     - Feed to browse developer profiles.
     - Send connection requests.
  3. **Connections Management**:
     - View matches (mutual connections).
     - Manage sent and received requests.
  4. **Additional Features**:
     - To be added based on development needs.

---

### 2. High-Level Design (HLD)

- **Tech Planning**:

  - **Architecture**: Microservices architecture separating frontend and backend services.
  - **Tech Stack**:
    - **Frontend**: React.js
    - **Backend**: Node.js
    - **Database**: MongoDB

- **Development Team Roles**:

  - Teams will include SDE1, SDE2, and backend engineers once features and tech planning are finalized.

- **Note**: Effective planning simplifies development and ensures smoother coding workflows.

---

### 3. Low-Level Design (LLD)

#### Database Design

- **Collections**:
  1. **User Collection**:
     - Fields: `firstname`, `lastname`, `email`, `password`, `age`, `gender`, etc.
  2. **ConnectionRequest Collection**:
     - Fields:
       - `fromUserId`: Sender's user ID.
       - `toUserId`: Receiver's user ID.
       - `status`: Connection status (e.g., pending, accepted, rejected, ignored).

---

## API Design

### What are REST APIs?

- **REST (Representational State Transfer)**: An architectural style for networked applications that uses HTTP for communication between client and server.
- **REST APIs** allow clients to interact with servers via standard HTTP methods.

---

### How REST APIs Work

1. **Client Request**:

   - Clients send HTTP requests using methods like:
     - **GET**: Retrieve data.
     - **POST**: Create new data.
     - **PUT**: Replace an entire resource.
     - **PATCH**: Partially update a resource.
     - **DELETE**: Remove data.

2. **Server Response**:

   - Processes the request and returns:
     - Status codes (e.g., 200: Success, 404: Not Found).
     - Data in JSON or XML format (if applicable).

3. **Stateless Communication**:
   - Each request must include all necessary information as the server doesn’t retain session states between requests.

---

### Difference Between PUT and PATCH

| **Aspect**    | **PUT**                              | **PATCH**                                |
| ------------- | ------------------------------------ | ---------------------------------------- |
| **Operation** | Updates the entire resource.         | Updates specific fields in the resource. |
| **Behavior**  | Missing fields are reset or removed. | Unchanged fields remain intact.          |

---

### REST APIs Needed

#### **User Management APIs**

1. `POST /signup`: Register a new user.
2. `POST /login`: Authenticate and log in the user.
3. `POST /profile`: Create a user profile.
4. `GET /profile`: Retrieve user profile details.
5. `PATCH /profile`: Update user profile.
6. `DELETE /profile`: Delete user profile.

#### **Connection Management APIs**

1. `POST /sendRequest`: Send a connection request (ignore/interested).
2. `POST /reviewRequest`: Accept or reject a connection request.
3. `GET /request`: Retrieve the list of sent and received requests.
4. `GET /connections`: Get a list of mutual connections.

---

## Next Steps

1. Finalize the **database schema** and **API design**.
2. Implement **backend services** for the listed APIs.
3. Develop the **frontend** to interact with backend services.
4. Test the application for functionality and fix any bugs.

---

> This document serves as a blueprint for the DevRoot project's development process. Let's build something amazing! 🚀

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
