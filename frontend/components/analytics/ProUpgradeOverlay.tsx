"use client";

import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

interface ProUpgradeOverlayProps {
    featureName: string;
    onUpgradeClick?: () => void;
}

export default function ProUpgradeOverlay({ featureName, onUpgradeClick }: ProUpgradeOverlayProps) {
    const router = useRouter();

    const handleUpgrade = () => {
        if (onUpgradeClick) {
            onUpgradeClick();
        } else {
            router.push("/pricing");
        }
    };

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "inherit",
                padding: "32px",
                textAlign: "center",
                background:
                    "linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.92) 40%, rgba(10,10,15,0.98) 100%)",
            }}
        >
            {/* Lock Icon */}
            <div
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                }}
            >
                <LockKeyhole size={40} color="#6366F1" />
            </div>

            {/* Feature Badge */}
            <span
                style={{
                    fontSize: 12,
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    color: "#a5b4fc",
                    borderRadius: 9999,
                    padding: "4px 12px",
                    marginBottom: 12,
                }}
            >
                {featureName}
            </span>

            {/* Heading */}
            <h3
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--pd-text-primary)",
                    marginBottom: 8,
                }}
            >
                Pro Feature
            </h3>

            {/* Body */}
            <p
                style={{
                    fontSize: 14,
                    color: "var(--pd-text-secondary)",
                    maxWidth: 280,
                    lineHeight: 1.6,
                    marginBottom: 24,
                }}
            >
                Unlock advanced analytics to see detailed traffic data, visitor trends,
                and conversion insights.
            </p>

            {/* Buttons */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    width: "100%",
                    maxWidth: 220,
                }}
            >
                <button
                    onClick={handleUpgrade}
                    style={{
                        background: "var(--pd-accent-primary)",
                        color: "white",
                        border: "none",
                        borderRadius: 10,
                        padding: "11px 24px",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        width: "100%",
                        transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--pd-accent-primary-hover)";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--pd-accent-primary)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    Upgrade to Pro →
                </button>

                <button
                    onClick={() => router.push("/pricing")}
                    style={{
                        background: "transparent",
                        border: "1px solid var(--pd-border)",
                        color: "var(--pd-text-secondary)",
                        borderRadius: 10,
                        padding: "10px 24px",
                        fontSize: 14,
                        cursor: "pointer",
                        width: "100%",
                        transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--pd-border-accent)";
                        e.currentTarget.style.color = "var(--pd-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--pd-border)";
                        e.currentTarget.style.color = "var(--pd-text-secondary)";
                    }}
                >
                    See Pricing Plans
                </button>
            </div>

            {/* Note */}
            <p style={{ fontSize: 11, color: "var(--pd-text-tertiary)", marginTop: 8 }}>
                ✦ Free plan includes basic view &amp; click counts
            </p>
        </div>
    );
}
