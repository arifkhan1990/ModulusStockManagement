
import {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
  ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => {},
};

// Explicitly type the context to avoid ambiguity
const ThemeProviderContext = createContext<ThemeContext>({
  theme: "light",
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
}: ThemeProviderProps) {
  export const useTheme = () => {
    const [theme, setTheme] = useState("light");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      setIsDarkMode(newTheme === "dark");
    };
    const contextValue = { theme, toggleTheme };

  return (
    <ThemeProviderContext.Provider value={{...contextValue}}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme(): ThemeProviderState {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  const stored = localStorage.getItem(storageKey);
  return stored && ['light', 'dark', 'system'].includes(stored)
    ? (stored as Theme)
    : defaultTheme;
}