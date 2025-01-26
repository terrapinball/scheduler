import { createContext } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

interface DarkModeContextType {
    isDark: boolean;
    toggleDarkMode: () => void;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
    const darkModeValue = useDarkMode();
    
    return (
      <DarkModeContext.Provider value={darkModeValue}>
        {children}
      </DarkModeContext.Provider>
    );
  }