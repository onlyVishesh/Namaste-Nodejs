/* eslint-disable react/prop-types */
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { capitalize, timeSince } from "../utils/constants";
import { removeIgnoredRequest } from "../utils/ignoredRequestsSlice";
import { removeInterestedRequest } from "../utils/interestedRequestsSlice";
import { fetchRequestCount } from "../utils/requestCountSlice";

const NetworkCard = ({ type, request }) => {
  const loggedInUser = useSelector((store) => store.user);
  const [showConnection, setShowConnection] = useState(false);
  const menuRef = useRef();
  const dispatch = useDispatch();

  const formattedName = () => {
    const { firstName, lastName } = request.fromUserId || {};
    const truncatedLastName =
      lastName?.length > 14 ? `${lastName.slice(0, 14)}...` : lastName;
    return `${capitalize(firstName)} ${capitalize(truncatedLastName)}`;
  };

  useEffect(() => {}, []);

  const setRequestAccepted = async () => {
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BackendURL +
          "/request/review/accepted/" +
          request._id,
        {},
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      if (res.data.success === true) {
        dispatch(removeInterestedRequest(request._id));
        dispatch(fetchRequestCount());
        toast.success(res.data.message);
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
    }
  };

  const setRequestIgnored = async () => {
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BackendURL +
          "/request/review/ignored/" +
          request._id,
        {},
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      if (res.data.success === true) {
        dispatch(removeInterestedRequest(request._id));
        dispatch(fetchRequestCount());
        toast.success(res.data.message);
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
    }
  };

  const removeConnection = async () => {
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BackendURL +
          "/request/review/accepted/" +
          request._id,
        {},
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      if (res.data.success === true) {
        window.location.reload();
        toast.success(res.data.message);
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
    }
  };

  const removeIgnored = async () => {
    try {
      const res = await axios.delete(
        import.meta.env.VITE_BackendURL +
          "/request/review/ignored/" +
          request._id,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      if (res.data.success === true) {
        dispatch(removeIgnoredRequest(request._id));
        dispatch(fetchRequestCount());
        toast.success(res.data.message);
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
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showConnection &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowConnection(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConnection]);

  const renderTimeStamp = {
    invitation: "Request sent",
    connection: "Connected since",
    follower: "Following since",
    following: "Following since",
  };

  const renderButtons = {
    invitation: (
      <>
        <button
          className="px-2 py-1 text-textMuted hover:bg-cardBg"
          onClick={() => {
            setRequestIgnored();
          }}
        >
          Ignore
        </button>
        <button
          className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white"
          onClick={() => {
            setRequestAccepted();
          }}
        >
          Accept
        </button>
      </>
    ),
    connection: (
      <>
        <button className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white">
          Message
        </button>
        <div className="relative">
          <BsThreeDots
            ref={menuRef}
            className="size-8 cursor-pointer rounded-full p-2 hover:bg-cardBg"
            onClick={() => setShowConnection(!showConnection)}
          />
          {showConnection && (
            <button
              className="absolute right-0 flex items-center justify-center gap-2 rounded-md bg-cardBg px-2 py-1 hover:bg-hover"
              onClick={() => {
                removeConnection();
              }}
            >
              <RiDeleteBin7Fill className="size-6" /> Remove Connection
            </button>
          )}
        </div>
      </>
    ),
    follower: (
      <>
        <Link
          to={`/user/profile/${
            request.fromUserId.username === loggedInUser
              ? request.toUserId.username
              : request.fromUserId.username
          }`}
          className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white"
        >
          View Profile
        </Link>
      </>
    ),
    following: (
      <>
        <Link
          to={`/user/profile/${
            request.fromUserId.username === loggedInUser
              ? request.toUserId.username
              : request.fromUserId.username
          }`}
          className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white"
        >
          View Profile
        </Link>
      </>
    ),
    ignored: (
      <>
        {loggedInUser._id?.toString() === request.toUserId._id?.toString() ? (
          <button
            className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white"
            onClick={() => removeIgnored()}
          >
            Un-Ignore
          </button>
        ) : (
          <button
            className="rounded-full px-2 py-1 font-semibold text-error hover:bg-cardBg hover:text-red-400"
            onClick={() => removeIgnored()}
          >
            Reject
          </button>
        )}
      </>
    ),
  };

  return (
    <div className="flex w-full items-center justify-between md:px-4">
      <Link
        className="flex items-center gap-3 rounded-md px-2"
        to={`/user/profile/${
          request.fromUserId.username === loggedInUser
            ? request.toUserId.username
            : request.fromUserId.username
        }`}
      >
        <div className="flex size-20 rounded-full">
          <div className="relative h-full w-full rounded-full">
            <img
              className="absolute inset-0 h-full w-full rounded-full object-cover p-2"
              src={request.fromUserId?.avatar}
              alt="User Profile"
            />
          </div>
        </div>

        <div className="w-5/12 sm:w-7/12 md:w-8/12">
          <h3 className="text-xl font-extrabold sm:text-xl">
            {formattedName()}
          </h3>
          <p className="line-clamp-1 text-sm">
            {request.fromUserId?.about || "No information provided."}
          </p>
          <p className="text-xs">
            {renderTimeStamp[type]} {timeSince(new Date(request.createdAt))}
          </p>
        </div>
      </Link>

      <div className="flex gap-2">{renderButtons[type]}</div>
    </div>
  );
};

NetworkCard.propTypes = {
  type: PropTypes.oneOf(["invitation", "connection", "follower", "following"])
    .isRequired,
};

export default NetworkCard;
