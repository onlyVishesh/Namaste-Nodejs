<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 19 | DevRoot UI - Part 5</span> 🚀
</h1>

<p align="center">
  <strong>Welcome to DevRoot UI - Part 5!</strong> This update introduces exciting new features and enhancements to improve user experience, security, and functionality. Dive in to explore what's new! 🎉
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [✨ New Features](#-new-features)
  - [Swipeable Card](#swipeable-card)
    - [Key Highlights:](#key-highlights)
  - [Markdown Editable About Section](#markdown-editable-about-section)
    - [Key Highlights:](#key-highlights-1)
  - [Skill Suggestion](#skill-suggestion)
    - [Key Highlights:](#key-highlights-2)
  - [Home Page](#home-page)
    - [Key Highlights:](#key-highlights-3)
  - [Route Protection](#route-protection)
    - [Key Highlights:](#key-highlights-4)
  - [Admin Dashboard](#admin-dashboard)
    - [Key Highlights:](#key-highlights-5)
  - [Search Functionality](#search-functionality)
    - [Key Highlights:](#key-highlights-6)

---

## ✨ New Features

### Swipeable Card

We’ve introduced **Swipeable Cards** using **Framer Motion** to make user interactions more dynamic and engaging. This feature allows users to:

- **Swipe Left** ➡️ to **Ignore** a connection or suggestion.
- **Swipe Right** ⬅️ to mark as **Interested** in a connection or suggestion.
- **Swipe Up** ⬆️ to **Skip** and move to the next card.

#### Key Highlights:

- **Smooth Animations**: Leverages Framer Motion for fluid and responsive swipe animations.
- **Interactive Feedback**: Provides visual feedback (e.g., color changes) based on swipe direction.
- **State Management**: Integrated with Redux to ensure real-time updates and consistency across the app.
- **Customizable Actions**: Easily extendable to support additional swipe gestures or actions.

---

### Markdown Editable About Section

The **About Section** on user profiles is now powered by **react-markdown-editor-lite**, enabling users to:

- Write and format their "About" section using **Markdown**.
- Preview the formatted content in real-time.
- Save and display the formatted content seamlessly.

#### Key Highlights:

- **Rich Text Editing**: Supports Markdown syntax for headings, lists, links, and more.
- **Live Preview**: Displays a live preview of the formatted content as users type.
- **Custom Styling**: Allows users to customize the appearance of their "About" section.
- **Integration with Backend**: Saves the Markdown content to the database and retrieves it for display on the profile page.

---

### Skill Suggestion

To make skill selection easier, we’ve added a **Skill Suggestion** feature that:

- Provides **auto-suggestions** as users type.
- Helps users select from a predefined list of skills.
- Ensures consistency and accuracy in skill representation.

#### Key Highlights:

- **Dynamic Suggestions**: Fetches skill suggestions from a predefined list or database as users type.
- **Tagging Support**: Allows users to add multiple skills as tags.
- **Validation**: Ensures that only valid skills are added to the profile.
- **Backend Integration**: Saves selected skills to the user’s profile and retrieves them for display.

---

### Home Page

Added a **Home Page** that provides an overview of the platform and its features. This page includes:

- A brief introduction to the platform.
- Highlights of key functionalities.
- Links to important sections like the network page, profile, and admin dashboard.

#### Key Highlights:

- **User-Friendly Design**: Clean and intuitive layout for easy navigation.
- **Dynamic Content**: Displays platform statistics or updates dynamically.
- **Call-to-Action Buttons**: Encourages users to explore features like the network page or profile settings.

---

### Route Protection

Implemented **Route Protection** to ensure that only authorized users can access specific routes. This includes:

- Restricting access to certain routes based on user roles (e.g., admin-only routes).
- Redirecting unauthorized users to the appropriate pages (e.g., login page).

#### Key Highlights:

- **Role-Based Access Control**: Ensures that only logged-in users or admins can access protected routes.
- **Secure Redirects**: Redirects unauthorized users to the login page or a custom error page.
- **Integration with Auth Middleware**: Uses JWT tokens and Redux to manage user authentication and authorization.

---

### Admin Dashboard

Added an **Admin Dashboard** to provide administrators with a comprehensive view of platform activity. The dashboard includes:

- **Total Users**: Displays the total number of registered users.
- **Total Requests**: Shows the total number of connection requests.
- **Total Interested Requests**: Provides a count of users who have expressed interest in connecting.
- **Other Metrics**: Additional insights to help admins monitor and manage the platform effectively.

#### Key Highlights:

- **Real-Time Data**: Fetches and updates data dynamically from the backend.
- **Interactive Charts**: Uses charts or graphs to visualize platform metrics.
- **User Management**: Allows admins to view, edit, or delete user profiles.
- **Request Monitoring**: Tracks connection requests and their statuses (e.g., pending, accepted, rejected).

---

### Search Functionality

Enhanced the **Search Functionality** with:

- **Full-Text Search**: Leverages MongoDB's full-text search capabilities for fast and accurate results.
- **Regex Fallback**: Provides a fallback mechanism using regex for partial matching when full-text search is not applicable.
- **Pagination**: Supports paginated results for better performance and user experience.

#### Key Highlights:

- **Fast and Accurate**: Uses MongoDB's text index for efficient searching.
- **Partial Matching**: Supports partial queries (e.g., "vis" matches "Vishesh") using regex.
- **Relevance Sorting**: Sorts search results by relevance using MongoDB's text score.
- **Pagination**: Displays results in pages to improve performance and usability.

---

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
