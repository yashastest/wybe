
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ 
  children, 
  defaultTheme = "system",
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme={defaultTheme} {...props}>
      {children}
    </NextThemesProvider>
  )
}

export const useTheme = () => {
  const context = React.useContext(React.createContext<{
    theme: string | undefined;
    setTheme: (theme: string) => void;
  }>({ theme: undefined, setTheme: () => {} }));
  
  if (context === undefined) {
    return { theme: "dark", setTheme: () => {} };
  }
  
  return context;
};
