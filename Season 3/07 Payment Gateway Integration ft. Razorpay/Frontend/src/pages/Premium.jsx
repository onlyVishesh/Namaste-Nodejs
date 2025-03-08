import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

const PricingCard = ({ title, price, features, isPopular = false }) => {
  const handlePayment = async (title) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BackendURL + "/payment/createOrder",
        { title, price },
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      if (res.data.success === true) {

        toast.success(res.data.message);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error || "Something went wrong!");
      } else if (err.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(err.message);
    }
  };
  return (
    <div
      className={`relative flex flex-col rounded-xl p-8 transition-all duration-300 hover:shadow-xl ${isPopular ? "to-card-bg border-t-4 border-primary bg-gradient-to-b from-primary" : "bg-bgSecondary"} hover:scale-105 hover:cursor-pointer`}
    >
      {isPopular && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-accent1 px-10 py-3 text-sm font-semibold text-text shadow-md [clip-path:polygon(10%_10%,90%_10%,100%_50%,100%_50%,90%_90%,10%_90%,0_50%,0_50%)]">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-center text-2xl font-bold text-text">{title}</h3>
      <div className="my-6 text-center">
        <span className="text-5xl font-bold text-text">₹{price}</span>
        <span className="text-textMuted">/month</span>
      </div>
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="mt-1 h-5 w-5 shrink-0 text-accent1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="ml-3 text-text">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`mt-auto w-full rounded-lg py-3 font-medium transition-colors duration-200 ${isPopular ? "hover:bg-primary/90 bg-primary text-text" : "hover:bg-primary/5 border border-primary text-primary"} hover:scale-105`}
        onClick={() => handlePayment(title)}
      >
        Get Started
      </button>
    </div>
  );
};

const Premium = () => {
  const [plansData, setPlansData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPlansData = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/payment/plans`,
        { withCredentials: true },
      );
      setPlansData(res.data.plansData);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPlansData();
  }, []);

  if (isLoading)
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden">
        <FaSpinner className="size-1/12 animate-spin" />
      </div>
    );

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Flexible plans for your needs
          </h2>
          <p className="mt-4 text-lg text-textMuted">
            Choose the perfect plan to grow your business
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plansData?.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              features={plan.features}
              isPopular={plan.isPopular || false}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Need something custom?{" "}
            <a
              href="/contact-form"
              className="font-medium text-primary hover:underline"
            >
              Contact us
            </a>{" "}
            for enterprise solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
