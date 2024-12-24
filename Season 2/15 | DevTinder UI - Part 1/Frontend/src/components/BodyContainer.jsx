import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const BodyContainer = () => {
  return (
    <>
      <NavBar />
      <div className="container mx-auto h-[200vh]">
        <Outlet />
      </div>
      <Footer/>
    </>
  );
};

export default BodyContainer;
