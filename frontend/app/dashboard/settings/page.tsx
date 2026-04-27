"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SubscriptionCard from "@/components/payments/SubscriptionCard";
import PaymentMethodModal from "@/components/payments/PaymentMethodModal";

export default function SettingsPage() {
    const [paymentModal, setPaymentModal] = useState<{
        open: boolean;
        plan: "pro" | "business";
    }>({ open: false, plan: "pro" });

    return (
        <>
            <DashboardHeader
                breadcrumb="PageDrop"
                pageTitle="Settings"
                showActions={false}
            />

            <div className="db-animate-in" style={{ marginBottom: 28 }}>
                <h1
                    className="text-slate-900 dark:text-[#e5e2e1]"
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        fontFamily: "var(--font-syne), sans-serif",
                    }}
                >
                    Settings
                </h1>
                <p className="text-slate-600 dark:text-[#908fa0]" style={{ fontSize: 14, marginTop: 4 }}>
                    Manage your account and subscription
                </p>
            </div>

            {/* Subscription Section */}
            <div className="db-section-card db-animate-in db-animate-delay-2">
                <div className="db-section-title">Subscription</div>
                <SubscriptionCard
                    onUpgradeClick={(plan) =>
                        setPaymentModal({ open: true, plan })
                    }
                />
            </div>

            <PaymentMethodModal
                isOpen={paymentModal.open}
                onClose={() =>
                    setPaymentModal((prev) => ({ ...prev, open: false }))
                }
                plan={paymentModal.plan}
            />
        </>
    );
}
