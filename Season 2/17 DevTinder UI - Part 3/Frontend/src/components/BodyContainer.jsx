import axios from "axios";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import Footer from "./Footer";
import NavBar from "./NavBar";

const BodyContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (user) return;
    try {
      const user = await axios.get(
        import.meta.env.VITE_BackendURL + "/profile/view",
        { withCredentials: true },
      );
      if (user.data.success === false) {
        toast.error(user?.data?.message || "An error occurred");
        return navigate("/login");
      } else {
        dispatch(addUser(user.data));
      }
    } catch (err) {
      if (err.response) {
        toast.error(err?.response?.data?.error || "Something went wrong!");
      } else if (err.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(err.message);
      return navigate("/home");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-20 min-h-[calc(100vh-25rem)]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default BodyContainer;
