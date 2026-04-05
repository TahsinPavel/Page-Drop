"use client";

import { Smartphone, Monitor } from "lucide-react";

interface DeviceSplitProps {
    deviceSplit: { mobile_pct: number; desktop_pct: number };
}

export default function DeviceSplit({ deviceSplit }: DeviceSplitProps) {
    const isEmpty = deviceSplit.mobile_pct === 0 && deviceSplit.desktop_pct === 0;

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
                <Smartphone size={18} color="var(--pd-text-secondary)" />
                <span
                    style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "var(--pd-text-primary)",
                    }}
                >
                    Device Split
                </span>
            </div>

            {isEmpty ? (
                <p
                    style={{
                        textAlign: "center",
                        color: "var(--pd-text-tertiary)",
                        fontSize: 13,
                        padding: "24px 0",
                    }}
                >
                    No device data yet
                </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Mobile */}
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 8,
                            }}
                        >
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    fontSize: 13,
                                    color: "var(--pd-text-secondary)",
                                }}
                            >
                                <Smartphone size={14} />
                                Mobile
                            </span>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--pd-text-primary)",
                                }}
                            >
                                {deviceSplit.mobile_pct}%
                            </span>
                        </div>
                        <div
                            style={{
                                height: 8,
                                width: "100%",
                                background: "rgba(255,255,255,0.06)",
                                borderRadius: 9999,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: `${deviceSplit.mobile_pct}%`,
                                    height: "100%",
                                    background: "#10B981",
                                    borderRadius: 9999,
                                    transition: "width 600ms ease",
                                }}
                            />
                        </div>
                    </div>

                    {/* Desktop */}
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 8,
                            }}
                        >
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    fontSize: 13,
                                    color: "var(--pd-text-secondary)",
                                }}
                            >
                                <Monitor size={14} />
                                Desktop
                            </span>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--pd-text-primary)",
                                }}
                            >
                                {deviceSplit.desktop_pct}%
                            </span>
                        </div>
                        <div
                            style={{
                                height: 8,
                                width: "100%",
                                background: "rgba(255,255,255,0.06)",
                                borderRadius: 9999,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: `${deviceSplit.desktop_pct}%`,
                                    height: "100%",
                                    background: "#6366F1",
                                    borderRadius: 9999,
                                    transition: "width 600ms ease",
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
