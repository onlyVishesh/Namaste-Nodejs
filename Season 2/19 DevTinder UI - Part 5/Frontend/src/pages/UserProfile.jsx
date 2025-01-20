/* eslint-disable react/prop-types */
import axios from "axios";
import MarkdownIt from "markdown-it";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { abbreviateNumber, capitalize } from "../utils/constants";

const UserProfile = () => {
  const { userId } = useParams();
  const user = useSelector((store) => store.user);
  console.log(user);
  const [profileData, setProfileData] = useState(null);
  const [requestCount, setRequestCount] = useState(null);
  const [connection, setConnection] = useState(null);
  const menuRef = useRef();
  const [showConnection, setShowConnection] = useState(false);
  const mdParser = new MarkdownIt();

  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/profile/" + userId,
        { withCredentials: true },
      );
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

  const getRequestCount = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL +
          "/user/totalStatus/" +
          profileData._id,
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

  const userConnection = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/user/connection/${profileData._id}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        setConnection(res.data.connectionRequest);
        console.log(connection);
      } else {
        toast.error(res.data.message || "Error fetching connection status");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred");
    }
  };

  useEffect(() => {
    if (user?.username === userId) {
      return navigate("/profile");
    } else {
      getUserData();
    }
  }, [user?.username, userId, navigate]);

  useEffect(() => {
    if (profileData?._id) {
      userConnection();
      getRequestCount();
    }
  }, [profileData]);

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
                    <p
                      className={`flex items-center justify-center gap-1 sm:gap-2`}
                    >
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
                    {profileData ? (
                      connection ? (
                        connection.status === "accepted" ? (
                          <div className="flex flex-col items-center justify-center rounded-md bg-green-500 px-5 py-2 transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:opacity-90">
                            <p className="text-lg font-bold">Connected</p>
                          </div>
                        ) : connection.status === "interested" &&
                          connection.fromUserId?.toString() !==
                            profileData._id?.toString() ? (
                          <div className="flex flex-col items-center justify-center rounded-md bg-yellow-500 px-5 py-2 transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:opacity-90">
                            <p className="text-lg font-bold">Pending</p>
                          </div>
                        ) : connection.status === "interested" &&
                          connection.fromUserId?.toString() ===
                            profileData._id?.toString() ? (
                          <div className="flex items-center justify-center gap-2 rounded-md bg-blue-500 px-5 py-2 transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:opacity-90">
                            <p className="text-lg font-bold">Interested</p>
                          </div>
                        ) : connection.status === "ignored" &&
                          connection.fromUserId?.toString() ===
                            profileData._id?.toString() ? (
                          <div className="flex flex-col items-center justify-center rounded-md bg-gray-500 px-5 py-2 transition-all duration-200 ease-in-out">
                            <p className="text-lg font-bold">Ignored</p>
                          </div>
                        ) : connection.status === "rejected" &&
                          connection.fromUserId?.toString() ===
                            profileData._id?.toString() ? (
                          <div className="flex flex-col items-center justify-center rounded-md bg-red-500 px-5 py-2 transition-all duration-200 ease-in-out">
                            <p className="text-lg font-bold">Rejected</p>
                          </div>
                        ) : connection.status === "rejected" &&
                          connection.fromUserId?.toString() !==
                            profileData._id?.toString() ? (
                          <div className="flex flex-col items-center justify-center rounded-md bg-yellow-500 px-5 py-2 transition-all duration-200 ease-in-out">
                            <p className="text-lg font-bold">Pending</p>
                          </div>
                        ) : null
                      ) : (
                        <div className="relative flex justify-end">
                          <BsThreeDots
                            ref={menuRef}
                            className="size-8 cursor-pointer rounded-full bg-cardBg p-2 duration-300 hover:scale-105"
                            onClick={() => setShowConnection(!showConnection)}
                          />
                          {showConnection && (
                            <div className="absolute right-0 top-10 flex flex-col items-center justify-center gap-2 rounded-md bg-cardBg">
                              <button className="flex w-full gap-5 text-nowrap rounded-md px-3 py-2 hover:bg-hover">
                                Interested ?
                              </button>
                              <button className="flex w-full items-center justify-center gap-2 text-nowrap rounded-md bg-cardBg px-3 py-2 hover:bg-gray-500 hover:bg-hover">
                                Ignore User
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-md bg-red-400 px-5 py-2 transition-all duration-200 ease-in-out">
                        <p className="text-lg font-bold">
                          Please log in to proceed
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-md lg:w-11/12">{profileData?.headline}</p>
                <div className="flex gap-5">
                  <div className="flex flex-col items-center justify-center rounded-md bg-bg px-5 py-2">
                    <p className="-mb-1 text-xl font-bold">
                      {requestCount?.following !== null &&
                      requestCount?.following !== undefined
                        ? abbreviateNumber(requestCount?.following)
                        : "NA"}
                    </p>

                    <p className="text-lg text-textMuted">Follow</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-md bg-bg px-5 py-2">
                    <p className="-mb-1 text-xl font-bold">
                      {requestCount?.followers !== null &&
                      requestCount?.followers !== undefined
                        ? abbreviateNumber(requestCount?.followers)
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
                    <MdEditor
                      value={profileData.about || "No information provided."}
                      view={{ menu: false, md: false, html: true }}
                      className="rounded-md"
                      renderHTML={(text) => mdParser.render(text)}
                      style={{
                        backgroundColor: "var(--color-bg)",
                        border: "0px solid var(--color-bg)",
                      }}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default UserProfile;
