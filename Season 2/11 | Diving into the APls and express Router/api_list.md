# List of all the APIs used in DevRoot

## APIs related to user login - authRouter

- [x] **POST** /signup - to register user.
- [x] **POST** /login - to login user.
- [x] **POST** /logout - to logout user.
- [x] **PATCH** /forgetPassword - to change password without login.
- [x] **PATCH** /changePassword - to change password when login.

## APIs related to profile - profileRouter

- [x] **GET** /profile/view - to view profile.
- [x] **PATCH** /profile/edit - to edit my profile.
- [ ] **DELETE** /profile/delete - To delete a user account.
- [ ] **PATCH** /profile/changeStatus - To temporarily deactivate a user account if active or reactive user account if deactivated.
- [ ] **GET** /profile/:userId - To view another user's public profile.

## APIs related to connections

### **connectionRequestRouter**

- [ ] **POST** /request/send/interested/:userId - to send connection request.
- [ ] **POST** /request/send/ignored/:userId - to ignore user.
- [ ] **GET** /requests/send - to show all the connection requests sent.
- [ ] **GET** /requests/received - to show all the connection requests received.
- [ ] **POST** /request/review/accepted/:requestId - to accept a connection request.
- [ ] **POST** /request/review/rejected/:requestId - to reject a connection request.
- [ ] **POST** /request/review/retrieve/:requestId - to retrieve a connection request that has been sent.

### **userConnections**

- [ ] **GET** /user/feed - to view profiles.
- [ ] **POST** /user/connections - to see all connections.
- [ ] **DELETE** /user/connections/:connectionId - To remove a connection.

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