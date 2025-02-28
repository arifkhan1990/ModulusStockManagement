
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';

interface Theme {
  mode: ThemeMode;
  color: ThemeColor;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  availableColors: ThemeColor[];
  availableModes: ThemeMode[];
}

const defaultTheme: Theme = {
  mode: 'system',
  color: 'blue',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? JSON.parse(storedTheme) : defaultTheme;
  });

  const availableColors: ThemeColor[] = ['blue', 'green', 'purple', 'orange', 'red', 'gray'];
  const availableModes: ThemeMode[] = ['light', 'dark', 'system'];

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', JSON.stringify(newTheme));
  };

  const setMode = (mode: ThemeMode) => {
    setTheme({ ...theme, mode });
  };

  const setColor = (color: ThemeColor) => {
    setTheme({ ...theme, color });
  };

  // Apply theme mode to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all previous theme classes
    root.classList.remove('light', 'dark');
    
    // Determine if we should use dark mode
    if (theme.mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme.mode);
    }

    // Remove all previous color classes
    availableColors.forEach(color => {
      root.classList.remove(`theme-${color}`);
    });
    
    // Add current color class
    root.classList.add(`theme-${theme.color}`);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        setMode,
        setColor,
        availableColors,
        availableModes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
