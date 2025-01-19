import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import NetworkCard from "../components/NetworkCard";
import { addInterestedRequests, clearInterestedRequests } from "../utils/interestedRequestsSlice";

const Interested = () => {
  const interestedRequests = useSelector((store) => store.interestedRequests);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const getInterestedRequest = async (currentPage) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/request/received?page=${currentPage}&limit=10`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        console.log(res.data.user);
        dispatch(addInterestedRequests(res.data.user));
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(clearInterestedRequests());
    getInterestedRequest(page);
  }, [page]);

  return (
    <div className="rounded-md bg-bgSecondary">
      <h2 className="px-4 py-2 text-2xl font-bold">
        Interested ({interestedRequests?.length})
      </h2>
      <hr className="border-textMuted" />
      <div className="flex flex-col divide-y divide-textMuted">
        {interestedRequests?.length === 0 ? (
          <div className="py-5 text-center">
            No Pending Requests exist. Try to{" "}
            <Link to="/feed" className="font-bold text-primary underline">
              Explore
            </Link>{" "}
            profiles
          </div>
        ) : (
          interestedRequests?.length > 0 &&
          interestedRequests.map((request) => (
            <NetworkCard
              type="interested"
              request={request}
              key={request._id}
            />
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

export default Interested;
