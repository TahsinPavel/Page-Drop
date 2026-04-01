"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePlan } from "@/hooks/usePlan";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";
import {
    LayoutDashboard,
    FileText,
    Box,
    BarChart2,
    Settings,
    LogOut,
    Zap,
    Crown,
    Sun,
    Moon,
} from "lucide-react";


const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/create", label: "My Pages", icon: FileText },
    { href: "/dashboard/leads", label: "Orders & Leads", icon: Box },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const { isPro, plan } = usePlan();
    const { theme, toggleTheme } = useDashboardTheme();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <div className="db-sidebar">
            {/* Brand */}
            <div className="db-sidebar-brand">
                <Link
                    href="/dashboard"
                    className="db-sidebar-brand-name"
                    style={{ textDecoration: "none" }}
                    onClick={onNavigate}
                >
                    <Zap size={22} style={{ color: "#6366f1" }} />
                    <span>
                        Page<span style={{ color: "#6366f1" }}>Drop</span>
                    </span>
                </Link>
                {isPro && (
                    <span className="db-sidebar-pro-badge" style={{ alignSelf: "flex-start", marginLeft: 32 }}>
                        {plan.toUpperCase()} PLAN
                    </span>
                )}
            </div>

            {/* Separator */}
            <div style={{ height: 1, background: "rgba(70,69,84,0.12)", margin: "0 16px" }} />

            {/* Nav */}
            <nav className="db-sidebar-nav" style={{ paddingTop: 12 }}>
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onNavigate}
                            className={`db-nav-item ${active ? "active" : ""}`}
                        >
                            <item.icon className="db-nav-icon" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="db-sidebar-footer">
                {/* User info */}
                <div className="db-sidebar-user">
                    <div className="db-sidebar-avatar">
                        {getInitials(user?.full_name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#e5e2e1",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {user?.full_name || "User Workspace"}
                        </div>
                        <div
                            style={{
                                fontSize: 11,
                                color: "#908fa0",
                            }}
                        >
                            {user?.email || "—"}
                        </div>
                    </div>
                </div>

                {/* Theme Toggle */}
                <button className="db-theme-toggle" onClick={toggleTheme}>
                    <span className="db-theme-toggle-track">
                        <span className="db-theme-toggle-thumb" />
                    </span>
                    {theme === "dark" ? (
                        <><Sun size={14} /> Light Mode</>
                    ) : (
                        <><Moon size={14} /> Dark Mode</>
                    )}
                </button>

                {/* Logout */}
                <button
                    className="db-nav-item"
                    onClick={handleLogout}
                    style={{ color: "#908fa0" }}
                >
                    <LogOut className="db-nav-icon" />
                    Logout
                </button>

                {/* Upgrade */}
                {!isPro && (
                    <Link href="/pricing" className="db-upgrade-btn" onClick={onNavigate}>
                        <Crown size={15} />
                        Upgrade Workspace
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function DashboardSidebar() {
    return (
        <aside className="db-sidebar-wrapper">
            <SidebarContent />
        </aside>
    );
}
