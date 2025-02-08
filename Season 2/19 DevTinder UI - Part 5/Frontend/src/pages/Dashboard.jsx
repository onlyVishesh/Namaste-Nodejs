import { Link } from "react-router-dom";
import DataCard from "../components/Dashboard/DataCard";

const Dashboard = () => {
  return (
    <div className="">
      <h2 className="mb-5 pt-5 text-3xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Link to="/admin/users">
          <DataCard heading={"Users"} type="user" data="new" />
        </Link>
        <Link to="/admin/requests">
          <DataCard heading={"Requests"} type="request" data="all" />
        </Link>
        <Link to="/admin/interested">
          <DataCard heading={"Interested"} type="request" data="interested" />
        </Link>
        <Link to="/admin/connected">
          <DataCard heading={"Connected"} type="request" data="accepted" />
        </Link>
        <Link to="/admin/rejected">
          <DataCard heading={"Rejected"} type="request" data="rejected" />
        </Link>
        <Link to="/admin/ignored">
          <DataCard heading={"Ignored"} type="request" data="ignored" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
