"use client";

import { useParams } from "next/navigation";
import { usePageById } from "@/hooks/usePages";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EditPageForm from "@/components/forms/EditPageForm";

export default function EditPage() {
    const params = useParams();
    const pageId = params.id as string;
    const { data: page, isLoading, error } = usePageById(pageId);

    if (isLoading) {
        return (
            <>
                <DashboardHeader breadcrumb="PageDrop" pageTitle="Edit Page" showActions={false} />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            style={{
                                height: i === 1 ? 32 : 200,
                                borderRadius: 10,
                                background: "rgba(53,53,52,0.3)",
                                animation: "pulse 2s infinite",
                            }}
                        />
                    ))}
                </div>
            </>
        );
    }

    if (error || !page) {
        return (
            <>
                <DashboardHeader breadcrumb="PageDrop" pageTitle="Edit Page" showActions={false} />
                <div className="db-empty-state">
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: "#e5e2e1" }}>
                        Page not found
                    </h2>
                    <p style={{ fontSize: 13, color: "#908fa0" }}>
                        This page doesn&apos;t exist or you don&apos;t have access to it.
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <DashboardHeader
                breadcrumb="PageDrop"
                pageTitle={`Edit: ${page.business_name}`}
                primarySlug={page.slug}
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
                    Edit: {page.business_name}
                </h1>
                <p style={{ fontSize: 14, color: "#908fa0", marginTop: 4 }}>
                    Update your page details. Changes to your business name or products
                    will re-trigger AI content generation.
                </p>
            </div>

            <div className="db-section-card db-animate-in db-animate-delay-2">
                <EditPageForm page={page} />
            </div>
        </>
    );
}
