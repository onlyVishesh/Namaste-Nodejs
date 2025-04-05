import axios from "axios";
import { motion } from "framer-motion";
import { House, LockKeyhole, Menu, UserRoundPen, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiMoon, FiSun } from "react-icons/fi";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { logout } from "../utils/authSlice";
import { clearConnectionRequests } from "../utils/connectionsSlice";
import { clearFollowerRequests } from "../utils/followersSlice";
import { clearFollowingRequests } from "../utils/followingSlice";
import { clearIgnoredRequests } from "../utils/ignoredRequestsSlice";
import { clearInterestedRequests } from "../utils/interestedRequestsSlice";
import { clearRejectedRequests } from "../utils/rejectedRequestsSlice";
import { cacheResults } from "../utils/searchSlice";
import { removeUser } from "../utils/userSlice";
import ProfileSearchCard from "./ProfileSearchCard";

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const NavBar = () => {
  const NAVBAR_LINKS = {
    home: <House />,
    networks: <Users />,
    profile: <UserRoundPen />,
    Premium: (
      <MdOutlineWorkspacePremium className="h-5 w-5 sm:h-6 sm:w-7" />
    ),
  };

  const HAMBURGER_SECTIONS = {
    Home: "/",
    "Meet the Team": "/team",
    "Contact Form": "/contact-form",
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [showNavbar, setShowNavbar] = useState(false);
  const menuRef = useRef(null);
  const [showProfileMenu1, setShowProfileMenu1] = useState(false);
  const [showProfileMenu2, setShowProfileMenu2] = useState(false);
  const profileRef1 = useRef(null);
  const profileMenuRef1 = useRef(null);
  const profileRef2 = useRef(null);
  const profileMenuRef2 = useRef(null);
  const [search, setSearch] = useState(null);
  const searchCache = useSelector((store) => store.search);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const user = useSelector((store) => store.user);

  if (user?.role === "admin") {
    NAVBAR_LINKS["admin"] = <LockKeyhole />;
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save new theme to localStorage
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BackendURL + "/logout",
        {},
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res?.data?.message || "An error occurred");
      } else {
        toast.success(res?.data?.message || "Logout successful!");
        dispatch(clearInterestedRequests());
        dispatch(clearConnectionRequests());
        dispatch(clearFollowerRequests());
        dispatch(clearFollowingRequests());
        dispatch(clearIgnoredRequests());
        dispatch(clearRejectedRequests());
        dispatch(removeUser());
        dispatch(logout());
        return navigate("/");
      }
    } catch (err) {
      if (err.response) {
        toast.error(err?.response?.data?.error || "Something went wrong!");
      } else if (err.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(err?.message);
      return navigate("/");
    }
  };

  useEffect(() => {
    // Ensure the correct theme is applied to the body
    const mainBody = document.querySelector(".main-body");
    mainBody.classList.remove("dark", "light"); // Remove any existing theme classes
    mainBody.classList.add(theme); // Add the current theme
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setShowNavbar(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        profileRef1.current &&
        !profileRef1.current.contains(event.target) &&
        profileMenuRef1.current &&
        !profileMenuRef1.current.contains(event.target)
      ) {
        setShowProfileMenu1(false); // Close the profile menu when clicking outside
      }
      if (
        profileRef2.current &&
        !profileRef2.current.contains(event.target) &&
        profileMenuRef2.current &&
        !profileMenuRef2.current.contains(event.target)
      ) {
        setShowProfileMenu2(false); // Close the profile menu when clicking outside
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowNavbar(false); // Close the menu when clicking outside
      }
    };

    const handleHoverOver1 = (event) => {
      if (
        (profileRef1.current && profileRef1.current.contains(event.target)) ||
        (profileMenuRef1.current &&
          profileMenuRef1.current.contains(event.target))
      ) {
        setShowProfileMenu1(true);
      } else {
        setShowProfileMenu1(false);
      }
    };

    const handleHoverOver2 = (event) => {
      if (
        (profileRef2.current && profileRef2.current.contains(event.target)) ||
        (profileMenuRef2.current &&
          profileMenuRef2.current.contains(event.target))
      ) {
        setShowProfileMenu2(true);
      } else {
        setShowProfileMenu2(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mouseover", handleHoverOver1);
    window.addEventListener("mouseover", handleHoverOver2);
    document.addEventListener("click", handleClickOutside);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseover", handleHoverOver1);
      window.removeEventListener("mouseover", handleHoverOver2);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showProfileMenu1, showProfileMenu2]);

  const getSearchSuggestions = async (query) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL +
          `/search/?query=${query}&page=1&limit=5`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
        return;
      }
      setSearch(res.data.result);
      dispatch(cacheResults({ [query]: res.data.result }));
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
    setInputSearchQuery(e.target.value);
    setSearchSuggestions(search);
  };

  useEffect(() => {
    if (!inputSearchQuery) return;
    const timer = setTimeout(() => {
      if (searchCache[inputSearchQuery]) {
        setSearchSuggestions(searchCache[inputSearchQuery]);
      } else {
        getSearchSuggestions(inputSearchQuery);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [inputSearchQuery]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  const newLocal = "z-50 fixed top-0 h-auto w-full bg-bgSecondary";
  return (
    <nav className={newLocal} ref={menuRef}>
      <div className="mx-0 flex h-full items-center justify-between px-4 sm:container sm:mx-auto">
        <div className="flex items-center gap-2 md:gap-4">
          <NavLink
            to={"/"}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img draggable="false" src={logo} className="w-20" />
          </NavLink>

          {user && (
            <div className="relative z-10">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
              <input
                type="text"
                className="w-48 rounded-xl border-2 border-border p-1 pl-10 text-black 2xs:w-52 md:w-52 lg:w-64"
                placeholder="Search"
                value={inputSearchQuery}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate("/search?query=" + inputSearchQuery);
                    setInputSearchQuery("");
                    setSearchSuggestions([]);
                  }
                }}
              />
              <div
                className={`absolute items-center justify-between px-2 py-1 text-textMuted ${searchSuggestions?.length === 0 ? "group-focus-within:flex" : ""}`}
              >
                {isFocused && searchSuggestions?.length === 0 && (
                  <div className="hidden text-sm group-focus-within:block">
                    No Suggestion Available
                  </div>
                )}
              </div>
              {isFocused && searchSuggestions?.length > 0 && (
                <div className="absolute z-10 mt-1 flex w-full flex-col justify-start gap-2 rounded-md rounded-b-md bg-cardBg">
                  {searchSuggestions?.map((search) => (
                    <div
                      key={search._id}
                      className="cursor-pointer px-2 py-1 hover:bg-hover"
                    >
                      <ProfileSearchCard
                        userData={search}
                        onClick={() => {
                          setInputSearchQuery("");
                          setSearchSuggestions([]);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-5">
          {user && (
            <div
              className="relative block md:hidden"
              ref={profileRef1}
              onClick={() => setShowProfileMenu1(!showProfileMenu1)} // Toggle on click
            >
              <img
                draggable="false"
                src={
                  user?.avatar
                    ? user.avatar
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt=""
                className="inset-0 z-[100] size-8 rounded-full border-2 border-border object-cover shadow-lg shadow-shadow lg:size-10"
              />
              {showProfileMenu1 && (
                <ul
                  className="absolute -right-16 flex w-40 flex-col gap-2 rounded-b-md bg-bgSecondary px-4 py-2 pb-4 pt-6 text-center text-lg font-bold transition duration-100"
                  ref={profileMenuRef1}
                >
                  <NavLink
                    to="/profile"
                    className="hover:cursor-pointer hover:text-hover"
                  >
                    Profile
                  </NavLink>
                  <li>
                    <button
                      className="hover:cursor-pointer hover:text-hover"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          <div className="md:hidden" onClick={handleShowNavbar}>
            <Menu />
          </div>
        </div>
        <div
          className={`absolute right-0 top-10 h-[calc(100vh-4rem)] w-0 overflow-hidden rounded-sm transition-all duration-300 ease-in-out md:relative md:right-auto md:top-auto md:flex md:h-auto md:w-auto md:items-center md:overflow-visible ${
            showNavbar
              ? "mt-8 flex w-64 items-start justify-center bg-bgSecondary pt-10"
              : ""
          }`}
        >
          <ul className="flex flex-col items-center space-x-2 font-medium md:flex-row md:space-x-4 lg:space-x-6">
            {user ? (
              <>
                {Object.keys(NAVBAR_LINKS).map((link) => {
                  return (
                    <li key={link}>
                      <NavLink
                        to={link === "home" ? "/feed" : "/" + link}
                        className={({ isActive }) =>
                          `relative flex flex-col items-center justify-center px-4 py-2 font-semibold hover:text-hover ${
                            isActive
                              ? "text-hover after:h-0.5 after:w-full after:bg-hover after:content-['']"
                              : ""
                          }`
                        }
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          setShowNavbar(false);
                        }}
                      >
                        {NAVBAR_LINKS[link]}
                        <span className="sm:block md:hidden lg:block">
                          {link[0].toUpperCase() + link.slice(1)}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
                <li
                  className="relative hidden md:block"
                  ref={profileRef2}
                  onClick={() => setShowProfileMenu2(!showProfileMenu2)} // Toggle on click
                >
                  <img
                    draggable="false"
                    src={
                      user?.avatar
                        ? user.avatar
                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                    className="inset-0 z-[100] size-8 rounded-full border-2 border-border object-cover shadow-lg shadow-shadow lg:size-10"
                  />
                  {showProfileMenu2 && (
                    <ul
                      className="absolute -left-3 flex w-40 flex-col gap-2 rounded-b-md bg-bgSecondary px-4 py-2 pb-4 pt-6 text-center font-bold transition duration-100"
                      ref={profileMenuRef2}
                    >
                      <NavLink
                        to="/profile"
                        className="hover:cursor-pointer hover:text-hover"
                      >
                        Profile
                      </NavLink>
                      <li>
                        <button
                          className="hover:cursor-pointer hover:text-hover"
                          onClick={() => {
                            handleLogout();
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            ) : (
              <div className="flex h-[70vh] flex-col justify-between md:h-0">
                <div className="md:hidden">
                  {Object.keys(HAMBURGER_SECTIONS).map((link) => {
                    return (
                      <li key={link}>
                        <NavLink
                          to={HAMBURGER_SECTIONS[link]}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            setShowNavbar(false);
                          }}
                          className={({ isActive }) =>
                            `relative flex flex-col items-center justify-center px-4 py-2 font-semibold hover:text-hover ${
                              isActive
                                ? "text-hover after:h-0.5 after:w-full after:bg-hover after:content-['']"
                                : ""
                            }`
                          }
                        >
                          <span className="sm:block md:hidden lg:block">
                            {link[0].toUpperCase() + link.slice(1)}
                          </span>
                        </NavLink>
                      </li>
                    );
                  })}
                </div>
                <div className="mb-4 flex flex-col justify-center gap-2 text-center font-medium md:mb-0 md:-translate-y-5 md:flex-row">
                  <NavLink to="/login">
                    <button
                      className="transform rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-hover"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setShowNavbar(false);
                      }}
                    >
                      Login
                    </button>
                  </NavLink>
                  <NavLink to="/signup">
                    <button
                      className="transform rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-hover"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setShowNavbar(false);
                      }}
                    >
                      Create Account
                    </button>
                  </NavLink>
                </div>
              </div>
            )}
            <li className="relative flex flex-col items-center justify-center text-hover hover:text-hover">
              <SliderToggle theme={theme} toggleTheme={toggleTheme} />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

// eslint-disable-next-line react/prop-types
const SliderToggle = ({ theme, toggleTheme }) => {
  return (
    <div className="relative flex w-fit items-center rounded-full border-[1.5px] border-border">
      <button
        className={`${TOGGLE_CLASSES} ${
          theme === "light" ? "text-white" : "text-slate-300"
        }`}
        onClick={() => {
          toggleTheme();
        }}
      >
        <FiSun className="relative z-10 text-lg md:text-sm" />
      </button>
      <button
        className={`${TOGGLE_CLASSES} ${
          theme === "dark" ? "text-white" : "text-slate-800"
        }`}
        onClick={() => {
          toggleTheme();
        }}
      >
        <FiMoon className="relative z-10 text-lg md:text-sm" />
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${
          theme === "dark" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
        />
      </div>
    </div>
  );
};

export default NavBar;
