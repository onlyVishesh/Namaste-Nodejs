import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Signup = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isUsername, setIsUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
  });

  const validateInputs = () => {
    const newErrors = { email: "", username: "", password: "" };

    // Email validation
    if (!isUsername && userId.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!isUsername && !/^\S+@\S+\.\S+$/.test(userId)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Username validation
    if (isUsername && userId.trim().length < 3) {
      newErrors.username = "Username must be more than 3 characters long.";
    }

    // Password validation
    if (password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  // to fetch login api
  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const data = isUsername
        ? { username: userId, password }
        : { email: userId, password };

      const res = await axios.post(
        import.meta.env.VITE_BackendURL + "/signup",
        data,
        { withCredentials: true },
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="flex min-h-fit justify-center">
      <div className="flex-2 m-10 flex justify-center rounded-lg bg-bgSecondary shadow">
        <div className="w-full p-6 sm:p-16">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold xl:text-3xl">
              Welcome Back
            </h1>
            <p className="mt-1 text-textMuted">
              Login to continue your journey
            </p>
            <div className="mt-8 w-full flex-1">
              <div className="mx-auto max-w-xs">
                {isUsername ? (
                  <input
                    className="md:text-md w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none sm:text-sm lg:text-lg"
                    type="text"
                    placeholder="Username"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                ) : (
                  <input
                    className="border-1 md:text-md w-full rounded-lg border-border px-8 py-4 font-medium text-black placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none sm:text-sm lg:text-lg"
                    type="email"
                    placeholder="Email"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                )}
                {errors.email && !isUsername && (
                  <p className="mt-1 text-center text-sm text-error">
                    {errors.email}
                  </p>
                )}
                {errors.username && isUsername && (
                  <p className="mt-1 text-center text-sm text-error">
                    {errors.username}
                  </p>
                )}
                <div className="relative mt-5">
                  <input
                    className="md:text-md w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none sm:text-sm lg:text-lg"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-center text-sm text-error">
                    {errors.password}
                  </p>
                )}
                <button
                  className="focus:shadow-outline mt-5 flex w-full items-center justify-center rounded-lg bg-indigo-500 bg-primary py-4 font-semibold tracking-wide text-text transition-all duration-300 ease-in-out hover:bg-hover focus:outline-none"
                  onClick={handleLogin}
                >
                  <svg
                    className="-ml-2 h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Login</span>
                </button>
                <p className="mt-6 text-center text-xs text-textMuted">
                  I agree to abide by DevRoot&apos;s <br />
                  <a
                    href="#"
                    className="border-b border-dotted border-border text-text"
                  >
                    Terms of Service
                  </a>{" "}
                  and its{" "}
                  <a
                    href="#"
                    className="border-b border-dotted border-border text-text"
                  >
                    Privacy Policy
                  </a>
                </p>
                <hr className="mt-4 border-[1.5px] border-textMuted" />
              </div>
              <div className="flex flex-col items-center">
                <button
                  className="focus:shadow-outline mt-5 flex w-full max-w-xs items-center justify-center rounded-lg bg-primary py-3 font-semibold text-text shadow-shadow transition-all duration-300 ease-in-out hover:bg-hover hover:shadow focus:shadow-sm focus:outline-none"
                  onClick={() => {
                    setIsUsername(!isUsername);
                    setUserId("");
                    setPassword("");
                  }}
                >
                  <span className="ml-4">
                    {`Sign Up with ${isUsername ? "Email" : "Username"}`}
                  </span>
                </button>
              </div>
            </div>
            <div className="my-2 text-center">
              <div className="inline-block translate-y-1/2 transform px-2 pt-2 text-sm font-medium leading-none tracking-wide text-textMuted">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="border-b border-dotted border-border text-text"
                >
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
