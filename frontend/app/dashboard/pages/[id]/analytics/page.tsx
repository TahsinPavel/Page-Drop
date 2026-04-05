"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, AlertCircle, BarChart2, Copy } from "lucide-react";
import toast from "react-hot-toast";
import {
    getPageAnalytics,
    getPageById,
    getDashboardSummary,
    getRecentEvents,
} from "@/lib/api";
import { usePlan } from "@/hooks/usePlan";
import { useAuth } from "@/hooks/useAuth";
import StatsGrid from "@/components/analytics/StatsGrid";
import TrafficChart from "@/components/analytics/TrafficChart";
import ReferrersTable from "@/components/analytics/ReferrersTable";
import BestDayCard from "@/components/analytics/BestDayCard";
import FunnelChart from "@/components/analytics/FunnelChart";
import RecentEventsFeed from "@/components/analytics/RecentEventsFeed";
import DeviceSplit from "@/components/analytics/DeviceSplit";
import AcquisitionSources from "@/components/analytics/AcquisitionSources";
import type { PageAnalyticsData, DashboardSummary, RecentEvent } from "@/types";

export default function PageAnalyticsPage() {
    useAuth(true);

    const [days, setDays] = useState(30);
    const [analytics, setAnalytics] = useState<PageAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [businessName, setBusinessName] = useState("");
    const [slug, setSlug] = useState("");
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const params = useParams<{ id: string }>();
    const id = params.id;
    const { isPro } = usePlan();
    const router = useRouter();

    const loadData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setEventsLoading(true);
        setError(null);
        try {
            const [data, page, summaryData, eventsData] = await Promise.all([
                getPageAnalytics(id, days),
                getPageById(id),
                getDashboardSummary().catch(() => null),
                getRecentEvents(10).catch(() => ({ events: [] as RecentEvent[], total: 0 })),
            ]);
            setAnalytics(data);
            setBusinessName(page.business_name);
            setSlug(page.slug);
            setSummary(summaryData);
            setRecentEvents(eventsData.events);
        } catch {
            setError("Failed to load analytics.");
        } finally {
            setLoading(false);
            setEventsLoading(false);
        }
    }, [id, days]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (businessName) {
            document.title = `${businessName} Analytics — PageDrop`;
        }
        return () => {
            document.title = "PageDrop";
        };
    }, [businessName]);

    const handleCopyLink = () => {
        const url = `${window.location.origin}/${slug}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success("Link copied!");
        });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--pd-bg-primary)",
                padding: "24px 16px",
            }}
        >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                {/* Back button */}
                <button
                    onClick={() => router.push(`/dashboard/pages/${id}`)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        color: "var(--pd-text-secondary)",
                        fontSize: 13,
                        cursor: "pointer",
                        padding: "6px 0",
                        marginBottom: 24,
                        transition: "color 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--pd-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--pd-text-secondary)";
                    }}
                >
                    <ArrowLeft size={16} />
                    Back to Page
                </button>

                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 32,
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: "var(--pd-text-primary)",
                                fontFamily: "var(--font-syne), sans-serif",
                            }}
                        >
                            {businessName || "Page"} Analytics
                        </h1>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 4,
                                flexWrap: "wrap",
                            }}
                        >
                            <Clock size={14} color="var(--pd-text-tertiary)" />
                            <span
                                style={{
                                    fontSize: 13,
                                    color: "var(--pd-text-tertiary)",
                                }}
                            >
                                Showing last {days} days of data
                            </span>
                            {slug && (
                                <>
                                    <span style={{ color: "var(--pd-text-tertiary)" }}>·</span>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "#818CF8",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => window.open(`/${slug}`, "_blank")}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.textDecoration = "underline";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.textDecoration = "none";
                                        }}
                                    >
                                        /{slug}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                </div>

                {/* LOADING STATE */}
                {loading && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 16,
                            }}
                        >
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: 128,
                                        background: "rgba(255,255,255,0.06)",
                                        borderRadius: 16,
                                        animation: "pulse 2s infinite",
                                    }}
                                />
                            ))}
                        </div>
                        <div
                            style={{
                                height: 320,
                                background: "rgba(255,255,255,0.06)",
                                borderRadius: 16,
                                animation: "pulse 2s infinite",
                            }}
                        />
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "3fr 2fr",
                                gap: 16,
                            }}
                        >
                            <div
                                style={{
                                    height: 256,
                                    background: "rgba(255,255,255,0.06)",
                                    borderRadius: 16,
                                    animation: "pulse 2s infinite",
                                }}
                            />
                            <div
                                style={{
                                    height: 256,
                                    background: "rgba(255,255,255,0.06)",
                                    borderRadius: 16,
                                    animation: "pulse 2s infinite",
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* ERROR STATE */}
                {error && !loading && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "64px 24px",
                            background: "var(--pd-bg-secondary)",
                            border: "1px solid var(--pd-border)",
                            borderRadius: 16,
                            textAlign: "center",
                        }}
                    >
                        <AlertCircle size={48} color="#F87171" style={{ marginBottom: 12 }} />
                        <h3
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: "var(--pd-text-primary)",
                                marginBottom: 8,
                            }}
                        >
                            Failed to load analytics
                        </h3>
                        <p
                            style={{
                                fontSize: 14,
                                color: "var(--pd-text-secondary)",
                                marginBottom: 20,
                            }}
                        >
                            {error}
                        </p>
                        <button
                            onClick={loadData}
                            style={{
                                background: "var(--pd-accent-primary)",
                                color: "white",
                                border: "none",
                                borderRadius: 10,
                                padding: "10px 24px",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* EMPTY STATE */}
                {analytics && analytics.total_views === 0 && !loading && !error && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "64px 24px",
                            background: "var(--pd-bg-secondary)",
                            border: "1px solid var(--pd-border)",
                            borderRadius: 16,
                            textAlign: "center",
                        }}
                    >
                        <BarChart2
                            size={64}
                            color="#6366F1"
                            style={{ opacity: 0.35, marginBottom: 16 }}
                        />
                        <h3
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: "var(--pd-text-primary)",
                                marginBottom: 8,
                            }}
                        >
                            No data yet
                        </h3>
                        <p
                            style={{
                                fontSize: 14,
                                color: "var(--pd-text-secondary)",
                                marginBottom: 20,
                            }}
                        >
                            Share your page link to start seeing analytics
                        </p>
                        <button
                            onClick={handleCopyLink}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                background: "var(--pd-accent-primary)",
                                color: "white",
                                border: "none",
                                borderRadius: 10,
                                padding: "10px 24px",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                            }}
                        >
                            <Copy size={16} />
                            Copy Page Link
                        </button>
                    </div>
                )}

                {/* NORMAL STATE */}
                {analytics && !loading && !error && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                        {/* Row 1 — Stats with real trend data */}
                        <StatsGrid analytics={analytics} summary={summary} />

                        {/* Row 2 — Traffic chart */}
                        <TrafficChart
                            data={analytics.views_by_day}
                            days={days}
                            onDaysChange={setDays}
                            isPro={isPro}
                        />

                        {/* Row 3 — Referrers + Best Day */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gap: 16,
                            }}
                            className="lg:!grid-cols-[3fr_2fr]"
                        >
                            <ReferrersTable
                                referrers={analytics.top_referrers}
                                isPro={isPro}
                            />
                            <BestDayCard bestDay={analytics.best_day} isPro={isPro} />
                        </div>

                        {/* Row 4 — Funnel (if data exists) */}
                        {analytics.funnel && (
                            <FunnelChart funnel={analytics.funnel} />
                        )}

                        {/* Row 5 — Device Split + Acquisition Sources */}
                        {summary && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr",
                                    gap: 16,
                                }}
                                className="lg:!grid-cols-2"
                            >
                                <DeviceSplit
                                    deviceSplit={summary.device_split ?? {
                                        mobile_pct: 0,
                                        desktop_pct: 0,
                                    }}
                                />
                                <AcquisitionSources
                                    sources={summary.acquisition_sources ?? []}
                                />
                            </div>
                        )}

                        {/* Row 6 — Recent Events Feed */}
                        <RecentEventsFeed
                            events={recentEvents}
                            loading={eventsLoading}
                        />

                        {/* Bottom note */}
                        <div
                            style={{
                                marginTop: 40,
                                paddingTop: 24,
                                borderTop: "1px solid var(--pd-border)",
                                textAlign: "center",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 11,
                                    color: "var(--pd-text-tertiary)",
                                }}
                            >
                                Analytics data updates in real time · Data retained for 90 days
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
