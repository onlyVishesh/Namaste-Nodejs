import { Lightbulb, LightbulbOff } from "lucide-react";
import { useEffect, useState } from "react";

const NavBar = () => {
  // Retrieve theme from localStorage or default to "dark"
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save new theme to localStorage
  };

  useEffect(() => {
    // Ensure the correct theme is applied to the body
    const body = document.querySelector("body");
    body.classList.remove("dark", "light"); // Remove any existing theme classes
    body.classList.add(theme); // Add the current theme
  }, [theme]);

  return (
    <div>
      <h1 className="bg-bg text-text text-xl">Hello, World!</h1>
      <button onClick={toggleTheme}>
        {theme === "dark" ? <LightbulbOff /> : <Lightbulb />}
      </button>
    </div>
  );
};

export default NavBar;
