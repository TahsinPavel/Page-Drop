"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMyPages } from "@/hooks/usePages";
import { getDashboardSummary } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageCard from "@/components/dashboard/PageCard";
import StatsCard from "@/components/dashboard/StatsCard";
import AnalyticsSummaryBar from "@/components/analytics/AnalyticsSummaryBar";
import PaymentMethodModal from "@/components/payments/PaymentMethodModal";
import { PlusCircle, Eye, MousePointerClick, FileText, Inbox, Crown } from "lucide-react";
import type { DashboardSummary } from "@/types";

export default function DashboardPage() {
    const { user } = useAuth(true);
    const { data: pages, isLoading } = useMyPages();

    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [paymentOpen, setPaymentOpen] = useState(false);

    useEffect(() => {
        getDashboardSummary()
            .then(setSummary)
            .catch(() => { })
            .finally(() => setSummaryLoading(false));
    }, []);

    useEffect(() => {
        const payment = new URLSearchParams(window.location.search).get('payment');
        if (payment === 'success') {
            toast.success('Your Pro plan is now active! 🎉', { duration: 6000 });
            window.history.replaceState({}, '', '/dashboard');
        }
    }, []);

    const totalViews = pages?.reduce((s, p) => s + p.page_views, 0) ?? 0;
    const totalClicks = pages?.reduce((s, p) => s + p.whatsapp_clicks, 0) ?? 0;
    const totalPages = pages?.length ?? 0;

    const bestPageId = pages?.find(
        (p) => p.slug === summary?.best_performing_page?.slug
    )?.id;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome{user?.full_name ? `, ${user.full_name}` : ""} 👋
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your landing pages and track performance.
                    </p>
                </div>
                {!isLoading && totalPages >= 1 ? (
                    <div className="text-right">
                        <Button className="gap-2" disabled>
                            <PlusCircle className="h-4 w-4" />
                            Create New Page
                        </Button>
                        <button
                            onClick={() => setPaymentOpen(true)}
                            className="mt-1 flex items-center gap-1 text-xs text-[#818CF8] hover:underline ml-auto"
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                        >
                            <Crown className="h-3 w-3" />
                            Upgrade to create more pages
                        </button>
                    </div>
                ) : (
                    <Link href="/dashboard/create">
                        <Button className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white">
                            <PlusCircle className="h-4 w-4" />
                            Create New Page
                        </Button>
                    </Link>
                )}
            </div>

            {/* Analytics Summary Bar */}
            <AnalyticsSummaryBar
                summary={summary}
                loading={summaryLoading}
                pageId={bestPageId}
            />

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <StatsCard title="Total Pages" value={totalPages} icon={FileText} />
                <StatsCard title="Total Views" value={totalViews} icon={Eye} />
                <StatsCard title="WhatsApp Clicks" value={totalClicks} icon={MousePointerClick} />
            </div>

            {/* Pages grid */}
            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            ) : pages && pages.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pages.map((page) => (
                        <PageCard key={page.id} page={page} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed py-16 text-center">
                    <Inbox className="h-12 w-12 text-muted-foreground/40" />
                    <div>
                        <h3 className="font-semibold text-gray-900">No pages yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Create your first landing page and go live in seconds.
                        </p>
                    </div>
                    <Link href="/dashboard/create">
                        <Button className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white">
                            <PlusCircle className="h-4 w-4" />
                            Create Your First Page
                        </Button>
                    </Link>
                </div>
            )}

            {/* Payment Modal */}
            <PaymentMethodModal
                isOpen={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                plan="pro"
            />
        </div>
    );
}
