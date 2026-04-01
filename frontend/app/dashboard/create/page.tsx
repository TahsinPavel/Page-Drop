"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CreatePageForm from "@/components/forms/CreatePageForm";

export default function CreatePage() {
    return (
        <>
            <DashboardHeader
                breadcrumb="PageDrop"
                pageTitle="Create New Page"
                showActions={false}
            />

            <div className="db-animate-in" style={{ marginBottom: 28 }}>
                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#e5e2e1",
                        fontFamily: "var(--font-syne), sans-serif",
                    }}
                >
                    Create New Page
                </h1>
                <p style={{ fontSize: 14, color: "#908fa0", marginTop: 4 }}>
                    Fill in your business details and let AI do the rest.
                </p>
            </div>

            <div className="db-section-card db-animate-in db-animate-delay-2">
                <CreatePageForm />
            </div>
        </>
    );
}
