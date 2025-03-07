import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

const FOOTER_CONTAINING_LINKS = [
  "/",
  "/team",
  "/faqs",
  "/support",
  "/contact-form",
];

const BodyContainer = () => {
  const location = useLocation();

  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-20 max-h-fit min-h-[calc(100vh-5rem)]">
        <Outlet />
      </div>
      {FOOTER_CONTAINING_LINKS.includes(location.pathname) && <Footer />}
    </>
  );
};

export default BodyContainer;
