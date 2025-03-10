/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { abbreviateNumber, capitalize } from "../utils/constants";

const SearchProfileCard = ({ user }) => {
  const [requestCount, setRequestCount] = useState(null);

  const formattedName = (firstName, lastName) => {
    const truncatedLastName =
      lastName?.length > 14 ? `${lastName.slice(0, 14)}...` : lastName;
    return `${capitalize(firstName)} ${capitalize(truncatedLastName)}`;
  };

  const getRequestCount = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/user/totalStatus/" + user._id,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      setRequestCount(res.data.requestCount);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error || "Something went wrong!");
      } else if (err.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getRequestCount();
    }
  }, [user]);

  return (
    <div className="flex w-full items-center justify-between rounded-md bg-cardBg p-4 shadow-sm transition-transform duration-200 hover:scale-[103%]">
      <Link
        className="flex w-full items-center gap-4"
        to={`/profile/${user?.username}`}
      >
        {/* User Avatar */}
        <div className="flex size-16 shrink-0 overflow-hidden rounded-full">
          <img
            className="h-full w-full object-cover"
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="User Profile"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="flex items-center gap-2 text-lg font-bold text-text">
            {formattedName(user.firstName, user.lastName)}{" "}
            {user.isPremium && (
              <MdOutlineWorkspacePremium className="h-6 w-6 text-yellow-500 sm:h-7 sm:w-7" />
            )}
          </h3>
          <p className="line-clamp-1 text-sm dark:text-textMuted">
            {user.headline || "No information provided."}
          </p>
        </div>

        {/* Followers and Following Count */}
        <div className="hidden gap-4 xs:flex">
          <div className="flex flex-col items-center justify-center rounded-md bg-bg px-3 py-2">
            <p className="text-lg font-bold text-text">
              {requestCount?.followers !== null &&
              requestCount?.followers !== undefined
                ? abbreviateNumber(requestCount?.followers)
                : "NA"}
            </p>
            <p className="text-sm text-textMuted">Followers</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-md bg-bg px-3 py-2">
            <p className="text-lg font-bold text-text">
              {requestCount?.following !== null &&
              requestCount?.following !== undefined
                ? abbreviateNumber(requestCount?.following)
                : "NA"}
            </p>
            <p className="text-sm text-textMuted">Following</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchProfileCard;
