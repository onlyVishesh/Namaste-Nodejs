import React, { useEffect } from "react";
import BodyContainer from "./components/BodyContainer";

const App = () => {
  const isLocal = process.env.NODE_ENV === "development";

  useEffect(() => {
    document.body.className = isLocal ? "debug-screens" : "";
  }, [isLocal]);

  return (
    <div className="bg-bg text-text">
      <BodyContainer />
    </div>
  );
};

export default App;
