"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check initial theme
    const savedTheme = localStorage.getItem("almi_theme");
    
    if (savedTheme === "light") {
      requestAnimationFrame(() => {
        setTheme("light");
      });
      document.documentElement.classList.remove("dark");
    } else {
      requestAnimationFrame(() => {
        setTheme("dark");
      });
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("almi_theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("almi_theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/30 border border-slate-700/30 text-slate-450 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle Theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      id="theme-toggle"
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5 text-cyan-400" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-indigo-400" />
      )}
    </button>
  );
}
