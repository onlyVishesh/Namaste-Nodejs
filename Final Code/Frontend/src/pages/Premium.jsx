import axios from "axios";
import { useEffect, useState } from "react";
import { FaCrown, FaSpinner } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addUser, removeUser } from "../utils/userSlice";

const PremiumUserView = () => {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/profile/view",
        { withCredentials: true },
      );

      if (res.data.success) {
        dispatch(addUser(res.data.user));
      } else {
        dispatch(removeUser(null));
      }
    } catch (err) {
      dispatch(removeUser(null));
    }
  };

  useEffect(() => {
    fetchUser();
  }, [dispatch]);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 p-6">
        <FaCrown className="h-16 w-16 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-text">
        You&apos;re a Premium Member!
      </h1>
      <p className="max-w-2xl text-lg text-textMuted">
        Thank you for subscribing to our premium service. You now have access to
        all exclusive features.
      </p>
      <div className="mt-6 flex gap-4">
        <button className="hover:bg-primary/90 rounded-lg bg-primary px-6 py-3 font-medium text-white">
          Explore Features
        </button>
        <button className="hover:bg-primary/5 rounded-lg border border-primary px-6 py-3 font-medium text-primary">
          Manage Subscription
        </button>
      </div>
    </div>
  );
};

const PricingCard = ({
  membershipType,
  price,
  features,
  isPopular = false,
  setIsUserPremium,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/payment/verify",
        { withCredentials: true },
      );
      if (res.data.isPremium === true) {
        setIsUserPremium(true);
        toast.success("Premium membership activated successfully!");
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to verify premium status");
    }
  };

  const handlePayment = async (membershipType) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_BackendURL + "/payment/createOrder",
        {
          membershipType,
        },
        { withCredentials: true },
      );

      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
        return;
      }

      const { orderId, amount, currency, notes } = res.data.order;
      const { keyId } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevRoot",
        description: "Connect to other Developer",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.LastName,
          email: notes.email,
        },
        theme: {
          color: "#3b82f6",
        },
        handler: function (response) {
          verifyPremiumUser();
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setIsProcessing(false);
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
      className={`relative flex flex-col rounded-xl p-8 transition-all duration-300 hover:shadow-xl ${isPopular ? "to-card-bg border-t-4 border-primary bg-gradient-to-b from-primary" : "bg-bgSecondary"} hover:scale-[1.02] hover:cursor-pointer`}
    >
      {isPopular && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-accent1 px-10 py-3 text-sm font-semibold text-text shadow-md [clip-path:polygon(10%_10%,90%_10%,100%_50%,100%_50%,90%_90%,10%_90%,0_50%,0_50%)]">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-center text-2xl font-bold text-text">
        {membershipType}
      </h3>
      <div className="my-6 text-center">
        <span className="text-5xl font-bold text-text">₹{price}</span>
        <span className="text-textMuted">/month</span>
      </div>
      <ul className="mb-8 space-y-3">
        {features?.map((feature, index) => (
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
        className={`mt-auto flex items-center justify-center rounded-lg py-3 font-medium transition-colors duration-200 ${isPopular ? "hover:bg-primary/90 bg-primary text-white" : "hover:bg-primary/5 border border-primary text-primary"} hover:scale-[1.02]`}
        onClick={() => handlePayment(membershipType)}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <FaSpinner className="mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Get Started"
        )}
      </button>
    </div>
  );
};

const Premium = () => {
  const [plansData, setPlansData] = useState(null);
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPlansData = async () => {
    setIsLoading(true);
    try {
      const [plansRes, premiumRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BackendURL}/payment/plans`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_BackendURL}/payment/verify`, {
          withCredentials: true,
        }),
      ]);

      setPlansData(plansRes.data.plansData);
      setIsUserPremium(premiumRes.data.isPremium === true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load plans data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPlansData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden">
        <FaSpinner className="size-1/12 animate-spin text-primary" />
      </div>
    );
  }

  if (isUserPremium) {
    return <PremiumUserView />;
  }

  return (
    <div className=" bg-bg py-16 sm:py-20">
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
              membershipType={plan.membershipType}
              price={plan.price}
              features={plan.features}
              isPopular={plan.isPopular || false}
              setIsUserPremium={setIsUserPremium}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-textMuted">
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
