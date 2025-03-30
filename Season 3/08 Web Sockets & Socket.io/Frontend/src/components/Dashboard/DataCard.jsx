import axios from "axios";
import { useEffect, useState } from "react";

const DataCard = ({ heading, type, data }) => {
  const [duration, setDuration] = useState("day");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BackendURL}/${type}/${data}/${duration}`,
          { withCredentials: true },
        );
        setStats(res.data.stats);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [duration, data]);

  return (
    <div className="w-64 rounded-lg bg-cardBg p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <h3 className="text-xl font-semibold text-textMuted">{heading}</h3>

      {isLoading ? (
        <div className="mt-4 h-8 w-full animate-pulse rounded-md bg-textMuted"></div>
      ) : (
        <div className="mt-4 flex items-end gap-2">
          <p className="text-3xl font-bold">
            {new Intl.NumberFormat("en-IN", {
              maximumSignificantDigits: 3,
            }).format(stats?.current)}
          </p>
          <p
            className={`text-sm font-semibold ${stats?.percentageChange === 0 ? "text-gray-500" : stats?.percentageChange > 0 ? "text-green-500" : "text-red-500"}`}
          >
            {stats?.percentageChange === 0
              ? `${stats?.percentageChange}%`
              : stats?.percentageChange > 0
                ? `+${stats?.percentageChange}%`
                : `${stats?.percentageChange}%`}
          </p>
        </div>
      )}

      {/* Comparison Text */}
      <p className="mt-2 text-sm text-textMuted">Compared to last {duration}</p>

      {/* Duration Buttons */}
      <div className="mt-4 flex justify-between gap-2">
        {["day", "week", "month", "year"].map((dur) => (
          <button
            key={dur}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${duration === dur ? "bg-blue-500 shadow-md" : "bg-bgSecondary text-text hover:bg-bg"}`}
            onClick={(e) => {
              e.preventDefault();
              setDuration(dur);
            }}
          >
            {dur === "day" && "1D"}
            {dur === "week" && "1W"}
            {dur === "month" && "1M"}
            {dur === "year" && "1Y"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataCard;
