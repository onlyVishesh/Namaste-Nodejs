import { FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";

const AdminRoute = ({ loading }) => {
  const user = useSelector((store) => store.user);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-text">
        <FaSpinner className="size-1/12 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== "admin") {
    toast.error("You are not admin/moderator")
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
