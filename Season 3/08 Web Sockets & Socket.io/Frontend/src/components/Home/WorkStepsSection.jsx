import { FaUser } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import { TiGroup } from "react-icons/ti";

const WorkStepsSection = () => {
  return (
    <section className="rounded-xl bg-bgSecondary px-8 py-20" id="support">
      <div className="mb-4 md:mb-12">
        <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          How DevRoot Works
        </h2>
        <p className="text-center text-lg text-textMuted">
          Connect, collaborate, and grow with developers worldwide in three
          simple steps
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        {[
          {
            icon: FaUser,
            title: "Create Your Profile",
            description:
              "Build your developer profile highlighting your skills, experience, and interests",
            point: "Personalize your presence",
          },
          {
            icon: TiGroup,
            title: "Connect with Peers",
            description:
              "Browse through developer profiles and connect with like-minded professionals",
            point: "Build your network",
          },
          {
            icon: ImPower,
            title: "Collaborate & Grow",
            description:
              "Start projects, share knowledge, and grow together with the community",
            point: "Accelerate your growth",
          },
        ].map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="relative transform rounded-lg border-[1px] border-bg bg-cardBg p-8 shadow-lg transition duration-300 hover:scale-105 hover:cursor-pointer hover:border-primary hover:bg-lightGray"
            >
              <div className="absolute left-0 top-0 flex size-10 -translate-x-1/3 -translate-y-1/3 items-center justify-center rounded-full bg-primary text-xl font-bold">
                {i + 1}
              </div>
              <h3 className="mb-2 text-2xl font-bold">{feature.title}</h3>
              <p className="mb-2 text-textMuted">{feature.description}</p>
              <div className="flex items-center justify-start gap-2">
                <Icon className="size-10 rounded-lg bg-primary bg-opacity-70 p-2" />
                <p className="font-semibold">{feature.point}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WorkStepsSection;
