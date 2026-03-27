"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // Read the current theme from the DOM (already set by the inline script)
    const currentTheme = document.documentElement.getAttribute("data-theme") || "fhenixlight";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "fhenixlight" ? "fhenixdark" : "fhenixlight";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Don't render until we know the theme (prevents hydration mismatch)
  if (theme === null) {
    return (
      <div className="p-2 w-9 h-9">
        {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-sm hover:bg-base-200 border border-transparent hover:border-base-300 transition-colors text-base-content/70 hover:text-base-content"
      aria-label={`Switch to ${theme === "fhenixlight" ? "dark" : "light"} mode`}
    >
      {theme === "fhenixlight" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

