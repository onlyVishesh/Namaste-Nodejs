import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import NetworkCard from "../../components/NetworkCard";
import {
  addFollowingRequests,
  setCurrentPage,
  setTotalPages,
  setTotalRequest,
} from "../../utils/followingSlice";

const Following = () => {
  const dispatch = useDispatch();
  const followingState = useSelector((store) => store.following);
  const {
    data: following,
    totalPages,
    currentPage,
    totalRequest,
  } = followingState;

  const [isLoading, setIsLoading] = useState(false);

  const getFollowingRequest = async (page) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/request/send?page=${page}&limit=10`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        dispatch(addFollowingRequests(res.data.user));
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
    if (following.length === 0) {
      getFollowingRequest(1);
    }
  }, [dispatch, following.length]);

  const loadMoreFollowing = () => {
    if (currentPage < totalPages) {
      getFollowingRequest(currentPage + 1);
    }
  };

  return (
    <div className="rounded-md bg-bgSecondary">
      <h2 className="px-4 py-2 text-2xl font-bold">
        Following ({totalRequest})
      </h2>
      <hr className="border-textMuted" />
      <div className="flex flex-col divide-y divide-textMuted">
        {following.length === 0 ? (
          <div className="py-5 text-center">
            You haven&apos;t follow any one. Try to{" "}
            <Link to="/feed" className="font-bold text-primary underline">
              Explore
            </Link>{" "}
            profiles
          </div>
        ) : (
          following.map((request) => (
            <NetworkCard type="following" request={request} key={request._id} />
          ))
        )}
      </div>
      {currentPage < totalPages && (
        <div className="py-4 text-center">
          <button
            onClick={loadMoreFollowing}
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

export default Following;
