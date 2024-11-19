<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 07 | Diving into the APis</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [1. JavaScript Object vs JSON Object](#1-javascript-object-vs-json-object)
  - [Key Differences](#key-differences)
- [2. Receiving Data Through POST API](#2-receiving-data-through-post-api)
  - [Overview](#overview)
  - [Process](#process)
- [3. Retrieving Users from the Database](#3-retrieving-users-from-the-database)
  - [Overview](#overview-1)
  - [Process](#process-1)
- [4. Handling Duplicate Documents with findOne()](#4-handling-duplicate-documents-with-findone)
  - [Overview](#overview-2)
  - [Key Points](#key-points)
- [5. Delete API - Removing Documents from Database](#5-delete-api---removing-documents-from-database)
  - [Overview](#overview-3)
  - [Key Method: `findOneAndDelete()`](#key-method-findoneanddelete)
- [6. PATCH vs PUT API](#6-patch-vs-put-api)
- [7. Updating Data with PATCH API](#7-updating-data-with-patch-api)
  - [Overview](#overview-4)
  - [Key Method: `findOneAndUpdate()`](#key-method-findoneandupdate)

---

## 1. JavaScript Object vs JSON Object

### Key Differences

| Feature                         | JavaScript Object                                                            | JSON (JavaScript Object Notation)                                |
| ------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Definition**                  | A collection of key-value pairs in JavaScript                                | A text-based data format for representing structured data        |
| **Data Types Supported**        | Any JavaScript type (string, number, boolean, array, object, function, etc.) | Limited to strings, numbers, booleans, arrays, objects, and null |
| **Syntax**                      | Property names do not need to be in quotes                                   | Property names must be in double quotes                          |
| **Usage**                       | Primarily used within JavaScript code for manipulation                       | Commonly used for data interchange between systems               |
| **Parsing Requirement**         | Not required in JavaScript, as it's native                                   | Needs `JSON.parse()` to convert to a JavaScript object           |
| **Stringification Requirement** | `JSON.stringify()` is used to convert to JSON format                         | Already in string format, no conversion needed for transmission  |
| **Functions Allowed**           | Can include functions as values                                              | Does not support functions                                       |
| **Comments**                    | Can contain comments                                                         | Does not allow comments                                          |

---

## 2. Receiving Data Through POST API

### Overview

The POST API is used to receive data from the client. In the DevRoot app, this data is often user information that needs to be stored in the database.

### Process

- **Step 1**: Set up a route that handles incoming POST requests.
- **Step 2**: Extract data from the request body. Ensure data validation and sanitize inputs to prevent issues such as SQL injection or XSS.
- **Step 3**: Once validated, structure the data appropriately before pushing it into the database.
- **Step 4**: Handle errors or success responses based on database operations to provide feedback to the client.

```javascript
app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = req.body;
  // creating a new instance of User Model and adding it to database
  const user = new User(userObj);
  try {
    await user.save();
    res.status(200).send("User Added successfully");
  } catch (err) {
    res.status(500).send("error saving the user" + err.message);
  }
});
```

---

## 3. Retrieving Users from the Database

### Overview

Fetching users from the database is essential for listing or displaying information on the frontend.

### Process

- **Step 1**: Set up a GET API route that triggers the database query for retrieving users.
- **Step 2**: Define query filters (if any) based on the request parameters. For example, you may want to fetch users with specific attributes.
- **Step 3**: Execute the query and structure the results before sending them back in the API response.
- **Step 4**: Ensure the response format is JSON, allowing the client to process and display data as needed.

```javascript
// Feed API - Get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ error: "User no user exist" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
```

---

## 4. Handling Duplicate Documents with findOne()

### Overview

When `findOne()` is used with duplicate email documents in the database, MongoDB will return the **first matching document** it finds based on the collection's internal document ordering.

### Key Points

- **Ordering**: MongoDB does not guarantee a specific order unless specified with an index. The document returned will typically be the first found, according to the insertion order.
- **Best Practice**: To avoid duplicates, enforce uniqueness in fields like email by using unique indexes.

```javascript
// User API to find a single user by email or username
app.get("/user", async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = email || username;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Email or username must be provided" });
    }

    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
```

---

## 5. Delete API - Removing Documents from Database

### Overview

The Delete API is used to remove specific documents from the database, allowing for efficient data management.

### Key Method: `findOneAndDelete()`

- Accepts the document's `conditions (object)` to identify and delete the target document.
- Returns the deleted document or `null` if no document is found.
- **Usage**: Primarily used for deleting user profiles or unwanted data from the collection.

```javascript
// Delete User API - Deleting a user by email or username
app.delete("/user", async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = email || username;

    if (!userId) {
      return res
        .status(404)
        .json({ error: "Email or username must be provided" });
    }

    const user = await User.findOneAndDelete({
      $or: [{ username: userId }, { email: userId }],
    });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res
      .status(200)
      .json({
        deletedUser: `User with username : ${user.username} and email : ${user.email} has been deleted`,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
```

---

## 6. PATCH vs PUT API

| Feature                  | PATCH                                               | PUT                                          |
| ------------------------ | --------------------------------------------------- | -------------------------------------------- |
| **Purpose**              | To partially update a document                      | To completely replace a document             |
| **Required Data**        | Only the fields that need updating                  | All fields, even if only one field changes   |
| **Typical Use Case**     | Updating a few fields, like changing a user's email | Replacing or re-uploading an entire document |
| **Database Interaction** | Updates specific fields, leaving others unchanged   | Replaces the document with a new version     |
| **HTTP Response Code**   | Typically 200 (OK) or 204 (No Content)              | Typically 200 (OK) or 204 (No Content)       |

---

## 7. Updating Data with PATCH API

### Overview

The PATCH API is used to update specific fields within a document without affecting other data.

### Key Method: `findOneAndUpdate()`

- Accepts the document's `conditions (object)` and an object with updated data.
- Only the fields in the update object will be modified; others remain unchanged.
- **Use Case**: Ideal for updating user information like username, bio, or profile picture without affecting other fields.

```javascript
// Patch User API - Updating user data
app.patch("/user", async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = email || username;

    const data = req.body;
    if (!userId) {
      return res
        .status(404)
        .json({ error: "Email or username must be provided" });
    }

    const user = await User.findOneAndUpdate(
      {
        $or: [{ username: userId }, { email: userId }],
      },
      data
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json({
      updatedUser: `User with username : ${user.username} and email : ${user.email} has been Updated`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
```

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
