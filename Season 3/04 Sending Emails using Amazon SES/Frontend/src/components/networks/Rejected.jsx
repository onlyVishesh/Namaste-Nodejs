import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  addRejectedRequests,
  setCurrentPage,
  setTotalPages,
  setTotalRequest,
} from "../../utils/rejectedRequestsSlice";
import NetworkCard from "../NetworkCard";

const Rejected = () => {
  const dispatch = useDispatch();
  const rejectedState = useSelector((store) => store.rejected);
  const {
    data: rejected,
    totalPages,
    currentPage,
    totalRequest,
  } = rejectedState;
  const [isLoading, setIsLoading] = useState(false);

  const getRejectedRequest = async (page) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/request/rejected?page=${page}&limit=10`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        dispatch(addRejectedRequests(res.data.user));
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
    if (rejected.length === 0) {
      getRejectedRequest(1);
    }
  }, [dispatch, rejected.length]);

  const loadMoreRejected = () => {
    if (currentPage < totalPages) {
      getRejectedRequest(currentPage + 1);
    }
  };

  return (
    <div className="rounded-md bg-bgSecondary">
      <h2 className="px-4 py-2 text-2xl font-bold">
        Rejected ({totalRequest})
      </h2>
      <hr className="border-textMuted" />
      <div className="flex flex-col divide-y divide-textMuted">
        {rejected.length === 0 ? (
          <div className="py-5 text-center">
            You haven&apos;t rejected any request. Try to{" "}
            <Link to="/feed" className="font-bold text-primary underline">
              Explore
            </Link>{" "}
            profiles
          </div>
        ) : (
          rejected.map((request) => (
            <NetworkCard type="rejected" request={request} key={request._id} />
          ))
        )}
      </div>
      {currentPage < totalPages && (
        <div className="py-4 text-center">
          <button
            onClick={loadMoreRejected}
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
