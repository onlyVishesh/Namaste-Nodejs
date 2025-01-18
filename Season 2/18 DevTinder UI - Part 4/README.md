<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 18 | DevRoot UI - Part 4</span> 🚀
</h1>

## Table of Contents

- [Feature: Network Page](#feature-network-page)
  - [Interested](#interested)
  - [Connection](#connection)
  - [Followers](#followers)
  - [Following](#following)
  - [Ignored](#ignored)
  - [Rejected](#rejected)
  - [State Management](#state-management)

---

# Feature: Network Page

A dedicated **Network Page** has been added to help users manage and monitor their connections in a more organized and user-friendly manner. This feature allows users to see their different connection statuses, track interactions, and engage more effectively with other users. The page segments connections into six categories to offer a clear and intuitive interface for managing relationships.

## Interested

The **Interested** section displays all connection requests sent to the `logged-in user` with the `interested` status. It allows users to keep track of incoming requests they haven’t acted upon yet.

- **Feature Highlights:**
  - Displays a list of users who are interested in connecting with the logged-in user.
  - Allows users to view details about the requestor, including name and profile picture.
  - Managed via Redux to ensure state consistency across the platform.
  - Dynamically updates as requests are accepted, rejected, or ignored.
  - Integrates with the `/request/received` API to fetch and update request data.

---

## Connection

The **Connection** section displays all users with whom the `logged-in user` has an `accepted` connection. It helps users keep track of their successful connections and build their network.

- **Feature Highlights:**
  - Displays a list of users who have accepted the connection request.
  - Shows relevant details about each connected user, such as name and profile picture.
  - Updates automatically when a request is accepted.
  - Managed via Redux for real-time state management.
  - Fetches and updates data through the `/request/accepted` API.

---

## Followers

The **Followers** section lists users who are following `logged-in user`. These users are `interested` in your content or profile. This section provides users with the opportunity to either follow back, ignore followers or connect.

- **Feature Highlights:**
  - Displays a list of users following you with the status of **Accepted**, **Interested** or **Rejected**.
  - Allows users to choose whether to follow them back or ignore.
  - Lists users who are interested in your content but have not formally connected with you.
  - Dynamically updates as you follow users back or choose to ignore them.
  - Uses Redux to manage the state of followers and their actions.
  - Fetches follower data through the `/request/followers` API.

---

## Following

The **Following** section displays the users `logged-in user` are currently following. This list includes people you're `interested` in or have been actively engaging with. The section allows you to manage your connections by `unfollowing` users or engaging with them further through methods like direct messaging.

- **Feature Highlights:**
  - Displays a list of users you're following.
  - Includes users you're interested in or have engaged with recently.
  - Allows users to unfollow individuals or continue engaging with them.
  - Dynamically updates as you follow or unfollow users.
  - Uses Redux to manage the state of following users.
  - Fetches following data through the `/review/send` API.

---

## Ignored

The **Ignored** section displays users whose connection requests or profiles `logged-in user` have chosen to ignore. These `ignored` requests are placed here to ensure they don’t clutter your network or feed, allowing for a cleaner experience.

- **Feature Highlights:**
  - Displays users whose requests have been ignored.
  - Ensures ignored requests do not clutter your network or feed.
  - Allows you to revisit ignored requests and decide whether to engage or remove them.
  - Users in this section are not notified that their request was ignored, maintaining discretion.
  - Updates dynamically as you choose to ignore requests.
  - Uses Redux to manage the ignored requests state.
  - Fetches ignored requests through the `/request/ignored` API.

---

## Rejected

The **Rejected** section shows users whose connection requests `logged-in user` have rejected. Once rejected, these users are moved out of the "Interested" or "Followers" sections and placed here, maintaining a clear distinction between active and rejected requests.

- **Feature Highlights:**
  - Displays users whose connection requests have been rejected.
  - Once rejected, users are removed from the "Interested" or "Followers" section and placed in this category.
  - Provides the ability to unblock or un-reject users, allowing for a second chance to interact if needed.
  - Helps keep track of interactions and rejected requests, ensuring unwanted connections are minimized.
  - Allows users to revisit their rejection decisions and reconsider connections.
  - Uses Redux to manage the rejected requests state.
  - Fetches rejected requests through the `/request/rejected` API.

---

## State Management

- The data for all sections is stored and managed using `Redux` to ensure smooth updates.
- As users change their connection statuses (such as accepting or rejecting requests), the UI is updated in real-time.
- Each connection section is connected to the Redux store, which centralizes the state and ensures consistency across the application.

---

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
