<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 06 Scheduling Cron Jobs</span> 🚀
</h1>
Welcome to the sixth part of the Namaste Node.js series! In this module, you'll learn how to automate tasks in your Node.js backend using cron jobs. We'll use `node-cron` to schedule weekly email reminders for users, and leverage `date-fns` for date calculations.

---

## 📌 Quick Links

[![Frontend Repo](https://img.shields.io/badge/Frontend-Repository-green)](https://github.com/onlyVishesh/DevRoot-Frontend)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-blue)](https://github.com/onlyVishesh/DevRoot-Backend)

---

## 📋 Table of Contents

- [� Quick Links](#-quick-links)
- [📋 Table of Contents](#-table-of-contents)
- [📝 What is a Cron Job?](#-what-is-a-cron-job)
- [📦 What is `node-cron`?](#-what-is-node-cron)
- [📅 What is `date-fns`?](#-what-is-date-fns)
- [🗂️ Project Structure](#️-project-structure)
- [🛠️ How to Schedule Cron Jobs in Node.js](#️-how-to-schedule-cron-jobs-in-nodejs)
  - [1. Install Dependencies](#1-install-dependencies)
  - [2. Create a Cron Schedule](#2-create-a-cron-schedule)
  - [3. Use `date-fns` for Date Calculations](#3-use-date-fns-for-date-calculations)
  - [4. Example: Weekly Email Reminder Cron Job](#4-example-weekly-email-reminder-cron-job)
- [📧 Email Template](#-email-template)
- [💡 Tips](#-tips)
- [⭐ If you found this guide helpful, please star the repository](#-if-you-found-this-guide-helpful-please-star-the-repository)

## 📝 What is a Cron Job?

A **cron job** is a scheduled task that runs automatically at specified intervals. Cron jobs are widely used for automating repetitive tasks like sending emails, cleaning up databases, or generating reports. The schedule is defined using a special syntax called a **cron expression**.

- **Cron Expression Example:**
  - `0 9 * * 1` → Runs at 09:00 every Monday
  - Format: `minute hour day month weekday`
  - [Learn more at crontab.guru](https://crontab.guru/)

---

## 📦 What is `node-cron`?

[`node-cron`](https://www.npmjs.com/package/node-cron) is a Node.js library that allows you to schedule and run cron jobs directly in your JavaScript code. It uses the familiar cron syntax and is easy to integrate into any Node.js project.

**Key Features:**

- Schedule tasks using cron expressions
- Lightweight and simple API
- No external dependencies required

---

## 📅 What is `date-fns`?

[`date-fns`](https://date-fns.org/) is a modern JavaScript date utility library. It provides a comprehensive set of functions for manipulating, formatting, and calculating dates in a simple and consistent way.

**Why use `date-fns`?**

- Pure functions, immutable, and simple API
- Handles date math (like subtracting days, months, etc.)
- No need to deal with JavaScript's complex native Date methods

**Example:**

```js
const { subDays } = require("date-fns");
const lastWeekDate = subDays(new Date(), 7); // 7 days ago
```

---

## 🗂️ Project Structure

```text
06 Scheduling Cron Jobs/
├── Backend/
│   ├── src/
│   │   ├── models/
│   │   ├── templates/
│   │   ├── utils/
│   │   └── ...
│   └── ...
└── Frontend/
    └── ...
```

---

## 🛠️ How to Schedule Cron Jobs in Node.js

### 1. Install Dependencies

```bash
npm install node-cron date-fns
```

### 2. Create a Cron Schedule

- Use `node-cron` to schedule tasks. Example:

```js
const cron = require("node-cron");
cron.schedule("0 9 * * 1", () => {
  // Runs every Monday at 09:00
});
```

- Cron syntax: `minute hour day month weekday`
- Use [crontab.guru](https://crontab.guru/) to build and understand cron expressions.

### 3. Use `date-fns` for Date Calculations

```js
const { subDays } = require("date-fns");
const lastWeekDate = subDays(new Date(), 7);
```

### 4. Example: Weekly Email Reminder Cron Job

- Fetch users with pending requests in the last week.
- Group requests by user.
- Send a summary email to each user.

See [`src/utils/cronjob.js`](Backend/src/utils/cronjob.js) for the full implementation.

---

## 📧 Email Template

- The weekly reminder email uses a custom HTML template.
- See [`src/templates/WeeklyReminderMailTemplate.js`](Backend/src/templates/WeeklyReminderMailTemplate.js) for details.

---

## 💡 Tips

- Always test your cron jobs in development before deploying to production.
- Use environment variables for sensitive data (see previous module on dotenv).
- Monitor your scheduled jobs and log errors for debugging.

---

## ⭐ If you found this guide helpful, please star the repository
