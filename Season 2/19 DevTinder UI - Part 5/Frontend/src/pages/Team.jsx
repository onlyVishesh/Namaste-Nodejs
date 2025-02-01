import React from "react";
import SocialLinks from "../components/SocialLinks";

const teamMembers = [
  {
    name: "Vishesh",
    role: "Full Stack Web Developer",
    image: "https://avatars.githubusercontent.com/u/121187728?v=4",
    description:
      "I’m a full-stack developer skilled in React, Next.js, TypeScript, Node.js, and MongoDB. I specialize in building scalable web applications with a focus on performance and user experience. Passionate about AI, blockchain, and 3D web, I love exploring new technologies and solving real-world problems. ",
  },
];

const Team = () => {
  return (
    <div className="min-h-[calc(100vh-5rem) px-6 py-12 text-text">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="mb-6 text-4xl font-extrabold text-text">
          Meet Our Team
        </h2>
        <p className="mx-auto max-w-2xl text-textMuted">
          The mind behind DevRoot – a passionate solo developer with
          engineering, and designing skills used to build a thriving
          tech community.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="rounded-xl bg-bgSecondary p-6 shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <img
              src={member.image}
              alt={member.name}
              className="mx-auto rounded-full border-4 border-border sm:size-20 md:size-40 lg:size-60"
            />
            <h3 className="mt-4 text-center text-xl font-semibold text-text md:text-3xl">
              {member.name}
            </h3>
            <p className="text-center text-textMuted">{member.role}</p>
            <p className="text-justify">{member.description}</p>
            <div className="flex items-center justify-center">
              <SocialLinks />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
