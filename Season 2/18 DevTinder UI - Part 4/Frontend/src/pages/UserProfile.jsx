/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { abbreviateNumber, capitalize } from "../utils/constants";

const UserProfile = () => {
  const { userId } = useParams();
  const user = useSelector((store) => store.user);
  console.log(user);
  const [profileData, setProfileData] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);

  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/profile/" + userId,
        { withCredentials: true },
      );
      console.log(res?.data?.user);
      if (res.data.success === false) {
        setProfileData(res?.data?.user);
        toast.error(res.data.message || "An error occurred");
        return navigate("/feed");
      }
      setProfileData(res?.data?.user);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error || "Something went wrong!");
      } else if (err.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }

      console.error(err.message);
      return navigate("/feed");
    }
  };
  const getConnections = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/user/connections",
        { withCredentials: true },
      );
      if (res.data.success === false) {
        setProfileData(res?.data.user);
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
    console.log(user?.username, userId);
    if (user?.username === userId) {
      return navigate("/profile");
    } else {
      getUserData();
      getConnections();
    }
  }, [user?.username, userId, navigate]);

  return (
    profileData && (
      <>
        <div className="mx-auto w-full py-5 sm:w-5/6 [&_input]:border-2 [&_input]:border-border [&_input]:bg-bgSecondary [&_select]:border-2 [&_select]:border-border [&_select]:bg-bgSecondary [&_textarea]:border-2 [&_textarea]:border-border [&_textarea]:bg-bgSecondary">
          <div className="relative rounded-xl bg-bgSecondary">
            <img
              className="h-48 w-full overflow-hidden rounded-t-xl object-cover sm:h-56"
              src={profileData?.banner}
              alt="banner"
            />

            <div className="relative mx-5 flex flex-col gap-10 xs:mx-10 lg:flex-row">
              <div className="absolute left-1/2 z-10 flex size-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bgSecondary shadow-md shadow-shadow xs:size-52 sm:size-60 lg:left-0 lg:translate-x-0">
                <div className="relative h-full w-full">
                  <img
                    className="absolute inset-0 h-full w-full rounded-full object-cover p-2"
                    src={profileData?.avatar}
                    alt="user profile"
                  />
                </div>
              </div>

              <div className="my-10 flex flex-col gap-5 pt-24 lg:ml-64 lg:w-[65%] lg:pt-0">
                <div className={`flex justify-between`}>
                  <div>
                    <p className="text-2xl font-extrabold sm:text-3xl">
                      {profileData?.lastName?.length > 14
                        ? capitalize(profileData?.firstName) +
                          " " +
                          capitalize(profileData?.lastName.slice(0, 14) + "...")
                        : capitalize(profileData?.firstName) +
                          " " +
                          capitalize(profileData?.lastName)}
                    </p>

                    <p className="text-xl font-semibold text-textMuted">
                      @{profileData?.username}
                    </p>
                    <p className="flex items-center text-center text-xl">
                      <span className="pr-2">
                        {
                          <>
                            {profileData?.age && profileData?.gender ? (
                              <>
                                {profileData?.age > 0 && (
                                  <span className="pr-2">
                                    {profileData?.age}
                                  </span>
                                )}
                                <span className="font-bold text-textMuted">
                                  {" "}
                                  |{" "}
                                </span>
                                {profileData?.gender && (
                                  <span className="pl-2">
                                    {capitalize(profileData?.gender)}
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                {profileData?.age > 0 && (
                                  <span className="">{profileData?.age}</span>
                                )}
                                {profileData?.gender && (
                                  <span className="">
                                    {capitalize(profileData?.gender)}
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        }
                      </span>
                    </p>
                  </div>
                  <div className="block space-y-2 text-right">
                    <p className={`flex items-center justify-center sm:gap-2`}>
                      Status:
                      <span
                        className={
                          profileData?.status?.toLowerCase() === "active"
                            ? "text-accent1"
                            : "text-accent3"
                        }
                      >
                        {capitalize(profileData?.status)}
                      </span>
                    </p>
                    {profileData?.status === "active" && (
                      <div className="flex flex-col items-center justify-center rounded-md bg-primary px-5 py-2 transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:opacity-90">
                        <p className="text-lg font-bold">Follow</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex flex-col items-center justify-center rounded-md bg-bg px-5 py-2">
                    <p className="-mb-1 text-xl font-bold">
                      {followers !== null && followers !== undefined
                        ? abbreviateNumber(followers)
                        : "NA"}
                    </p>

                    <p className="text-lg text-textMuted">Follower</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-md bg-bg px-5 py-2">
                    <p className="-mb-1 text-xl font-bold">
                      {following !== null && following !== undefined
                        ? abbreviateNumber(following)
                        : "NA"}
                    </p>

                    <p className="text-lg text-textMuted">Following</p>
                  </div>
                </div>
                <div className="relative w-full">
                  <h2 className="pb-2 text-2xl font-bold">Skills</h2>
                  {
                    <ul className="flex flex-wrap gap-3 duration-200 [&_li]:rounded-md [&_li]:bg-bg [&_li]:px-5 [&_li]:py-2 [&_li]:shadow-sm [&_li]:shadow-shadow [&_li]:transition-all [&_li]:hover:cursor-pointer">
                      {profileData?.skills?.length > 0 ? (
                        profileData?.skills?.map((skill) => (
                          <li
                            className="hover:scale-105 hover:cursor-pointer"
                            key={skill}
                          >
                            {capitalize(skill)}
                          </li>
                        ))
                      ) : (
                        <li className="hover:scale-105 hover:cursor-pointer">
                          No Skills
                        </li>
                      )}
                    </ul>
                  }
                </div>

                <div className="relative w-full">
                  <h2 className="pb-2 text-2xl font-bold">About</h2>
                  {
                    <p className="rounded-md bg-bg px-5 py-3">
                      {profileData?.about || "No information provided."}
                    </p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="m-10 flex flex-col items-center justify-center">
          <h2 className="-mb-10 inline-block text-center text-3xl font-extrabold sm:mb-20 md:mb-24 lg:mb-20">
            This is how{" "}
            <span className="relative">
              Your Profile{" "}
              <svg
                viewBox="0 0 687 155"
                className="absolute -bottom-3 right-4 w-40 text-primary 2xs:right-16 xs:right-4"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M20 98c27-13.3333333 54-20 81-20 40.5 0 40.5 20 81 20s40.626917-20 81-20 40.123083 20 80.5 20 40.5-20 81-20 40.5 20 81 20 40.626917-20 81-20c26.915389 0 53.748722 6.6666667 80.5 20"
                    opacity=".3"
                  ></path>
                  <path d="M20 118c27-13.3333333 54-20 81-20 40.5 0 40.5 20 81 20s40.626917-20 81-20 40.123083 20 80.5 20 40.5-20 81-20 40.5 20 81 20 40.626917-20 81-20c26.915389 0 53.748722 6.6666667 80.5 20"></path>
                </g>
              </svg>
            </span>{" "}
            will look like to other
          </h2>
          <Card user={profileData} />
        </div> */}
      </>
    )
  );
};

export default UserProfile;
