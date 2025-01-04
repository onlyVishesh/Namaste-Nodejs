import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import { addFeed } from "../utils/feedSlice";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const getFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(import.meta.env.VITE_BackendURL + "/feed", {
        withCredentials: true,
      });
      console.log(res.data.users);
      dispatch(addFeed(res?.data?.users));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <div className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2">
        <div className="border-3 border-border">
          {feed && <Card user={feed[0]} />}
        </div>
      </div>
    </div>
  );
};

export default Feed;
