"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_LINKS = [
    { label: "Templates", href: "#templates" },
    { label: "Features", href: "#features" },
    { label: "Reviews", href: "#reviews" },
    { label: "Pricing", href: "#pricing" },
    { label: "Resources", href: "#resources" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const { isAuthenticated, logout } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Active section detection
            const sections = NAV_LINKS.map(link => link.href.substring(1));
            let current = "";
            
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // If the top of the section is near the top of viewport
                    if (rect.top <= 200) {
                        current = section;
                    }
                }
            }
            
            setActiveSection(current ? "#" + current : "");
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (href: string) => {
        if (href.startsWith("#")) return activeSection === href;
        return pathname === href;
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                        ? "bg-white/90 dark:bg-[#0A0A0F]/90 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/40 border-b border-gray-200/50 dark:border-white/10 py-2"
                        : "bg-transparent backdrop-blur-sm py-4"
                    }`}
            >
                <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6366F1] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-[#6366F1]/20 pd-glow-button">
                            <Zap className="h-6 w-6 text-white fill-white" />
                        </div>
                        <span className="text-2xl font-heading tracking-tight text-gray-900 dark:text-white">
                            Page<span className="text-[#6366F1]">Drop</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden items-center gap-10 lg:flex">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`relative text-[15px] font-bold tracking-wide transition-all duration-300 hover:scale-105 ${isActive(link.href)
                                        ? "text-[#6366F1]"
                                        : "text-gray-700 hover:text-gray-900 dark:text-white/60 dark:hover:text-white"
                                    }`}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <motion.div 
                                        layoutId="nav-active"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#6366F1] rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-6 lg:flex">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-8">
                                <Link
                                    href="/dashboard"
                                    className="text-[15px] font-bold text-gray-800 hover:text-[#6366F1] dark:text-white/80 dark:hover:text-white transition-all group"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="text-[15px] font-bold text-gray-500 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-[15px] font-bold text-gray-700 hover:text-gray-900 dark:text-white/60 dark:hover:text-white transition-all"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="group flex items-center gap-2 rounded-2xl bg-[#6366F1] px-7 py-3 text-[15px] font-bold text-white transition-all duration-300 hover:bg-[#4F46E5] hover:scale-105 shadow-xl shadow-[#6366F1]/20 pd-glow-button"
                                >
                                    Get Started
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? (
                            <X className="h-6 w-6 text-gray-900 dark:text-[#F0F0FF]" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-900 dark:text-[#F0F0FF]" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`absolute top-16 left-0 right-0 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0A0A0F] transition-all duration-300 ${mobileOpen
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-4 opacity-0 pointer-events-none"
                        }`}
                >
                    <nav className="flex flex-col px-6 py-6 gap-2">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`rounded-2xl px-4 py-4 text-base font-bold transition-all duration-200 ${isActive(link.href)
                                        ? "text-[#6366F1] bg-[#6366F1]/10"
                                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="mt-4 border-t border-gray-100 dark:border-white/5 pt-6 flex flex-col gap-3">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-2xl px-4 py-4 text-base font-bold text-gray-800 hover:bg-gray-100 dark:text-white/80 dark:hover:bg-white/5"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="flex items-center gap-3 rounded-2xl px-4 py-4 text-base font-bold text-gray-500 hover:bg-gray-100 dark:text-white/40 dark:hover:bg-white/5"
                                    >
                                        <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/5">
                                            <X className="h-5 w-5" />
                                        </div>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-2xl px-4 py-4 text-base font-bold text-gray-700 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-white/5"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setMobileOpen(false)}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6366F1] px-6 py-4 text-base font-bold text-white transition-all hover:bg-[#4F46E5] shadow-lg shadow-[#6366F1]/20"
                                    >
                                        Get Started Free
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>
            {/* Backdrop overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 dark:bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
}
