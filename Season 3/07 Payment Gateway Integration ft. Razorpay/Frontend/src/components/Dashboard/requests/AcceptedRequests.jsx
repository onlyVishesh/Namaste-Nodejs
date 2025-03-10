import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import RequestDataCard from "../RequestDataCard";

const AcceptedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchRequests = async (pageNumber) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/admin/requests/accepted?page=${pageNumber}`,
        { withCredentials: true },
      );
      setRequests((prevRequests) => [...prevRequests, ...res.data.requests]);
      setHasMore(res.data.requests.length > 0);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [page]);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= scrollHeight - 100) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="space-y-4 p-6">
      <h2 className="mb-5 pt-5 text-center text-2xl font-bold">
        Accepted Requests
      </h2>
      <div className="flex flex-col items-center gap-5">
        {requests.map((request) => (
          <RequestDataCard key={request._id} request={request} />
        ))}
      </div>
      {isLoading && <p className="text-center">Loading...</p>}
    </div>
  );
};

export default AcceptedRequests;
