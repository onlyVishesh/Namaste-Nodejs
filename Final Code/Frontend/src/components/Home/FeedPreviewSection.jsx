/* eslint-disable react/prop-types */
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { capitalize } from "../../utils/constants";

// eslint-disable-next-line react/prop-types

const USERS = [
  {
    username: "aarav_07",
    firstName: "Aarav",
    lastName: "Sharma",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpA7JSTMLEMywDvS35v_79D1TcwpkUNaR2Lg&s", // Indian student male
    banner:
      "https://media.istockphoto.com/id/1312850689/vector/matrix-background-binary-code-texture-falling-green-numbers-data-visualization-concept.jpg?s=612x612&w=0&k=20&c=l1xAzPJUjbROnui5McM-_vbDswAg5OoSzwJuFpdj3WE=",
    skills: ["React", "Node.js", "MongoDB", "Express", "Git", "JavaScript"],
    role: "student",
    status: "active",
    followers: 152,
    following: 134,
    headline:
      "CS undergrad | Passionate about Full-Stack Development | Open-source enthusiast 🚀",
  },
  {
    username: "kriti.codes",
    firstName: "Kriti",
    lastName: "Verma",
    avatar:
      "https://images.ctfassets.net/2htm8llflwdx/Y0mAruESDwFn4MO5GbYyr/f898df53e63d503d63321d8aea34fdf8/GettyImages-947895170.jpg", // Indian student female
    banner:
      "https://bitesofcode.wordpress.com/wp-content/uploads/2016/12/testing_3.png?w=1000",
    skills: ["Python", "Django", "Machine Learning", "Data Science", "SQL"],
    role: "student",
    status: "active",
    followers: 210,
    following: 189,
    headline:
      "ML enthusiast 🤖 | Exploring AI & Deep Learning | Kaggle contributor",
  },
  {
    username: "raj_math_whiz",
    firstName: "Raj",
    lastName: "Patel",
    avatar:
      "https://www.edgeip.com/images/FCK/Image/202310/SFG-ComingtoCanadaIndianStudents.jpg", // Indian student male
    banner:
      "https://cdn.shopify.com/s/files/1/0570/9280/0675/files/three-monitors-slackware_480x480.jpg?v=1718872848",
    skills: ["C++", "Algorithms", "Competitive Programming", "DSA"],
    role: "student",
    status: "active",
    followers: 175,
    following: 132,
    headline:
      "Competitive Programmer 💻 | 5⭐ @CodeChef | ACM ICPC Regionalist",
  },
  {
    username: "ananya_uiux",
    firstName: "Ananya",
    lastName: "Mishra",
    avatar:
      "https://static-bestcolleges.tosshub.com/2024/News/JoufFBZoz6nt1JuoSdAZtBCJkh1VFdieNLn8FsPR.jpg", // Indian student female
    banner:
      "https://miro.medium.com/v2/resize:fit:2000/1*QRAV-aC_Yj7u0h1HOlv7lA.png",
    skills: [
      "Figma",
      "UI/UX Design",
      "Photoshop",
      "Illustrator",
      "HTML",
      "CSS",
    ],
    role: "student",
    status: "active",
    followers: 190,
    following: 160,
    headline:
      "Designing beautiful experiences 🎨 | UI/UX Enthusiast | Hackathon Winner 🏆",
  },
  {
    username: "deepak_dev",
    firstName: "Deepak",
    lastName: "Singh",
    avatar: "https://i.imgur.com/Ed0W5YVs.jpg", // Indian student male
    banner: "https://source.unsplash.com/1600x900/?technology,developer",
    skills: ["React Native", "Java", "Android Development", "Firebase"],
    role: "student",
    status: "active",
    followers: 130,
    following: 100,
    headline:
      "Android & React Native Developer 📱 | Building awesome mobile apps 🚀",
  },
];

const Card = ({ user, index = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 150;
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 150;
    }
  };

  useEffect(() => {
    const handleExpand = (event) => {
      if (cardRef.current && cardRef.current.contains(event.target)) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };

    window.addEventListener("mouseover", handleExpand);
    return () => {
      window.removeEventListener("mouseover", handleExpand);
    };
  }, []);

  return (
    <div
      className="scale-90 group relative mt-20 h-[450px] w-[380px] select-none rounded-2xl bg-bgSecondary transition-all duration-700 hover:h-[500px] 2xs:hover:h-[500px] sm:mt-0 sm:h-[450px] sm:w-[400px] md:h-[550px] md:w-[500px] md:hover:h-[600px] lg:mt-14 lg:h-[470px] lg:w-[380px] lg:hover:h-[520px] xl:mt-0 xl:h-[600px] xl:w-[500px] xl:hover:h-[650px]"
      ref={cardRef}
      style={{
        boxShadow:
          index === 0
            ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
            : undefined,
      }}
    >
      <div className="absolute mb-5 w-full overflow-hidden transition-all duration-700">
        <img
          src={user?.banner}
          draggable="false"
          alt="banner"
          className="h-40 w-full overflow-hidden rounded-lg object-cover transition-[height] duration-[600ms] group-hover:h-[200px] md:h-56 md:group-hover:h-[275px] lg:h-40 lg:group-hover:h-[200px] xl:h-60 xl:group-hover:h-[300px]"
        />
      </div>
      <div className="bg-primary/20 absolute -top-12 left-1/2 z-10 size-48 -translate-x-1/2 overflow-hidden rounded-full transition-all duration-700 group-hover:size-64 2xs:size-48 2xs:group-hover:size-64 md:size-64 md:group-hover:size-72 lg:size-48 lg:group-hover:size-64 xl:size-64 xl:group-hover:size-80">
        <img
          draggable="false"
          src={
            user?.avatar ??
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt=""
          className="absolute left-0 top-0 size-full object-cover drop-shadow-lg"
        />
      </div>
      <div className="mx-auto flex h-[85%] w-10/12 flex-col items-center justify-end gap-1 xl:h-[87%]">
        <h2 className="line-clamp-1 text-center text-2xl font-bold md:text-3xl">
          {user?.lastName?.length > 14
            ? user?.firstName +
              " " +
              capitalize(user?.lastName.slice(0, 14) + "...")
            : capitalize(user?.firstName) + " " + capitalize(user?.lastName)}
        </h2>
        <p className="-mt-1 line-clamp-1 font-normal text-textMuted md:text-lg">
          @{user.username}
        </p>
        <div className="line-clamp-2">{user.headline}</div>

        <div className="relative flex w-full items-center justify-evenly gap-2">
          <button
            onClick={scrollLeft}
            className="transform rounded-full bg-cardBg p-1 text-text shadow-md transition duration-300 hover:scale-110"
          >
            <MdArrowBack className="size-5" />
          </button>

          <div
            className="mx-2 overflow-x-auto scroll-smooth whitespace-nowrap"
            style={{
              overflowX: "scroll",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            ref={scrollRef}
          >
            <ul className="flex justify-start gap-3 px-2 py-2 duration-200 [&_li]:rounded-md [&_li]:bg-bg [&_li]:px-3 [&_li]:py-2 [&_li]:font-semibold [&_li]:shadow-sm [&_li]:shadow-shadow [&_li]:transition-all [&_li]:hover:cursor-pointer">
              {user?.skills?.length > 0 ? (
                user.skills.map((skill) =>
                  typeof skill === "string" ? (
                    <li
                      className="hover:scale-105 hover:cursor-pointer"
                      key={skill}
                    >
                      {capitalize(skill)}
                    </li>
                  ) : (
                    <li
                      className="hover:scale-105 hover:cursor-pointer"
                      key={skill}
                    >
                      Enter Skill and Save for preview
                    </li>
                  ),
                )
              ) : (
                <li>No Skills</li>
              )}
            </ul>
          </div>

          <button
            onClick={scrollRight}
            className="transform rounded-full bg-cardBg p-1 text-text shadow-md transition duration-300 hover:scale-110"
          >
            <MdArrowForward className="size-5" />
          </button>
        </div>

        <div
          className={`overflow-hidden transition-[max-height] duration-700 ${
            expanded ? "max-h-[300px]" : "max-h-[120px]"
          }`}
        >
          <div className="flex justify-evenly gap-14">
            <div className="flex flex-col items-center justify-center">
              <p className="-mb-2 text-xl font-bold">{user.followers}</p>
              <p className="text-lg text-textMuted">Followers</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="-mb-2 text-xl font-bold">{user.following}</p>
              <p className="text-lg text-textMuted">Following</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 left-1/2 mx-auto flex w-[90%] -translate-x-1/2 items-center justify-center gap-10 xl:bottom-3">
        {
          <button className="transform rounded-lg bg-primary px-4 py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-hover md:hidden">
            Expand
          </button>
        }
      </div>
    </div>
  );
};

const MotionCard = ({ user, index, totalCards, requestRef, handleSwipe }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const combinedOpacity = useTransform([x, y], ([latestX, latestY]) => {
    const opacityFromX =
      latestX >= -250 && latestX <= 250 ? 1 - Math.abs(latestX) / 1250 : 0.8;
    const opacityFromY =
      latestY >= -150 && latestY <= 150 ? 1 - Math.abs(latestY) / 1000 : 0.8;
    return Math.max(0.8, Math.min(opacityFromX, opacityFromY));
  });

  const scaleThumbsUp = useTransform(x, [0, 150, 225], [0, 0, 4]);
  const scaleThumbsDown = useTransform(x, [-225, -150, 0], [4, 0, 0]);
  const rotateRaw = useTransform(x, [-250, 250], [-18, 18]);
  const rotate = useTransform(() => {
    const offset = index === 0 ? 0 : index % 2 ? 3 : -3;
    return rotateRaw.get() + offset;
  });

  const handleDrag = () => {
    if (y < -100) {
      x.set(0);
    } else if (x > 100 || x < -100) {
      y.set(0);
    }
    if (x.get() > 150) {
      requestRef.current.textContent = "Interested";
    } else if (x.get() < -150) {
      requestRef.current.textContent = "Ignore";
    } else if (y.get() < -100) {
      requestRef.current.textContent = "skip";
    } else {
      requestRef.current.textContent = "Swipe";
    }
  };

  const handleDragEnd = () => {
    if (x.get() > 200 || x.get() < -200 || y.get() < -250) {
      handleSwipe(index);
    } else {
      x.set(0);
      y.set(0);
    }
    x.stop();
    y.stop();
    requestRef.current.textContent = "Swipe";
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -150, right: 150, top: -250, bottom: 0 }}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        y,
        opacity: combinedOpacity,
        rotate,
        zIndex: totalCards - index,
        transition: "0.125s transform",
        pointerEvents: index === 0 ? "auto" : "none",
      }}
      animate={{
        scale: index === 0 ? 1 : 0.98,
      }}
      layout
      dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
      transition={{ type: "spring", damping: 15, stiffness: 250 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      className={`relative !origin-bottom rounded-lg hover:cursor-grab active:cursor-grabbing`}
    >
      <Card user={user} index={index} />
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ scale: scaleThumbsUp }}
      >
        <FaThumbsUp className="text-5xl text-accent1" />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ scale: scaleThumbsDown }}
      >
        <FaThumbsDown className="text-5xl text-accent3" />
      </motion.div>
    </motion.div>
  );
};

const FeedPreviewSection = () => {
  const requestRef = useRef(null);
  const [users, setUsers] = useState(USERS.slice(0, 4));
  const handleSwipe = (index) => {
    setUsers((prev) => {
      if (prev.length <= 1) return prev;

      const swipedUser = prev[index];
      const remainingUsers = prev.filter((_, i) => i !== index);
      return [...remainingUsers, swipedUser];
    });
  };

  return (
    <section className="bg-bg px-8 py-20" id="feed">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 md:mb-20">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
            Explore the DevRoot Feed
          </h2>
          <p className="text-center text-lg text-textMuted">
            Connect with talented developers worldwide
          </p>
        </div>
        <div className="relative grid place-items-center gap-5">
          {users?.map((user, index) => (
            <MotionCard
              key={`${user.username}-${index}`}
              user={user}
              index={index}
              totalCards={users.length}
              requestRef={requestRef}
              handleSwipe={handleSwipe}
              setUsers={setUsers}
            />
          ))}

          <p
            id="action"
            ref={requestRef}
            className={`text-xl font-bold ${
              requestRef.current?.textContent === "Interested"
                ? "text-green-500"
                : requestRef.current?.textContent === "Ignore"
                  ? "text-red-500"
                  : "text-gray-500"
            }`}
          >
            {users?.length !== 0 && "Swipe"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeedPreviewSection;
