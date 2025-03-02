import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CallForActionSection = () => {
  const user = useSelector((store) => store.user);
  return (
    <section className="bg-bg px-8 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="mb-8 text-4xl font-bold">
          Ready to Connect with Developers Like You?
        </h2>
        <p className="mb-12 text-xl text-textMuted">
          Join a Community of Innovators and Build Together.
        </p>
        <div className="space-x-4">
          <button className="transform rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-hover">
            <Link to={user ? "/feed" : "/signup"}>
              {user ? "Explore New Developers" : "Sign Up for Free"}
            </Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallForActionSection;
