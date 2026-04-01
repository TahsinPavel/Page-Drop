"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: number;          // e.g. +12 or -1
    trendLabel?: string;     // e.g. "+12%"
    delay?: number;
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    trendLabel,
    delay = 0,
}: StatsCardProps) {
    const isPositive = trend !== undefined && trend >= 0;

    return (
        <div className={`db-stat-card db-animate-in db-animate-delay-${delay}`}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div className="db-stat-icon">
                    <Icon size={20} />
                </div>
                {trend !== undefined && trendLabel && (
                    <div className={isPositive ? "db-stat-trend-up" : "db-stat-trend-down"}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trendLabel}
                    </div>
                )}
            </div>
            <div style={{ marginTop: 16 }}>
                <p
                    style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#e5e2e1",
                        lineHeight: 1.1,
                        fontFamily: "var(--font-syne), sans-serif",
                    }}
                >
                    {typeof value === "number" ? value.toLocaleString() : value}
                </p>
                <p
                    style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#908fa0",
                        marginTop: 4,
                    }}
                >
                    {title}
                </p>
            </div>
        </div>
    );
}
