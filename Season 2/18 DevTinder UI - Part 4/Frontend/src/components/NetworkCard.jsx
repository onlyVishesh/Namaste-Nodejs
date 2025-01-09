import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { capitalize } from "../utils/constants";

const NetworkCard = ({ type }) => {
  const user = useSelector((store) => store.user);
  const [showConnection, setShowConnection] = useState(false);
  const menuRef = useRef();

  const formattedName = () => {
    const { firstName, lastName } = user || {};
    const truncatedLastName =
      lastName?.length > 14 ? `${lastName.slice(0, 14)}...` : lastName;
    return `${capitalize(firstName)} ${capitalize(truncatedLastName)}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showConnection &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowConnection(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConnection]);

  const renderTimeStamp = {
    invitation: "Request sent",
    connection: "Connected since",
    follower: "Following since",
    following: "Following since",
  };

  const renderButtons = {
    invitation: (
      <>
        <button className="px-2 py-1 text-textMuted hover:bg-cardBg">
          Ignore
        </button>
        <button className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white">
          Accept
        </button>
      </>
    ),
    connection: (
      <>
        <button className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white">
          Message
        </button>
        <div className="relative">
          <BsThreeDots
            ref={menuRef}
            className="size-8 cursor-pointer rounded-full p-2 hover:bg-cardBg"
            onClick={() => setShowConnection(!showConnection)}
          />
          {showConnection && (
            <button className="absolute right-0 flex items-center gap-2 rounded-md bg-cardBg px-2 py-1 hover:bg-hover justify-center">
              <RiDeleteBin7Fill className="size-6"/> Remove Connection
            </button>
          )}
        </div>
      </>
    ),
    follower: (
      <>
        <button className="rounded-full border-2 border-textMuted px-2 py-1 font-semibold text-textMuted hover:bg-cardBg">
          Following
        </button>
        <button className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white">
          Follow
        </button>
      </>
    ),
    following: (
      <>
        <button className="rounded-full border-2 border-textMuted px-2 py-1 font-semibold text-textMuted hover:bg-cardBg">
          Following
        </button>
        <button className="rounded-full border-2 border-primary px-2 py-1 font-semibold text-primary hover:bg-hover hover:text-white">
          Follow
        </button>
      </>
    ),
  };

  return (
    <div className="flex items-center  gap-3 rounded-md px-2 md:px-4">
      <div className="flex size-20 rounded-full">
        <div className="relative h-full w-full rounded-full">
          <img
            className="absolute inset-0 h-full w-full rounded-full object-cover p-2"
            src={user?.avatar}
            alt="User Profile"
          />
        </div>
      </div>

      <div className="w-5/12 sm:w-7/12 md:w-8/12">
        <h3 className="text-xl font-extrabold sm:text-xl">{formattedName()}</h3>
        <p className="line-clamp-1 text-sm">
          {user?.about || "No information provided."}
        </p>
        <p className="text-xs">{renderTimeStamp[type] + " 1 week ago"}</p>
      </div>

      <div className="flex gap-2">{renderButtons[type]}</div>
    </div>
  );
};

NetworkCard.propTypes = {
  type: PropTypes.oneOf(["invitation", "connection", "follower", "following"])
    .isRequired,
};

export default NetworkCard;
