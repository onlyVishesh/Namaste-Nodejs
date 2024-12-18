# List of all the APIs used in DevRoot

## APIs related to user login - authRouter

- [x] **POST** /signup - to register user.
- [x] **POST** /login - to login user.
- [x] **POST** /logout - to logout user.
- [x] **PATCH** /forgetPassword - to change password when not logged in.
- [x] **PATCH** /changePassword - to change password when logged in.

## APIs related to profile - profileRouter

- [x] **GET** /profile/view - to view profile.
- [x] **PATCH** /profile/edit - to edit my profile.
- [x] **DELETE** /profile/delete - To delete a user account.
- [x] **PATCH** /profile/changeStatus - To temporarily deactivate a user account if active or reactive user account if deactivated.
- [x] **GET** /profile/:userId - To view another user's public profile.
- [x] **GET** /moderator/userNumbers/:status - To view the total number of users according to their status. [admin/moderator only]
- [x] **GET** /moderator/users/:status - To view the list of users according to their status. [admin/moderator only]

  ### Admin

  - [x] **GET** /admin/viewRole/:role - To view a list of user according to their role
  - [x] **PATCH** /admin/changeRole/:role/:userId - To change the role of a user
  - [x] **PATCH** /admin/changeStatus/:status/:userId - To change user status including blocking.
  - [x] **DELETE** /admin/user/delete/:userId - To delete a user account.

  ### Moderator

  - [x] **GET** /moderator/viewRole/:role - To view a list of user according to their role (moderator/user role only)
  - [x] **PATCH** /moderator/changeRole/:role/:userId - To change the role of a user (to moderator/user role only)
  - [x] **PATCH** /moderator/changeStatus/:userId - To temporarily deactivate a user account if active or reactive user account if deactivated.

## APIs related to connections

### **connectionRequestRouter**

- [x] **POST** /request/send/interested/:userId - to send connection request.
- [x] **POST** /request/send/ignored/:userId - to ignore user.
- [x] **GET** /requests/send - to show all the connection requests sent.
- [x] **GET** /requests/received - to show all the connection requests received.
- [x] **GET** /requests/ignored - to show all the ignored connection requests received.
- [x] **DELETE** /request/review/retrieve/:requestId - to retrieve a connection request that has been sent.
- [x] **DELETE** /request/review/ignored/:requestId - to delete an ignored connection request.

- [x] **POST** /request/review/accepted/:requestId - to accept a connection request.
- [x] **POST** /request/review/rejected/:requestId - to reject a connection request.

- [ ] **GET** /moderator/requests/totalRequests
- [ ] **GET** /admin/request/:status
- [ ] **GET** /admin/request/:userId

### **userConnectionsRouter**

- [x] **GET** /user/feed - to view profiles.
- [x] **POST** /user/connections - to see all connections.
- [x] **DELETE** /user/connections/:connectionId - To remove a connection.

## APIs related to search user - searchRouter

- [ ] **GET** /search - To search for users, skills, or topics (with query parameters like name, skill, etc.).

## Extra APIs (future scope)

### APIs related to post

- **GET** /feed/posts - To view feed posts shared by connections.
- **POST** /feed/post - To create a new post in the feed.
- **DELETE** /feed/post/:postId - To delete a post from the feed.
- **POST** /feed/post/:postId/like - To like a post.
- **POST** /feed/post/:postId/comment - To add a comment to a post.

### APIs for messaging

- **POST** /message/send/:userId - To send a direct message to a user.
- **GET** /message/conversation/:userId - To view the conversation with a user.

### APIs related to Projects

- **POST** /projects/add - To add projects to a profile.
- **PATCH** /projects/edit/:projectId - To edit a project.
- **DELETE** /projects/remove/:projectId - To remove a project from a profile.
