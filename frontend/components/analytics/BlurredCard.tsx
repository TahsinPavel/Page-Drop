"use client";

import ProUpgradeOverlay from "@/components/analytics/ProUpgradeOverlay";

interface BlurredCardProps {
    children: React.ReactNode;
    isPro: boolean;
    featureName: string;
    minHeight?: string;
    onUpgradeClick?: () => void;
}

export default function BlurredCard({
    children,
    isPro,
    featureName,
    minHeight = "300px",
    onUpgradeClick,
}: BlurredCardProps) {
    return (
        <div style={{ position: "relative", minHeight }}>
            {/* Content — always rendered for layout, blurred when locked */}
            <div
                style={{
                    filter: isPro ? "none" : "blur(6px)",
                    transition: "filter 300ms ease",
                    pointerEvents: isPro ? "auto" : "none",
                    userSelect: isPro ? "auto" : "none",
                }}
            >
                {children}
            </div>

            {/* Overlay — only shown when not Pro */}
            {!isPro && <ProUpgradeOverlay featureName={featureName} onUpgradeClick={onUpgradeClick} />}
        </div>
    );
}
