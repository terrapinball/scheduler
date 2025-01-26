import { createContext, useContext } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

interface DarkModeContextType {
    isDark: boolean;
    toggleDarkMode: () => void;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const useDarkModeContext = () => {
  const context = useContext(DarkModeContext);
  if (!context) throw new Error("useDarkModeContext must be used within DarkModeProvider");
  return context;
};

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
    const darkModeValue = useDarkMode();
    
    return (
      <DarkModeContext.Provider value={darkModeValue}>
        {children}
      </DarkModeContext.Provider>
    );
  }