import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const BodyContainer = () => {
  return (
    <div className="container mx-auto">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default BodyContainer;
