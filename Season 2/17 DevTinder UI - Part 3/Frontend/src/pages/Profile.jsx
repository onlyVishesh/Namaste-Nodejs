import { useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "../utils/constants";

const Profile = () => {
  const [showProfileMenu2, setShowProfileMenu2] = useState(false);
  const settingRef = useRef(null);
  const settingMenu = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingRef.current &&
        !settingRef.current.contains(event.target) &&
        settingMenu.current &&
        !settingMenu.current.contains(event.target)
      ) {
        setShowProfileMenu2(false); // Close the profile menu when clicking outside
      }
    };

    const handleHoverOver2 = (event) => {
      if (
        (settingRef.current && settingRef.current.contains(event.target)) ||
        (settingMenu.current && settingMenu.current.contains(event.target))
      ) {
        setShowProfileMenu2(true);
      } else {
        setShowProfileMenu2(false);
      }
    };

    window.addEventListener("mouseover", handleHoverOver2);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("mouseover", handleHoverOver2);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showProfileMenu2]);
  return (
    <div className="mx-auto w-full py-5 sm:w-5/6">
      <div className="rounded-xl bg-bgSecondary">
        <img
          className="h-48 w-full overflow-hidden rounded-t-xl object-cover sm:h-56"
          src="https://cdn.fstoppers.com/styles/full/s3/media/2020/12/21/nando-vertical-horizontal-11.jpg"
          alt="banner"
        />
        <div className="relative mx-5 flex flex-col gap-10 xs:mx-10 lg:flex-row">
          <div className="absolute left-1/2 z-10 flex size-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bgSecondary shadow-md shadow-shadow xs:size-52 sm:size-60 lg:left-0 lg:translate-x-0">
            <img
              className="rounded-full p-2"
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="user profile"
            />
          </div>
          <div className="my-10 flex flex-col gap-5 pt-24 lg:ml-64 lg:w-[65%] lg:pt-0">
            <div className="flex justify-between">
              <div>
                <p className="text-2xl font-extrabold sm:text-3xl">Name Name</p>
                <p className="text-xl font-semibold text-textMuted">
                  @username
                </p>
                <p className="flex items-center text-center text-xl">
                  <p className="pr-2">26</p>
                  <span className="font-bold text-textMuted">|</span>
                  <p className="pl-2">Male</p>
                </p>
              </div>
              <div className="flex flex-col gap-5 text-right">
                <p>
                  Status: <span className="text-accent1">Active</span>
                </p>
                <div className="flex flex-col items-center justify-center rounded-md bg-primary px-5 py-2 transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:opacity-90">
                  <p className="text-lg font-bold">Follow</p>
                </div>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col items-center justify-center rounded-md bg-bg px-5 py-2">
                <p className="-mb-1 text-xl font-bold">
                  {abbreviateNumber(100000)}
                </p>
                <p className="text-bo text-lg">Follower</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md bg-bg px-5 py-2">
                <p className="-mb-1 text-xl font-bold">
                  {abbreviateNumber(100000)}
                </p>
                <p className="text-lg text-textMuted">Following</p>
              </div>
            </div>
            <div className="w-full">
              <h2 className="pb-2 text-2xl font-bold">Skills</h2>
              <ul className="flex gap-3 duration-200 [&_li]:rounded-md [&_li]:bg-bg [&_li]:px-5 [&_li]:py-2 [&_li]:shadow-sm [&_li]:shadow-shadow [&_li]:transition-all [&_li]:hover:cursor-pointer">
                <li className="hover:scale-105 hover:cursor-pointer">React</li>
                <li className="hover:scale-105">React</li>
                <li className="hover:scale-105">React</li>
              </ul>
            </div>
            <div className="w-full">
              <h2 className="pb-2 text-2xl font-bold">About</h2>
              <p className="rounded-md bg-bg px-5 py-3">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta
                id alias, omnis corrupti hic modi aut, eaque illo maxime eius
                libero assumenda provident. Tenetur distinctio debitis repellat,
                eos architecto laborum.
              </p>
            </div>
          </div>
          <div ref={settingRef}>
            <IoMdSettings className="absolute right-0 top-5 z-10 size-8 transition delay-[40ms] duration-200 ease-in-out hover:rotate-90 hover:cursor-pointer" />
            {showProfileMenu2 && (
              <div
                className="absolute -right-0 top-7 bg-bgSecondary pt-7"
                ref={settingMenu}
              >
                <ul className="z-50 flex flex-col gap-2 rounded-md rounded-b-md bg-bg px-6 py-2 pt-2 text-center transition duration-100 [&_li]:text-center">
                  <li className="hover:cursor-pointer hover:text-hover">
                    <button>Edit Profile</button>
                  </li>
                  <li className="hover:cursor-pointer hover:text-hover">
                    <Link to="/setting">Setting</Link>
                  </li>
                  <li className="hover:cursor-pointer hover:text-hover">
                    <button>Logout</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
