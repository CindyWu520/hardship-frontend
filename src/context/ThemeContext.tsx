import { createContext, useState, useEffect } from "react";

interface ThemeContextType {
    theme: string 
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {}
});

export function ThemeProvider({ children } : {children: React.ReactNode}) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme == "dark") {
      document.documentElement.classList.add("dark");
      console.log( `{the theme changed to ${theme}}`)
    } else {
      document.documentElement.classList.remove("dark");
      console.log(`{the theme changed to ${theme}}`);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}