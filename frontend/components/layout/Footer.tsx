import Link from "next/link";
import { Zap } from "lucide-react";

const PRODUCT_LINKS = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#example", label: "Example" },
];

const COMPANY_LINKS = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Footer() {
    return (
        <footer
            style={{
                background: "var(--pd-bg-secondary)",
                borderTop: "1px solid var(--pd-border)",
            }}
        >
            <div className="mx-auto max-w-[1200px] px-5 sm:px-6 py-12 sm:py-16">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-[#6366F1]" />
                            <span
                                className="text-lg font-bold pd-gradient-text"
                                style={{ fontFamily: "var(--font-syne), sans-serif" }}
                            >
                                PageDrop
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--pd-text-secondary)" }}>
                            Instant websites for WhatsApp businesses. AI-powered, free to start.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4
                            className="mb-3 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "var(--pd-text-tertiary)" }}
                        >
                            Product
                        </h4>
                        <ul className="space-y-2">
                            {PRODUCT_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors duration-200"
                                        style={{ color: "var(--pd-text-secondary)" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pd-text-primary)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pd-text-secondary)")}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4
                            className="mb-3 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "var(--pd-text-tertiary)" }}
                        >
                            Company
                        </h4>
                        <ul className="space-y-2">
                            {COMPANY_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors duration-200"
                                        style={{ color: "var(--pd-text-secondary)" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pd-text-primary)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pd-text-secondary)")}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4
                            className="mb-3 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "var(--pd-text-tertiary)" }}
                        >
                            Connect
                        </h4>
                        <p className="text-sm" style={{ color: "var(--pd-text-secondary)" }}>
                            Built with ❤️ in Bangladesh
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="mt-12 border-t pt-6 text-center text-xs"
                    style={{
                        borderColor: "var(--pd-border)",
                        color: "var(--pd-text-tertiary)",
                    }}
                >
                    &copy; {new Date().getFullYear()} PageDrop · Made for small businesses
                </div>
            </div>
        </footer>
    );
}
