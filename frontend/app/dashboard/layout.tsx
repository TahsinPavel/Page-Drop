"use client";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useAuth(true); // require auth

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar />
            <main className="flex-1 overflow-auto">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
