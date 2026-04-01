"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMyPages } from "@/hooks/usePages";
import { getDashboardSummary, deletePage } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import PageCard from "@/components/dashboard/PageCard";
import CarouselControl from "@/components/dashboard/CarouselControl";
import PaymentMethodModal from "@/components/payments/PaymentMethodModal";
import {
    FileText,
    Eye,
    MousePointerClick,
    TrendingUp,
    PlusCircle,
    Box,
    Layout,
    ExternalLink,
    Inbox,
} from "lucide-react";
import type { DashboardSummary } from "@/types";

export default function DashboardPage() {
    const { user } = useAuth(true);
    const { data: pages, isLoading } = useMyPages();
    const queryClient = useQueryClient();

    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [paymentOpen, setPaymentOpen] = useState(false);

    useEffect(() => {
        getDashboardSummary()
            .then(setSummary)
            .catch(() => {})
            .finally(() => setSummaryLoading(false));
    }, []);

    useEffect(() => {
        const payment = new URLSearchParams(window.location.search).get("payment");
        if (payment === "success") {
            toast.success("Your Pro plan is now active! 🎉", { duration: 6000 });
            window.history.replaceState({}, "", "/dashboard");
        }
    }, []);

    const totalViews = pages?.reduce((s, p) => s + p.page_views, 0) ?? 0;
    const totalClicks = pages?.reduce((s, p) => s + p.whatsapp_clicks, 0) ?? 0;
    const totalPages = pages?.length ?? 0;
    const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
    const primarySlug = pages?.[0]?.slug;

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this page?")) return;
        try {
            await deletePage(id);
            queryClient.invalidateQueries({ queryKey: ["my-pages"] });
            toast.success("Page deleted");
        } catch {
            toast.error("Failed to delete page");
        }
    };

    return (
        <>
            {/* Header */}
            <DashboardHeader
                breadcrumb="PageDrop"
                pageTitle="Dashboard"
                primarySlug={primarySlug}
            />

            {/* Welcome */}
            <div className="db-animate-in db-animate-delay-1" style={{ marginBottom: 28 }}>
                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#e5e2e1",
                        fontFamily: "var(--font-syne), sans-serif",
                    }}
                >
                    Welcome{user?.full_name ? `, ${user.full_name}` : ""} 👋
                </h1>
                <p style={{ fontSize: 14, color: "#908fa0", marginTop: 4 }}>
                    Manage your landing pages and track performance.
                </p>
            </div>

            {/* Stats Grid - 4 cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 16,
                    marginBottom: 28,
                }}
            >
                <StatsCard
                    title="Total Pages"
                    value={totalPages}
                    icon={FileText}
                    trend={totalPages > 0 ? 12 : 0}
                    trendLabel={totalPages > 0 ? `+${totalPages}` : "—"}
                    delay={1}
                />
                <StatsCard
                    title="Total Views"
                    value={totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}
                    icon={Eye}
                    trend={summary?.total_views_last_30_days ?? 0}
                    trendLabel={
                        summary?.total_views_last_30_days
                            ? `+${summary.total_views_last_30_days.toLocaleString()}`
                            : "—"
                    }
                    delay={2}
                />
                <StatsCard
                    title="WhatsApp Clicks"
                    value={totalClicks}
                    icon={MousePointerClick}
                    trend={totalClicks}
                    trendLabel={totalClicks > 0 ? `+${totalClicks}` : "—"}
                    delay={3}
                />
                <StatsCard
                    title="Conversion Rate"
                    value={`${conversionRate}%`}
                    icon={TrendingUp}
                    trend={Number(conversionRate)}
                    trendLabel={Number(conversionRate) > 0 ? `+${conversionRate}%` : "—"}
                    delay={4}
                />
            </div>

            {/* Quick Actions */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 14,
                    marginBottom: 28,
                }}
            >
                <QuickActionCard
                    icon={PlusCircle}
                    label="Add New Page"
                    href="/dashboard/create"
                    delay={3}
                />
                <QuickActionCard
                    icon={Box}
                    label="Customize Carousel"
                    onClick={() => toast("Carousel editor coming soon!", { icon: "🎠" })}
                    delay={4}
                />
                <QuickActionCard
                    icon={Layout}
                    label="Edit Landing Page"
                    href={pages?.[0] ? `/dashboard/pages/${pages[0].id}` : "/dashboard/create"}
                    delay={5}
                />
                <QuickActionCard
                    icon={ExternalLink}
                    label="View Live Page"
                    href={primarySlug ? `/${primarySlug}` : "#"}
                    delay={6}
                />
            </div>

            {/* Main content grid — Recent Pages + Carousel Control */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 320px",
                    gap: 20,
                    alignItems: "start",
                }}
                className="db-grid-responsive"
            >
                {/* Recent Pages / Products */}
                <div className="db-section-card db-animate-in db-animate-delay-4">
                    <div className="db-section-title">Recent Pages</div>

                    {isLoading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: 60,
                                        borderRadius: 10,
                                        background: "rgba(53,53,52,0.3)",
                                        animation: "pulse 2s infinite",
                                    }}
                                />
                            ))}
                        </div>
                    ) : pages && pages.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {pages.map((page) => (
                                <PageCard
                                    key={page.id}
                                    page={page}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="db-empty-state">
                            <Inbox size={40} style={{ color: "#5a5a7a" }} />
                            <div>
                                <h3
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: "#e5e2e1",
                                        marginBottom: 4,
                                    }}
                                >
                                    No pages yet
                                </h3>
                                <p style={{ fontSize: 13, color: "#908fa0" }}>
                                    Create your first landing page and go live in seconds.
                                </p>
                            </div>
                            <Link href="/dashboard/create">
                                <button className="db-btn-primary">
                                    <PlusCircle
                                        size={15}
                                        style={{ marginRight: 6, display: "inline" }}
                                    />
                                    Create Your First Page
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Carousel Control */}
                {pages && pages.length > 0 && <CarouselControl pages={pages} />}
            </div>




            {/* Payment Modal */}
            <PaymentMethodModal
                isOpen={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                plan="pro"
            />
        </>
    );
}
