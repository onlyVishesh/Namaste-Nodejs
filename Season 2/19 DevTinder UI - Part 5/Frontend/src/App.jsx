import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import BodyContainer from "./components/BodyContainer";
import Requests from "./components/Dashboard/Requests";
import AcceptedRequests from "./components/Dashboard/requests/AcceptedRequests";
import AllRequests from "./components/Dashboard/requests/AllRequests";
import IgnoredRequests from "./components/Dashboard/requests/IgnoredRequests";
import InterestedRequests from "./components/Dashboard/requests/InterestedRequests";
import RejectedRequests from "./components/Dashboard/requests/RejectedRequests";
import Users from "./components/Dashboard/Users";
import Connections from "./components/networks/Connections";
import Followers from "./components/networks/Followers";
import Following from "./components/networks/Following";
import Ignored from "./components/networks/Ignored";
import Interested from "./components/networks/Interested";
import Rejected from "./components/networks/Rejected";
import ContactForm from "./pages/ContactForm";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Networks from "./pages/Networks";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Signup from "./pages/Signup";
import Team from "./pages/Team";
import UserProfile from "./pages/UserProfile";
import AdminRoute from "./utils/AdminRoutes";
import ProtectedRoute from "./utils/ProtectedRoute";
import { addUser, removeUser } from "./utils/userSlice";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BackendURL + "/profile/view",
          { withCredentials: true },
        );

        if (res.data.success) {
          dispatch(addUser(res.data.user));
        } else {
          dispatch(removeUser(null));
        }
      } catch (err) {
        dispatch(removeUser(null));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-text">
        <FaSpinner className="size-1/12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="main-body h-full w-full bg-bg text-text">
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BodyContainer />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute loading={loading} />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/networks" element={<Networks />}>
                <Route path="/networks" element={<Interested />} />
                <Route path="/networks/followers" element={<Followers />} />
                <Route path="/networks/following" element={<Following />} />
                <Route path="/networks/connections" element={<Connections />} />
                <Route path="/networks/ignored" element={<Ignored />} />
                <Route path="/networks/rejected" element={<Rejected />} />
              </Route>
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact-form" element={<ContactForm />} />
            </Route>
            <Route element={<AdminRoute loading={loading} />}>
              <Route path="/admin" element={<Dashboard />}></Route>
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/requests" element={<Requests />}>
                <Route path="/admin/requests" element={<AllRequests />} />
                <Route
                  path="/admin/requests/interested"
                  element={<InterestedRequests />}
                />
                <Route
                  path="/admin/requests/accepted"
                  element={<AcceptedRequests />}
                />
                <Route
                  path="/admin/requests/rejected"
                  element={<RejectedRequests />}
                />
                <Route
                  path="/admin/requests/ignored"
                  element={<IgnoredRequests />}
                />
              </Route>
            </Route>
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
