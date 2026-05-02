"use client";

import { useState, useEffect } from "react";
import { Crown, Check, Loader2 } from "lucide-react";
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
            <div className="h-40 w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl animate-pulse" />
        );
    }

    const isFree = !subscription || subscription.plan === "free";

    /* ── FREE PLAN ── */
    if (isFree) {
        return (
            <div className="bg-white dark:bg-[#12121A] border border-slate-300 dark:border-white/10 rounded-2xl p-6 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-200 dark:bg-[#25D366]/10 text-slate-700 dark:text-[#25D366]">
                            Free Plan
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
                            Upgrade for advanced analytics
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-white/80 mt-2 leading-relaxed">
                            Unlock traffic charts, referrer data, and custom branding for your pages.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => onUpgradeClick("pro")}
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                        >
                            Upgrade to Pro — $12/mo
                        </button>
                        <button
                            onClick={() => onUpgradeClick("business")}
                            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-[#353534] bg-transparent text-slate-700 dark:text-white/80 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                        >
                            Upgrade to Business — $29/mo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── PRO / BUSINESS PLAN ── */
    const statusColors: Record<string, string> = {
        active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        cancelled: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        expired: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    };
    const sc = statusColors[subscription.status] ?? statusColors.active;

    return (
        <div className="bg-white dark:bg-[#12121A] border border-slate-300 dark:border-white/10 rounded-2xl p-6 shadow-md">
            {/* Top row: badges */}
            <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-[#818CF8] border border-indigo-100 dark:border-indigo-500/20">
                    <Crown size={12} />
                    {subscription.plan.toUpperCase()} PLAN
                </span>
                <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${sc} capitalize`}>
                    {subscription.status}
                </span>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                    <p className="text-[10px] text-slate-500 dark:text-white/60 font-bold uppercase tracking-widest">
                        Payment Provider
                    </p>
                    <p className="text-sm text-slate-900 dark:text-white font-bold mt-1 capitalize">
                        {subscription.payment_provider ?? "—"}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                    <p className="text-[10px] text-slate-500 dark:text-white/60 font-bold uppercase tracking-widest">
                        {subscription.status === "cancelled" ? "Access until" : "Next Billing Date"}
                    </p>
                    <p className="text-sm text-slate-900 dark:text-[#e5e2e1] font-bold mt-1">
                        {formatDate(subscription.current_period_end)}
                    </p>
                </div>
            </div>

            {/* Cancelled info box */}
            {subscription.status === "cancelled" && (
                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                        Your plan is cancelled. Access continues until {formatDate(subscription.current_period_end)}.
                    </p>
                </div>
            )}

            {/* Cancel link */}
            {subscription.status === "active" && !showCancelConfirm && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 dark:text-white/30 dark:hover:text-red-400 transition-colors"
                    >
                        Cancel subscription
                    </button>
                </div>
            )}

            {/* Cancel confirmation dialog */}
            {showCancelConfirm && (
                <div className="mt-6 p-5 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/15">
                    <p className="font-bold text-red-900 dark:text-red-400 text-sm">
                        Are you sure you want to cancel?
                    </p>
                    <p className="text-[13px] text-red-700/70 dark:text-red-400/60 mt-1 leading-relaxed">
                        You&apos;ll keep all premium features until {formatDate(subscription.current_period_end)}. 
                        Remember to also cancel the recurring payment on {subscription.payment_provider || 'the payment provider'}.
                    </p>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all disabled:opacity-50"
                        >
                            {cancelling ? <Loader2 size={14} className="animate-spin" /> : "Yes, Cancel"}
                        </button>
                        <button
                            onClick={() => setShowCancelConfirm(false)}
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white/60 font-bold text-xs hover:bg-slate-50 dark:hover:bg-white/10"
                        >
                            Never mind
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
