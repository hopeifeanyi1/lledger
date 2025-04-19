"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme | null;
      
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme(defaultTheme);
      }
    } catch (error) {
      toast.error("Failed to load theme preference");
      console.error("Theme loading error:", error);
    }
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      
      // Remove existing class
      root.classList.remove("light", "dark");

      // Apply new theme
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
      
      // Save theme preference
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      toast.error("Failed to apply theme");
      console.error("Theme application error:", error);
    }
  }, [theme, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      try {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        const handleChange = () => {
          try {
            const root = window.document.documentElement;
            const systemTheme = mediaQuery.matches ? "dark" : "light";
            
            root.classList.remove("light", "dark");
            root.classList.add(systemTheme);
          } catch (error) {
            toast.error("Failed to update system theme");
            console.error("System theme update error:", error);
          }
        };
        
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } catch (error) {
        toast.error("Failed to detect system theme");
        console.error("Media query error:", error);
      }
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        setTheme(newTheme);
      } catch (error) {
        toast.error("Failed to change theme");
        console.error("Theme change error:", error);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    toast.error("Theme context not found. Make sure to use the ThemeProvider");
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}