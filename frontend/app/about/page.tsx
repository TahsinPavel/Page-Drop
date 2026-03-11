"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Zap, Users, Clock } from "lucide-react";

function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
            { threshold: 0.1 }
        );
        el.querySelectorAll(".pd-reveal").forEach((child) => obs.observe(child));
        return () => obs.disconnect();
    }, []);
    return ref;
}

export default function AboutPage() {
    const containerRef = useScrollReveal();

    return (
        <div
            ref={containerRef}
            style={{ background: "var(--pd-bg-primary)", color: "var(--pd-text-primary)" }}
        >
            <Navbar />

            {/* Hero */}
            <section className="px-4 pt-32 pb-16 text-center">
                <div className="mx-auto max-w-[680px]">
                    <h1
                        className="pd-fade-up pd-fade-up-d1 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
                        style={{ fontFamily: "var(--font-syne), sans-serif" }}
                    >
                        We&apos;re building the simplest website tool for businesses that run on{" "}
                        <span className="pd-gradient-text">WhatsApp</span>
                    </h1>
                </div>
            </section>

            {/* Story */}
            <section className="px-4 pb-20">
                <div className="pd-reveal mx-auto max-w-[640px] space-y-5 text-base leading-[1.8]" style={{ color: "var(--pd-text-secondary)" }}>
                    <p>
                        Millions of small shops, restaurants, and service businesses across
                        Bangladesh and South Asia run their entire business through WhatsApp.
                        They take orders, share photos, answer questions — all on their phone.
                        But when a customer asks &quot;do you have a website?&quot;, the answer is
                        always no.
                    </p>
                    <p>
                        PageDrop exists to change that. We believe every business deserves a
                        professional online presence — not just the ones that can afford a
                        developer.
                    </p>
                </div>
            </section>

            {/* Mission card */}
            <section className="px-4 pb-20">
                <div
                    className="pd-reveal mx-auto max-w-[640px] rounded-2xl border p-8 sm:p-10 text-center"
                    style={{
                        background: "var(--pd-bg-secondary)",
                        borderColor: "var(--pd-border-accent)",
                    }}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6366F1]">
                        OUR MISSION
                    </p>
                    <p
                        className="mt-4 text-xl font-bold leading-relaxed sm:text-2xl"
                        style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
                    >
                        Give every WhatsApp business a website in under 60 seconds, for free.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section
                className="px-4 py-20"
                style={{ background: "var(--pd-bg-secondary)" }}
            >
                <div className="mx-auto max-w-[1000px]">
                    <p className="pd-reveal text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#6366F1]">
                        OUR VALUES
                    </p>
                    <div className="mt-10 grid gap-6 sm:grid-cols-3">
                        {[
                            {
                                icon: Zap,
                                title: "Simplicity",
                                desc: "No dashboards, no jargon, no 50-step forms. If it's not simple enough for everyone, it's not simple enough.",
                                iconBg: "bg-[#6366F1]/15",
                                iconColor: "text-[#6366F1]",
                            },
                            {
                                icon: Users,
                                title: "Accessibility",
                                desc: "Built for the non-technical. Every design choice we make prioritizes the shop owner, not the developer.",
                                iconBg: "bg-[#10B981]/15",
                                iconColor: "text-[#10B981]",
                            },
                            {
                                icon: Clock,
                                title: "Speed",
                                desc: "If it takes more than 60 seconds, we've failed. Speed is a feature, and we obsess over it.",
                                iconBg: "bg-[#8B5CF6]/15",
                                iconColor: "text-[#8B5CF6]",
                            },
                        ].map((v) => (
                            <div
                                key={v.title}
                                className="pd-reveal pd-card-hover rounded-2xl border p-8"
                                style={{
                                    background: "var(--pd-bg-elevated)",
                                    borderColor: "var(--pd-border)",
                                }}
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${v.iconBg}`}>
                                    <v.icon className={`h-6 w-6 ${v.iconColor}`} />
                                </div>
                                <h3 className="mt-5 text-lg font-semibold" style={{ color: "var(--pd-text-primary)" }}>
                                    {v.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--pd-text-secondary)" }}>
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founder note */}
            <section className="px-4 py-20">
                <div
                    className="pd-reveal mx-auto max-w-[640px] rounded-2xl border p-8 sm:p-10"
                    style={{
                        background: "var(--pd-gradient-card)",
                        borderColor: "var(--pd-border)",
                    }}
                >
                    <p className="text-sm leading-[1.8]" style={{ color: "var(--pd-text-secondary)" }}>
                        &quot;Built by a developer who believes technology should work for
                        everyone, not just the privileged few. Every small business owner
                        deserves the tools that big companies take for granted.&quot;
                    </p>
                    <p className="mt-4 text-xs font-semibold" style={{ color: "var(--pd-text-tertiary)" }}>
                        — Founder, PageDrop
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 pb-20 text-center">
                <div className="pd-reveal">
                    <Link
                        href="/signup"
                        className="group inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-[1.02] pd-glow-button"
                        style={{ background: "var(--pd-gradient-hero)" }}
                    >
                        Create your free page today
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
