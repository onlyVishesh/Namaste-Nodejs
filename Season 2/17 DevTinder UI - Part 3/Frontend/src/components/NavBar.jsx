import axios from "axios";
import { motion } from "framer-motion";
import { House, LockKeyhole, Menu, UserRoundPen, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiMoon, FiSun } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { removeUser } from "../utils/userSlice";

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const NAVBAR_LINKS = {
  home: <House />,
  networks: <Users />,
  profile: <UserRoundPen />,
  admin: <LockKeyhole />,
};

const HAMBURGER_SECTIONS = {
  "Company History": "history",
  "Meet the Team": "team",
  Careers: "careers",
  FAQs: "faqs",
  Support: "support",
};

const NavBar = () => {
  // Retrieve theme from localStorage or default to "dark"
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

  const user = useSelector((store) => store.user);
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
        dispatch(removeUser());
        return navigate("/home");
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
      return navigate("/home");
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

  const newLocal = "z-50 fixed top-0 h-auto w-full bg-bgSecondary";
  return (
    <nav className={newLocal} ref={menuRef}>
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <NavLink
            to={user ? "/feed" : "/"}
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
                className="w-28 rounded-xl border-2 border-border p-1 pl-10 text-black 2xs:w-48"
                placeholder="Search"
              />
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
                  user?.avatar ??
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt=""
                className="z-[100] size-8 rounded-full border-2 border-border shadow-lg shadow-shadow lg:size-10"
              />
              {showProfileMenu1 && (
                <ul
                  className="absolute -right-16 flex w-40 flex-col gap-2 rounded-b-md bg-bgSecondary px-4 py-2 pb-4 pt-6 text-center text-lg font-bold transition duration-100"
                  ref={profileMenuRef1}
                >
                  <li className="hover:cursor-pointer hover:text-hover">
                    <NavLink to="/profile">Profile</NavLink>
                  </li>
                  <li className="hover:cursor-pointer hover:text-hover">
                    <NavLink to="/setting">Setting</NavLink>
                  </li>
                  <li className="hover:cursor-pointer hover:text-hover">
                    <button
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
                        to={"/" + link}
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
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt=""
                    className="z-[100] size-8 rounded-full border-2 border-border shadow-lg shadow-shadow lg:size-10"
                  />
                  {showProfileMenu2 && (
                    <ul
                      className="absolute -left-3 flex w-40 flex-col gap-2 rounded-b-md bg-bgSecondary px-4 py-2 pb-4 pt-6 text-center transition duration-100"
                      ref={profileMenuRef2}
                    >
                      <li className="hover:cursor-pointer hover:text-hover">
                        <NavLink to="/profile">Profile</NavLink>
                      </li>
                      <li className="hover:cursor-pointer hover:text-hover">
                        <NavLink to="/setting">Setting</NavLink>
                      </li>
                      <li className="hover:cursor-pointer hover:text-hover">
                        <button
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
                          to={"/" + HAMBURGER_SECTIONS[link]}
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
                      className="rounded-full bg-gradient-to-r from-primary to-indigo-600 px-5 py-2 text-white transition-opacity duration-100 hover:opacity-80"
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
                      className="rounded-full bg-gradient-to-r from-primary to-indigo-600 px-5 py-2 text-white transition-opacity duration-100 hover:opacity-80"
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
