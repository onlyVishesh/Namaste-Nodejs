import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const BodyContainer = () => {
  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-20 min-h-[calc(100vh-25rem)]">
        <Outlet />
      </div>
      <Footer/>
    </>
  );
};

export default BodyContainer;
