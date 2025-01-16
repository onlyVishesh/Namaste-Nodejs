import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaUserCheck,
  FaUserClock,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { fetchRequestCount } from "../utils/requestCountSlice";

const Networks = () => {
  // const [requestCount, setRequestCount] = useState(null);
  const dispatch = useDispatch();
  const { requestCount, loading, error } = useSelector(
    (state) => state.requestCount,
  );

  const getRequestCount = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/user/totalStatus",
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

  // useEffect(() => {
  //   getRequestCount();
  // }, []);
  useEffect(() => {
    // Fetch the initial request count when the component is mounted
    dispatch(fetchRequestCount());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error); // Display the error if there is one
    }
  }, [error]);

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-between gap-5 py-10 lg:w-11/12 lg:flex-row lg:items-start lg:gap-10 xl:w-10/12">
      <div className="w-full max-w-96 rounded-md bg-bgSecondary lg:sticky lg:top-32 lg:w-4/12 xl:w-3/12">
        <h2 className="px-4 py-4 text-xl font-bold">Manage Your connections</h2>
        <hr className="border-textMuted" />

        <div className="flex flex-col [&_p]:flex [&_p]:items-center [&_p]:gap-3 [&_p]:text-lg">
          <NavLink
            to="/networks"
            end
            className={({ isActive }) =>
              `flex justify-between px-4 py-2 hover:bg-shadow${
                isActive ? "font-bold text-primary" : ""
              }`
            }
          >
            <p>
              <FaUserClock />
              Interested
            </p>
            <p>
              {!requestCount?.interestedReceived ||
              requestCount?.interestedReceived === 0
                ? ""
                : "(" + requestCount?.interestedReceived + ")"}
            </p>
          </NavLink>
          <NavLink
            to="/networks/connections"
            className={({ isActive }) =>
              `flex justify-between px-4 py-2 hover:bg-shadow${
                isActive ? "font-bold text-primary" : ""
              }`
            }
          >
            <p>
              <FaUsers />
              Connections
            </p>
            <p>
              {!requestCount?.connections || requestCount?.connections === 0
                ? ""
                : "(" + requestCount?.connections + ")"}
            </p>
          </NavLink>
          <NavLink
            to="/networks/followers"
            className={({ isActive }) =>
              `flex justify-between px-4 py-2 hover:bg-shadow${
                isActive ? "font-bold text-primary" : ""
              }`
            }
          >
            <p>
              <FaUserCheck />
              Followers
            </p>
            <p>
              {!requestCount?.followers || requestCount?.followers === 0
                ? ""
                : "(" + requestCount?.followers + ")"}
            </p>
          </NavLink>
          <NavLink
            to="/networks/following"
            className={({ isActive }) =>
              `flex justify-between px-4 py-2 hover:bg-shadow${
                isActive ? "font-bold text-primary" : ""
              }`
            }
          >
            <p>
              <FaUserFriends /> Following
            </p>
            <p>
              {!requestCount?.following || requestCount?.following === 0
                ? ""
                : "(" + requestCount?.following + ")"}
            </p>
          </NavLink>
          <NavLink
            to="/networks/ignored"
            className={({ isActive }) =>
              `flex justify-between px-4 py-2 hover:bg-shadow${
                isActive ? "font-bold text-primary" : ""
              }`
            }
          >
            <p>
              <FaUserFriends /> Ignored
            </p>
            <p>
              {(!requestCount?.ignoredSend && !requestCount?.ignoredReceived) ||
              requestCount?.ignoredSend + requestCount?.ignoredReceived === 0
                ? ""
                : "(" +
                  (requestCount?.ignoredSend + requestCount?.ignoredReceived) +
                  ")"}
            </p>
          </NavLink>
        </div>
      </div>
      <div className="w-full lg:w-8/12">{<Outlet />}</div>
    </div>
  );
};

export default Networks;
