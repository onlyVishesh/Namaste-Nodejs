import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Card from "../components/Card";
import Model from "../components/Model";
import { abbreviateNumber, capitalize } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const Profile = () => {
  const [showSettingMenu, setShowSettingMenu] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isBannerModelShow, setIsBannerModelShow] = useState(false);
  const [isAvatarModelShow, setIsAvatarModelShow] = useState(false);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const [tempBanner, setTempBanner] = useState(
    profileData?.banner ||
      "https://cdn.fstoppers.com/styles/full/s3/media/2020/12/21/nando-vertical-horizontal-11.jpg",
  );
  const [tempAvatar, setTempAvatar] = useState(
    profileData?.avatar ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  );

  const settingRef = useRef(null);
  const settingMenu = useRef(null);

  useEffect(() => {
    if (profileData?.dateOfBirth) {
      const dob = new Date(profileData.dateOfBirth);
      const ageDiff = Date.now() - dob.getTime();
      const age = Math.floor(ageDiff / (365.25 * 24 * 60 * 60 * 1000));
      setProfileData((prevData) => ({
        ...prevData,
        age,
      }));
    } else
      setProfileData((prevData) => ({
        ...prevData,
        age: 0,
      }));
  }, [profileData?.dateOfBirth]);

  const updateProfile = async () => {
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BackendURL + "/profile/edit",
        profileData,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        toast.success(res.data.message || "Profile Data Fetched");
        dispatch(addUser(res.data.user));
      }
    } catch (err) {
      if (err.response) {
        setProfileData(user);
        toast.error(err.response.data.error || "Something went wrong!");
      } else if (err.request) {
        setProfileData(user);
        toast.error("No response from the server. Please try again.");
      } else {
        setProfileData(user);
        toast.error("An unexpected error occurred.");
      }
      console.error(err.message);
    }
  };

  const getConnections = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/user/connections",
        { withCredentials: true },
      );
      if (res.data.success === false) {
        setProfileData(user?.message);
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
    const handleClickOutside = (event) => {
      if (
        settingRef.current &&
        !settingRef.current.contains(event.target) &&
        settingMenu.current &&
        !settingMenu.current.contains(event.target)
      ) {
        setShowSettingMenu(false);
      }
    };

    const handleHoverOver2 = (event) => {
      if (
        (settingRef.current && settingRef.current.contains(event.target)) ||
        (settingMenu.current && settingMenu.current.contains(event.target))
      ) {
        setShowSettingMenu(true);
      } else {
        setShowSettingMenu(false);
      }
    };

    window.addEventListener("mouseover", handleHoverOver2);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("mouseover", handleHoverOver2);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSettingMenu]);

  const handleSave = () => {
    setIsEditProfile(false);
    updateProfile();
  };

  const handleCancel = () => {
    setIsEditProfile(false);
    setProfileData(user);
  };

  return (
    user &&
    profileData && (
      <>
        <Model isModelShow={isBannerModelShow}>
          <div className="bg-cardBg px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <label className="text-center font-bold">Enter Image Url</label>
            <input
              type="text"
              className="mb-3 mt-2 w-full rounded bg-bgSecondary p-2 outline-none"
              onChange={(e) => {
                setTempBanner(e.target.value);
              }}
            />
          </div>
          <div className="bg-bgSecondary px-4 py-3 text-right">
            <button
              type="button"
              className="mr-2 rounded bg-cardBg px-4 py-2 text-text hover:bg-opacity-80"
              onClick={() => {
                setTempBanner(profileData.banner);
                setIsBannerModelShow(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="mr-2 rounded bg-primary px-4 py-2 font-medium text-text transition duration-500 hover:opacity-80"
              onClick={() => {
                setProfileData({ ...profileData, banner: tempBanner });
                setIsBannerModelShow(false);
              }}
            >
              Save
            </button>
          </div>
        </Model>
        <Model isModelShow={isAvatarModelShow}>
          <div className="bg-cardBg px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <label className="text-center font-bold">Enter Image Url</label>
            <input
              type="text"
              className="mb-3 mt-2 w-full rounded bg-bgSecondary p-2 outline-none"
              onChange={(e) => {
                setTempAvatar(e.target.value);
              }}
            />
          </div>
          <div className="bg-bgSecondary px-4 py-3 text-right">
            <button
              type="button"
              className="mr-2 rounded bg-cardBg px-4 py-2 text-text hover:bg-opacity-80"
              onClick={() => {
                setTempAvatar(profileData.avatar);
                setIsAvatarModelShow(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="mr-2 rounded bg-primary px-4 py-2 font-medium text-text transition duration-500 hover:opacity-80"
              onClick={() => {
                setProfileData({ ...profileData, avatar: tempAvatar });
                setIsAvatarModelShow(false);
              }}
            >
              Save
            </button>
          </div>
        </Model>
        <div className="mx-auto w-full py-5 sm:w-5/6 [&_input]:border-2 [&_input]:border-border [&_input]:bg-bgSecondary [&_select]:border-2 [&_select]:border-border [&_select]:bg-bgSecondary [&_textarea]:border-2 [&_textarea]:border-border [&_textarea]:bg-bgSecondary">
          <div className="relative rounded-xl bg-bgSecondary">
            {isEditProfile && (
              <MdEdit
                className="absolute right-3 top-3 size-9 rounded-full border-2 border-border bg-bgSecondary p-1 transition duration-200 hover:scale-105 hover:cursor-pointer md:right-5 md:top-5 md:size-8"
                onClick={() => {
                  setIsBannerModelShow(true);
                }}
              />
            )}
            <img
              className="h-48 w-full overflow-hidden rounded-t-xl object-cover sm:h-56"
              src={profileData?.banner}
              alt="banner"
            />

            <div className="relative mx-5 flex flex-col gap-10 xs:mx-10 lg:flex-row">
              <div className="absolute left-1/2 z-10 flex size-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bgSecondary shadow-md shadow-shadow xs:size-52 sm:size-60 lg:left-0 lg:translate-x-0">
                <div className="relative h-full w-full">
                  {isEditProfile && (
                    <MdEdit
                      className="absolute right-3 top-3 z-10 size-9 rounded-full border-2 border-border bg-bgSecondary p-1 transition duration-200 hover:scale-105 hover:cursor-pointer md:right-5 md:top-5 md:size-8"
                      onClick={() => {
                        setIsAvatarModelShow(true);
                      }}
                    />
                  )}
                  <img
                    className="absolute inset-0 h-full w-full rounded-full object-cover p-2"
                    src={profileData?.avatar}
                    alt="user profile"
                  />
                </div>
              </div>

              <div className="my-10 flex flex-col gap-5 pt-24 lg:ml-64 lg:w-[65%] lg:pt-0">
                <div
                  className={`flex justify-between ${isEditProfile ? "flex-col xl:flex-row" : ""}`}
                >
                  <div>
                    <p className="text-2xl font-extrabold sm:text-3xl">
                      {isEditProfile ? (
                        <div className="flex flex-wrap gap-3 xs:gap-5">
                          <input
                            className="text-md xs:w-42 w-32 rounded-md border px-2 sm:w-48"
                            value={`${profileData?.firstName}`}
                            maxLength={14}
                            minLength={3}
                            onChange={(e) => {
                              setProfileData({
                                ...profileData,
                                firstName: e.target.value,
                              });
                            }}
                            onBlur={() => {
                              setProfileData({
                                ...profileData,
                                firstName: capitalize(profileData?.firstName),
                              });
                            }}
                          />
                          <input
                            className="text-md xs:w-42 w-32 rounded-md border px-2 sm:w-48"
                            value={`${profileData?.lastName || ""}`}
                            maxLength={25}
                            onChange={(e) => {
                              setProfileData({
                                ...profileData,
                                lastName: e.target.value,
                              });
                            }}
                            onBlur={() => {
                              setProfileData({
                                ...profileData,
                                lastName: capitalize(profileData?.lastName),
                              });
                            }}
                          />
                        </div>
                      ) : profileData?.lastName?.length > 14 ? (
                        capitalize(profileData?.firstName) +
                        " " +
                        capitalize(profileData?.lastName.slice(0, 14) + "...")
                      ) : (
                        capitalize(profileData?.firstName) +
                        " " +
                        capitalize(profileData?.lastName)
                      )}
                    </p>

                    <p className="text-xl font-semibold text-textMuted">
                      @{profileData?.username}
                    </p>
                    <p className="flex items-center text-center text-xl">
                      <span className="pr-2">
                        {isEditProfile ? (
                          <>
                            <span className="pr-2">
                              <input
                                type="date"
                                className="w-32 rounded-md border px-2 text-sm"
                                defaultValue={
                                  profileData?.dateOfBirth
                                    ? new Date(profileData?.dateOfBirth)
                                        ?.toISOString()
                                        ?.split("T")[0]
                                    : new Date().toISOString().split("T")[0]
                                }
                                onChange={(e) => {
                                  setProfileData({
                                    ...profileData,
                                    dateOfBirth: e.target.value,
                                  });
                                }}
                                max={new Date().toISOString().split("T")[0]}
                              />
                            </span>
                            <span className="pl-2">
                              <select
                                className="rounded-md border px-2 text-[18px]"
                                value={profileData?.gender || ""}
                                onChange={(e) => {
                                  if (e.target.value === "") return;
                                  setProfileData({
                                    ...profileData,
                                    gender: e.target.value,
                                  });
                                }}
                              >
                                <option value="" disabled>
                                  Select Gender
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </span>
                          </>
                        ) : (
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
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="block text-right">
                    <p
                      className={`flex items-center justify-center sm:gap-2 ${isEditProfile ? "flex-col pt-3 sm:justify-start xl:flex-row" : ""}`}
                    >
                      Status:
                      {isEditProfile ? (
                        <select
                          className="rounded-md border px-2 text-[18px]"
                          value={profileData?.status}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="deactivated">Deactivated</option>
                        </select>
                      ) : (
                        <span
                          className={
                            profileData?.status?.toLowerCase() === "active"
                              ? "text-accent1"
                              : "text-accent3"
                          }
                        >
                          {capitalize(profileData?.status)}
                        </span>
                      )}
                    </p>
                    {/* <div className="flex flex-col items-center justify-center rounded-md bg-primary px-5 py-2 transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:opacity-90">
                  <p className="text-lg font-bold">Follow</p>
                </div> */}
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
                  {isEditProfile ? (
                    <>
                      <input
                        className="w-full rounded-md border px-2 py-2"
                        value={profileData?.skills.join(", ")}
                        onChange={(e) => {
                          setProfileData({
                            ...profileData,
                            skills: e.target.value
                              .split(",")
                              .map((skill) => skill.trim()),
                          });
                        }}
                        onBlur={(e) => {
                          const skills = e.target.value
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter((skill) => skill !== ""); // Remove empty skills

                          if (skills.length <= 15) {
                            setProfileData({
                              ...profileData,
                              skills: [...new Set(skills)], // Ensure unique skills
                            });
                          } else {
                            setProfileData({
                              ...profileData,
                              skills: [...new Set(skills)].slice(0, 15), // Limit to 15 unique skills
                            });
                          }
                        }}
                      />

                      <p
                        className={`absolute bottom-6 right-2 text-sm ${
                          profileData?.skills.length > 3
                            ? "text-error"
                            : "text-gray-500"
                        }`}
                      >
                        {profileData?.skills.length >= 15
                          ? "0 Skill"
                          : profileData?.skills.length >= 14
                            ? "1 Skill"
                            : 15 - profileData?.skills.length + " Skills"}{" "}
                        left
                      </p>

                      {profileData?.skills.length >= 15 ? (
                        <p className="mt-1 text-sm text-red-500">
                          You can only add up to 15 skills.
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-red-500">
                          Enter Comma separated Value
                        </p>
                      )}
                    </>
                  ) : (
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
                  )}
                </div>

                <div className="relative w-full">
                  <h2 className="pb-2 text-2xl font-bold">About</h2>
                  {isEditProfile ? (
                    <>
                      <textarea
                        className="w-full rounded-md border px-2 py-1"
                        value={profileData?.about}
                        maxLength={500}
                        onChange={(e) => {
                          setProfileData({
                            ...profileData,
                            about: e.target.value,
                          });
                        }}
                      />
                      <p
                        className={`absolute bottom-3 right-2 text-sm ${
                          profileData?.about?.length > 420
                            ? "text-error"
                            : "text-gray-500"
                        }`}
                      >
                        {profileData?.about?.length
                          ? 500 - profileData?.about?.length
                          : 500}{" "}
                        char left
                      </p>
                    </>
                  ) : (
                    <p className="rounded-md bg-bg px-5 py-3">
                      {profileData?.about || "No information provided."}
                    </p>
                  )}
                </div>
                {isEditProfile && (
                  <div className="flex items-center justify-center gap-5">
                    <button
                      onClick={handleCancel}
                      className="rounded-md bg-accent3 px-5 py-2 transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:opacity-90"
                    >
                      <p className="text-lg font-bold">Cancel</p>
                    </button>
                    <button
                      onClick={handleSave}
                      className="rounded-md bg-accent1 px-5 py-2 transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:opacity-90"
                    >
                      <p className="text-lg font-bold">Save</p>
                    </button>
                  </div>
                )}
              </div>
              <div ref={settingRef}>
                <IoMdSettings
                  className="absolute -right-3 top-10 z-10 size-8 transition delay-[40ms] duration-200 ease-in-out hover:rotate-90 hover:cursor-pointer sm:top-5"
                  onClick={() => setShowSettingMenu((prev) => !prev)}
                />
                {showSettingMenu && (
                  <div
                    className="absolute -right-3 top-14 bg-bgSecondary pt-7 sm:top-7"
                    ref={settingMenu}
                  >
                    <ul className="z-50 flex flex-col gap-2 rounded-md rounded-b-md bg-bg px-4 py-2 pt-2 text-center transition duration-100 [&_li]:text-center">
                      <li className="hover:cursor-pointer hover:text-hover">
                        {!isEditProfile ? (
                          <button onClick={() => setIsEditProfile(true)}>
                            Edit Profile
                          </button>
                        ) : (
                          <button onClick={handleCancel}>
                            <p className="text-lg font-bold">Cancel Edit</p>
                          </button>
                        )}
                      </li>
                      <li className="hover:cursor-pointer hover:text-hover">
                        <button>Change Password</button>
                      </li>
                      <li className="hover:cursor-pointer hover:text-hover">
                        <Link to="/setting">Setting</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-10 flex flex-col items-center justify-center">
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
        </div>
      </>
    )
  );
};

export default Profile;
