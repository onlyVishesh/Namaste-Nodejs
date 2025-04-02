import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { capitalize } from "../../utils/constants";
import Card from "../Card";

const Users = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("all");
  const [hasMore, setHasMore] = useState(true);

  const getUsers = async (pageNumber, currentStatus) => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/moderator/viewUsers/${currentStatus}?page=${pageNumber}&limit=9`,
        { withCredentials: true },
      );
      setUsers((prevUsers) => [...prevUsers, ...res.data.users]);
      setHasMore(res.data.users.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHasMore(true)
    setUsers([]);
    setPage(1);
    getUsers(1, status); 
  }, [status]);

  useEffect(() => {
    getUsers(page, status); 
  }, [page]);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const threshold = document.documentElement.offsetHeight - 100;

    if (scrollPosition >= threshold) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <h2 className="mb-5 pt-5 text-3xl font-bold text-center">Users</h2>
      <div className="my-4 flex gap-2">
        {["all", "active", "deactivated", "banned"].map((currentStatus) => (
          <button
            key={currentStatus}
            className={`flex rounded-md px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${status === currentStatus ? "bg-blue-500 text-white shadow-md" : "bg-bgSecondary text-text hover:bg-cardBg"}`}
            onClick={() => setStatus(currentStatus)}
          >
            {capitalize(currentStatus)}
          </button>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-3">
        {users.map((user) => (
          <div key={user._id} className="mb-12">
            <Card user={user} />
          </div>
        ))}
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default Users;
