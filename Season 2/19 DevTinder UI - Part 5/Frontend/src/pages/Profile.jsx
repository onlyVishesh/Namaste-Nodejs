import axios from "axios";
import MarkdownIt from "markdown-it";
import { useEffect, useRef, useState } from "react";
import { IoMdCloseCircle, IoMdSettings } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import MdEditor from "react-markdown-editor-lite";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Card from "../components/Card";
import Model from "../components/Model";
import { abbreviateNumber, capitalize } from "../utils/constants";
import { addUser } from "../utils/userSlice";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import { cacheResults } from "../utils/skillsSlice";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const [requestCount, setRequestCount] = useState(null);
  const [isBannerModelShow, setIsBannerModelShow] = useState(false);
  const [isAvatarModelShow, setIsAvatarModelShow] = useState(false);

  const [skills, setSkills] = useState(null);
  const skillsCache = useSelector((store) => store.skills);
  const [suggestions, setSuggestions] = useState([]);
  const [inputSkillQuery, setInputSkillQuery] = useState("");
  const skillRef = useRef(null);

  const mdParser = new MarkdownIt();
  const [writing, setWriting] = useState(true);

  const [showSettingMenu, setShowSettingMenu] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const settingRef = useRef(null);
  const settingMenu = useRef(null);

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

  useEffect(() => {
    getRequestCount();
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

  const getSkillSuggestions = async (query) => {
    try {
      const res = await axios.get(
        `https://skilllookup.onrender.com/api/skills?query=${query}&page=1&limit=5`,
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
        return;
      }
      setSkills(res.data.skills);
      dispatch(cacheResults({ [query]: res.data.skills }));
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
  const handleInputChange = (e) => {
    setInputSkillQuery(e.target.value);

    const filteredSuggestions = skills?.filter(
      (skill) =>
        skill?.toLowerCase()?.includes(e.target.value.trim()?.toLowerCase()) &&
        !profileData?.skills?.includes(skill),
    );
    setSuggestions(filteredSuggestions);
  };

  // Handle when user selects a suggestion
  const handleSkillSelect = (skill) => {
    if (profileData?.skills?.includes(skill) || skill === "") {
      return;
    }

    if (profileData?.skills?.length === 15) {
      return;
    }

    setProfileData({
      ...profileData,
      skills: [...profileData.skills, capitalize(skill.trim())],
    });

    setInputSkillQuery("");
    setSuggestions([]);
  };

  const handleRemoveSkill = (skill) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((s) => s !== skill),
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillRef.current && !skillRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!inputSkillQuery) return;
    const timer = setTimeout(() => {
      if (skillsCache[inputSkillQuery]) {
        setSuggestions(skillsCache[inputSkillQuery]);
      } else {
        getSkillSuggestions(inputSkillQuery);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [inputSkillQuery]);

  // This function can convert File object to a datauri string
  function onImageUpload(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (data) => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

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
        <div className="mx-auto w-full py-5 sm:w-5/6 [&_input]:border-0 [&_input]:bg-bg [&_select]:border-2 [&_select]:border-border [&_select]:bg-bg [&_textarea]:bg-bg">
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
                            className="text-md xs:w-42 w-32 rounded-md border px-2 py-1 sm:w-48"
                            value={`${capitalize(profileData?.firstName)}`}
                            maxLength={14}
                            minLength={3}
                            onChange={(e) => {
                              setProfileData({
                                ...profileData,
                                firstName: capitalize(e.target.value),
                              });
                            }}
                          />
                          <input
                            className="text-md xs:w-42 w-32 rounded-md border px-2 py-1 sm:w-48"
                            value={`${capitalize(profileData?.lastName)}`}
                            maxLength={25}
                            onChange={(e) => {
                              setProfileData({
                                ...profileData,
                                lastName: capitalize(e.target.value),
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

                    <p
                      className={`text-xl font-semibold text-textMuted ${isEditProfile && "my-1"}`}
                    >
                      {profileData?.username && "@" + profileData.username}
                    </p>
                    <p className="flex items-center text-xl">
                      <span className="flex items-center pr-2">
                        {isEditProfile ? (
                          <>
                            <span className="pr-2">
                              <input
                                type="date"
                                className="w-32 rounded-md !border-2 px-2 py-1 text-sm"
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
                                className="rounded-md border px-2 py-1 text-[16px]"
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
                  </div>
                </div>

                <div className="w-full">
                  <h2 className="pb-2 text-2xl font-bold">Headline</h2>
                  {isEditProfile ? (
                    <div className="w-full rounded-md bg-bg focus-within:border-2">
                      <textarea
                        className="w-full rounded-md px-2 py-1 focus:outline-none"
                        value={profileData?.headline}
                        rows="3"
                        maxLength={220}
                        onChange={(e) => {
                          setProfileData({
                            ...profileData,
                            headline: e.target.value,
                          });
                        }}
                      />
                      <p
                        className={`px-2 py-1 text-right text-sm ${
                          profileData?.headline?.length > 200
                            ? "text-error"
                            : "text-gray-500"
                        }`}
                      >
                        {profileData?.headline?.length
                          ? 220 - profileData?.headline?.length
                          : 220}{" "}
                        char left
                      </p>
                    </div>
                  ) : (
                    <p className="text-md lg:w-11/12">
                      {profileData?.headline}
                    </p>
                  )}
                </div>
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
                <div className="relative mb-5 w-full">
                  <h2 className="pb-2 text-2xl font-bold">Skills</h2>
                  {isEditProfile ? (
                    <div
                      className="group w-full rounded-md bg-bg focus-within:border-2"
                      ref={skillRef}
                    >
                      <div className="flex flex-wrap gap-3 px-4 py-2">
                        {profileData?.skills?.map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center rounded-md bg-primary px-2 py-1 text-text transition-all duration-200 hover:scale-105"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-xs font-semibold transition-all hover:scale-110 hover:cursor-pointer"
                            >
                              <IoMdCloseCircle className="size-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="relative">
                        <input
                          className="w-full rounded-md px-2 py-2 focus:outline-none"
                          value={inputSkillQuery}
                          onChange={handleInputChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSkillSelect(inputSkillQuery);
                            }
                          }}
                          placeholder="Start typing to show suggestions"
                        />
                      </div>
                      <div
                        className={`items-center justify-between px-2 py-1 text-textMuted ${suggestions?.length === 0 ? "group-focus-within:flex" : ""}`}
                      >
                        {suggestions?.length === 0 && (
                          <div className="hidden text-sm group-focus-within:block">
                            Keep writing for suggestion or enter to add Skill
                          </div>
                        )}
                        <p className="text-right text-sm">
                          {profileData?.skills?.length > 15
                            ? "You can only add up to 15 skills."
                            : `${15 - profileData?.skills?.length} skills left`}
                        </p>
                      </div>

                      {suggestions?.length > 0 && (
                        <div className="z-10 mt-1 w-full rounded-b-md bg-cardBg">
                          {suggestions?.map((skill) => (
                            <div
                              key={skill}
                              className="cursor-pointer px-2 py-1 hover:bg-hover"
                              onClick={() => handleSkillSelect(skill)}
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                <div className="relative mb-5 w-full">
                  <h2 className="pb-2 text-2xl font-bold">About</h2>
                  {isEditProfile ? (
                    <>
                      <div className="flex gap-3">
                        <button
                          className={`${writing ? "border-b-[1px] border-primary bg-bg" : ""} rounded-t-md px-2 py-1 transition-[background] duration-300`}
                          onClick={() => {
                            setWriting(true);
                            console.log(writing);
                          }}
                        >
                          Write
                        </button>
                        <button
                          className={`${!writing ? "border-b-[1px] border-primary bg-bg" : ""} rounded-t-md px-2 py-1 transition-[background] duration-300`}
                          onClick={() => {
                            setWriting(false);
                            console.log(writing);
                          }}
                        >
                          Preview
                        </button>
                      </div>
                      {writing && (
                        <MdEditor
                          value={profileData.about}
                          onChange={({ text }) => {
                            setProfileData({
                              ...profileData,
                              about: text,
                            });
                          }}
                          view={{ menu: false, md: true, html: false }}
                          onImageUpload={onImageUpload}
                          className="custom-markdown-editor h-96 rounded-md"
                          renderHTML={(text) => mdParser.render(text)}
                          markdownClass=""
                        />
                      )}
                      {!writing && (
                        <MdEditor
                          value={profileData.about}
                          view={{ menu: false, md: false, html: true }}
                          className="h-96 rounded-md"
                          renderHTML={(text) => mdParser.render(text)}
                          style={{
                            backgroundColor: "var(--color-bg)",
                            border: "0px solid var(--color-bg)",
                          }}
                        />
                      )}

                      <p
                        className={`absolute -bottom-6 w-full rounded-b-md bg-bg px-6 py-1 text-right text-sm ${
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
        <div className="flex flex-col items-center justify-center p-10">
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
