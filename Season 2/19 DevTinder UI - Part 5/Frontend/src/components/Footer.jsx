import { FileUser, Mail, MapPinHouse } from "lucide-react";
import { CgWebsite } from "react-icons/cg";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const SOCIAL_LINKS = {
  github: [
    "https://github.com/onlyVishesh",
    <FaGithub className="size-8 p-1" key="github" />,
  ],
  linkedin: [
    "https://www.linkedin.com/in/vishesh-%E2%80%8E-48b1b8257",
    <FaLinkedinIn className="size-8 p-1" key="linkedin" />,
  ],
  twitter: [
    "https://x.com/onlyVishesh14",
    <FaTwitter className="size-8 p-1" key="twitter" />,
  ],
  portfolio: [
    "https://onlyvishesh.vercel.app/",
    <CgWebsite className="size-8 p-1" key="portfolio" />,
  ],
};

const FOOTER_SECTIONS = {
  "About Us": [
    { "Company History": "/history" },
    { "Meet the Team": "/team" },
    { Careers: "/careers" },
  ],
  "Our Services": [
    { Feed: "/feed" },
    { Network: "/network" },
    { Profile: "/profile" },
  ],
  "Helpful Links": [
    { FAQs: "/faqs" },
    { Support: "/support" },
    { "Live Chat": "/live-chat" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-bgSecondary">
      <div className="container mx-auto px-4 pb-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex flex-col items-center justify-center gap-0 sm:justify-start">
              <div className="flex max-w-md items-center justify-center gap-2 sm:mx-0 sm:max-w-xs">
                <img src={logo} alt="" className="size-24" />
                Rooted in Development, Branching Out to Opportunities.
              </div>
              <p className="max-w-md text-justify leading-relaxed text-textMuted sm:mx-0 sm:max-w-xs">
                Discover like-minded professionals, build your network, and
                unlock new opportunities. Join a platform designed to foster
                meaningful connections and showcase your skills to the world!
              </p>
              <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
                {Object.keys(SOCIAL_LINKS).map((link) => {
                  return (
                    <li key={link}>
                      <Link
                        to={SOCIAL_LINKS[link][0]}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-primary transition hover:cursor-pointer hover:text-hover"
                      >
                        <span className="sr-only">{link}</span>
                        <span className="flex size-10 items-center justify-center rounded-full bg-hover text-text hover:scale-110">
                          {SOCIAL_LINKS[link][1]}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            {Object.keys(FOOTER_SECTIONS).map((section) => {
              return (
                <div className="text-center sm:text-left" key={section}>
                  <p className="text-lg font-bold">{section}</p>

                  <nav className="mt-4">
                    <ul className="space-y-4 text-sm">
                      {FOOTER_SECTIONS[section].map((link) => {
                        return (
                          <li key={Object.values(link)}>
                            <Link
                              className="transition hover:text-textMuted"
                              to={Object.values(link)[0]}
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            >
                              {Object.keys(link)}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              );
            })}

            <div className="text-center sm:text-left">
              <p className="text-lg font-bold">Contact Us</p>
              <ul className="mt-4 space-y-4 text-sm">
                <li>
                  <a
                    className="group flex items-center justify-center gap-1.5 sm:justify-start"
                    href="mailto:devroot@gmail.com"
                  >
                    <Mail className="size-6 group-hover:text-textMuted" />

                    <span className="transition group-hover:text-textMuted">
                      devroot@gmail.com
                    </span>
                  </a>
                </li>

                <li>
                  <Link
                    className="group flex items-center justify-center gap-1.5 sm:justify-start"
                    to="/form"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <FileUser className="size-6 group-hover:text-textMuted" />
                    <span className="transition group-hover:text-textMuted">
                      Contact Form
                    </span>
                  </Link>
                </li>

                <li className="group flex items-start justify-center gap-1.5 sm:justify-start">
                  <MapPinHouse className="size-6 group-hover:text-textMuted" />

                  <address className="-mt-0.5 not-italic transition hover:cursor-pointer group-hover:text-textMuted">
                    Ghaziabad, Uttar Pradesh, India
                  </address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-800 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="space-x-2 text-sm text-gray-400">
              <span className="block sm:inline">All rights reserved.</span>
              <Link
                className="inline-block text-hover underline transition hover:text-hover hover:opacity-75"
                to="/"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Terms & Conditions
              </Link>

              <span>&middot;</span>
              <Link
                className="inline-block text-hover underline transition hover:text-hover hover:opacity-75"
                to="/"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Privacy Policy
              </Link>
            </p>

            <p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">
              &copy; {new Date().getFullYear()} DevRoot
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
