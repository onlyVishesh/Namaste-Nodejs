import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  addFollowerRequests,
  setCurrentPage,
  setTotalPages,
  setTotalRequest,
} from "../../utils/followersSlice";
import NetworkCard from "../NetworkCard";

const Followers = () => {
  const dispatch = useDispatch();
  const followersState = useSelector((store) => store.followers);
  const {
    data: followers,
    totalPages,
    currentPage,
    totalRequest,
  } = followersState;

  const [isLoading, setIsLoading] = useState(false);

  const getFollowerRequest = async (page) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/request/followers?page=${page}&limit=10`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        dispatch(addFollowerRequests(res.data.user));
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
    if (followers.length === 0) {
      getFollowerRequest(1);
    }
  }, [dispatch, followers.length]);

  const loadMoreFollowers = () => {
    if (currentPage < totalPages) {
      getFollowerRequest(currentPage + 1);
    }
  };

  return (
    <div className="rounded-md bg-bgSecondary">
      <h2 className="px-4 py-2 text-2xl font-bold">
        Followers ({totalRequest})
      </h2>
      <hr className="border-textMuted" />
      <div className="flex flex-col divide-y divide-textMuted">
        {followers.length === 0 ? (
          <div className="py-5 text-center">
            No one follows you. Try to{" "}
            <Link to="/feed" className="font-bold text-primary underline">
              Explore
            </Link>{" "}
            profiles.
          </div>
        ) : (
          followers.map((request) => (
            <NetworkCard type="follower" request={request} key={request._id} />
          ))
        )}
      </div>
      {currentPage < totalPages && (
        <div className="py-4 text-center">
          <button
            onClick={loadMoreFollowers}
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

export default Followers;
