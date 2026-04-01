"use client";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";
import "./dashboard.css";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useAuth(true); // require auth

    return (
        <div className="db-void" style={{ display: "flex", minHeight: "100vh" }}>
            <DashboardSidebar />
            <main style={{ flex: 1, overflow: "auto" }}>
                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        padding: "28px 24px",
                    }}
                >
                    {children}
                </div>
            </main>
        </div>
    );
}
