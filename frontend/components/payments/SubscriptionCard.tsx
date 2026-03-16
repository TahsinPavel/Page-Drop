"use client";

import { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import toast from "react-hot-toast";
import { getMySubscription, cancelSubscription } from "@/lib/api";
import type { SubscriptionStatus } from "@/types";

interface SubscriptionCardProps {
    onUpgradeClick: (plan: "pro" | "business") => void;
}

export default function SubscriptionCard({
    onUpgradeClick,
}: SubscriptionCardProps) {
    const [subscription, setSubscription] =
        useState<SubscriptionStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        getMySubscription()
            .then(setSubscription)
            .catch(() => setSubscription(null))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async () => {
        setCancelling(true);
        try {
            const result = await cancelSubscription();
            if (result.success) {
                toast.success(
                    "Subscription cancelled. Access continues until period end."
                );
                setShowCancelConfirm(false);
                const updated = await getMySubscription();
                setSubscription(updated);
            }
        } catch {
            toast.error("Failed to cancel. Please try again.");
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (iso: string | null) => {
        if (!iso) return "—";
        return new Date(iso).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    /* Loading skeleton */
    if (loading) {
        return (
            <div
                style={{
                    height: 160,
                    background: "var(--pd-bg-secondary)",
                    border: "1px solid var(--pd-border)",
                    borderRadius: 16,
                    animation: "pulse 2s infinite",
                }}
            />
        );
    }

    const isFree = !subscription || subscription.plan === "free";

    /* ── FREE PLAN ── */
    if (isFree) {
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
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                padding: "4px 10px",
                                borderRadius: 9999,
                                background: "rgba(255,255,255,0.06)",
                                color: "var(--pd-text-tertiary)",
                            }}
                        >
                            Free Plan
                        </span>
                        <h3
                            style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: "var(--pd-text-primary)",
                                marginTop: 12,
                            }}
                        >
                            Upgrade for advanced analytics
                        </h3>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--pd-text-secondary)",
                                marginTop: 4,
                            }}
                        >
                            Unlock traffic charts, referrer data, and more
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        <button
                            onClick={() => onUpgradeClick("pro")}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 10,
                                border: "none",
                                background: "var(--pd-accent-primary)",
                                color: "white",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Upgrade to Pro — $12/mo
                        </button>
                        <button
                            onClick={() => onUpgradeClick("business")}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 10,
                                border: "1px solid var(--pd-border-accent)",
                                background: "transparent",
                                color: "var(--pd-text-secondary)",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Upgrade to Business — $29/mo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── PRO / BUSINESS PLAN ── */
    const statusColors: Record<string, { bg: string; color: string }> = {
        active: { bg: "rgba(16,185,129,0.1)", color: "#10B981" },
        cancelled: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B" },
        expired: { bg: "rgba(239,68,68,0.1)", color: "#EF4444" },
    };
    const sc =
        statusColors[subscription.status] ?? statusColors.active;

    return (
        <div
            style={{
                background: "var(--pd-bg-secondary)",
                border: "1px solid var(--pd-border)",
                borderRadius: 16,
                padding: 24,
            }}
        >
            {/* Top row: badges */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                }}
            >
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "4px 12px",
                        borderRadius: 9999,
                        background: "rgba(99,102,241,0.12)",
                        color: "#818CF8",
                    }}
                >
                    <Crown size={12} />
                    {subscription.plan.toUpperCase()} PLAN
                </span>
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 9999,
                        background: sc.bg,
                        color: sc.color,
                        textTransform: "capitalize",
                    }}
                >
                    {subscription.status}
                </span>
            </div>

            {/* Details grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginTop: 16,
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: 11,
                            color: "var(--pd-text-tertiary)",
                            textTransform: "uppercase",
                        }}
                    >
                        Provider
                    </p>
                    <p
                        style={{
                            fontSize: 14,
                            color: "var(--pd-text-primary)",
                            fontWeight: 500,
                            marginTop: 2,
                            textTransform: "capitalize",
                        }}
                    >
                        {subscription.payment_provider ?? "—"}
                    </p>
                </div>
                <div>
                    <p
                        style={{
                            fontSize: 11,
                            color: "var(--pd-text-tertiary)",
                            textTransform: "uppercase",
                        }}
                    >
                        {subscription.status === "cancelled"
                            ? "Access until"
                            : "Renews"}
                    </p>
                    <p
                        style={{
                            fontSize: 14,
                            color: "var(--pd-text-primary)",
                            fontWeight: 500,
                            marginTop: 2,
                        }}
                    >
                        {formatDate(subscription.current_period_end)}
                    </p>
                </div>
            </div>

            {/* Cancelled info box */}
            {subscription.status === "cancelled" && (
                <div
                    style={{
                        marginTop: 16,
                        padding: 12,
                        borderRadius: 10,
                        background: "rgba(245,158,11,0.08)",
                        border: "1px solid rgba(245,158,11,0.2)",
                    }}
                >
                    <p style={{ fontSize: 13, color: "#FBBF24" }}>
                        Your plan is cancelled. Access continues until{" "}
                        {formatDate(subscription.current_period_end)}.
                    </p>
                </div>
            )}

            {/* Cancel link */}
            {subscription.status === "active" && !showCancelConfirm && (
                <button
                    onClick={() => setShowCancelConfirm(true)}
                    style={{
                        marginTop: 16,
                        background: "none",
                        border: "none",
                        fontSize: 12,
                        color: "var(--pd-text-tertiary)",
                        cursor: "pointer",
                        transition: "color 200ms",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#EF4444";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color =
                            "var(--pd-text-tertiary)";
                    }}
                >
                    Cancel subscription
                </button>
            )}

            {/* Cancel confirmation dialog */}
            {showCancelConfirm && (
                <div
                    style={{
                        marginTop: 16,
                        padding: 16,
                        borderRadius: 12,
                        background: "rgba(239,68,68,0.05)",
                        border: "1px solid rgba(239,68,68,0.15)",
                    }}
                >
                    <p
                        style={{
                            fontWeight: 600,
                            color: "var(--pd-text-primary)",
                            fontSize: 14,
                        }}
                    >
                        Cancel subscription?
                    </p>
                    <p
                        style={{
                            fontSize: 13,
                            color: "var(--pd-text-secondary)",
                            marginTop: 4,
                            lineHeight: 1.5,
                        }}
                    >
                        You&apos;ll keep access until{" "}
                        {formatDate(subscription.current_period_end)}. You
                        must also cancel your payment on Gumroad or
                        NOWPayments.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            marginTop: 12,
                        }}
                    >
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 8,
                                border: "none",
                                background: "#EF4444",
                                color: "white",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: cancelling ? "wait" : "pointer",
                                opacity: cancelling ? 0.7 : 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            {cancelling ? (
                                <>
                                    <span
                                        style={{
                                            width: 14,
                                            height: 14,
                                            border: "2px solid rgba(255,255,255,0.3)",
                                            borderTop: "2px solid white",
                                            borderRadius: "50%",
                                            animation: "spin 1s linear infinite",
                                            display: "inline-block",
                                        }}
                                    />
                                    Cancelling…
                                </>
                            ) : (
                                "Yes, Cancel"
                            )}
                        </button>
                        <button
                            onClick={() => setShowCancelConfirm(false)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 8,
                                border: "1px solid var(--pd-border)",
                                background: "transparent",
                                color: "var(--pd-text-secondary)",
                                fontSize: 13,
                                cursor: "pointer",
                            }}
                        >
                            Never mind
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
