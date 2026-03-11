"use client";

import { useState } from "react";
import SubscriptionCard from "@/components/payments/SubscriptionCard";
import PaymentMethodModal from "@/components/payments/PaymentMethodModal";

export default function SettingsPage() {
    const [paymentModal, setPaymentModal] = useState<{
        open: boolean;
        plan: "pro" | "business";
    }>({ open: false, plan: "pro" });

    return (
        <div style={{ padding: "32px 16px", maxWidth: 800, margin: "0 auto" }}>
            <h1
                style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--pd-text-primary)",
                    fontFamily: "var(--font-syne), sans-serif",
                    marginBottom: 8,
                }}
            >
                Settings
            </h1>
            <p
                style={{
                    color: "var(--pd-text-secondary)",
                    fontSize: 14,
                    marginBottom: 32,
                }}
            >
                Manage your account and subscription
            </p>

            {/* Subscription Section */}
            <section style={{ marginBottom: 32 }}>
                <h2
                    style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--pd-text-primary)",
                        marginBottom: 16,
                    }}
                >
                    Subscription
                </h2>
                <SubscriptionCard
                    onUpgradeClick={(plan) =>
                        setPaymentModal({ open: true, plan })
                    }
                />
            </section>

            <PaymentMethodModal
                isOpen={paymentModal.open}
                onClose={() =>
                    setPaymentModal((prev) => ({ ...prev, open: false }))
                }
                plan={paymentModal.plan}
            />
        </div>
    );
}
