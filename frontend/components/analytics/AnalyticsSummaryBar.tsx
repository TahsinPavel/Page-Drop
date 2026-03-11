"use client";

import Link from "next/link";
import { Eye, MessageCircle, TrendingUp, Trophy } from "lucide-react";
import type { DashboardSummary } from "@/types";

interface AnalyticsSummaryBarProps {
    summary: DashboardSummary | null;
    loading: boolean;
    pageId?: string;
}

export default function AnalyticsSummaryBar({
    summary,
    loading,
    pageId,
}: AnalyticsSummaryBarProps) {
    if (loading) {
        return (
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            height: 32,
                            width: 160,
                            background: "rgba(255,255,255,0.06)",
                            borderRadius: 9999,
                            animation: "pulse 2s infinite",
                        }}
                    />
                ))}
            </div>
        );
    }

    if (!summary) return null;

    const pills = [
        {
            icon: Eye,
            label: `${summary.total_views_all_time.toLocaleString()} Total Views`,
        },
        {
            icon: MessageCircle,
            label: `${summary.total_whatsapp_clicks_all_time.toLocaleString()} WA Clicks`,
        },
        {
            icon: TrendingUp,
            label: `${summary.total_views_last_30_days.toLocaleString()} Views This Month`,
        },
    ];

    return (
        <div style={{ marginBottom: 24 }}>
            {/* Stat pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {pills.map((pill) => {
                    const Icon = pill.icon;
                    return (
                        <span
                            key={pill.label}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 16px",
                                borderRadius: 9999,
                                background: "rgba(99,102,241,0.08)",
                                border: "1px solid rgba(99,102,241,0.18)",
                                color: "#a5b4fc",
                                fontSize: 13,
                                fontWeight: 500,
                                transition: "border-color 200ms ease",
                            }}
                        >
                            <Icon size={14} />
                            {pill.label}
                        </span>
                    );
                })}
            </div>

            {/* Best performing page highlight */}
            {summary.best_performing_page && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 18px",
                        borderRadius: 12,
                        marginTop: 8,
                        background: "rgba(99,102,241,0.05)",
                        border: "1px solid rgba(99,102,241,0.12)",
                        flexWrap: "wrap",
                    }}
                >
                    <Trophy size={16} color="#F59E0B" />
                    <span style={{ fontSize: 13, color: "var(--pd-text-secondary)" }}>
                        Best page:
                    </span>
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--pd-text-primary)",
                        }}
                    >
                        {summary.best_performing_page.business_name}
                    </span>
                    <span
                        style={{
                            fontSize: 12,
                            color: "var(--pd-text-tertiary)",
                        }}
                    >
                        · {summary.best_performing_page.views.toLocaleString()} views
                    </span>

                    {pageId && (
                        <Link
                            href={`/dashboard/pages/${pageId}/analytics`}
                            style={{
                                marginLeft: "auto",
                                fontSize: 12,
                                color: "#818CF8",
                                textDecoration: "none",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.textDecoration = "none";
                            }}
                        >
                            View Analytics →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
