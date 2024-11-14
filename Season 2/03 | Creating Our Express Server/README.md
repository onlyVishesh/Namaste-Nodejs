<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 03 | Creating Our Express Server</span> 🚀
</h1>

## Overview

**DevRoot** is a professional networking and collaboration platform designed specifically for developers, engineers, and tech enthusiasts. It serves as the foundation for innovation, connection, and growth within the developer community—your go-to hub for building meaningful connections and tackling exciting projects.

This project uses the following technologies:

- **Frontend**: React and Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB

---

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [DevRoot Backend](#devroot-backend)
  - [Repository Setup](#repository-setup)
  - [Learning Journey](#learning-journey)
    - [1. What is Express Framework?](#1-what-is-express-framework)
    - [2. Installing Express](#2-installing-express)
  - [Understanding Key Files and Folders in a Node.js Project](#understanding-key-files-and-folders-in-a-nodejs-project)
    - [1. `node_modules`](#1-node_modules)
    - [2. `package.json`](#2-packagejson)
    - [3. `package-lock.json`](#3-package-lockjson)
    - [4. Other Common Files](#4-other-common-files)
  - [Server Setup](#server-setup)
  - [Understanding the `-g` Flag in `npm install`](#understanding-the--g-flag-in-npm-install)
    - [What is `-g` in `npm install`?](#what-is--g-in-npm-install)
    - [Local vs. Global Installation](#local-vs-global-installation)
      - [Local Installation (Default):](#local-installation-default)
      - [Global Installation (`-g` Flag):](#global-installation--g-flag)
    - [Example Usage](#example-usage)

---

## DevRoot Backend

### Repository Setup

- Created a new repository for the backend service: [DevRoot Backend GitHub Repository](https://github.com/your-username/devroot-backend)
- Initialized the repository using `npm init`, which generated a `package.json` file to manage project dependencies and configurations.

---

### Learning Journey

#### 1. What is Express Framework?

- **Express** is a minimal, flexible, and robust web application framework for Node.js that simplifies server-side development.
- Explored the official website to understand its purpose and features: [Express.js Official Website](https://expressjs.com)

#### 2. Installing Express

- Installed Express in the project using npm:

  ```bash
  npm install express
  ```

  This added the Express framework to the `package.json` file under dependencies and created the `node_modules` folder to store the installed packages.

### Understanding Key Files and Folders in a Node.js Project

#### 1. `node_modules`

- **Description**:
  - The `node_modules` folder contains all the installed npm packages and their dependencies.
  - It is automatically generated when packages are installed using npm.
- **Purpose**:
  - Stores all the libraries and dependencies required by the project.
  - Can be large because it includes every package and sub-dependency specified in the project.
- **Note**:
  - You typically don’t need to manually edit this folder.
  - If deleted, it can be recreated by running `npm install`.

#### 2. `package.json`

- **Description**:
  - The `package.json` file acts as the manifest file for a Node.js project, containing metadata such as project name, version, description, author, and dependencies.
- **Key Fields**:
  - `"name"`: The name of the project.
  - `"version"`: The current version of the project.
  - `"description"`: A brief description of the project.
  - `"dependencies"`: Lists npm packages required for the project.
  - `"devDependencies"`: Lists packages needed for development but not in production.
  - `"scripts"`: Defines custom npm commands for running tasks (e.g., `"start": "node app.js"`).
- **Common Commands**:
  - `npm init`: Creates a new `package.json` file.
  - `npm install <package>`: Adds a package to the project’s dependencies.
  - `npm install <package> --save-dev`: Adds a package to `devDependencies`.

#### 3. `package-lock.json`

- **Description**:
  - The `package-lock.json` file is automatically generated when npm modifies the `node_modules` tree or `package.json`.
  - Ensures consistent installation of dependencies by locking the versions.
- **Purpose**:
  - Prevents issues caused by updates to dependencies or sub-dependencies.
  - Provides a detailed description of the dependency tree and specific versions installed.

#### 4. Other Common Files

- **`.gitignore`**:
  - Specifies files and directories that should be ignored by Git. Commonly used to exclude `node_modules` and other generated files.
- **`README.md`**:
  - A markdown file that serves as documentation for the project, typically including instructions for installation, usage, and contribution.

---

### Server Setup

Created the basic server using Express:

```javascript
const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("hello Welcome to the '/' end point!!");
});

app.use("/hello", (req, res) => {
  res.send("hello how are you!!");
});

app.use("/secret", (req, res) => {
  res.send("How do you find me ? Are you god ??");
});

app.listen(3000, () => {
  console.log("Server is listing on port 3000...");
});
```

### Understanding the `-g` Flag in `npm install`

#### What is `-g` in `npm install`?

The `-g` flag stands for "global" and is used with the `npm install` command to install packages globally on your system, rather than locally within a specific project.

#### Local vs. Global Installation

##### Local Installation (Default):

- When you run `npm install <package>`, the package is installed locally in the `node_modules` directory of the current project.
- The package is only accessible within that project and is added to the project's `package.json` dependencies.

##### Global Installation (`-g` Flag):

- When you run `npm install -g <package>`, the package is installed globally on your system.
- This makes the package accessible from the command line in any directory.
- Global installation is typically used for packages that provide command-line tools (e.g., `npm`, `nodemon`, `eslint`).

#### Example Usage

To install a package globally:

```bash
npm install -g <package>
npm install -g nodemon

```

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
