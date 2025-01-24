/* eslint-disable react/prop-types */
import axios from "axios";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaSpinner, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import { addFeed, removeRequest } from "../utils/feedSlice";

// Wrapping the Card with motion and handling style
const MotionCard = ({ user, index, totalCards, requestRef }) => {
  const dispatch = useDispatch();
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
    if (x.get() > 200) {
      console.log("right");
      dispatch(removeRequest(user._id));
    } else if (x.get() < -200) {
      console.log("left");
      dispatch(removeRequest(user._id));
    } else if (y.get() < -250) {
      console.log("up");
      dispatch(removeRequest(user._id));
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

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [page, setPage] = useState(1);

  // Using useRef to store the swipe status
  const requestRef = useRef(null);

  const getFeed = async (pageNumber) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/feed?page=${pageNumber}&limit=5`,
        { withCredentials: true },
      );
      dispatch(addFeed(res?.data?.users));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed(page);
  }, [page]);

  useEffect(() => {
    if (feed?.length <= 1) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [feed]);

  if (feed.length === 0 && page < 3)
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden">
        <FaSpinner className="size-1/12 animate-spin" />
      </div>
    );

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden">
      <div className="relative grid place-items-center gap-5">
        {feed &&
          feed.map((user, index) => (
            <MotionCard
              key={user._id}
              user={user}
              index={index}
              totalCards={feed.length}
              requestRef={requestRef}
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
          {feed.length !== 0 && "Swipe"}
        </p>
        {feed.length === 0 && (
          <div className="text-center text-2xl font-bold">
            You Have swiped all the users. Try again later...
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
