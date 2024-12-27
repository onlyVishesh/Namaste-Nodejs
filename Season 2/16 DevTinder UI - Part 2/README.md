<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 16 | DevRoot UI - Part 2</span> 🚀
</h1>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [1. Cors setup](#1-cors-setup)
  - [**Backend Setup**](#backend-setup)
    - [Install `cors`](#install-cors)
    - [Add CORS Middleware](#add-cors-middleware)
  - [Frontend Setup](#frontend-setup)
    - [Install `axios`](#install-axios)
    - [Configure axios with withCredentials](#configure-axios-with-withcredentials)
- [2. Login/Sign Up Page Client-Side Validation](#2-loginsign-up-page-client-side-validation)
  - [`Email` Validation](#email-validation)
  - [`Username` Validation](#username-validation)
  - [`Name` Validation](#name-validation)
  - [`Password` Validation](#password-validation)
- [3. Real-Time Feedback and Toast Notifications](#3-real-time-feedback-and-toast-notifications)
  - [Add Real-Time Feedback (Client side handling)](#add-real-time-feedback-client-side-handling)
  - [Toast Notifications (Server side handling)](#toast-notifications-server-side-handling)
- [4. Redux Setup](#4-redux-setup)
  - [Install Redux and Redux Toolkit](#install-redux-and-redux-toolkit)
  - [Configure a Redux Store](#configure-a-redux-store)
  - [Create a Redux State Slice](#create-a-redux-state-slice)
  - [Add Slice Reducers to the Store](#add-slice-reducers-to-the-store)
  - [Use Redux State and Actions in React Components](#use-redux-state-and-actions-in-react-components)

## 1. Cors setup

### **Backend Setup**

#### Install `cors`

Run the following command in your backend project to install `cors`:

```bash
npm install cors
```

#### Add CORS Middleware

Configure cors middleware in your backend to allow cross-origin requests with credentials. Example configuration:

```javascript
const cors = require("cors");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
```

### Frontend Setup

#### Install `axios`

Run the following command in your frontend project to install axios:

```bash
npm install axios
```

#### Configure axios with withCredentials

Enable cookies to be sent along with requests using axios:

```javascript
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // Replace with your backend URL
  withCredentials: true, // Enable cookies
});
export default instance;
```

## 2. Login/Sign Up Page Client-Side Validation

### `Email` Validation

Ensure the `email` follows a proper format (e.g., user@example.com):

```javascript
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

### `Username` Validation

Ensure the `username` is at least 4 characters long:

```javascript
const isValidUsername = (username) => username.length > 3;
```

### `Name` Validation

Ensure the `Name` is at least 3 characters long and contain only alphabet:

```javascript
const isValidName = (name) => name.length > 3 && /[0-9!@#$%^&*(),.?":{}|<>]/.test(name);
```

### `Password` Validation

Ensure that `password` is present

```javascript
const isValidPassword = (password) => password.trim().length <= 0;
```

## 3. Real-Time Feedback and Toast Notifications

### Add Real-Time Feedback (Client side handling)

Validate form inputs dynamically and provide real-time feedback to the user for a smoother experience.

```javascript
// to store error
const [errors, setErrors] = useState({
  email: "",
  username: "",
  password: "",
});

const validateInputs = () => {
  const newErrors = { email: "", username: "", password: "" };

  // Email validation
  if (!isUsername && userId.trim() === "") {
    newErrors.email = "Email is required.";
  } else if (!isUsername && !/^\S+@\S+\.\S+$/.test(userId)) {
    newErrors.email = "Enter a valid email address.";
  }

  // Username validation
  if (isUsername && userId.trim().length < 3) {
    newErrors.username = "Username must be more than 3 characters long.";
  }

  // Password validation
  if (password.trim().length <= 0) {
    newErrors.password = "Enter A Password.";
  }

  setErrors(newErrors);

  return !Object.values(newErrors).some((error) => error !== "");
};

// to fetch login api
const handleLogin = async () => {
  // if not validated show error on UI
  if (!validateInputs()) return;

  const res = await axios.post(BASE_URL + "/login", {
    withCredentials: true,
  });

  .
  .
  .

  {errors.password && (
    // Place holder for password error
    <p className="mb-1 text-center text-xs text-error">
      {errors.password}
    </p>
  )}
    <input
      className="md:text-md w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none sm:text-sm lg:text-lg"
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
      }}
    />
};
```

### Toast Notifications (Server side handling)

Use a toast library (e.g.,sooner, react-toastify) to show error and success notifications.

```javascript
const handleLogin = async () => {
  if (!validateInputs()) return;

  try {
    const res = await axios.post(BASE_URL + "/login", data, {
      withCredentials: true,
    });
    if (res.data.success === false) {
      toast.error(res.data.message || "An error occurred");
    } else {
      toast.success(res.data.message || "Logged In successful!");
      navigate("/profile");
      dispatch(addUser(res.data));
      return navigate("/feed");
    }
  } catch (err) {
    if (err.response) {
      // The request was made, and the server responded with a status code
      toast.error(err.response.data.error || "Something went wrong!");
    } else if (err.request) {
      // The request was made, but no response was received
      toast.error("No response from the server. Please try again.");
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error("An unexpected error occurred.");
    }
    console.error(err.message);
  }
};
```

## 4. Redux Setup

### Install Redux and Redux Toolkit

Run the following command to install Redux and Redux Toolkit:

```bash copy
npm install @reduxjs/toolkit react-redux
```

### Configure a Redux Store

1. Create a `store.js` file and `configureStore` API from Redux Toolkit to configure the Redux store:

```js
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {},
});

export default store;
```

2. Provide the Redux Store to React by Wrap your `app` with the Redux Provider:

```js
import { Provider } from "react-redux";
import store from "./store";

const App = () => <Provider store={store}>// Rest of the Code</Provider>;
```

### Create a Redux State Slice

A slice includes the `state`, `reducers`, and `actions` related to a specific feature. Use the `createSlice` method from Redux Toolkit.

```js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: () => {
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
```

### Add Slice Reducers to the Store

Next, we need to import the reducer function from the counter slice and add it to our store. By defining a field inside the reducer parameter, we tell the store to use this slice `reducer` function to handle all updates to that state.

```js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
```

### Use Redux State and Actions in React Components

```js
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const res = await axios.post(BASE_URL + "/login", {
      withCredentials: true,
    });
    dispatch(addUser(res.data));
  };

  return (
    <h1 className="text-2xl font-extrabold xl:text-3xl">
      {user && Welcome Back, {user.name} }
    </h1>
  );
};
export default Login;
```

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
