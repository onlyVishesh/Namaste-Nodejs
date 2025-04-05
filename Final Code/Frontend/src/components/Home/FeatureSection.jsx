import { FaUser } from "react-icons/fa";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { RiBookShelfFill } from "react-icons/ri";

const FeatureSection = () => {
  return (
    <section className="rounded-xl bg-bgSecondary px-8 py-20">
      <div className="mb-4 md:mb-12">
        <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          Connect with the Right Developers
        </h2>
        <p className="text-center text-lg text-textMuted">
          Find the perfect match for your project needs with our intelligent
          developer matching system
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        {[
          {
            icon: FaUser,
            title: "Smart Matching",
            point: "AI-driven connections tailored for you",
            description:
              "Our intelligent algorithm connects you with developers who align with your skills, experience, and project needs, ensuring seamless collaboration.",
          },
          {
            icon: RiBookShelfFill,
            title: "Knowledge Hub",
            point: "Explore, share, and innovate",
            description:
              "Engage in meaningful discussions, share insights, and stay ahead with the latest trends, frameworks, and best practices in the developer community.",
          },
          {
            icon: MdOutlineVerifiedUser,
            title: "Verified Profiles",
            point: "Quality, trust, and authenticity",
            description:
              "Every developer undergoes a rigorous vetting process to ensure a skilled, professional, and trustworthy network for seamless collaboration.",
          },
        ].map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="transform rounded-lg border-[1px] border-bg bg-cardBg p-8 shadow-lg transition duration-300 hover:scale-105 hover:cursor-pointer hover:border-primary hover:bg-lightGray"
            >
              <div className="mb-4 text-4xl">
                <Icon className="size-14 rounded-lg bg-primary bg-opacity-70 p-2" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">{feature.title}</h3>
              <p className="font-semibold">{feature.point}</p>
              <p className="text-textMuted">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureSection;
