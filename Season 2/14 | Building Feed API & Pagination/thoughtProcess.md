# Thought Process for API Requests

## Table of Contents

1. [APIs related to user login - authRouter](#apis-related-to-user-login---authrouter)
2. [APIs related to profile - profileRouter](#apis-related-to-profile---profilerouter)
3. [APIs related to connections](#apis-related-to-connections)
   - [connectionRequestRouter](#connectionrequestrouter)
   - [userConnectionsRouter](#userconnectionsrouter)
4. [APIs related to search user - searchRouter](#apis-related-to-search-user---searchrouter)
5. [Extra APIs (future scope)](#extra-apis-future-scope)
   - [APIs related to posts](#apis-related-to-posts)
   - [APIs for messaging](#apis-for-messaging)
   - [APIs related to projects](#apis-related-to-projects)

---

## APIs related to user login - authRouter

### 1. **POST** /signup

**Purpose**: To register a new user.  
**Thought Process**:

- **POST** is used here because we are creating a new resource (user) in the system.
- Validate the user input (e.g., email, password, username).
- Hash the password using bcrypt for security.
- Check for duplicate emails or usernames in the database.
- Store the user data in the database and return a success message with the user details or an error message.

**Edge Cases**:

- Duplicate email or username.
- Weak or insecure passwords.
- Missing required fields.

---

### 2. **POST** /login

**Purpose**: To log in a user.  
**Thought Process**:

- **POST** is used here because the login process involves authentication, which usually requires creating a session or generating a token for the user.
- Validate the email and password fields.
- Fetch the user from the database by email and check for account validity.
- If the credentials are correct, generate a JWT token for session management.
- Return the generated token and the user's profile details as the response.

**Edge Cases**:

- Incorrect email or password.
- Locked or inactive accounts.
- Multiple failed login attempts triggering account lockouts.

---

### 3. **POST** /logout

**Purpose**: To log out the user by invalidating their session or token.  
**Thought Process**:

- **POST** is used to perform an action (logging out) that involves invalidating the session or token, which is a change of state.
- Validate the current session token and invalidate it (e.g., by deleting or marking the token as invalid).
- Return a success response confirming the logout.

**Edge Cases**:

- Expired or invalid tokens.
- User already logged out or not logged in.

---

### 4. **PATCH** /forgetPassword

**Purpose**: To reset the user's password when they are logged out.  
**Thought Process**:

- **PATCH** is used because we are partially updating the user's information (password), not creating or deleting resources.
- Validate the email and/or username to ensure the account exists.
- Generate a password reset token and send it to the user via email or SMS.
- Allow the user to reset their password using the token and update the database.
- Return a success message once the password has been changed.

**Edge Cases**:

- Invalid or expired reset tokens.
- User attempts to reset password for a non-existent account.

---

### 5. **PATCH** /changePassword

**Purpose**: To allow a logged-in user to change their password.  
**Thought Process**:

- **PATCH** is used here because we are partially updating the user's information (changing the password).
- Validate the user's current password and ensure it's correct.
- Hash the new password using bcrypt and update the database.
- Return a success response confirming the password change.

**Edge Cases**:

- Incorrect current password.
- Weak password policies not being met.
- Token expiry or invalid session.

---

## APIs related to profile - profileRouter

### 1. **GET** /profile/view

**Purpose**: To view the logged-in user's profile.  
**Thought Process**:

- **GET** is used because we are retrieving data (profile information) without making any changes to the resource.
- Validate the session or token to ensure the user is authenticated.
- Fetch the user's profile data from the database and return it in the response.

**Edge Cases**:

- Invalid or expired tokens.
- Database read errors or incomplete user data.

---

### 2. **PATCH** /profile/edit

**Purpose**: To edit the user's profile details.  
**Thought Process**:

- **PATCH** is used because we are partially updating the user's profile data (such as bio, profile picture, etc.).
- Validate the input to ensure the fields being updated are correct.
- Authenticate the user and update the profile data in the database.
- Return the updated profile details in the response.

**Edge Cases**:

- Invalid input formats (e.g., image size too large, invalid bio).
- Concurrent updates or data inconsistencies.

---

### 3. **DELETE** /profile/delete

**Purpose**: To delete a user account.  
**Thought Process**:

- **DELETE** is used because we are removing a resource (user) permanently or marking it as inactive.
- Validate the user's authentication and confirm the deletion request.
- Soft delete the user account (e.g., mark as inactive) or remove all related data from the system.
- Return a success message confirming the deletion.

**Edge Cases**:

- Unauthorized or unauthenticated delete requests.
- Incomplete data cleanup causing orphan records.

---

### 4. **PATCH** /profile/changeStatus

**Purpose**: To temporarily deactivate or reactivate a user account.  
**Thought Process**:

- **PATCH** is used because we are partially updating the status of the user's account (active or deactivated).
- Validate the user's session or token.
- Change the status in the database (set to active or inactive).
- Return a success message confirming the status change.

**Edge Cases**:

- Invalid user status changes.
- Unauthorized attempts to change account status.

---

### 5. **GET** /profile/:userId

**Purpose**: To view another user's public profile.  
**Thought Process**:

- **GET** is used because we are retrieving data from the system (viewing a public profile).
- Validate the requested user ID and ensure the profile exists.
- Return the public details of the user's profile (excluding sensitive information like the password).

**Edge Cases**:

- Non-existent user ID.
- Accessing a restricted or private profile.

---

## APIs related to connections - connectionRequestRouter

### 1. **POST** /request/send/interested/:userId

**Purpose**: To send a connection request to another user.  
**Thought Process**:

- **POST** is used because we are creating a new resource (connection request) in the system.
- Validate the user ID and ensure the target user exists.
- Create a new connection request document and set its status to "interested".
- Notify the target user about the incoming connection request.

**Edge Cases**:

- Duplicate connection requests.
- Sending requests to inactive or blocked users.

---

### 2. **POST** /request/send/ignored/:userId

**Purpose**: To ignore a user for connection requests.  
**Thought Process**:

- **POST** is used to create a record in the system that marks a user as "ignored".
- Validate the user ID and ensure the target user exists.
- Mark the connection request status as "ignored".
- Notify the target user (if applicable).

**Edge Cases**:

- Duplicate ignored requests.
- Sending requests to deactivated users.

---

### 3. **GET** /requests/send

**Purpose**: To view all sent connection requests.  
**Thought Process**:

- **GET** is used because we are retrieving data (the list of sent requests) without changing any resource.
- Fetch and return all sent connection requests associated with the logged-in user.

**Edge Cases**:

- No sent requests.
- Issues with pagination when there are too many requests.

---

### 4. **GET** /requests/received

**Purpose**: To view all received connection requests.  
**Thought Process**:

- **GET** is used because we are fetching data (the list of received requests) without modifying the resource.
- Fetch and return all received connection requests for the logged-in user.

**Edge Cases**:

- No received requests.
- Issues with pagination or empty results.

---

### 5. **DELETE** /request/review/retrieve/:requestId

**Purpose**: To retrieve a sent connection request.  
**Thought Process**:

- **DELETE** is used because we are removing or canceling a request, which is a permanent action.
- Validate the request ID and ensure the connection request exists.
- Remove the request from the system.

**Edge Cases**:

- Invalid or non-existent request ID.
- Unauthorized delete requests.

---

### 6. **DELETE** /request/review/ignored/:requestId

**Purpose**: To delete an ignored connection request.  
**Thought Process**:

- **DELETE** is used to remove an ignored connection request from the system permanently.
- Validate the request ID and ensure it exists.
- Remove the ignored request from the database.

**Edge Cases**:

- Non-existent ignored request.
- Deleting requests that have been processed or accepted.

---

### 7. **POST** /request/review/accepted/:requestId

**Purpose**: To accept a connection request.  
**Thought Process**:

- **POST** is used because we are changing the status of a resource (connection request) to accepted.
- Validate the request ID and ensure it’s in the "pending" state.
- Update the request status and create a connection between the users.

**Edge Cases**:

- Invalid or non-existent request ID.
- Attempting to accept an already accepted or rejected request.

---

### 8. **POST** /request/review/rejected/:requestId

**Purpose**: To reject a connection request.  
**Thought Process**:

- **POST** is used because we are changing the state of a connection request to "rejected".
- Validate the request ID and ensure it’s in the "pending" state.
- Update the status of the request to rejected.

**Edge Cases**:

- Invalid or non-existent request ID.
- Rejection of already accepted or rejected requests.

---

### 9. **POST** /user/connections

**Purpose**: To view all the user's connections.  
**Thought Process**:

- **POST** is used for fetching a list of connections, possibly with pagination or filters.
- Validate the session or token and return all the connections associated with the user.

**Edge Cases**:

- No connections to display.
- Performance bottlenecks with large numbers of connections.

---

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
