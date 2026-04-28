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
            <div className="bg-white dark:bg-[#1f2020] border border-slate-200 dark:border-[#353534] rounded-2xl p-6">
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
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#908fa0]">
                            Free Plan
                        </span>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-[#e5e2e1] mt-3">
                            Upgrade for advanced analytics
                        </h3>
                        <p className="text-[13px] text-slate-600 dark:text-[#908fa0] mt-1">
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
                            className="px-5 py-2.5 rounded-[10px] border-none bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-[13px] cursor-pointer whitespace-nowrap transition-colors"
                        >
                            Upgrade to Pro — $12/mo
                        </button>
                        <button
                            onClick={() => onUpgradeClick("business")}
                            className="px-5 py-2.5 rounded-[10px] border border-slate-200 dark:border-[#353534] bg-transparent text-slate-700 dark:text-[#908fa0] font-semibold text-[13px] cursor-pointer whitespace-nowrap hover:bg-slate-50 dark:hover:bg-[#252525] transition-colors"
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
        <div className="bg-white dark:bg-[#1f2020] border border-slate-200 dark:border-[#353534] rounded-2xl p-6">
            {/* Top row: badges */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                }}
            >
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-[#818CF8]">
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
                    <p className="text-[11px] text-slate-500 dark:text-[#908fa0] uppercase">
                        Provider
                    </p>
                    <p className="text-sm text-slate-900 dark:text-[#e5e2e1] font-medium mt-0.5 capitalize">
                        {subscription.payment_provider ?? "—"}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500 dark:text-[#908fa0] uppercase">
                        {subscription.status === "cancelled"
                            ? "Access until"
                            : "Renews"}
                    </p>
                    <p className="text-sm text-slate-900 dark:text-[#e5e2e1] font-medium mt-0.5">
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
                    className="mt-4 bg-transparent border-none text-xs text-slate-500 dark:text-[#908fa0] cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                    Cancel subscription
                </button>
            )}

            {/* Cancel confirmation dialog */}
            {showCancelConfirm && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/15">
                    <p className="font-semibold text-slate-900 dark:text-[#e5e2e1] text-sm">
                        Cancel subscription?
                    </p>
                    <p className="text-[13px] text-slate-600 dark:text-[#908fa0] mt-1 leading-relaxed">
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
