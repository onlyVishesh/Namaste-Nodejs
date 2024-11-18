<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 06 | Database, Schema & Models Mongoose</span> 🚀
</h1>

# Mongoose: Database, Schema & Models

## Table of Contents

- [Mongoose: Database, Schema \& Models](#mongoose-database-schema--models)
  - [Table of Contents](#table-of-contents)
  - [1. Database Connection](#1-database-connection)
    - [1. Install Mongoose](#1-install-mongoose)
    - [2. Database Connection Code:](#2-database-connection-code)
  - [2. Database Schema in Mongoose](#2-database-schema-in-mongoose)
    - [What is a Database Schema?](#what-is-a-database-schema)
    - [Schema Parameters](#schema-parameters)
    - [Example: Creating a User Schema](#example-creating-a-user-schema)
  - [3. Saving a Document with a Schema in Mongoose](#3-saving-a-document-with-a-schema-in-mongoose)
    - [Example: Saving a User Document](#example-saving-a-user-document)
  - [4. Automatic Fields Added by MongoDB](#4-automatic-fields-added-by-mongodb)
    - [1. \_id Field](#1-_id-field)
      - [Characteristics](#characteristics)
    - [2. \_\_v Field](#2-__v-field)
      - [Characteristics](#characteristics-1)

---

## 1. Database Connection

This guide demonstrates how to connect to MongoDB directly using a connection string URL without using a `.env` file. This setup is convenient for testing but is not secure for production as it exposes sensitive information.

### 1. Install Mongoose

Make sure Mongoose is installed in your project:

```bash
npm install mongoose
```

### 2. Database Connection Code:

```javascript
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const PORT = 3000;

// MongoDB connection string URL
const databaseUrl =
  "mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority";

// first connecting to database then allowing requests
connectDB()
  .then(() => {
    console.log("database connection establish");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000...");
    });
  })
  .catch((err) => console.error(err));
```

_`Important Note: Always ensure that the database connection is established before starting the server. This setup is best for development or testing but not for production, as it can expose credentials.`_

## 2. Database Schema in Mongoose

A `schema` in Mongoose defines the structure of documents in a MongoDB collection, including fields, data types, and validation. Using schemas allows for structured data models, making it easier to handle data validation and consistency within MongoDB.

### What is a Database Schema?

- A Mongoose schema outlines the fields and their types for a document in a MongoDB collection.
- Schemas allow you to apply constraints, set defaults, and define validation rules for each field.
- Mongoose schemas enable structured, schema-driven data handling similar to traditional SQL databases.

### Schema Parameters

- **type**: Defines the data type of the field (e.g., String, Number, Date, ObjectId).
- **required**: A boolean indicating whether this field must be provided.
- **unique**: Ensures that the value of this field must be unique across all documents.
- **default**: A default value for the field if not provided.
- **enum**: Restricts the field to a set of predefined values.
- **min/max**: For numerical values, sets the minimum or maximum allowable value.

### Example: Creating a User Schema

```javascript
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  role: {
    type: String,
    enum: ["admin", "moderator", "user"],
    default: "user",
  },
});

// Export the model
const User = mongoose.model("User", userSchema);

module.exports = User;
```

## 3. Saving a Document with a Schema in Mongoose

Once a schema is defined in Mongoose, you can create and save documents to MongoDB based on that schema. Mongoose provides a straightforward way to add documents with its `.save()` method, ensuring the data adheres to the schema’s structure and validation rules.

### Example: Saving a User Document

```javascript

const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    username: "onlyVishesh",
    firstName: "Vishesh",
    email: "Vishesh@gmail.com",
    password: "vishesh#1234",
    avatar: "https://avatars,
    role: "admin",
  };

  // creating a new instance of User Model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("error saving the user" + err.message);
  }
});
```

## 4. Automatic Fields Added by MongoDB

MongoDB automatically adds certain fields to documents within collections. Understanding these fields is crucial for effective data management. This section outlines two key automatic fields: `_id` and `__v`.

### 1. \_id Field

The `_id` field is a unique identifier for each document in a MongoDB collection. It serves as the primary key for the document.

#### Characteristics

- **Type**: `ObjectId`
- **Uniqueness**: Each document must have a unique `_id` value. If you attempt to insert a document with a duplicate `_id`, MongoDB will return an error.
- **Auto-generated**: If not provided, MongoDB generates this field automatically when a document is created.

Example

```javascript
{
  "_id": ObjectId("60d5b6f0d89a3c52a8d7c331"),
  "name": "Vishesh"
}
```

### 2. \_\_v Field

The `__v` field is an automatic field added by MongoDB when using Mongoose to manage document versions. This field is used to track the version of a document and helps manage concurrent updates to prevent overwriting changes.

#### Characteristics

- **Type**: `Number`
- **Purpose**: It tracks the version of the document for concurrency control.
- **Auto-incremented**: The `__v` field increments automatically with each update to the document.

Example

```javascript
{
  "_id": ObjectId("60d5b6f0d89a3c52a8d7c331"),
  "name": "Vishesh",
  "__v": 0
}
```

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
