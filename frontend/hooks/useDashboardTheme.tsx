"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    toggleTheme: () => {},
});

export function useDashboardTheme() {
    return useContext(ThemeContext);
}

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    /* Read saved preference on mount */
    useEffect(() => {
        const saved = localStorage.getItem("db-theme") as Theme | null;
        if (saved === "light" || saved === "dark") {
            setTheme(saved);
        }
        setMounted(true);
    }, []);

    /* Apply class to the dashboard wrapper */
    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("db-theme", theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
