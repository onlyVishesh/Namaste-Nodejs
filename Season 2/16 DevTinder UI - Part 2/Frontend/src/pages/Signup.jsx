import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const validateInputs = () => {
    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    };

    // Email validation
    if (email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Username validation
    if (username.trim().length < 3) {
      newErrors.username = "Username must be more than 3 characters long.";
    }

    // Name validation
    if (firstName.trim().length < 3) {
      newErrors.firstName = "Name must be more than 3 characters long.";
    } else if (
      /[0-9]/.test(firstName) ||
      /[!@#$%^&*(),.?":{}|<>]/.test(firstName)
    ) {
      newErrors.firstName = "Name should contain only characters";
    }
    if (
      (lastName.trim().length > 0 && /[0-9]/.test(lastName)) ||
      /[!@#$%^&*(),.?":{}|<>]/.test(lastName)
    ) {
      newErrors.lastName = "Name should contain only characters";
    }

    // Password validation
    if (password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  // to fetch login api
  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const data = { email, firstName, lastName, username, password };

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
    <div className="flex min-h-fit min-w-[350px] justify-center">
      <div className="m-10 flex w-full justify-center rounded-lg bg-bgSecondary shadow md:w-8/12 lg:w-6/12 xl:w-5/12">
        <div className="w-full p-6 shadow-md shadow-shadow sm:p-16">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold xl:text-3xl">
              Create a account
            </h1>
            <p className="mt-1 text-textMuted">
              Find your matching dev partner today!
            </p>
            <div className="mt-8 w-full flex-1">
              <div className="mx-auto max-w-[28rem]">
                <div className="flex flex-col">
                  {errors.firstName && (
                    <p className="mb-1 text-center text-xs text-error">
                      {errors.firstName}
                    </p>
                  )}
                  <input
                    className="md:text-md mb-2 w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-textMuted focus:border-gray-400 focus:bg-white focus:outline-none sm:text-sm lg:text-lg"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  {errors.lastName && (
                    <p className="mb-1 text-center text-xs text-error">
                      {errors.lastName}
                    </p>
                  )}
                  <input
                    className="md:text-md mb-2 w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-textMuted focus:border-gray-400 focus:bg-white focus:outline-none sm:text-sm lg:text-lg"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                {errors.username && (
                  <p className="mb-1 text-center text-xs text-error">
                    {errors.username}
                  </p>
                )}
                <input
                  className="md:text-md mb-2 w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-textMuted focus:border-gray-400 focus:bg-white focus:outline-none sm:text-sm lg:text-lg"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                {errors.email && (
                  <p className="mb-1 text-center text-xs text-error">
                    {errors.email}
                  </p>
                )}
                <input
                  className="md:text-md mb-2 w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-textMuted focus:border-gray-400 focus:bg-white focus:outline-none sm:text-sm lg:text-lg"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative">
                  {errors.password && (
                    <p className="mb-1 text-center text-xs text-error">
                      {errors.password}
                    </p>
                  )}
                  <input
                    className="md:text-md w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-textMuted focus:border-gray-400 focus:bg-white focus:outline-none sm:text-sm lg:text-lg"
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

                <button
                  className="focus:shadow-outline mt-5 flex w-full items-center justify-center rounded-lg bg-indigo-500 bg-primary py-4 font-semibold tracking-wide text-text transition-all duration-300 ease-in-out hover:bg-hover focus:outline-none"
                  onClick={handleLogin}
                >
                  <FaUserPlus />
                  <span className="ml-3">Sign Up</span>
                </button>
                <p className="mt-6 pb-2 text-center text-xs text-textMuted">
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
                <hr className="border-[1.5px] border-textMuted" />
              </div>
            </div>
            <div className="my-0 text-center">
              <div className="mt-4 inline-block transform text-sm font-medium leading-none tracking-wide text-textMuted">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="border-b border-dotted border-border text-text"
                >
                  Login
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
