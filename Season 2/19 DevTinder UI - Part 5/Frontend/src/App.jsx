import { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import BodyContainer from "./components/BodyContainer";
import Connections from "./components/networks/Connections";
import Followers from "./components/networks/Followers";
import Following from "./components/networks/Following";
import Ignored from "./components/networks/Ignored";
import Interested from "./components/networks/Interested";
import Rejected from "./components/networks/Rejected";
import ContactForm from "./pages/ContactForm";
import Error from "./pages/Error";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Networks from "./pages/Networks";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Team from "./pages/Team";
import UserProfile from "./pages/UserProfile";
import appStore from "./utils/appStore";
import ProtectedRoute from "./utils/ProtectedRoute";

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
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/feed"
                element={<ProtectedRoute element={<Feed />} />}
              />
              <Route
                path="/networks"
                element={<ProtectedRoute element={<Networks />} />}
              >
                <Route path="/networks" element={<Interested />} />
                <Route path="/networks/followers" element={<Followers />} />
                <Route path="/networks/following" element={<Following />} />
                <Route path="/networks/connections" element={<Connections />} />
                <Route path="/networks/ignored" element={<Ignored />} />
                <Route path="/networks/rejected" element={<Rejected />} />
              </Route>
              <Route
                path="/profile"
                element={<ProtectedRoute element={<Profile />} />}
              />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact-form" element={<ContactForm />} />

              {/* Error Page */}
              <Route path="*" element={<Error />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
};

export default App;
