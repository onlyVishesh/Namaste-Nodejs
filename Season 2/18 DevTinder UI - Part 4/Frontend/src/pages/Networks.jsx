import {
  FaUserCheck,
  FaUserClock,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";

const Networks = () => {
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
              Invitations
            </p>
            <p>(20)</p>
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
            <p>(20)</p>
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
            <p>(20)</p>
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
            <p>(20)</p>
          </NavLink>
        </div>
      </div>
      <div className="h-[200vh] w-full lg:w-8/12">{<Outlet />}</div>
    </div>
  );
};

export default Networks;
