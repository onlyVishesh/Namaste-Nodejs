import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import NetworkCard from "../../components/NetworkCard";
import {
  addConnectionRequests,
  setCurrentPage,
  setTotalPages,
  setTotalRequest,
} from "../../utils/connectionsSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connectionsState = useSelector((store) => store.connections);
  const {
    data: connections,
    totalPages,
    currentPage,
    totalRequest,
  } = connectionsState;
  const [isLoading, setIsLoading] = useState(false);

  const getConnectionRequest = async (page) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/request/accepted?page=${page}&limit=10`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        dispatch(addConnectionRequests(res.data.user));
        dispatch(setTotalPages(res.data.pagination.totalPages));
        dispatch(setCurrentPage(page));
        dispatch(setTotalRequest(res.data.pagination.total));
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connections.length === 0) {
      getConnectionRequest(1);
    }
  }, [dispatch, connections.length]);

  const loadMoreConnections = () => {
    if (currentPage < totalPages) {
      getConnectionRequest(currentPage + 1);
    }
  };

  return (
    <div className="rounded-md bg-bgSecondary">
      <h2 className="px-4 py-2 text-2xl font-bold">
        Connections ({totalRequest})
      </h2>
      <hr className="border-textMuted" />
      <div className="flex flex-col divide-y divide-textMuted">
        {connections.length === 0 ? (
          <div className="py-5 text-center">
            You don&apos;t have any connections. Try to{" "}
            <Link to="/feed" className="font-bold text-primary underline">
              Explore
            </Link>{" "}
            profiles
          </div>
        ) : (
          connections.map((request) => (
            <NetworkCard
              type="connection"
              request={request}
              key={request._id}
            />
          ))
        )}
      </div>
      {currentPage < totalPages && (
        <div className="py-4 text-center">
          <button
            onClick={loadMoreConnections}
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-hover"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Connections;
