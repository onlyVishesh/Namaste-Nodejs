import { FaStar, FaStarHalf } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const user = useSelector((store) => store.user);

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 opacity-90"></div>
      <div className="relative z-10">
        <h1 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-6xl font-extrabold text-transparent sm:text-6xl md:mb-6 md:text-8xl">
          DevRoot
        </h1>
        <h2 className="mb-2 bg-gradient-to-r from-primary to-accent1 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:mb-6 md:text-6xl">
          Connect. Collaborate. Grow.
        </h2>
        <p className="text-md sm:lg mb-8 text-textMuted md:text-2xl">
          Empowering Developers, One Connection at a Time.
        </p>
        <button className="transform rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-hover">
          <Link to={user ? "/feed" : "/signup"}>
            {user ? "Explore Feed" : "Create Account"}
          </Link>
        </button>
      </div>
      <div className="absolute bottom-10 flex flex-col items-center justify-center gap-5">
        <div className="flex -space-x-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <img
              key={i}
              src={`https://i.pravatar.cc/40?img=${i}`}
              alt="User Avatar"
              className="size-12 rounded-full border-2 border-primary hover:z-10 hover:scale-110 hover:cursor-pointer"
            />
          ))}
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex space-x-2">
            <FaStar className="size-8 text-yellow-500" />
            <FaStar className="size-8 text-yellow-500" />
            <FaStar className="size-8 text-yellow-500" />
            <FaStar className="size-8 text-yellow-500" />
            <FaStarHalf className="size-8 text-yellow-500" />
          </div>
          <h4 className="font-bold">1,550+ Happy Developers</h4>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
