<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 15 | DevRoot UI - Part 1</span> 🚀
</h1>

# DevRoot Frontend

DevRoot is a professional networking platform for developers, engineers, and tech enthusiasts. This is the frontend built with React and styled using Tailwind CSS.

## Packages Used

- **Tailwind CSS**: Utility-first CSS framework.
- **Tailwind Debug Screen**: Debug tool for Tailwind classes.
- **Prettier Plugin TailwindCSS**: Auto-formats Tailwind classes.
- **React Router DOM**: Handles routing in React apps.
- **React DOM**: Renders React components to the DOM.

## Routing Setup with React Router DOM

The following code snippet demonstrates how routing is implemented in the DevRoot frontend using `React Router DOM`:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BodyContainer from "./components/BodyContainer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Networks from "./pages/Networks";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<BodyContainer />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/network" element={<Networks />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Route Structure

- / - Renders the main `BodyContainer` component.
- /login - Displays the `Login` page.
- /signup - Displays the `Signup` page.
- /feed - Displays the `Feed` page where users can explore content.
- /network - Displays the `Networks` page showing connection requests.
- /profile - Displays the `Profile` page for viewing and editing user details.


If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊