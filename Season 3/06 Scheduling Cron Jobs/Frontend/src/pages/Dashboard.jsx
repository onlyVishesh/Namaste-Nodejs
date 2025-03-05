import { Link } from "react-router-dom";
import DataCard from "../components/Dashboard/DataCard";

const Dashboard = () => {
  return (
    <div className="">
      <h2 className="mb-5 pt-5 text-3xl font-bold text-center">Dashboard</h2>
      <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <Link to="/admin/users">
          <DataCard heading={"Users"} type="user" data="new" />
        </Link>
        <Link to="/admin/requests">
          <DataCard heading={"Requests"} type="request" data="all" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
