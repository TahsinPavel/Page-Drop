"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PaymentMethodModal from "@/components/payments/PaymentMethodModal";
import { Check, ArrowRight, ChevronDown } from "lucide-react";

/* ── Scroll Reveal ── */
function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add("visible");
                }),
            { threshold: 0.1 }
        );
        el.querySelectorAll(".pd-reveal").forEach((child) => obs.observe(child));
        return () => obs.disconnect();
    }, []);
    return ref;
}

const PLANS = [
    {
        name: "Free" as const,
        badge: "Current Plan",
        price: "$0",
        period: "/month",
        features: [
            "1 business page",
            "AI-generated content",
            "WhatsApp button",
            "Basic analytics",
            "Mobile-optimized",
        ],
        cta: "Get Started Free",
        ctaLink: "/signup",
        highlight: false,
    },
    {
        name: "Pro" as const,
        badge: "Popular",
        price: "$12",
        period: "/month",
        features: [
            "5 business pages",
            "Custom domain",
            "Advanced analytics",
            "Priority support",
            "QR code generator",
        ],
        cta: "Upgrade to Pro — $12/mo",
        ctaLink: "#",
        highlight: true,
    },
    {
        name: "Business" as const,
        badge: "Best Value",
        price: "$29",
        period: "/month",
        features: [
            "Unlimited pages",
            "White-label branding",
            "Team access",
            "API access",
            "Dedicated support",
        ],
        cta: "Upgrade to Business — $29/mo",
        ctaLink: "#",
        highlight: false,
    },
];

const FAQS = [
    {
        q: "Do I need a credit card to sign up?",
        a: "No, never. PageDrop is completely free to get started and we will never ask for payment information to create your first page.",
    },
    {
        q: "How long does it take to create a page?",
        a: "Under 60 seconds. Just fill in your business details, choose a theme, and our AI does the rest. Your page goes live instantly.",
    },
    {
        q: "Can I edit my page after creating it?",
        a: "Yes, anytime. You can update your business information, products, theme, and even regenerate the AI-written content whenever you want.",
    },
    {
        q: "What happens when paid plans launch?",
        a: "Free users keep everything in the free tier forever. Paid plans will only add extra features like custom domains, more pages, and advanced analytics.",
    },
    {
        q: "What is PageDrop?",
        a: "PageDrop is a tool that lets small WhatsApp-based businesses create a professional landing page in seconds. You fill a simple form, AI writes your marketing copy, and you get a beautiful live page with a WhatsApp contact button.",
    },
];

export default function PricingPage() {
    const containerRef = useScrollReveal();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [paymentModal, setPaymentModal] = useState<{
        open: boolean;
        plan: "pro" | "business";
    }>({ open: false, plan: "pro" });

    return (
        <div
            ref={containerRef}
            style={{ background: "var(--pd-bg-primary)", color: "var(--pd-text-primary)" }}
        >
            <Navbar />

            {/* Hero */}
            <section className="px-4 pt-32 pb-16 text-center">
                <h1
                    className="pd-fade-up pd-fade-up-d1 text-4xl font-extrabold sm:text-5xl"
                    style={{ fontFamily: "var(--font-syne), sans-serif" }}
                >
                    Simple, honest pricing
                </h1>
                <p
                    className="pd-fade-up pd-fade-up-d2 mx-auto mt-4 max-w-md text-base"
                    style={{ color: "var(--pd-text-secondary)" }}
                >
                    Start free. Upgrade anytime with card or crypto.
                </p>
            </section>

            {/* Pricing cards */}
            <section className="px-4 pb-20">
                <div className="mx-auto grid max-w-[1000px] gap-6 sm:grid-cols-3">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`pd-reveal pd-card-hover rounded-2xl border p-8 ${plan.highlight ? "relative" : ""
                                }`}
                            style={{
                                background: "var(--pd-bg-secondary)",
                                borderColor: plan.highlight ? "var(--pd-border-accent)" : "var(--pd-border)",
                                boxShadow: plan.highlight
                                    ? "0 0 40px rgba(99,102,241,0.12)"
                                    : undefined,
                            }}
                        >
                            {/* Badge */}
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${plan.highlight
                                        ? "bg-[#6366F1]/15 text-[#818CF8]"
                                        : "bg-white/5 text-[var(--pd-text-tertiary)]"
                                    }`}
                            >
                                {plan.badge}
                            </span>

                            <h3
                                className="mt-4 text-xl font-bold"
                                style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
                            >
                                {plan.name}
                            </h3>

                            <p className="mt-3">
                                <span
                                    className="text-4xl font-extrabold"
                                    style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
                                >
                                    {plan.price}
                                </span>
                                <span className="text-sm" style={{ color: "var(--pd-text-tertiary)" }}>
                                    {plan.period}
                                </span>
                            </p>

                            <ul className="mt-6 space-y-2.5">
                                {plan.features.map((f) => (
                                    <li
                                        key={f}
                                        className="flex items-center gap-2.5 text-sm"
                                        style={{ color: "var(--pd-text-secondary)" }}
                                    >
                                        <Check className="h-4 w-4 shrink-0 text-[#10B981]" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {plan.name === "Free" ? (
                                <Link
                                    href={plan.ctaLink}
                                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                                    style={{ background: "var(--pd-gradient-hero)" }}
                                >
                                    {plan.cta}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <div className="mt-8">
                                    <button
                                        onClick={() =>
                                            setPaymentModal({
                                                open: true,
                                                plan: plan.name.toLowerCase() as "pro" | "business",
                                            })
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                                        style={{
                                            background: plan.highlight
                                                ? "var(--pd-gradient-hero)"
                                                : "var(--pd-accent-primary)",
                                        }}
                                    >
                                        {plan.cta}
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section
                className="px-4 py-20"
                style={{ background: "var(--pd-bg-secondary)" }}
            >
                <div className="mx-auto max-w-[680px]">
                    <h2
                        className="pd-reveal text-center text-3xl font-bold"
                        style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
                    >
                        Frequently asked questions
                    </h2>

                    <div className="mt-10 space-y-3">
                        {FAQS.map((faq, i) => (
                            <div
                                key={i}
                                className="pd-reveal rounded-xl border"
                                style={{
                                    borderColor: openFaq === i ? "var(--pd-border-accent)" : "var(--pd-border)",
                                    background: "var(--pd-bg-elevated)",
                                }}
                            >
                                <button
                                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold"
                                    style={{ color: "var(--pd-text-primary)" }}
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    {faq.q}
                                    <ChevronDown
                                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""
                                            }`}
                                        style={{ color: "var(--pd-text-tertiary)" }}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-200 ${openFaq === i ? "max-h-40 pb-5" : "max-h-0"
                                        }`}
                                >
                                    <p className="px-5 text-sm leading-relaxed" style={{ color: "var(--pd-text-secondary)" }}>
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />

            {/* Payment Modal */}
            <PaymentMethodModal
                isOpen={paymentModal.open}
                onClose={() => setPaymentModal((prev) => ({ ...prev, open: false }))}
                plan={paymentModal.plan}
            />
        </div>
    );
}
