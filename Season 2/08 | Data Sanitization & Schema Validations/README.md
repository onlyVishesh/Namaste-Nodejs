<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 08 | Data Sanitization & Schema Validations</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Schema Types in Mongoose](#schema-types-in-mongoose)
  - [Basic Types](#basic-types)
  - [All Schema Types](#all-schema-types)
    - [`required`](#required)
    - [`select`](#select)
    - [`validate`](#validate)
    - [`get`](#get)
    - [`set`](#set)
  - [String Schema Type](#string-schema-type)
  - [Number Schema Type](#number-schema-type)
  - [Date Schema Type](#date-schema-type)
- [API-Level Validations](#api-level-validations)
  - [PATCH API for Selected Field Updates](#patch-api-for-selected-field-updates)
- [Top Validation Methods in Validator.js](#top-validation-methods-in-validatorjs)
  - [1. **Validating Email IDs**](#1-validating-email-ids)
  - [2. **Validating URLs**](#2-validating-urls)
  - [3. **Validating Password Strength**](#3-validating-password-strength)
- [Benefits of Using Validator.js](#benefits-of-using-validatorjs)

---

## Overview

This document explains various Mongoose Schema types and validation methods, using a `User` schema as an example. Mongoose schema definitions provide a robust way to structure data and enforce validation rules to ensure the data stored in MongoDB remains accurate, consistent, and secure.

## Schema Types in Mongoose

Mongoose schemas allow us to define the shape of our data and enforce rules on individual fields. Here are some of the most commonly used types and options in Mongoose schemas.

### Basic Types

Mongoose supports a variety of basic data types that can be defined in your schema:

- **String**: Represents textual data.
- **Number**: Represents numeric data.
- **Date**: Represents a date and time.
- **Boolean**: Represents a true/false value.
- **Array**: Represents an array of values.
- **Buffer**: Represents binary data.
- **Mixed**: Used for data that can be any type.
- **ObjectId**: Represents an ObjectId, used for referencing other documents in MongoDB.

---

### All Schema Types

Mongoose provides several schema options that allow us to enforce data integrity and validation for each field. Some important schema types and their associated options include:

#### `required`

- **Type**: Boolean or Function
- **Description**: Specifies that a field must be provided before a document is saved.
- **Example**:
- ```javascript
  username: {
    type: String,
    required: true
  }
  ```

#### `default`

- **Type**: Any or Function
- **Description**: Sets a default value for a field if no value is provided. If it's a function, the return value of the function is used as the default.

- **Example**:

  ```javascript
  role: {
  type: String,
  default: "user"
  }
  ```

#### `select`

- **Type**: Boolean
- **Description**: Specifies whether the field should be included in query results by default.

- **Example**:

  ```javascript
  password: {
  type: String,
  select: false
  }

  ```

#### `validate`

- **Type**: Function
- **Description**: Adds a custom validation function for the field.
- **Example**:

  ```javascript
  email: {
  type: String,
  validate: {
    validator: function(value) {
      return validator.isEmail(value);
      },
    message: "Invalid email address"
    }
  }
  ```

#### `get`

- **Type**: Function
- **Description**: Defines a custom getter for this property using `Object.defineProperty()`.
- **Example**:

  ```javascript
  age: {
  type: Number,
  get: function() {
    return this._age * 2;
    }
  }
  ```

#### `set`

- **Type**: Function
- **Description**: Defines a custom setter for this property
- **Example**:

  ```javascript
  password: {
  type: String,
  set: function(value) {
    return bcrypt.hashSync(value, 10);
    }
  }
  ```

### String Schema Type

The `String` schema type allows the definition of text data with additional options for validation and transformation.

Options for the `String` type:

- **lowercase**: Boolean, converts the value to lowercase before saving.
- **uppercase**: Boolean, converts the value to uppercase before saving.
- **trim**: Boolean, removes whitespace from both ends of the string.
- **match**: Regular expression, validates the string using a regular expression.
- **enum**: Array, validates that the value is in the specified array.
- **minLength**: Number, ensures the string has a minimum length.
- **maxLength**: Number, ensures the string has a maximum length.

**Example**:

```javascript
firstName: {
type: String,
required: true,
trim: true,
minLength: [3, "First name is too short"],
maxLength: [50, "First name is too long"],
match: /^[a-zA-Z]+$/,
}
```

### Number Schema Type

The `Number` schema type is used for numeric values with validation options for range checks.

Options for the `Number` type:

- **min**: Number, ensures the value is greater than or equal to the specified number.
- **max**: Number, ensures the value is less than or equal to the specified number.
- **enum**: Array, validates that the number is in the specified set of values.

**Example**:

```javascript
age: {
type: Number,
min: [18, "Age must be at least 18"],
max: [100, "Age must be less than 100"]
}
```

### Date Schema Type

The `Date` schema type is used for date-related data with options for validation.

Options for the `Date` type:

- **min**: Date, ensures the date is later than or equal to the specified date.
- **max**: Date, ensures the date is earlier than or equal to the specified date.
- **expires**: Number or String, creates a TTL (Time-To-Live) index, with the value expressed in seconds.

**Example**

```javascript
  dateOfBirth: {
    type: Date,
    min: new Date('1900-01-01'),
    max: new Date('2023-12-31')
  }
```

## API-Level Validations

### PATCH API for Selected Field Updates

- **Field-Level Validation**: API-level validation ensures that only specific fields can be updated in a PATCH request. This limits changes to approved fields and improves security.
- **Selective Updates**: Enables users to update only allowed fields while maintaining the integrity of other data.

- **Benefits**:

  - Prevents unintended updates.
  - Minimizes errors by restricting updates to specified fields.
  - Enhances data security by controlling what data is modifiable.

  ```javascript
  const ALLOWED_UPDATE = [
    "username",
    "firstName",
    "lastName",
    "password",
    "avatar",
    "about",
    "skills",
    "dateOfBirth",
    "gender",
    "role",
    "status",
  ];
  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATE.includes(k)
  );

  if (!isUpdateAllowed) {
    throw new Error("Update not allow");
  }
  ```

## Top Validation Methods in Validator.js

Now focus on learning how to use the `validator.js` library for advanced data validation in the DevRoot app. Validator.js provides powerful and simple methods to validate user input fields, ensuring data accuracy and security.

### 1. **Validating Email IDs**

- **Method**: `isEmail`
- Ensures that the provided email address is in a valid format.
- Helps prevent invalid or malformed email addresses from being stored in the database.

```javascript
   email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid email address",
      },
    },
```

### 2. **Validating URLs**

- **Method**: `isURL`
- Validates whether a string is a properly formatted URL.
- Useful for checking the validity of photo URLs uploaded by users.

```javascript
   avatar: {
      type: String,
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
        message: "Give string is not an URL",
      },
    }
```

### 3. **Validating Password Strength**

- **Method**: `isStrongPassword`
- Checks if the password meets specific criteria for strength, such as:
  - Minimum length.
  - Inclusion of uppercase and lowercase letters.
  - Numbers and special characters.
- Ensures that users create secure passwords to protect their accounts.

```javascript
   password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value);
        },
        message:
          "Password is not strong",
      }
   }
```

## Benefits of Using Validator.js

- **Improved Data Integrity**: Ensures only valid data is stored in the database.
- **Enhanced Security**: Prevents common vulnerabilities caused by invalid inputs.
- **Ease of Use**: Simple methods for complex validations reduce development time.
- **Standard Compliance**: Ensures data adheres to industry standards (e.g., email formatting, URL structure).

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
