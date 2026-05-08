"use client";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";
import { DashboardThemeProvider, useDashboardTheme } from "@/hooks/useDashboardTheme";
import "./dashboard.css";

import { usePathname } from "next/navigation";

function DashboardShell({ children }: { children: React.ReactNode }) {
    const { theme } = useDashboardTheme();
    const pathname = usePathname();
    const isBuilder = pathname?.startsWith("/dashboard/build");

    return (
        <div className={`db-void ${theme === "light" ? "db-light" : "dark"}`} style={{ display: "flex", minHeight: "100vh" }}>
            {!isBuilder && <DashboardSidebar />}
            <main style={{ flex: 1, overflow: "auto" }}>
                {isBuilder ? (
                    <div style={{ height: "100%", width: "100%" }}>
                        {children}
                    </div>
                ) : (
                    <div
                        style={{
                            maxWidth: 1100,
                            margin: "0 auto",
                            padding: "28px 24px",
                        }}
                    >
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useAuth(true);

    return (
        <DashboardThemeProvider>
            <DashboardShell>{children}</DashboardShell>
        </DashboardThemeProvider>
    );
}

