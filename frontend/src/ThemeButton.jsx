import React, { useState, useEffect } from "react";
import "./ThemeButton.css"; // Import the CSS file for the button styles

function ThemeButton() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  useEffect(() => {
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme(preferredTheme);
    document.body.className = preferredTheme;
  }, []);

  return (
    <div className="theme-button-container">
      <button onClick={toggleTheme} className={`theme-button ${theme}`}>
        {theme === "light" ? "🌚" : "🌞"}
      </button>
    </div>
  );
}

export default ThemeButton;
