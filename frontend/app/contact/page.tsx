"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MessageCircle, Mail, Bug } from "lucide-react";

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

export default function ContactPage() {
    const containerRef = useScrollReveal();

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
                    Get in touch
                </h1>
                <p
                    className="pd-fade-up pd-fade-up-d2 mx-auto mt-4 max-w-md text-base"
                    style={{ color: "var(--pd-text-secondary)" }}
                >
                    Have a question or feedback? We&apos;d love to hear from you.
                </p>
            </section>

            {/* Contact cards */}
            <section className="px-4 pb-20">
                <div className="mx-auto grid max-w-[700px] gap-6">
                    {/* WhatsApp card */}
                    <div
                        className="pd-reveal rounded-2xl border p-8 text-center"
                        style={{
                            background: "var(--pd-bg-secondary)",
                            borderColor: "var(--pd-border)",
                        }}
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#10B981]/15">
                            <MessageCircle className="h-7 w-7 text-[#10B981]" />
                        </div>
                        <h2
                            className="mt-5 text-xl font-bold"
                            style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
                        >
                            Chat with us on WhatsApp
                        </h2>
                        <p className="mt-2 text-sm" style={{ color: "var(--pd-text-secondary)" }}>
                            The fastest way to reach us. We usually respond within 24 hours.
                        </p>
                        <a
                            href="https://wa.me/8801700000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-8 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.914.914l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                    </div>

                    {/* Email card */}
                    <div
                        className="pd-reveal rounded-2xl border p-8"
                        style={{
                            background: "var(--pd-bg-secondary)",
                            borderColor: "var(--pd-border)",
                        }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6366F1]/15">
                                <Mail className="h-6 w-6 text-[#6366F1]" />
                            </div>
                            <div>
                                <h3
                                    className="text-base font-bold"
                                    style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
                                >
                                    Email us
                                </h3>
                                <p className="mt-1 text-sm" style={{ color: "var(--pd-text-secondary)" }}>
                                    hello@pagedrop.app
                                </p>
                                <p className="mt-1 text-xs" style={{ color: "var(--pd-text-tertiary)" }}>
                                    We usually respond within 24 hours
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bug / Feature Request card */}
                    <div
                        className="pd-reveal rounded-2xl border p-8"
                        style={{
                            background: "var(--pd-bg-secondary)",
                            borderColor: "var(--pd-border)",
                        }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/15">
                                <Bug className="h-6 w-6 text-[#8B5CF6]" />
                            </div>
                            <div>
                                <h3
                                    className="text-base font-bold"
                                    style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
                                >
                                    Found a bug or have a feature request?
                                </h3>
                                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--pd-text-secondary)" }}>
                                    We&apos;re a small team and we read every message. Drop us a message
                                    on WhatsApp or email and we&apos;ll get back to you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
