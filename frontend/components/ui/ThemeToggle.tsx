"use client";

import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
    className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`transition-opacity duration-300 opacity-40 hover:opacity-100 ${className || "fixed left-6 bottom-8 z-[100]"}`}
        >
            <button 
                onClick={toggleTheme}
                className="theme-toggle-btn shadow-xl shadow-black/20"
                aria-label="Toggle theme"
            >
                <div className="theme-toggle-track">
                    <div className="theme-toggle-thumb" />
                </div>
                <div className="flex items-center gap-2">
                    {theme === "dark" ? (
                        <>
                            <Sun size={14} className="text-amber-400" />
                            <span>Light Mode</span>
                        </>
                    ) : (
                        <>
                            <Moon size={14} className="text-[#6366F1]" />
                            <span>Dark Mode</span>
                        </>
                    )}
                </div>
            </button>
        </motion.div>
    );
}
