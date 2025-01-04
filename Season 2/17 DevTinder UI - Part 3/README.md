<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 17 | DevRoot UI - Part 3</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
  - [Feature: Added Logout Option](#feature-added-logout-option)
  - [Feature: Feed Page that Contains User Card](#feature-feed-page-that-contains-user-card)
  - [Feature: Profile Page and Edit Feature](#feature-profile-page-and-edit-feature)
  - [Feature: Added View Profile Option to User Card](#feature-added-view-profile-option-to-user-card)

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊

---

### Feature: Added Logout Option

A logout feature has been added to the platform, allowing users to securely log out of their accounts. The logout button is easily accessible in the navigation bar, providing a smooth user experience.

- **Feature Highlights:**
  - A new logout button in the UI.
  - Once clicked, the user is logged out and redirected to the homepage.
  - Session data is cleared to ensure the user is signed out completely.
  - uses `/logout` API

---

### Feature: Feed Page that Contains User Card

The Feed page has been introduced, where users can see a collection of user cards. Each card contains relevant information such as the user's profile picture, name, skills etc. This page is designed to offer users an engaging and interactive feed.

- **Feature Highlights:**
  - Displays a list of user cards.
  - Each card shows the user's name, profile picture, and additional details.
  - Clickable user cards that allow for further interaction and navigation.
  - Created a Redux slice to store feed data, enabling state management for smooth updates.
  - Uses the `/feed` API to fetch the feed data.

---

### Feature: Profile Page and Edit Feature

A dedicated Profile page has been added, where users can view their personal details and make updates. This page offers an interface for users to modify their profile information, including their about, profile picture, and more.

- **Feature Highlights:**
  - A clean, user-friendly profile page.
  - Users can update personal details like about, avatar, and other settings.
  - A save button that applies changes made to the profile.
  - uses `/profile` and `/profile/edit` APIs

---

### Feature: Added View Profile Option to User Card

Now, each user card in the Feed page includes an option to view the user's full profile. This feature provides a seamless experience for users to quickly navigate to the profile page of any individual they’re interested in.

- **Feature Highlights:**
  - A "View Profile" button added to the user cards.
  - Clicking the button takes the user directly to the profile page of the selected user.
  - Ensures users can explore others' profiles with ease.
  - uses `/profile/:userId` API

---

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
