"use client";

import { TrendingDown } from "lucide-react";

interface FunnelStep {
    label: string;
    value: number;
    icon: string;
    color: string;
}

interface FunnelChartProps {
    funnel: {
        visitors: number;
        interactions: number;
        focus_15s: number;
        cta_clicks: number;
    };
}

export default function FunnelChart({ funnel }: FunnelChartProps) {
    const steps: FunnelStep[] = [
        { label: "Visitors", value: funnel.visitors, icon: "👁", color: "#6366F1" },
        { label: "Interactions", value: funnel.interactions, icon: "🖱️", color: "#8B5CF6" },
        { label: "Focus >15s", value: funnel.focus_15s, icon: "⏱", color: "#A78BFA" },
        { label: "WhatsApp Clicks", value: funnel.cta_clicks, icon: "💬", color: "#10B981" },
    ];

    if (funnel.visitors === 0) {
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
                    <TrendingDown size={18} color="var(--pd-text-secondary)" />
                    <span
                        style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "var(--pd-text-primary)",
                        }}
                    >
                        Experience Funnel
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
                    No interaction data yet
                </p>
            </div>
        );
    }

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
                <TrendingDown size={18} color="var(--pd-text-secondary)" />
                <span
                    style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "var(--pd-text-primary)",
                    }}
                >
                    Experience Funnel
                </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {steps.map((step, i) => {
                    const widthPct = Math.max(
                        (step.value / (funnel.visitors || 1)) * 100,
                        4
                    );
                    const prevValue = i > 0 ? steps[i - 1].value : 0;
                    const dropOff =
                        i > 0
                            ? (
                                  ((prevValue - step.value) / (prevValue || 1)) *
                                  100
                              ).toFixed(0)
                            : null;

                    return (
                        <div key={step.label}>
                            {/* Labels row */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 6,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 13,
                                        color: "var(--pd-text-secondary)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    <span style={{ fontSize: 14 }}>{step.icon}</span>
                                    {step.label}
                                </span>
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "var(--pd-text-primary)",
                                    }}
                                >
                                    {step.value.toLocaleString()}
                                </span>
                            </div>

                            {/* Bar */}
                            <div
                                style={{
                                    width: "100%",
                                    height: 8,
                                    background: `${step.color}20`,
                                    borderRadius: 9999,
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${widthPct}%`,
                                        height: "100%",
                                        background: `${step.color}CC`,
                                        borderRadius: 9999,
                                        transition: "width 600ms ease",
                                    }}
                                />
                            </div>

                            {/* Drop-off */}
                            {dropOff !== null && (
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: "var(--pd-text-tertiary)",
                                        marginTop: 4,
                                    }}
                                >
                                    {dropOff}% drop-off
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
