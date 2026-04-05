"use client";

import { Globe } from "lucide-react";

interface AcquisitionSourcesProps {
    sources: Array<{
        source: string;
        category: string;
        visits: number;
        percentage: number;
    }>;
}

const categoryColors: Record<string, string> = {
    Social: "#EC4899",
    Search: "#3B82F6",
    Direct: "#10B981",
    Referral: "#F59E0B",
};

function getCategoryColor(category: string): string {
    return categoryColors[category] ?? "#6366F1";
}

export default function AcquisitionSources({ sources }: AcquisitionSourcesProps) {
    if (sources.length === 0) {
        return (
            <div
                style={{
                    background: "var(--pd-bg-secondary)",
                    border: "1px solid var(--pd-border)",
                    borderRadius: 16,
                    padding: 24,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 20,
                    }}
                >
                    <Globe size={18} color="var(--pd-text-secondary)" />
                    <span
                        style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "var(--pd-text-primary)",
                        }}
                    >
                        Acquisition Sources
                    </span>
                </div>
                <p
                    style={{
                        textAlign: "center",
                        color: "var(--pd-text-tertiary)",
                        fontSize: 13,
                        padding: "24px 0",
                    }}
                >
                    No referrer data yet
                </p>
            </div>
        );
    }

    const displayed = sources.slice(0, 8);

    return (
        <div
            style={{
                background: "var(--pd-bg-secondary)",
                border: "1px solid var(--pd-border)",
                borderRadius: 16,
                padding: 24,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 20,
                }}
            >
                <Globe size={18} color="var(--pd-text-secondary)" />
                <span
                    style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "var(--pd-text-primary)",
                    }}
                >
                    Acquisition Sources
                </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {displayed.map((src) => {
                    const color = getCategoryColor(src.category);
                    const truncatedName =
                        src.source.length > 24
                            ? `${src.source.slice(0, 24)}…`
                            : src.source;

                    return (
                        <div key={`${src.source}-${src.category}`}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 6,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        minWidth: 0,
                                    }}
                                >
                                    {/* Color dot */}
                                    <span
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: color,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "var(--pd-text-secondary)",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {truncatedName}
                                    </span>
                                    {/* Category badge */}
                                    <span
                                        style={{
                                            fontSize: 10,
                                            padding: "1px 6px",
                                            borderRadius: 9999,
                                            background: `${color}18`,
                                            color,
                                            fontWeight: 500,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {src.category}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "var(--pd-text-primary)",
                                        flexShrink: 0,
                                        marginLeft: 8,
                                    }}
                                >
                                    {src.visits.toLocaleString()}
                                </span>
                            </div>
                            {/* Percentage bar */}
                            <div
                                style={{
                                    height: 6,
                                    width: "100%",
                                    background: "rgba(255,255,255,0.06)",
                                    borderRadius: 9999,
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${Math.max(src.percentage, 2)}%`,
                                        height: "100%",
                                        background: color,
                                        borderRadius: 9999,
                                        transition: "width 600ms ease",
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
