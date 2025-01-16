import axios from "axios";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import Footer from "./Footer";
import NavBar from "./NavBar";

const BodyContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (user.length !== 0) return;
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/profile/view",
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res?.data?.message || "An error occurred");
        return navigate("/login");
      } else {
        dispatch(addUser(res.data.user));
      }
    } catch (err) {
      if (location.pathname === "/") {
        toast.success("Welcome To DevRoot");
      } else {
        if (err.response) {
          toast.error(err?.response?.data?.error || "Something went wrong!");
        } else if (err.request) {
          toast.error("No response from the server. Please try again.");
        } else {
          toast.error("An unexpected error occurred.");
        }
        console.error(err.message);
        return navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-20 max-h-fit min-h-[calc(100vh-5rem)]">
        <Outlet />
      </div>
      {location.pathname === "/" && <Footer />}
    </>
  );
};

export default BodyContainer;
