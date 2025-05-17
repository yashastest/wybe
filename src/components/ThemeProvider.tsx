
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ 
  children, 
  defaultTheme = "dark",
  ...props 
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // After mounting, we can safely show the UI that depends on client-side theme detection
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider defaultTheme={defaultTheme} {...props}>
      {children}
    </NextThemesProvider>
  )
}

export const useTheme = () => {
  const [theme, setTheme] = React.useState("dark");
  
  // Use next-themes' useTheme if available, otherwise fall back to our implementation
  try {
    const { useTheme: nextUseTheme } = require("next-themes");
    // This will throw an error if next-themes is not properly initialized
    const nextTheme = nextUseTheme();
    
    return nextTheme;
  } catch (error) {
    // Fall back to a simple theme implementation
    return {
      theme,
      setTheme: (newTheme: string) => {
        setTheme(newTheme);
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(newTheme);
        }
      },
      themes: ["light", "dark"]
    };
  }
};
