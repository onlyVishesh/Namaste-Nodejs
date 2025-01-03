/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { abbreviateNumber, capitalize } from "../utils/constants";

// eslint-disable-next-line react/prop-types
const Card = ({ user }) => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);

  const getConnections = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/user/connections",
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      setFollowers(res.data.followers);
      setFollowing(res.data.following);
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
    getConnections();
  }, []);

  useEffect(() => {
    const handleExpand = (event) => {
      if (cardRef.current && cardRef.current.contains(event.target)) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };

    window.addEventListener("mouseover", handleExpand);
    return () => {
      window.removeEventListener("mouseover", handleExpand);
    };
  }, []);

  return (
    <div
      className="group relative mt-20 h-96 w-[380px] select-none rounded-2xl bg-bgSecondary shadow-lg shadow-shadow transition-all duration-700 hover:h-[475px] 2xs:hover:h-[500px] sm:mt-0 sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] md:hover:h-[575px] lg:mt-24 lg:h-96 lg:w-[380px] lg:hover:h-[475px] xl:mt-0 xl:h-[475px] xl:w-[500px] xl:hover:h-[550px]"
      ref={cardRef}
    >
      <div className="bg-primary/20 absolute -top-12 left-1/2 size-48 -translate-x-1/2 overflow-hidden rounded-2xl bg-opacity-20 bg-clip-padding shadow-sm shadow-cardBg backdrop-blur-lg backdrop-filter transition-all duration-700 group-hover:size-64 2xs:size-48 2xs:group-hover:size-64 md:size-64 md:group-hover:size-72 lg:size-48 lg:group-hover:size-64 xl:size-64 xl:group-hover:size-80">
        <img
          draggable="false"
          src={
            user?.avatar ??
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt=""
          className="absolute left-0 top-0 size-full object-cover"
        />
      </div>
      <div className="mx-auto flex h-[85%] w-10/12 flex-col items-center justify-end gap-1 xl:h-[87%]">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          {capitalize(user?.firstName)} {capitalize(user?.lastName)}
          <p className="-mt-1 font-normal text-textMuted md:text-lg">
            @{user.username}
          </p>
        </h2>
        <div className="md:text-md my-2 sm:text-sm">
          <ul className="flex flex-wrap gap-3 duration-200 [&_li]:rounded-md [&_li]:bg-bg [&_li]:px-3 [&_li]:py-2 [&_li]:shadow-sm [&_li]:shadow-shadow [&_li]:transition-all [&_li]:hover:cursor-pointer">
            {user?.skills?.slice(0, 5)?.length > 0 ? (
              user.skills.slice(0, 5).map((skill) =>
                typeof skill === "string" ? (
                  <li
                    className="hover:scale-105 hover:cursor-pointer"
                    key={skill}
                  >
                    {capitalize(skill)}
                  </li>
                ) : (
                  <li
                    className="hover:scale-105 hover:cursor-pointer"
                    key={skill}
                  >
                    Enter Skill and Save for preview
                  </li>
                ),
              )
            ) : (
              <li>No Skills</li>
            )}
          </ul>
        </div>

        <div
          className={`overflow-hidden transition-[max-height] duration-700 ${
            expanded ? "max-h-[300px]" : "max-h-[120px]"
          }`}
        >
          <div className="flex justify-evenly gap-14">
            <div className="flex flex-col items-center justify-center">
              <p className="-mb-2 text-xl font-bold">
                {following !== null && following !== undefined
                  ? abbreviateNumber(following)
                  : "NA"}
              </p>
              <p className="text-lg text-textMuted">Follow</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="-mb-2 text-xl font-bold">
                {followers !== null && followers !== undefined
                  ? abbreviateNumber(followers)
                  : "NA"}
              </p>
              <p className="text-lg text-textMuted">Following</p>
            </div>
          </div>
          {/* <p
            className={`text-md duration-800 line-clamp-5 transition-all md:line-clamp-[7] md:text-lg lg:line-clamp-4 xl:line-clamp-[7]${
              expanded ? "" : ""
            }`}
          >
            {user.about
              ? user.about
              : "User Does not add any details. Click view profile for more detail about user."}
          </p> */}
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 mx-auto flex w-[90%] -translate-x-1/2 items-center justify-center gap-10 xl:bottom-3">
        {
          <button className="rounded-md bg-primary px-4 py-2 text-text hover:bg-hover md:hidden">
            Expand
          </button>
        }
        <Link
          to="/"
          className="rounded-md bg-primary px-4 py-2 text-text hover:bg-hover"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default Card;
