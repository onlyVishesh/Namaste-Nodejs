import { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BodyContainer from "./components/BodyContainer";
import Error from "./pages/Error";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Networks from "./pages/Networks";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import appStore from "./utils/appStore";

const App = () => {
  const isLocal = process.env.NODE_ENV === "development";

  useEffect(() => {
    document.body.className = isLocal ? "debug-screens" : "";
  }, [isLocal]);

  return (
    <Provider store={appStore}>
      <div className="main-body h-full w-full bg-bg text-text">
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<BodyContainer />}>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/feed" element={<Feed />}></Route>
              <Route path="/network" element={<Networks />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="*" element={<Error />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
};

export default App;
