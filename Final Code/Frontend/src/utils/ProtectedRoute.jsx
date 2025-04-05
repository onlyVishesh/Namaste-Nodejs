import { FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ loading }) => {
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

  return <Outlet />;
};

export default ProtectedRoute;
