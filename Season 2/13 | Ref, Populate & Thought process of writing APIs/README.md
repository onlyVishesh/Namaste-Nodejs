<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 13 | Ref, Populate & Thought process of writing APIs</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Thought Process](#thought-process)
- [Understanding `ref` in Mongoose](#understanding-ref-in-mongoose)
  - [What is `ref`?](#what-is-ref)
  - [Example:](#example)
  - [Why Use `ref`?](#why-use-ref)
- [Using `populate` in Mongoose](#using-populate-in-mongoose)
  - [What is populate?](#what-is-populate)
  - [Example:](#example-1)
  - [Benefits:](#benefits)
- [Exploring MongoDB Query Operators](#exploring-mongodb-query-operators)
- [Conclusion](#conclusion)

---

## Thought Process

Refer this [Readme file](./thoughtProcess.md) for the detailed thought process of creating each APIs Request

---

## Understanding `ref` in Mongoose

### What is `ref`?

In Mongoose, `ref` is used to establish relationships between different schemas by referencing documents in another collection.

### Example:

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Connection" }],
});
```

### Why Use `ref`?

- Creates logical relationships between collections.
- Facilitates the use of populate to fetch related documents.

## Using `populate` in Mongoose

### What is populate?

`populate` fills in the referenced documents in a query result, allowing you to retrieve related data efficiently.

### Example:

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Connection" }],
});
```

### Benefits:

- Simplifies queries for related data.
- Reduces the need for multiple queries.

## Exploring MongoDB Query Operators

| **Operator**   | **Description**                                                                                             | **Example**                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `$nin`         | Matches values not in a specified array.                                                                    | `{ _id: { $nin: [id1, id2] } }`                                          |
| `$and`         | Combines multiple conditions that all must be true.                                                         | `{ $and: [{ age: { $gt: 18 } }, { status: "active" }] }`                 |
| `$ne`          | Matches documents where the value is not equal to a specified value.                                        | `{ status: { $ne: "deactivated" } }`                                     |
| `$gt`          | Matches values that are greater than the specified value.                                                   | `{ age: { $gt: 18 } }`                                                   |
| `$gte`         | Matches values that are greater than or equal to the specified value.                                       | `{ age: { $gte: 18 } }`                                                  |
| `$lt`          | Matches values that are less than the specified value.                                                      | `{ age: { $lt: 30 } }`                                                   |
| `$lte`         | Matches values that are less than or equal to the specified value.                                          | `{ age: { $lte: 30 } }`                                                  |
| `$eq`          | Matches values that are equal to the specified value.                                                       | `{ status: { $eq: "active" } }`                                          |
| `$in`          | Matches values that are in a specified array.                                                               | `{ status: { $in: ["active", "pending"] } }`                             |
| `$or`          | Combines multiple conditions where at least one condition must be true.                                     | `{ $or: [{ status: "active" }, { status: "pending" }] }`                 |
| `$exists`      | Matches documents that have the specified field.                                                            | `{ age: { $exists: true } }`                                             |
| `$type`        | Matches documents where the value of the field is of a specified type.                                      | `{ age: { $type: "int" } }`                                              |
| `$regex`       | Matches documents where the field value matches a specified regular expression.                             | `{ name: { $regex: "^A" } }`                                             |
| `$not`         | Inverts the effect of a query operator.                                                                     | `{ age: { $not: { $lt: 18 } } }`                                         |
| `$size`        | Matches arrays with the specified length.                                                                   | `{ tags: { $size: 3 } }`                                                 |
| `$all`         | Matches documents where the array field contains all the specified elements.                                | `{ tags: { $all: ["mongodb", "nodejs"] } }`                              |
| `$elemMatch`   | Matches documents that contain an array field with at least one element that satisfies the specified query. | `{ reviews: { $elemMatch: { rating: { $gte: 4 }, reviewer: "John" } } }` |
| `$inc`         | Increments the value of a field by a specified amount.                                                      | `{ age: { $inc: 1 } }`                                                   |
| `$mul`         | Multiplies the value of a field by a specified amount.                                                      | `{ price: { $mul: 1.1 } }`                                               |
| `$push`        | Adds an element to an array field.                                                                          | `{ tags: { $push: "newTag" } }`                                          |
| `$pop`         | Removes an element from the beginning or the end of an array.                                               | `{ tags: { $pop: 1 } }`                                                  |
| `$pull`        | Removes all elements from an array that match the specified condition.                                      | `{ tags: { $pull: { tag: "deprecated" } } }`                             |
| `$addToSet`    | Adds a value to an array only if it does not already exist.                                                 | `{ tags: { $addToSet: "newTag" } }`                                      |
| `$currentDate` | Sets the value of a field to the current date.                                                              | `{ lastModified: { $currentDate: { $type: "date" } } }`                  |
| `$mod`         | Matches values based on the result of a modulo operation.                                                   | `{ score: { $mod: [2, 0] } }`                                            |

## Conclusion

This guide provided an overview of using `ref` and `populate` in Mongoose, creating logical and efficient APIs, and exploring MongoDB query operators like `$nin`, `$and`, `$ne` etc.

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊

````

```

```
````
