import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { logout, login } from "./authSlice";
import { addUser } from "./userSlice";

const ProtectedRoute = ({ element }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/profile/view",
        { withCredentials: true },
      );

      if (res.data.success) {
        dispatch(addUser(res.data.user));
        dispatch(login());
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err) {
      dispatch(logout());
      navigate("/login", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) fetchUser();
    else setIsLoading(false);
  }, [isAuthenticated]);

  if (isLoading) return null; 

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
