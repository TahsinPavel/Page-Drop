"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePlan } from "@/hooks/usePlan";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
    LayoutDashboard,
    FileText,
    Box,
    BarChart2,
    Settings,
    LogOut,
    Menu,
    Zap,
    Crown,
} from "lucide-react";
import { useState } from "react";

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
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile header */}
            <div
                className="lg:hidden"
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 40,
                    display: "flex",
                    height: 56,
                    alignItems: "center",
                    borderBottom: "1px solid rgba(70,69,84,0.12)",
                    background: "#121212",
                    padding: "0 16px",
                }}
            >
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            className="db-btn-icon"
                            style={{ background: "transparent", border: "none" }}
                        >
                            <Menu size={20} style={{ color: "#e5e2e1" }} />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="p-0"
                        style={{
                            width: 260,
                            background: "#121212",
                            border: "none",
                        }}
                    >
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SidebarContent onNavigate={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
                <span
                    style={{
                        marginLeft: 12,
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "var(--font-syne), sans-serif",
                        color: "#f0f0ff",
                    }}
                >
                    Page<span style={{ color: "#6366f1" }}>Drop</span>
                </span>
            </div>

            {/* Desktop sidebar */}
            <aside
                className="hidden lg:flex lg:w-64 lg:flex-col"
                style={{ background: "#121212", borderRight: "1px solid rgba(70,69,84,0.12)" }}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
