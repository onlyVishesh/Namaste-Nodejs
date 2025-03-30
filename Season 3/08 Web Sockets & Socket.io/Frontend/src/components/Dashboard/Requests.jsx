import { Link, Outlet } from "react-router-dom";
import DataCard from "./DataCard";

const Requests = () => {
  return (
    <div className="">
      <h2 className="mb-5 pt-5 text-3xl font-bold text-center">Requests</h2>
      <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <Link to="/admin/requests">
          <DataCard heading={"All"} type="request" data="all" />
        </Link>
        <Link to="/admin/requests/interested">
          <DataCard heading={"Interested"} type="request" data="interested" />
        </Link>
        <Link to="/admin/requests/accepted">
          <DataCard heading={"Accepted"} type="request" data="accepted" />
        </Link>
        <Link to="/admin/requests/rejected">
          <DataCard heading={"Rejected"} type="request" data="rejected" />
        </Link>
        <Link to="/admin/requests/ignored">
          <DataCard heading={"Ignored"} type="request" data="ignored" />
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default Requests;
