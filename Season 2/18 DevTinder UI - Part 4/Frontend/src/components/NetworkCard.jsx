/* eslint-disable react/prop-types */
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { removeConnectionRequest } from "../utils/connectionsSlice";
import { capitalize, timeSince } from "../utils/constants";
import { removeFollowingRequest } from "../utils/followingSlice";
import { removeIgnoredRequest } from "../utils/ignoredRequestsSlice";
import { removeInterestedRequest } from "../utils/interestedRequestsSlice";
import { removeRejectedRequest } from "../utils/rejectedRequestsSlice";
import { fetchRequestCount } from "../utils/requestCountSlice";

const NetworkCard = ({ type, request }) => {
  const loggedInUser = useSelector((store) => store.user);
  const [showConnection, setShowConnection] = useState(false);
  const menuRef = useRef();
  const dispatch = useDispatch();

  const formattedName = () => {
    const { firstName, lastName } =
      request.fromUserId.username === loggedInUser.username
        ? request.toUserId || {}
        : request.fromUserId || {};
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
          "/request/review/removeConnection/" +
          request._id,
        {},
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      if (res.data.success === true) {
        dispatch(removeConnectionRequest(request._id));
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

  const rejectRequest = async () => {
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BackendURL +
          "/request/review/rejectRequest/" +
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

  const removeRejected = async () => {
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BackendURL +
          "/request/review/removeRejected/" +
          request._id,
        {},
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      if (res.data.success === true) {
        dispatch(removeRejectedRequest(request._id));
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

  const removePending = async (status) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BackendURL}/request/review/${status}/${request._id}`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      if (res.data.success === true) {
        dispatch(removeFollowingRequest(request._id));
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
    interested: "Request received",
    connection: "Connected",
    follower: "Following",
    following: "Following",
    ignored: "Ignored",
    rejected: "Rejected",
  };

  const renderButtons = {
    interested: (
      <>
        <button
          className="rounded-full px-2 py-1 font-semibold text-error hover:bg-cardBg hover:text-red-400"
          onClick={() => {
            rejectRequest();
          }}
        >
          Reject
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
        {request.status === "accepted" && (
          <div className="rounded-full border-2 border-green-500 px-2 py-1 font-semibold text-green-500 hover:cursor-pointer hover:bg-cardBg hover:text-green-400">
            Connected
          </div>
        )}
        {request.status === "interested" && (
          <div className="rounded-full border-2 border-blue-500 px-2 py-1 font-semibold text-blue-500 hover:cursor-pointer hover:bg-cardBg hover:text-blue-400">
            Interested
          </div>
        )}
        {request.status === "rejected" && (
          <div className="rounded-full border-2 border-red-500 px-2 py-1 font-semibold text-error hover:cursor-pointer hover:bg-cardBg hover:text-red-400">
            Rejected
          </div>
        )}
      </>
    ),
    following: (
      <>
        {request.status === "accepted" && (
          <div className="rounded-full border-2 border-green-500 px-2 py-1 font-semibold text-green-500 hover:cursor-pointer hover:bg-cardBg hover:text-green-400">
            Connected
          </div>
        )}
        {(request.status === "interested" || request.status === "rejected") && (
          <>
            <div className="rounded-full border-2 border-yellow-500 px-2 py-1 font-semibold text-yellow-500 hover:cursor-pointer hover:bg-cardBg hover:text-yellow-400">
              Pending
            </div>
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
                    removePending(request.status);
                  }}
                >
                  <RiDeleteBin7Fill className="size-6" /> Retrieve Request
                </button>
              )}
            </div>
          </>
        )}
      </>
    ),
    ignored: (
      <>
        <button
          className="flex items-center justify-center text-nowrap rounded-full px-2 py-1 font-semibold text-error hover:bg-cardBg hover:text-red-400"
          onClick={() => removeIgnored()}
        >
          Un-Ignore
        </button>
      </>
    ),
    rejected: (
      <>
        <button
          className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white"
          onClick={() => removeRejected()}
        >
          Remove
        </button>
      </>
    ),
  };

  return (
    <div className="flex w-full items-center justify-between md:px-4">
      <Link
        className="flex items-center gap-3 rounded-md px-2"
        to={`/user/profile/${
          request.fromUserId.username === loggedInUser.username
            ? request.toUserId.username
            : request.fromUserId.username
        }`}
      >
        <div className="flex size-20 rounded-full">
          <div className="relative h-full w-full rounded-full">
            <img
              className="absolute inset-0 h-full w-full rounded-full object-cover p-2"
              src={
                request.fromUserId.username === loggedInUser.username
                  ? request.toUserId.avatar
                  : request.fromUserId.avatar
              }
              alt="User Profile"
            />
          </div>
        </div>

        <div className="w-5/12 sm:w-7/12 md:w-8/12">
          <h3 className="text-nowrap text-xl font-extrabold sm:text-xl">
            {formattedName()}
          </h3>
          <p className="line-clamp-1 text-sm">
            {request.fromUserId.username === loggedInUser.username
              ? request.toUserId?.about || "No information provided."
              : request.fromUserId?.about || "No information provided."}
          </p>
          <p className="text-xs">
            {renderTimeStamp[type]}{" "}
            {request.status === "accepted" || request.status === "rejected"
              ? timeSince(new Date(request.updatedAt))
              : timeSince(new Date(request.createdAt))}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-center gap-2">
        {renderButtons[type]}
      </div>
    </div>
  );
};

NetworkCard.propTypes = {
  type: PropTypes.oneOf([
    "interested",
    "connection",
    "follower",
    "following",
    "ignored",
    "rejected",
  ]).isRequired,
};

export default NetworkCard;
