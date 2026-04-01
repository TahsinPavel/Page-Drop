"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import { useMyPages } from "@/hooks/usePages";
import { Eye, MousePointerClick, TrendingUp, BarChart2 } from "lucide-react";

export default function AnalyticsPage() {
    const { data: pages } = useMyPages();

    const totalViews = pages?.reduce((s, p) => s + p.page_views, 0) ?? 0;
    const totalClicks = pages?.reduce((s, p) => s + p.whatsapp_clicks, 0) ?? 0;
    const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

    return (
        <>
            <DashboardHeader
                breadcrumb="PageDrop"
                pageTitle="Analytics"
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
                    Analytics Overview
                </h1>
                <p style={{ fontSize: 14, color: "#908fa0", marginTop: 4 }}>
                    Track your performance across all pages.
                </p>
            </div>

            {/* Stats */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 16,
                    marginBottom: 28,
                }}
            >
                <StatsCard title="Total Views" value={totalViews} icon={Eye} delay={1} />
                <StatsCard title="WhatsApp Clicks" value={totalClicks} icon={MousePointerClick} delay={2} />
                <StatsCard title="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} delay={3} />
            </div>

            {/* Chart placeholder */}
            <div className="db-section-card db-animate-in db-animate-delay-4">
                <div className="db-section-title">Traffic Over Time</div>
                <div
                    style={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        background: "rgba(32, 31, 31, 0.5)",
                        border: "1px dashed rgba(70,69,84,0.2)",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <BarChart2 size={40} style={{ color: "#5a5a7a", marginBottom: 12 }} />
                        <p style={{ fontSize: 14, color: "#908fa0" }}>
                            Detailed analytics charts coming soon
                        </p>
                        <p style={{ fontSize: 12, color: "#5a5a7a", marginTop: 4 }}>
                            Per-page analytics are available from the page edit view
                        </p>
                    </div>
                </div>
            </div>

            {/* Per-page list */}
            {pages && pages.length > 0 && (
                <div className="db-section-card db-animate-in db-animate-delay-5" style={{ marginTop: 20 }}>
                    <div className="db-section-title">Performance by Page</div>
                    <table className="db-leads-table">
                        <thead>
                            <tr>
                                <th>Page</th>
                                <th>Views</th>
                                <th>Clicks</th>
                                <th>CTR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map((page) => {
                                const ctr = page.page_views > 0
                                    ? ((page.whatsapp_clicks / page.page_views) * 100).toFixed(1)
                                    : "0.0";
                                return (
                                    <tr key={page.id}>
                                        <td style={{ fontWeight: 500 }}>{page.business_name}</td>
                                        <td>{page.page_views.toLocaleString()}</td>
                                        <td>{page.whatsapp_clicks.toLocaleString()}</td>
                                        <td>
                                            <span className={Number(ctr) > 0 ? "db-stat-trend-up" : ""}>
                                                {ctr}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
