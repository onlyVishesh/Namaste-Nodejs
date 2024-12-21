# Thought Process for API Requests

## Table of Contents

1. [APIs related to user login - authRouter](#apis-related-to-user-login---authrouter)
2. [APIs related to profile - profileRouter](#apis-related-to-profile---profilerouter)
3. [APIs related to connections - requestRouter](#apis-related-to-connections---requestrouter)
4. [APIs related to connections - userRouter](#apis-related-to-connections---userrouter)
5. [APIs related to search user - searchRouter](#apis-related-to-search-user---searchrouter)
6. [Extra APIs (future scope)](#extra-apis-future-scope)
   - [APIs related to posts](#apis-related-to-posts)
   - [APIs for messaging](#apis-for-messaging)
   - [APIs related to projects](#apis-related-to-projects)

---

## APIs related to user login - authRouter

### 1. **POST** /signup

**Purpose**: Registers a new user.

**Thought Process**:

- **POST** is used to create a new user resource.
- Validate the `email`, `password`, and `username` provided by the user.
- Hash the password using `bcrypt` for enhanced security.
- Check the database for any duplicate emails or usernames.
- Store the user data in the database and return a success message with the user details, or an error message if validation fails.

**Edge Cases**:

- Duplicate `email` or `username`.
- Weak or insecure `password`.
- Missing required fields (e.g., `email`, `password`, or `username`).

---

### 2. **POST** /login

**Purpose**: To log in a user and generate an authentication token.

**Thought Process**:

- **POST** is used as the login process involves authentication and session creation.
- Validate the provided `email` and `password`.
- Retrieve the user from the database using the provided email and verify the account's validity.
- If credentials are correct, generate a JWT token for session management.
- Return the JWT token along with the user's profile details (excluding sensitive information like the password).

**Edge Cases**:

- Incorrect `email` or `password`.
- banned or inactive accounts.
- Multiple failed login attempts leading to account lockouts.

---

### 3. **POST** /logout

**Purpose**: Logs out the user by invalidating their session or token.

**Thought Process**:

- **POST** is used to perform an action (logging out), which involves invalidating the session or `token`, changing the user’s state.
- Validate the current session token and invalidate it (e.g., by deleting or marking it as invalid).
- Return a success response confirming the logout action.

**Edge Cases**:

- Expired or invalid tokens.
- User already logged out or not logged in.

---

### 4. **PATCH** /forgetPassword

**Purpose**: Resets the user's password when they are logged out.

**Thought Process**:

- **PATCH** is used to partially update the user's information (password) without creating or deleting resources.
- Validate the provided `email` and/or `username` to ensure the account exists.
- Generate a password reset token and send it to the user via email or SMS.
- Allow the user to reset their password using the token and update the password in the database.
- Return a success message once the password has been successfully changed.

**Edge Cases**:

- Invalid or expired reset tokens.
- User attempts to reset the password for a non-existent account.

---

### 5. **PATCH** /changePassword

**Purpose**: Allows a logged-in user to change their password.

**Thought Process**:

- **PATCH** is used to partially update the user's information (password).
- Validate the user's current password and ensure it is correct.
- Hash the new password using `bcrypt` and update it in the database.
- Return a success response confirming the password change.

**Edge Cases**:

- Incorrect current password.
- New password does not meet password policy requirements.
- Expired or invalid session token.

---

## APIs related to profile - profileRouter

### 1. **GET** /profile/view

**Purpose**: Views the logged-in user's profile.

**Thought Process**:

- **GET** is used to retrieve data (profile information) without modifying the resource.
- Validate the session or token to ensure the user is authenticated.
- Fetch the user's profile data from the database and return it in the response.

**Edge Cases**:

- Invalid or expired tokens.
- Database read errors or incomplete user data.

---

### 2. **PATCH** /profile/edit

**Purpose**: To edit the user's profile details.

**Thought Process**:

- **PATCH** is used for partially updating a resource (user profile).
- Validate the input to ensure the fields being updated are correct (e.g., valid bio format, image size).
- Authenticate the user and ensure they are authorized to edit their profile.
- Update the profile data (bio, profile picture, etc.) in the database.
- Return the updated profile details in the response.

**Edge Cases**:

- Invalid input formats (e.g., image size too large, invalid bio).
- Concurrent updates leading to data inconsistencies.
- Unauthorized access or attempts to edit another user's profile.

---

### 3. **DELETE** /profile/delete

**Purpose**: To delete a user account.

**Thought Process**:

- **DELETE** is used to remove a resource (user) permanently or mark it as inactive.
- Validate the user's authentication and confirm the deletion request.
- Soft delete the user account (e.g., mark as inactive) or remove all related data from the system.
- Return a success message confirming the deletion.

**Edge Cases**:

- Unauthorized or unauthenticated delete requests.
- Incomplete data cleanup leading to orphan records.

---

### 4. **PATCH** /profile/changeStatus

**Purpose**: To temporarily deactivate or reactivate a user account.

**Thought Process**:

- **PATCH** is used because the user's account status (active or deactivated) is being partially updated.
- Validate the user's session or token to ensure the request is coming from an authenticated user.
- Ensure the user is authorized to change the status (e.g., checking if the user is allowed to modify their own status).
- Change the user's status in the database (e.g., setting the status to "active" or "deactivated").
- If the status change is successful, return a success message confirming the update.

**Edge Cases**:

- Attempting to change the status to an invalid value (e.g., a status that is not `active` or `deactivated`).
- Unauthorized attempts to change account status, such as a user trying to change another user's status without permission.
- If the user's status is already the same as the requested status, avoid making an unnecessary update and return a message indicating no change was needed.

---

### 5. **GET** /profile/:userId

**Purpose**: To view another user's public profile.

**Thought Process**:

- **GET** is used to retrieve data (viewing a public profile).
- Validate the `userId` to ensure it is a valid MongoDB ObjectId and the profile exists in the database.
- Return the public details of the user's profile, excluding sensitive information like password, email, etc.
- If the user is found, return their profile details.

**Edge Cases**:

- Invalid or non-existent `userId` (`404` error with message "User not found").
- Accessing a restricted or private profile may return a `403` error or similar (if applicable).

---

### 6. **PATCH** /admin/changeRole/:role/:userId

**Purpose**: To update a user's role (`admin`, `moderator`, or `user`).  
**Thought Process**:

- **PATCH** is used for partially updating a resource (user role).
- Validate `userId` and ensure the user exists in the database.
- Confirm `role` is one of the allowed values: `admin`, `moderator`, or `user`.
- Prevent changes to protected admin accounts from the `adminEmails` list.
- Check if the new role matches the current one to avoid redundant updates.
- Update the role in the database and save changes.

**Edge Cases**:

- Invalid or non-existent `userId`.
- Invalid `role` value.
- Attempts to modify protected admin accounts.
- Unauthorized access by non-admin users.
- Redundant role updates.

---

### 7. **GET** /admin/viewRole/:role

**Purpose**: To view all users with a specific role (`admin`, `moderator`, or `user`).

**Thought Process**:

- **GET** is used to retrieve a list of users based on their role.
- Validate `role` to ensure it matches allowed values: `admin`, `moderator`, or `user`.
- Support pagination with `page` and `limit` query parameters to handle large datasets.
- Limit the maximum `limit` value to 50 to prevent performance issues.
- Retrieve user data with selected fields only (excluding sensitive details).

**Edge Cases**:

- Invalid `role` value.
- No users found for the specified role.
- Out-of-range pagination values.
- Unauthorized access by non-admin users.

---

### 8. **PATCH** /admin/changeStatus/:status/:userId

**Purpose**: To change a user's account status to `active`, `deactivated`, or `banned`.

**Thought Process**:

- **PATCH** is used to partially update the user's account status.
- Validate the `userId` to ensure it’s a valid MongoDB ObjectId and corresponds to an existing user.
- The `status` parameter must be one of the allowed values: `active`, `deactivated`, or `banned`.
- Check if the user's current status is the same as the requested status to avoid unnecessary updates.
- If valid, update the user's status in the database and return a success message.

**Edge Cases**:

- Invalid or non-existent `userId` (`400` error).
- Invalid `status` value (`400` error).
- User already has the requested status (`200` message with no update).
- Unauthorized access by non-admin users (`403` error).

---

### 9. **DELETE** /admin/user/delete/:userId

**Purpose**: To delete a user profile from the system.

**Thought Process**:

- **DELETE** is used to remove a user account from the system.
- Validate the `userId` to ensure it’s a valid MongoDB ObjectId and that the user exists.
- Prevent deletion of admin profiles by checking the user’s role.
- Remove any associated connection requests (sent and received).
- Delete the user and return a success message with the deleted user's details and number of deleted connection requests.

**Edge Cases**:

- Invalid or non-existent `userId` (`400` error).
- Attempting to delete an admin profile (`403` error).
- Database errors during deletion (`500` error).

---

### 10. **GET** /feed

**Purpose**: To view all users (accessible only by admin).

**Thought Process**:

- **GET** retrieves a list of users.
- Only accessible by admin users for role-based authorization.
- Fetch users from the database. If no users exist, return a `404` error with a message ("0 users exist").
- If users are found, return them with a success message.

**Edge Cases**:

- No users in the database (`404` response).
- Unauthorized access by non-admin users (`401` response).
- Server/database issues (`500` response).

---

### 11. **PATCH** /moderator/changeRole/:role/:userId

**Purpose**: To change the role of a user to either "moderator" or "user".

**Thought Process**:

- **PATCH** is used to update the user's role.
- Only `admin` or `moderator` users can make this change.
- Validate the `userId` to ensure it's a valid MongoDB ObjectId and the user exists.
- Prevent users from changing their own role or the role of admins.
- Ensure the new role is either `moderator` or `user`.
- If the user already has the target role, no update is made.
- Update the role and return a success message.

**Edge Cases**:

- Invalid or non-existent `userId`.
- Changing the logged-in user's own role.
- Attempting to update an admin's role.
- The user already has the new role.

---

### 12. **GET** /moderator/viewRole/:role

**Purpose**: To view a list of users with a specific role (either "moderator" or "user").

**Thought Process**:

- **GET** retrieves the list of users with the specified role.
- Only users with `admin` or `moderator` roles can access this endpoint.
- Validate the role (`moderator` or `user`) and ensure that moderators cannot access the `admin` role.
- Implement pagination to allow limiting the number of results (default: 10 results per page).
- Return a list of users with the specified role, including fields like `firstName`, `lastName`, `username`, etc.

**Edge Cases**:

- Invalid role request (not `moderator` or `user`).
- Non-existent or invalid user roles.
- Errors while fetching user data from the database.
- Invalid pagination parameters.

---

### 13. **GET** /moderator/userNumbers/:status

**Purpose**: To retrieve the number of users based on their status (`all`, `active`, `deactivated`, or `banned`).

**Thought Process**:

- **GET** is used to fetch the count of users.
- Only `admin` or `moderator` roles are authorized to access this endpoint.
- The `status` parameter must be one of: `all`, `active`, `deactivated`, or `banned`.
- If `status` is `all`, the count of all users is returned. Otherwise, the count is filtered by the selected status.
- Returns a count of users matching the specified status.

**Edge Cases**:

- Invalid `status` parameter.
- Unauthorized access by users without `admin` or `moderator` roles.
- Database query errors while fetching the user count.

---

### 14. **GET** /moderator/viewUsers/:status

**Purpose**: To view user profiles based on their status (`all`, `active`, `deactivated`, or `banned`).

**Thought Process**:

- **GET** is used to fetch user profiles from the system.
- Only `admin` or `moderator` roles can access this endpoint.
- The `status` parameter must be one of the following: `all`, `active`, `deactivated`, or `banned`.
- If the `status` is `all`, all users are fetched; otherwise, users are filtered by the given status.
- Paginated list of users with fields like `firstName`, `lastName`, `username`, and `avatar` is returned.

**Edge Cases**:

- Invalid `status` parameter.
- Unauthorized access by users without `admin` or `moderator` roles.
- Errors while fetching or querying user data.
- Pagination issues if results exceed set limits.

---

### 15. **PATCH** /moderator/changeStatus/:status/:userId

**Purpose**: To change the status of a user to either `active` or `deactivated`.

**Thought Process**:

- **PATCH** is used to update the user's status.
- The logged-in user must have an `admin` or `moderator` role.
- The `status` parameter must be either `active` or `deactivated`.
- Validate the `userId` to ensure the user exists in the database.
- Admins cannot have their status changed through this endpoint.
- If the new status matches the current one, no change is made.
- If valid, update the user's status.

**Edge Cases**:

- Invalid `status` parameter.
- Unauthorized access by users without `admin` or `moderator` roles.
- Admin users cannot have their status changed.
- No update if the status is already the same.
- Invalid or non-existent `userId`.

---

## APIs related to connections - requestRouter

### 1. **POST** /request/send/interested/:userId

**Purpose**: To send a connection request to another user.

**Thought Process**:

- **POST** is used to create a new connection request.
- Validate the `userId` and ensure the target user exists.
- Create a connection request with the status set to "interested".
- Notify the target user about the request.

**Edge Cases**:

- Duplicate connection requests return a `400` error.
- Sending requests to inactive or blocked users returns a `400` error.

---

### 2. **POST** /request/send/ignored/:userId

**Purpose**: To ignore a user for connection requests.

**Thought Process**:

- **POST** is used to mark a user as "ignored" for future connection requests.
- Validate the `userId` and ensure the target user exists.
- Mark the connection request status as "ignored".
- Notify the target user (if applicable).

**Edge Cases**:

- Duplicate ignored requests return a `400` error.
- Sending requests to deactivated users returns a `400` error.

---

### 3. **GET** /requests/send

**Purpose**: To view all sent connection requests.

**Thought Process**:

- **GET** is used to retrieve the list of sent connection requests.
- Fetch and return all sent connection requests for the logged-in user.

**Edge Cases**:

- No sent requests returns an empty list.
- Issues with pagination or too many requests return a `500` error.

---

### 4. **GET** /requests/received

**Purpose**: To view all received connection requests.

**Thought Process**:

- **GET** is used to fetch the list of received connection requests.
- Fetch and return all received connection requests for the logged-in user.

**Edge Cases**:

- No received requests returns an empty list.
- Issues with pagination or empty results return a `500` error.

---

### 5. **GET** /request/ignored

**Purpose**: To view all the ignored profiles for the logged-in user.

**Thought Process**:

- **GET** is used because this endpoint retrieves a list of ignored profiles (connection requests) sent by the logged-in user.
- The logged-in user’s ID is checked to ensure they are authorized to view their own requests.
- The query parameters `page` and `limit` control pagination to avoid fetching too many results at once.
- The `ConnectionRequest` collection is queried to find all requests where the status is marked as "ignored", filtering by the logged-in user's ID.
- The profiles of both the sender (`fromUserId`) and receiver (`toUserId`) are populated with relevant data like name, avatar, skills, etc.

**Edge Cases**:

- If no ignored requests are found, an empty array is returned.
- Unauthorized access if the user is not logged in, resulting in a `401` response.
- Server error if the database fails, returning a `500` response with an error message.

---

### 6. **DELETE** /request/review/retrieve/:requestId

**Purpose**: To retrieve (cancel) a sent connection request.

**Thought Process**:

- **DELETE** is used to cancel a sent connection request permanently.
- Validate the `requestId` and ensure the request exists.
- Remove the request from the system.

**Edge Cases**:

- Invalid or non-existent `requestId` returns a `400` error.
- Unauthorized delete requests return a `401` error.

---

### 7. **DELETE** /request/review/ignored/:requestId

**Purpose**: To delete an ignored connection request.

**Thought Process**:

- **DELETE** is used to remove an ignored connection request permanently.
- Validate the `requestId` and ensure the request exists.
- Remove the ignored request from the database.

**Edge Cases**:

- Non-existent ignored request returns a `400` error.
- Attempting to delete a processed or accepted request returns a `400` error.

---

### 8. **POST** /request/review/accepted/:requestId

**Purpose**: To accept a connection request.

**Thought Process**:

- **POST** is used to change the status of a connection request to "accepted".
- Validate the `requestId` and ensure the status is "pending".
- Update the request's status to "accepted" and create a connection between the users.

**Edge Cases**:

- Invalid or non-existent `requestId` returns a `400` error.
- Attempting to accept an already accepted or rejected request returns a `400` error.

---

### 9. **POST** /request/review/rejected/:requestId

**Purpose**: To reject a connection request.

**Thought Process**:

- **POST** is used to change the state of a connection request to "rejected".
- Validate the `requestId` and ensure it is in the "pending" state.
- Update the request's status to "rejected".

**Edge Cases**:

- Invalid or non-existent `requestId` returns a `400` error.
- Attempting to reject already accepted or rejected requests returns a `400` error.

---

### 10. **DELETE** /request/review/ignored/:requestId

**Purpose**: To delete a specific ignored connection request sent by the logged-in user.

**Thought Process**:

- **DELETE** is used to remove an ignored connection request.
- Validate the logged-in user's authentication to ensure they can only delete their own requests.
- Validate the `requestId` to check if it’s a valid `ObjectId`.
- Query the `ConnectionRequest` collection to find a matching request where the `fromUserId` is the logged-in user and the status is "ignored".
- If found, delete the request from the database and return a success message.

**Edge Cases**:

- Invalid `requestId` returns a `400` error.
- If the request doesn’t exist or is not ignored, return a `400` error.
- Deletion failure results in a `500` error.

---

### 11. **GET** /admin/requests/:status

**Purpose**: To retrieve connection requests of all users filtered by a specified status.

**Thought Process**:

- **GET** is used to fetch connection requests filtered by status.
- Authenticate using `userAuth` and ensure only admins can access via `userRole("admin")`.
- Validate the `status` parameter against predefined valid values: `all`, `interested`, `ignored`, `accepted`, `rejected`.
- Apply pagination using `page` and `limit` query parameters.
- Query the `ConnectionRequest` collection for matching requests based on the `status`.
- Use `populate()` to retrieve additional user details (e.g., `firstName`, `lastName`, `username`, `avatar`) for `fromUserId` and `toUserId`.

**Edge Cases**:

- Invalid `status` returns a `400` error with the message `"Invalid status."`.
- No requests match the status returns an empty list.
- Database failures or invalid parameters return a `500` error with the error message.

---

### 12. **GET** /admin/user/requests/:userId

**Purpose**: To get all the connection requests for a specific user (admin only).

**Thought Process**:

- **GET** is used to retrieve connection requests for a specific user.
- Validate the logged-in user’s authentication to ensure they are an admin.
- Validate the `userId` parameter to ensure it’s a valid user.
- Fetch connection requests where either `fromUserId` or `toUserId` matches the provided `userId`.
- Apply pagination using `page` and `limit` query parameters.
- Return the list of connection requests.

**Edge Cases**:

- Invalid or non-existent `userId` returns a `400` error.
- Database query failure returns a `500` error.

---

## APIs related to connections - userRouter

### 1. **POST** /user/connections

**Purpose**: To view all the user's connections.

**Thought Process**:

- **POST** is used to fetch a list of the user's connections, possibly with pagination or filters.
- Validate the session or token to ensure the user is authenticated.
- Return all the connections associated with the user.

**Edge Cases**:

- No connections to display.
- Performance issues with large numbers of connections.

---

### 2. **GET** /user/feed

**Purpose**: To create a feed of user profiles, excluding the logged-in user and those with whom the user has sent or received connection requests.

**Thought Process**:

- **GET** is used to retrieve a list of user profiles.
- Authenticate the logged-in user before accessing the feed.
- Fetch all connection requests (sent or received) by the user.
- Hide profiles of the logged-in user and those involved in connection requests.
- Apply pagination to limit the number of profiles returned.
- Only active users who match the criteria are included in the feed.

**Edge Cases**:

- If the user is not authenticated, a `401` error is returned.
- If no matching active users are found, an empty list is returned.
- If the database query fails, a `500` error is returned.

---

### 3. **DELETE** /user/connection/:connectionId

**Purpose**: To delete an accepted connection between the logged-in user and another user.

**Thought Process**:

- **DELETE** is used to remove a connection.
- Validate the logged-in user's authentication to ensure they can delete the connection.
- Check if the `connectionId` is a valid `ObjectId`.
- Find the `ConnectionRequest` where:
  - The connection is `accepted`.
  - The logged-in user is either `fromUserId` or `toUserId`.
- Delete the connection if found and return a success response.
- If no valid connection is found or it is not `accepted`, return an error.

**Edge Cases**:

- Invalid `connectionId` returns a `400` error.
- No matching or unaccepted connection returns a `404` error.
- Internal errors return a `500` error.

---

## APIs related to search user - searchRouter

### 1. **GET** /search

**Purpose**: To search for users based on `username`, `firstName`, `lastName`, or `skills`.

**Thought Process**:

- **GET** is used to retrieve users based on the search query.
- The `query` parameter is required for searching and can match `username`, `firstName`, `lastName`, or `skills`.
- Paginate results using `page` and `limit` parameters, with default values.
- A `regex` search is used for case-insensitive matching.
- Return search results in a success response.

**Edge Cases**:

- Missing `query` returns a `400` error.
- No matches return an empty list with a `200` status.
- Database failure returns a `500` error.

## Extra APIs (future scope)

### APIs related to posts

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
