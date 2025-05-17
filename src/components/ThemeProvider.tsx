
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
  const context = React.useContext(
    React.createContext<{
      theme: string | undefined;
      setTheme: (theme: string) => void;
    }>({ 
      theme: undefined, 
      setTheme: () => {} 
    })
  );
  
  // Fallback for when context is not available
  const [internalTheme, setInternalTheme] = React.useState("dark");
  
  return {
    theme: context.theme || internalTheme, 
    setTheme: context.setTheme || setInternalTheme
  };
};
