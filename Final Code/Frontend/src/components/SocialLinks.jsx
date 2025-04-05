import { CgWebsite } from "react-icons/cg";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

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

const SocialLinks = () => {
  return (
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
  );
};

export default SocialLinks;
