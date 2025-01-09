import NetworkCard from "../components/NetworkCard";

const Invitations = () => {
  return (
    <div className="rounded-md bg-bgSecondary">
      <h2 className="px-4 py-2 text-2xl font-bold">Invitations (20)</h2>
      <hr className="border-textMuted" />
      <div className="flex divide-y divide-textMuted flex-col">
        <div>
          <NetworkCard type="invitation"/>
        </div>
        <div>
          <NetworkCard type="invitation"/>
        </div>
        <div>
          <NetworkCard type="invitation"/>
        </div>
        <div>
          <NetworkCard type="invitation"/>
        </div>
        
      </div>
    </div>
  );
};

export default Invitations;
