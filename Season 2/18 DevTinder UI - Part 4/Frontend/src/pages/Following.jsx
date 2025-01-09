import NetworkCard from "../components/NetworkCard";

const Following = () => {
  return (
    <div className="rounded-md bg-bgSecondary">
      <h2 className="px-4 py-2 text-2xl font-bold">Following (20)</h2>
      <hr className="border-textMuted" />
      <div className="flex flex-col divide-y divide-textMuted">
        <div>
          <NetworkCard type="following" />
        </div>
        <div>
          <NetworkCard type="following" />
        </div>
        <div>
          <NetworkCard type="following" />
        </div>
        <div>
          <NetworkCard type="following" />
        </div>
      </div>
    </div>
  );
};

export default Following;
