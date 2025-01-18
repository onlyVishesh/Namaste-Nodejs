import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import NetworkCard from "../components/NetworkCard";
import {
  addRejectedRequests,
  clearRejectedRequests,
} from "../utils/rejectedRequestsSlice";

const Rejected = () => {
  const rejectedRequests = useSelector((store) => store.rejected);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const getRejectedRequest = async (currentPage) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/request/rejected?page=${currentPage}&limit=10`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        dispatch(addRejectedRequests(res.data.user));
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(clearRejectedRequests());
    getRejectedRequest(page);
  }, [page]);

  return (
    <div className="rounded-md bg-bgSecondary">
      <h2 className="px-4 py-2 text-2xl font-bold">
        Rejected ({rejectedRequests.length})
      </h2>
      <hr className="border-textMuted" />
      <div className="flex flex-col divide-y divide-textMuted">
        {rejectedRequests.length === 0 ? (
          <div className="py-5 text-center">
            You haven&apos;t rejected any request. Try to{" "}
            <Link to="/feed" className="font-bold text-primary underline">
              Explore
            </Link>{" "}
            profiles
          </div>
        ) : (
          rejectedRequests.map((request) => (
            <NetworkCard type="rejected" request={request} key={request._id} />
          ))
        )}
      </div>
      {page < totalPages && (
        <div className="py-4 text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
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

export default Rejected;
