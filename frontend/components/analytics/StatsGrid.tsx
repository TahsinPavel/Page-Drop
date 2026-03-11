"use client";

import {
    Eye,
    MessageCircle,
    TrendingUp,
    ShoppingBag,
} from "lucide-react";
import type { PageAnalyticsData } from "@/types";

interface StatsGridProps {
    analytics: PageAnalyticsData;
}

interface StatCardConfig {
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    iconBorder: string;
    value: number;
    label: string;
    subtext: string;
}

export default function StatsGrid({ analytics }: StatsGridProps) {
    const cards: StatCardConfig[] = [
        {
            icon: Eye,
            iconColor: "#6366F1",
            iconBg: "rgba(99,102,241,0.12)",
            iconBorder: "rgba(99,102,241,0.2)",
            value: analytics.total_views,
            label: "Total Page Views",
            subtext: `↑ ${analytics.views_last_7_days} this week`,
        },
        {
            icon: MessageCircle,
            iconColor: "#10B981",
            iconBg: "rgba(16,185,129,0.12)",
            iconBorder: "rgba(16,185,129,0.2)",
            value: analytics.total_whatsapp_clicks,
            label: "WhatsApp Clicks",
            subtext: `CTR: ${analytics.click_through_rate.toFixed(1)}%`,
        },
        {
            icon: TrendingUp,
            iconColor: "#8B5CF6",
            iconBg: "rgba(139,92,246,0.12)",
            iconBorder: "rgba(139,92,246,0.2)",
            value: analytics.views_last_30_days,
            label: "Views (30 Days)",
            subtext: analytics.best_day
                ? `Peak: ${analytics.best_day.date}`
                : "Keep sharing your page",
        },
        {
            icon: ShoppingBag,
            iconColor: "#F59E0B",
            iconBg: "rgba(245,158,11,0.12)",
            iconBorder: "rgba(245,158,11,0.2)",
            value: analytics.total_product_clicks,
            label: "Product Clicks",
            subtext: "Engagement metric",
        },
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
            }}
            className="sm:!grid-cols-4"
        >
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        style={{
                            background: "var(--pd-bg-secondary)",
                            border: "1px solid var(--pd-border)",
                            borderRadius: 16,
                            padding: 24,
                            position: "relative",
                            transition: "all 200ms ease",
                            cursor: "default",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.borderColor = "var(--pd-border-accent)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "var(--pd-border)";
                        }}
                    >
                        {/* Free Badge */}
                        <span
                            style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                fontSize: 10,
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.25)",
                                color: "#10B981",
                                borderRadius: 9999,
                                padding: "2px 8px",
                                fontWeight: 500,
                            }}
                        >
                            Free
                        </span>

                        {/* Icon */}
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                background: card.iconBg,
                                border: `1px solid ${card.iconBorder}`,
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Icon size={22} color={card.iconColor} />
                        </div>

                        {/* Value */}
                        <p
                            style={{
                                fontSize: 32,
                                fontWeight: 700,
                                color: "var(--pd-text-primary)",
                                margin: "12px 0 4px",
                                lineHeight: 1,
                            }}
                        >
                            {card.value.toLocaleString()}
                        </p>

                        {/* Label */}
                        <p style={{ fontSize: 13, color: "var(--pd-text-secondary)" }}>
                            {card.label}
                        </p>

                        {/* Subtext */}
                        <p
                            style={{
                                fontSize: 12,
                                color: "var(--pd-text-tertiary)",
                                marginTop: 4,
                            }}
                        >
                            {card.subtext}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
