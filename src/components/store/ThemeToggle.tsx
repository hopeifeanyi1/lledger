"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering once mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="inline-flex items-center justify-center rounded-md p-2 text-md font-medium bg-secondary text-primary-foreground shadow hover:bg-primary/90"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );
}