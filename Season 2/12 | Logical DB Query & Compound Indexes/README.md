<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 12 | Logical DB Query & Compound Indexes</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction to Schema `pre('save')` Hook](#introduction-to-schema-presave-hook)
  - [Example:](#example)
  - [Key Points:](#key-points)
- [Understanding Indexes in MongoDB](#understanding-indexes-in-mongodb)
  - [Types of Indexes:](#types-of-indexes)
- [Why Do We Need Indexes?](#why-do-we-need-indexes)
  - [Without Index:](#without-index)
  - [With Index:](#with-index)
- [Advantages of Creating Indexes](#advantages-of-creating-indexes)
- [Disadvantages of Creating Indexes](#disadvantages-of-creating-indexes)
- [Compound Indexes](#compound-indexes)
  - [Example:](#example-1)
  - [Key Considerations:](#key-considerations)
- [Conclusion](#conclusion)

---

## Introduction to Schema `pre('save')` Hook

The `schema.pre('save')` function in Mongoose is a middleware that runs before a document is saved to the database. It allows developers to:

- Validate or modify the data before saving.
- Hash sensitive information (e.g., passwords).
- Implement conditional operations or logging.

### Example:

```javascript
const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  { timestamps: true }
);

// pre save
connectionRequestSchema.pre("save", function (next) {
  // checking if fromUserId is same as toUserId
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You Could not send request to yourself");
  }

  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
```

### Key Points:

- Use `next()` to proceed with the save operation.
- Avoid asynchronous errors by wrapping operations in `try-catch` blocks.

---

## Understanding Indexes in MongoDB

Indexes in MongoDB are data structures that improve the speed of read operations by allowing the database to quickly locate documents that match a query.

### Types of Indexes:

- **Single Field Index**: Indexes a single field.
- **Compound Index**: Indexes multiple fields.
- **Text Index**: Supports text search operations.
- **Geospatial Index**: Supports queries on geographical data.
- **Hashed Index**: Distributes index values evenly across a range.

Read more: [MongoDB Index Types](https://www.mongodb.com/docs/manual/core/indexes/)

---

## Why Do We Need Indexes?

Indexes are essential for optimizing query performance. They help:

- **Speed up data retrieval**: Avoid full collection scans by narrowing down the search space.
- **Enforce uniqueness**: Prevent duplicate values in specific fields.
- **Sort data efficiently**: Enable faster sorting based on indexed fields.

### Without Index:

```javascript
db.users.find({ username: "onlyVishesh" });
// Scans all documents to find a match
```

### With Index:

```javascript
db.users.createIndex({ username: 1 });
// Locates the match directly using the index
```

---

## Advantages of Creating Indexes

1. **Improved Query Performance**: Faster searches and retrievals.
2. **Efficient Sorting**: Optimized sorting operations on indexed fields.
3. **Unique Constraints**: Ensures data integrity by preventing duplicates.
4. **Partial Indexing**: Index only documents that meet specific criteria.

---

## Disadvantages of Creating Indexes

1. **Increased Storage Requirements**: Indexes consume additional disk space.
2. **Slower Write Operations**: Insert, update, and delete operations may slow down as indexes need to be updated.
3. **Index Overhead**: Unused or poorly designed indexes can lead to inefficiencies.

---

## Compound Indexes

Compound indexes combine multiple fields into a single index structure, enabling efficient queries that filter or sort by those fields.

### Example:

```javascript
db.users.createIndex({ firstName: 1, lastName: 1 });
```

- Queries benefiting from this index:
  - `db.users.find({ firstName: 'Vishesh' });`
  - `db.users.find({ firstName: 'Vishesh', lastName: '' });`

### Key Considerations:

- Field order matters in compound indexes.
- Queries must include the leading field(s) to utilize the index efficiently.

Read more: [Compound Indexes in MongoDB](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)

---

## Conclusion

Indexes are a powerful tool in MongoDB for optimizing query performance, but they come with trade-offs in storage and write operation speed. Thoughtfully designing and maintaining indexes based on query patterns is essential for efficient database operations.

---

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
