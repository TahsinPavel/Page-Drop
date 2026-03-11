"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
    Rocket,
    LayoutDashboard,
    BarChart2,
    PlusCircle,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard", label: "Analytics", icon: BarChart2, subtitle: "Per-page analytics" },
    { href: "/dashboard/create", label: "Create New Page", icon: PlusCircle },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-4 font-bold text-xl">
                <Rocket className="h-6 w-6 text-[#25D366]" />
                <span>
                    Page<span className="text-[#25D366]">Drop</span>
                </span>
            </div>

            <Separator />

            {/* Nav links */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive = item.label === "Analytics"
                        ? pathname.includes("/analytics")
                        : pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[#25D366]/10 text-[#25D366]"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            <div>
                                {item.label}
                                {"subtitle" in item && item.subtitle && (
                                    <span className="block text-[11px] font-normal text-muted-foreground">
                                        {item.subtitle}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User & logout */}
            <div className="border-t px-3 py-4 space-y-2">
                <p className="truncate px-3 text-xs text-muted-foreground">
                    {user?.email ?? "—"}
                </p>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-red-500"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default function DashboardSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile hamburger */}
            <div className="sticky top-0 z-40 flex h-14 items-center border-b bg-white px-4 lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SidebarContent onNavigate={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
                <span className="ml-3 font-bold">
                    Page<span className="text-[#25D366]">Drop</span>
                </span>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-white">
                <SidebarContent />
            </aside>
        </>
    );
}
