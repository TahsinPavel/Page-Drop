"use client";

import { Crown } from "lucide-react";

interface UpgradeButtonProps {
    plan: "pro" | "business";
    size?: "sm" | "md" | "lg";
    variant?: "filled" | "ghost" | "gradient";
    label?: string;
    onClick: () => void;
}

const SIZE_STYLES: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 14px", fontSize: 12, borderRadius: 8 },
    md: { padding: "10px 20px", fontSize: 14, borderRadius: 10 },
    lg: { padding: "14px 28px", fontSize: 15, borderRadius: 12 },
};

export default function UpgradeButton({
    plan,
    size = "md",
    variant = "filled",
    label,
    onClick,
}: UpgradeButtonProps) {
    const displayLabel =
        label ??
        `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;

    const base: React.CSSProperties = {
        ...SIZE_STYLES[size],
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "all 150ms ease",
        border: "none",
    };

    const variants: Record<string, React.CSSProperties> = {
        filled: {
            ...base,
            background: "var(--pd-accent-primary)",
            color: "white",
        },
        ghost: {
            ...base,
            background: "transparent",
            border: "1px solid var(--pd-border-accent)",
            color: "var(--pd-text-secondary)",
        },
        gradient: {
            ...base,
            background:
                "var(--pd-gradient-hero, linear-gradient(135deg,#6366F1,#10B981))",
            color: "white",
        },
    };

    return (
        <button onClick={onClick} style={variants[variant]}>
            <Crown size={size === "sm" ? 12 : size === "lg" ? 16 : 14} />
            {displayLabel}
        </button>
    );
}
