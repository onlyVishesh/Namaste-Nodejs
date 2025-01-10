import { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import BodyContainer from "./components/BodyContainer";
import Connections from "./pages/Connections";
import Error from "./pages/Error";
import Feed from "./pages/Feed";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import Home from "./pages/Home";
import Ignored from "./pages/Ignored";
import Interested from "./pages/Interested";
import Login from "./pages/Login";
import Networks from "./pages/Networks";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import appStore from "./utils/appStore";

const App = () => {
  // eslint-disable-next-line no-undef
  const isLocal = process.env.NODE_ENV === "development";

  useEffect(() => {
    document.body.className = isLocal ? "debug-screens" : "";
  }, [isLocal]);

  return (
    <Provider store={appStore}>
      <div className="main-body h-full w-full bg-bg text-text">
        <Toaster richColors />
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<BodyContainer />}>
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/feed" element={<Feed />}></Route>
              <Route path="/networks" element={<Networks />}>
                <Route path="/networks" element={<Interested />} />
                <Route path="/networks/followers" element={<Followers />} />
                <Route path="/networks/following" element={<Following />} />
                <Route path="/networks/connections" element={<Connections />} />
                <Route path="/networks/ignored" element={<Ignored />} />
              </Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route
                path="/user/profile/:userId"
                element={<UserProfile />}
              ></Route>
              <Route path="*" element={<Error />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
};

export default App;
