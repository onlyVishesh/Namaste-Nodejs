import axios from "axios";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import { addFeed, removeRequest } from "../utils/feedSlice";

// Wrapping the Card with motion and handling style
const MotionCard = ({ user, index, totalCards, setRequestRef }) => {
  const dispatch = useDispatch();
  const x = useMotionValue(0); // Motion value for x-axis dragging
  const opacity = useTransform(x, [-250, 0, 250], [0, 1, 0]);
  const rotateRaw = useTransform(x, [-250, 250], [-18, 18]);
  const rotate = useTransform(() => {
    const offset = index === 0 ? 0 : index % 2 ? 3 : -3;
    return rotateRaw.get() + offset;
  });

  const handleDrag = () => {
    if (x.get() > 150) {
      setRequestRef("Interested");
    } else if (x.get() < -150) {
      setRequestRef("Ignore");
    } else {
      setRequestRef("Swipe");
    }
  };

  const handleDragEnd = () => {
    if (x.get() > 200) {
      console.log("right");
      dispatch(removeRequest(user._id));
    } else if (x.get() < -200) {
      console.log("left");
      dispatch(removeRequest(user._id));
    } else {
      x.set(0);
    }
    x.stop();
  };

  return (
    <motion.div
      drag={index === 0 ? "x" : false}
      dragConstraints={{ left: -150, right: 150 }}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        zIndex: totalCards - index,
        transition: "0.125s transform",
        pointerEvents: index === 0 ? "auto" : "none",
      }}
      animate={{
        scale: index === 0 ? 1 : 0.98,
      }}
      layout
      transition={{ type: "spring", damping: 15, stiffness: 250 }}
      // onDrag={handleDrag} ]]]
      onDragEnd={handleDragEnd}
      className={`origin-bottom rounded-lg hover:cursor-grab active:cursor-grabbing ${index === 0 ? "" : ""}`}
    >
      <Card user={user} index={index} />
    </motion.div>
  );
};

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [page, setPage] = useState(1);
  const [request, setRequest] = useState("Swipe");

  // Using useRef to store the swipe status
  const requestRef = useRef(request);

  const getFeed = async (pageNumber) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/feed?page=${pageNumber}&limit=5`,
        { withCredentials: true },
      );
      console.log(res.data.users);
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

  const setRequestRef = (status) => {
    // Update the requestRef without causing re-renders
    requestRef.current = status;
    setRequest(status); // Update the state once the drag ends or status changes significantly
  };

  if (feed.length === 0 && page < 3)
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden">
        <FaSpinner className="size-1/12 animate-spin" />
      </div>
    );

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden">
      <div className="relative grid place-items-center">
        {feed &&
          feed.map((user, index) => (
            <MotionCard
              key={user._id}
              user={user}
              index={index}
              totalCards={feed.length}
              setRequestRef={setRequestRef} // Pass the setRequestRef function to avoid re-rendering on each drag
            />
          ))}
        <p>{request}</p> {/* Display the current swipe status */}
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
