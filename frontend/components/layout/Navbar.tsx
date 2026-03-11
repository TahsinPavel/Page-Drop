"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Zap, ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { isAuthenticated, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isActive = (href: string) => {
        if (href.startsWith("/#")) return pathname === "/";
        return pathname === href;
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? "bg-[#0A0A0F]/80 backdrop-blur-xl shadow-lg shadow-black/20"
                        : "bg-transparent backdrop-blur-sm"
                    }`}
                style={{ borderBottom: "1px solid var(--pd-border)" }}
            >
                <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-[#6366F1]" />
                        <span
                            className="text-[22px] font-bold pd-gradient-text"
                            style={{ fontFamily: "var(--font-syne), sans-serif" }}
                        >
                            PageDrop
                        </span>
                    </Link>

                    {/* Center nav — desktop */}
                    <nav className="hidden items-center gap-8 md:flex">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-sm font-medium transition-colors duration-200 ${isActive(link.href)
                                        ? "text-[#6366F1]"
                                        : "text-[#9090B0] hover:text-[#F0F0FF]"
                                    }`}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#6366F1]" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side CTAs — desktop */}
                    <div className="hidden items-center gap-3 md:flex">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium text-[#9090B0] transition-colors duration-200 hover:text-[#F0F0FF]"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-[#9090B0] transition-colors duration-200 hover:text-[#F0F0FF]"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-[#9090B0] transition-colors duration-200 hover:text-[#F0F0FF]"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="group flex items-center gap-1.5 rounded-lg bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4F46E5] pd-glow-button"
                                >
                                    Get Started Free
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="flex items-center justify-center md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? (
                            <X className="h-6 w-6 text-[#F0F0FF]" />
                        ) : (
                            <Menu className="h-6 w-6 text-[#F0F0FF]" />
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${mobileOpen ? "visible opacity-100" : "invisible opacity-0"
                    }`}
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/60"
                    onClick={() => setMobileOpen(false)}
                />
                {/* Panel */}
                <div
                    className={`absolute top-16 left-0 right-0 border-b transition-all duration-300 ${mobileOpen
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-4 opacity-0"
                        }`}
                    style={{
                        background: "var(--pd-bg-secondary)",
                        borderColor: "var(--pd-border)",
                    }}
                >
                    <nav className="flex flex-col px-6 py-4 gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${isActive(link.href)
                                        ? "text-[#6366F1] bg-[#6366F1]/10"
                                        : "text-[#9090B0] hover:text-[#F0F0FF] hover:bg-[#1A1A26]"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--pd-border)" }}>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#9090B0] hover:text-[#F0F0FF]"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="block w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-[#9090B0] hover:text-[#F0F0FF]"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#9090B0] hover:text-[#F0F0FF]"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setMobileOpen(false)}
                                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4F46E5]"
                                    >
                                        Get Started Free
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
