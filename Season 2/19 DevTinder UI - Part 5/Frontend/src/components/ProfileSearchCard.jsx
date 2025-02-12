/* eslint-disable react/prop-types */
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { capitalize } from "../utils/constants";

const ProfileSearchCard = ({ userData, onClick }) => {
  return (
    <Link to={"/profile/" + userData?.username} onClick={onClick}>
      <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-hover">
        <img
          src={userData?.avatar}
          alt={userData?.firstName}
          className="aspect-square size-8 rounded-full"
        />
        <div>
          <h3 className="line-clamp-1">
            {capitalize(userData?.firstName)} {capitalize(userData?.lastName)}
          </h3>
          <p className="line-clamp-1 text-sm text-textMuted">
            {userData?.headline}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProfileSearchCard;
