import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { capitalize } from "../../utils/constants";

const RequestDataCard = ({ request }) => {
  const formattedName = (firstName, lastName) => {
    const truncatedLastName =
      lastName?.length > 14 ? `${lastName.slice(0, 14)}...` : lastName;
    return `${capitalize(firstName)} ${capitalize(truncatedLastName)}`;
  };

  const renderButtons = {
    interested: (
      <div className="rounded-md bg-blue-500 px-2 py-1 font-semibold hover:cursor-pointer">
        Interested
      </div>
    ),
    accepted: (
      <>
        <div className="rounded-md bg-green-500 px-2 py-1 font-semibold hover:cursor-pointer">
          Accepted
        </div>
      </>
    ),
    rejected: (
      <div className="rounded-md bg-red-500 px-2 py-1 font-semibold hover:cursor-pointer">
        Rejected
      </div>
    ),
    ignored: (
      <>
        <button className="rounded-md bg-gray-500 px-2 py-1 font-semibold hover:cursor-pointer">
          Ignored
        </button>
      </>
    ),
  };

  return (
    <div className="relative w-full sm:w-2/3">
      <div className="flex flex-col items-center justify-between">
        {/* From User */}
        <div className="flex w-full items-center justify-between gap-3 rounded-t-lg bg-cardBg px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-20 rounded-full">
              <div className="relative h-full w-full rounded-full">
                <img
                  className="absolute inset-0 h-full w-full rounded-full object-cover p-2"
                  src={request.fromUserId.avatar}
                  alt="User Profile"
                />
              </div>
            </div>

            <div className="w-5/12 sm:w-7/12 md:w-8/12">
              <h3 className="text-nowrap text-md font-extrabold sm:text-xl">
                {formattedName(
                  request.fromUserId.firstName,
                  request.fromUserId.lastName,
                )}
              </h3>
              <p className="text-sm text-textMuted">
                {request.fromUserId?.username || "No information provided."}
              </p>
              <p className="line-clamp-1 text-sm">
                {request.fromUserId?.headline || "No information provided."}
              </p>
            </div>
          </div>
          <Link
            to={`/profile/${request.fromUserId.username}`}
            className="transform text-nowrap rounded-lg bg-primary sm:px-4 sm:py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-hover px-2 py-1 "
          >
            View Profile
          </Link>
        </div>

        {/* Request Type */}
        <div className="z-10 -mb-2 -mt-2 flex flex-col items-end">
          {renderButtons[request?.status]}
        </div>

        {/* To User */}
        <div className="flex w-full items-center justify-between gap-3 rounded-b-lg bg-cardBg px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-20 rounded-full">
              <div className="relative h-full w-full rounded-full">
                <img
                  className="absolute inset-0 h-full w-full rounded-full object-cover p-2"
                  src={request.toUserId.avatar}
                  alt="User Profile"
                />
              </div>
            </div>

            <div className="w-5/12 sm:w-7/12 md:w-8/12">
              <h3 className="text-nowrap text-md font-extrabold sm:text-xl">
                {formattedName(
                  request.toUserId.firstName,
                  request.toUserId.lastName,
                )}
              </h3>
              <p className="text-sm text-textMuted">
                {request.toUserId?.username || "No information provided."}
              </p>
              <p className="line-clamp-1 text-sm">
                {request.toUserId?.headline || "No information provided."}
              </p>
            </div>
          </div>
          <Link
            to={`/profile/${request.toUserId.username}`}
            className="transform text-nowrap rounded-lg bg-primary px-2 py-1 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-hover sm:px-4 sm:py-3"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

RequestDataCard.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    fromUserId: PropTypes.shape({
      username: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    toUserId: PropTypes.shape({
      username: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default RequestDataCard;
