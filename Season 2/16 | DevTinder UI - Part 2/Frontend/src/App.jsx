import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BodyContainer from "./components/BodyContainer";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Networks from "./pages/Networks";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

const App = () => {
  const isLocal = process.env.NODE_ENV === "development";

  useEffect(() => {
    document.body.className = isLocal ? "debug-screens" : "";
  }, [isLocal]);

  return (
    <div className="bg-bg text-text h-full w-full main-body">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<BodyContainer />}>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/feed" element={<Feed />}></Route>
            <Route path="/network" element={<Networks />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
