import { Lightbulb, LightbulbOff, MoonStar } from "lucide-react";
import React, { useEffect } from "react";

const App = () => {
  const isLocal = process.env.NODE_ENV === "development";
  const [theme, setTheme] = React.useState("light");
  const toggleTheme = () => {
    setTheme(theme === "dim" ? "light" : "dim");
  };
  useEffect(() => {
    document.body.className = isLocal ? "debug-screens" : "";
  }, [isLocal]);
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <>
      <h1 className="text-xl text-yellow-600">Hello, World!</h1>
      <label className="swap swap-rotate">
        <input onClick={toggleTheme} type="checkbox" />
        <div className="swap-on">
          <LightbulbOff />
        </div>
        <div className="swap-off">
          <Lightbulb />
        </div>
      </label>
    </>
  );
};

export default App;
