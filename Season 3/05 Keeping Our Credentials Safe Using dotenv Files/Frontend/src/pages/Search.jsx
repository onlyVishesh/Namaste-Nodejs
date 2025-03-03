import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import SearchProfileCard from "../components/SearchProfileCard";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchResult, setSearchResult] = useState([]);

  const observer = useRef(null);

  const getSearchResult = async (query, pageNumber) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL +
          `/search/?query=${query}&page=${pageNumber}&limit=10`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
        return;
      } else {
        const result = res.data.result;
        console.log(result);

        if (result.length === 0) {
          setHasMore(false);
        } else {
          // Append new results to the existing searchResult array
          setSearchResult((prevResults) => [...prevResults, ...result]);
        }
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error || "Something went wrong!");
      } else if (err.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when query changes
    setSearchResult([]);
    setPage(1);
    setHasMore(true);
    getSearchResult(query, 1);
  }, [query]);

  const lastPostCallback = useCallback(
    (node) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => {
              const nextPage = prevPage + 1;
              getSearchResult(query, nextPage);
              return nextPage;
            });
          }
        },
        { threshold: 1.0 },
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, query],
  );

  return (
    <div className="flex flex-col py-5 gap-5">
      <h2 className="text-3xl font-semibold flex justify-center">People</h2>
      <div className="flex-1 ">
        {!searchResult || searchResult.length === 0 ? (
          <div className="flex h-[80vh] items-center justify-center">
            {loading ? (
              <FaSpinner className="size-16 animate-spin text-text" />
            ) : (
              <p className="text-lg text-text">No results found.</p>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4">
            <div className="space-y-4">
              {searchResult.map((user, index) => {
                const isLastPost = index === searchResult.length - 1;
                return (
                  <div
                    key={user?._id}
                    ref={isLastPost ? lastPostCallback : null}
                    className="cursor-pointer"
                  >
                    <SearchProfileCard user={user} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {loading && (
        <div className="mt-6 flex items-center justify-center">
          <FaSpinner className="size-8 animate-spin dark:text-white" />
        </div>
      )}
    </div>
  );
};

export default Search;
