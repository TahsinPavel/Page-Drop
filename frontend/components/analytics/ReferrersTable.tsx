"use client";

import { Globe } from "lucide-react";
import type { ReferrerAnalytics } from "@/types";

interface ReferrersTableProps {
    referrers: ReferrerAnalytics[];
    isPro: boolean;
}

const dotColors = ["#6366F1", "#10B981", "#8B5CF6", "#5A5A7A", "#5A5A7A"];

export default function ReferrersTable({ referrers }: ReferrersTableProps) {
    const maxCount = referrers.length > 0 ? referrers[0].count : 1;
    const total = referrers.reduce((sum, r) => sum + r.count, 0) || 1;

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
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Globe size={18} color="#6366F1" />
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: "var(--pd-text-primary)",
                                    fontSize: 16,
                                }}
                            >
                                Traffic Sources
                            </span>
                        </div>
                        <span
                            style={{
                                fontSize: 12,
                                color: "var(--pd-text-tertiary)",
                                display: "block",
                                marginTop: 2,
                            }}
                        >
                            Where your visitors come from
                        </span>
                    </div>
                </div>

                {/* Empty state */}
                {referrers.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "40px 20px",
                            textAlign: "center",
                        }}
                    >
                        <Globe
                            size={48}
                            color="var(--pd-text-tertiary)"
                            style={{ opacity: 0.4, marginBottom: 12 }}
                        />
                        <p
                            style={{
                                fontWeight: 600,
                                color: "var(--pd-text-secondary)",
                                marginBottom: 4,
                            }}
                        >
                            No referrer data yet
                        </p>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--pd-text-tertiary)",
                            }}
                        >
                            Share your page link to start seeing traffic sources
                        </p>
                    </div>
                ) : (
                    <div>
                            {/* Column headers */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr auto auto",
                                    gap: 12,
                                    paddingBottom: 12,
                                    borderBottom: "1px solid var(--pd-border)",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 11,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        color: "var(--pd-text-tertiary)",
                                    }}
                                >
                                    Source
                                </span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        color: "var(--pd-text-tertiary)",
                                        textAlign: "right",
                                    }}
                                >
                                    Visits
                                </span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        color: "var(--pd-text-tertiary)",
                                        textAlign: "right",
                                        minWidth: 120,
                                    }}
                                >
                                    Share
                                </span>
                            </div>

                            {/* Rows */}
                            {referrers.slice(0, 5).map((ref, idx) => {
                                const pct = ((ref.count / total) * 100).toFixed(0);
                                const barWidth = ((ref.count / maxCount) * 100).toFixed(0);
                                const isLast = idx === Math.min(referrers.length, 5) - 1;

                                return (
                                    <div
                                        key={ref.referrer}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr auto auto",
                                            gap: 12,
                                            padding: "12px 0",
                                            borderBottom: isLast
                                                ? "none"
                                                : "1px solid var(--pd-border)",
                                            alignItems: "center",
                                        }}
                                    >
                                        {/* Source */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: "50%",
                                                    background: dotColors[idx] ?? "#5A5A7A",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    color: "var(--pd-text-primary)",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    maxWidth: 180,
                                                }}
                                            >
                                                {ref.referrer || "Direct"}
                                            </span>
                                        </div>

                                        {/* Count */}
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: "var(--pd-text-primary)",
                                                fontSize: 13,
                                                textAlign: "right",
                                            }}
                                        >
                                            {ref.count.toLocaleString()}
                                        </span>

                                        {/* Progress bar + percentage */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                justifyContent: "flex-end",
                                                minWidth: 120,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: 6,
                                                    width: 80,
                                                    background: "rgba(255,255,255,0.06)",
                                                    borderRadius: 9999,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        height: "100%",
                                                        width: `${barWidth}%`,
                                                        background: "#6366F1",
                                                        borderRadius: 9999,
                                                        transition: "width 800ms ease",
                                                    }}
                                                />
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    color: "var(--pd-text-tertiary)",
                                                    minWidth: 28,
                                                    textAlign: "right",
                                                }}
                                            >
                                                {pct}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}
