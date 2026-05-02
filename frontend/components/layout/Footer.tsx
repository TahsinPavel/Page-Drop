"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

const PRODUCT_LINKS = [
    { href: "/#features", label: "Features" },
    { href: "/#templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#resources", label: "Resources" },
];

const COMPANY_LINKS = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-[#050508] border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-6 py-12 sm:py-16">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6366F1] transition-transform duration-300 group-hover:scale-110">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#F0F0FF]">
                                Page<span className="text-[#6366F1]">Drop</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-[#9090B0]">
                            The WhatsApp-first sales engine for modern businesses. Build premium sales pages in minutes, not days.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-[#F0F0FF]">
                            Product
                        </h4>
                        <ul className="space-y-3">
                            {PRODUCT_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-700 hover:text-[#6366F1] dark:text-[#9090B0] dark:hover:text-[#F0F0FF] transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-[#F0F0FF]">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {COMPANY_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-700 hover:text-[#6366F1] dark:text-[#9090B0] dark:hover:text-[#F0F0FF] transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-[#F0F0FF]">
                            Status
                        </h4>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
                            <span className="text-xs font-medium text-gray-700 dark:text-[#9090B0]">System Operational</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-[#606080]">
                            Built with ❤️ for modern commerce.
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600 dark:text-[#606080]">
                        &copy; {new Date().getFullYear()} PageDrop. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-900 dark:text-[#606080] dark:hover:text-[#F0F0FF]">Terms</Link>
                        <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-900 dark:text-[#606080] dark:hover:text-[#F0F0FF]">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
