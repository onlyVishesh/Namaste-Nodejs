import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login, logout } from "../utils/authSlice";
import { addUser } from "../utils/userSlice";
import Footer from "./Footer";
import NavBar from "./NavBar";

const FOOTER_CONTAINING_LINKS = [
  "/",
  "/team",
  "/faqs",
  "/support",
  "/contact-form",
];

const BodyContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/profile/view",
        { withCredentials: true },
      );

      if (!res.data.success) {
        toast.error(res?.data?.message || "An error occurred");
        navigate("/login");
      } else {
        dispatch(addUser(res.data.user));
        dispatch(login());
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

      dispatch(logout());

      if (location.pathname !== "/") {
        navigate("/login");
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
      {FOOTER_CONTAINING_LINKS.includes(location.pathname) && <Footer />}
    </>
  );
};

export default BodyContainer;
