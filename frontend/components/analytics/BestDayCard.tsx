"use client";

import { Trophy } from "lucide-react";
import type { BestDay } from "@/types";

interface BestDayCardProps {
    bestDay: BestDay | null;
    isPro: boolean;
}

function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr + "T00:00:00");
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(date);
    } catch {
        return dateStr;
    }
}

export default function BestDayCard({ bestDay }: BestDayCardProps) {
    return (
        <div
            style={{
                background: "var(--pd-bg-secondary)",
                border: "1px solid var(--pd-border)",
                borderRadius: 16,
                overflow: "hidden",
                height: "100%",
            }}
        >
            <div style={{ padding: 24 }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 20,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Trophy size={18} color="#F59E0B" />
                        <span
                            style={{
                                fontWeight: 600,
                                color: "var(--pd-text-primary)",
                                fontSize: 16,
                            }}
                        >
                            Best Performing Day
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px 16px",
                        textAlign: "center",
                        position: "relative",
                    }}
                >
                    {bestDay ? (
                        <>
                                {/* Date */}
                                <p
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: "var(--pd-text-primary)",
                                        marginBottom: 8,
                                    }}
                                >
                                    {formatDate(bestDay.date)}
                                </p>

                                {/* View count */}
                                <p
                                    className="pd-gradient-text"
                                    style={{
                                        fontSize: 48,
                                        fontWeight: 800,
                                        lineHeight: 1,
                                        marginBottom: 8,
                                    }}
                                >
                                    {bestDay.views.toLocaleString()}
                                </p>

                                {/* Label */}
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: "var(--pd-text-secondary)",
                                    }}
                                >
                                    page views in one day
                                </p>

                                {/* Decoration trophy */}
                                <Trophy
                                    size={80}
                                    color="#F59E0B"
                                    style={{
                                        position: "absolute",
                                        bottom: -4,
                                        right: -4,
                                        opacity: 0.06,
                                    }}
                                />
                        </>
                    ) : (
                        <>
                                <Trophy
                                    size={48}
                                    color="#F59E0B"
                                    style={{ opacity: 0.3, marginBottom: 12 }}
                                />
                                <p
                                    style={{
                                        fontWeight: 600,
                                        color: "var(--pd-text-secondary)",
                                        marginBottom: 4,
                                    }}
                                >
                                    Not enough data yet
                                </p>
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: "var(--pd-text-tertiary)",
                                    }}
                                >
                                    Keep sharing your page to find your best day
                                </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
