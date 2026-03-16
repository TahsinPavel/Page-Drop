"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Sparkles,
  ClipboardList,
  Share2,
  ArrowRight,
  MessageCircle,
  MapPin,
  Store,
  Check,
} from "lucide-react";

/* ── Scroll reveal hook ── */
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

export default function HomePage() {
  const containerRef = useScrollReveal();
  const [previewTheme, setPreviewTheme] = useState<"default" | "dark">("default");

  return (
    <div
      ref={containerRef}
      style={{ background: "var(--pd-bg-primary)", color: "var(--pd-text-primary)" }}
    >
      <Navbar />

      {/* ═══════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
        {/* Animated gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="pd-blob-1 absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-40 blur-[120px]"
            style={{ background: "rgba(99,102,241,0.35)" }}
          />
          <div
            className="pd-blob-2 absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full opacity-30 blur-[100px]"
            style={{ background: "rgba(16,185,129,0.3)" }}
          />
          <div
            className="pd-blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full opacity-25 blur-[110px]"
            style={{ background: "rgba(139,92,246,0.35)" }}
          />
        </div>

        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 pd-grid-overlay" />

        <div className="relative z-10 mx-auto max-w-[760px] text-center">
          {/* Badge */}
          <div className="pd-fade-up pd-fade-up-d1 mb-6 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5 text-xs font-medium text-[#818CF8]">
            ✦ AI-Powered · Free to Start
          </div>

          {/* Headline */}
          <h1
            className="pd-fade-up pd-fade-up-d2 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-[60px] lg:leading-[1.1]"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            Your WhatsApp Business
            <br />
            <span className="pd-gradient-text">Deserves a Real Website</span>
          </h1>

          {/* Subheadline */}
          <p
            className="pd-fade-up pd-fade-up-d3 mx-auto mt-5 max-w-[520px] text-base leading-[1.7] sm:text-lg"
            style={{ color: "var(--pd-text-secondary)" }}
          >
            Fill a simple form. AI writes your content. Get a live page in 60
            seconds — no code, no designer, no monthly agency fees.
          </p>

          {/* CTA buttons */}
          <div className="pd-fade-up pd-fade-up-d4 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-[10px] px-7 py-3.5 text-sm font-bold text-white transition-transform duration-200 hover:scale-[1.02] pd-glow-button"
              style={{ background: "var(--pd-gradient-hero)" }}
            >
              Create Your Free Page
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#example"
              className="flex items-center gap-2 rounded-[10px] border px-7 py-3.5 text-sm font-medium transition-colors duration-200"
              style={{
                borderColor: "var(--pd-border-accent)",
                color: "var(--pd-text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6366F1";
                e.currentTarget.style.color = "var(--pd-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--pd-border-accent)";
                e.currentTarget.style.color = "var(--pd-text-secondary)";
              }}
            >
              See Live Example
            </a>
          </div>

          {/* Social proof */}
          <p
            className="pd-fade-up pd-fade-up-d5 mt-5 text-xs"
            style={{ color: "var(--pd-text-tertiary)" }}
          >
            🟢 127 businesses already have their page
          </p>

          {/* Floating mockup card */}
          <div className="pd-fade-up pd-fade-up-d5 mt-12 flex justify-center">
            <div
              className="pd-float mx-auto w-full max-w-[480px] rounded-2xl border p-6 text-left"
              style={{
                background: "var(--pd-bg-elevated)",
                borderColor: "var(--pd-border)",
              }}
            >
              {/* Browser chrome */}
              <div className="mb-4 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                <span
                  className="ml-3 flex-1 rounded-md px-3 py-1 text-[10px]"
                  style={{ background: "var(--pd-bg-primary)", color: "var(--pd-text-tertiary)" }}
                >
                  pagedrop.app/nadias-cake-house
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366F1]/10">
                  <Store className="h-6 w-6 text-[#6366F1]" />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--pd-text-primary)" }}>
                    Nadia&apos;s Cake House
                  </p>
                  <p className="text-xs" style={{ color: "var(--pd-text-tertiary)" }}>
                    Custom cakes for every occasion 🎂
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { name: "Birthday Cake", price: "৳1,500" },
                  { name: "Wedding Tier", price: "৳5,000" },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="rounded-lg border p-3"
                    style={{ borderColor: "var(--pd-border)", background: "var(--pd-bg-primary)" }}
                  >
                    <p className="text-xs font-medium" style={{ color: "var(--pd-text-primary)" }}>
                      {p.name}
                    </p>
                    <p className="text-xs font-bold text-[#10B981]">{p.price}</p>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#10B981] py-2.5 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4" />
                Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — TRUST BAR
      ═══════════════════════════════════════════════ */}
      <section id="trust" className="pd-reveal px-4 py-12" style={{ background: "var(--pd-bg-primary)" }}>
        <div className="mx-auto max-w-[800px] text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest" style={{ color: "var(--pd-text-tertiary)" }}>
            Trusted by businesses across
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"].map((city) => (
              <span
                key={city}
                className="rounded-full border px-4 py-1.5 text-xs font-medium"
                style={{ borderColor: "var(--pd-border)", color: "var(--pd-text-secondary)" }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="px-4 py-20 sm:py-24"
        style={{ background: "var(--pd-bg-primary)" }}
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="pd-reveal text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6366F1]">
              PROCESS
            </p>
            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
            >
              From zero to live page in 3 steps
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: ClipboardList,
                iconBg: "bg-[#6366F1]/15",
                iconColor: "text-[#6366F1]",
                title: "Fill Your Details",
                desc: "Enter your business name, products, WhatsApp number, and location. Takes under 2 minutes.",
                badge: null,
              },
              {
                step: "02",
                icon: Sparkles,
                iconBg: "bg-[#8B5CF6]/15",
                iconColor: "text-[#8B5CF6]",
                title: "AI Writes Everything",
                desc: "Our AI generates your headline, about section, and product descriptions — professional copy instantly.",
                badge: "Powered by Gemini AI",
              },
              {
                step: "03",
                icon: Share2,
                iconBg: "bg-[#10B981]/15",
                iconColor: "text-[#10B981]",
                title: "Share Your Link",
                desc: "Get a live link like pagedrop.app/your-business. Share it anywhere, update it anytime.",
                badge: null,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="pd-reveal pd-card-hover relative rounded-2xl border p-8"
                style={{
                  background: "var(--pd-bg-secondary)",
                  borderColor: "var(--pd-border)",
                }}
              >
                <span
                  className="absolute top-6 right-6 text-xs font-mono font-bold"
                  style={{ color: "var(--pd-text-tertiary)" }}
                >
                  {item.step}
                </span>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}>
                  <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                <h3
                  className="mt-5 text-lg font-semibold"
                  style={{ color: "var(--pd-text-primary)" }}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--pd-text-secondary)" }}>
                  {item.desc}
                </p>
                {item.badge && (
                  <span className="mt-3 inline-flex rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-[10px] font-medium text-[#A78BFA]">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — FEATURES
      ═══════════════════════════════════════════════ */}
      <section
        id="features"
        className="px-4 py-20 sm:py-24"
        style={{ background: "var(--pd-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="pd-reveal text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6366F1]">
              FEATURES
            </p>
            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
            >
              Everything a small business needs
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { emoji: "⚡", title: "Instant Setup", desc: "Live in under 60 seconds. No technical skills needed." },
              { emoji: "🤖", title: "AI Copywriting", desc: "Professional marketing content written for you by Gemini AI." },
              { emoji: "📱", title: "Mobile First", desc: "Looks perfect on every phone — because that's where your customers are." },
              { emoji: "💬", title: "WhatsApp Button", desc: "Customers reach you in one tap. Biggest CTA on the page." },
              { emoji: "🎨", title: "4 Beautiful Themes", desc: "Default, Dark, Minimal, Vibrant — pick the one that fits your brand." },
              { emoji: "📊", title: "Basic Analytics", desc: "See page views and WhatsApp clicks. Know what's working." },
            ].map((f, i) => (
              <div
                key={f.title}
                className="pd-reveal pd-card-hover rounded-2xl border p-6"
                style={{
                  background: i % 2 === 0 ? "var(--pd-bg-elevated)" : "var(--pd-bg-primary)",
                  borderColor: "var(--pd-border)",
                }}
              >
                <span className="text-2xl">{f.emoji}</span>
                <h3 className="mt-3 text-base font-semibold" style={{ color: "var(--pd-text-primary)" }}>
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--pd-text-secondary)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — LIVE EXAMPLE
      ═══════════════════════════════════════════════ */}
      <section
        id="example"
        className="px-4 py-20 sm:py-24"
        style={{ background: "var(--pd-bg-primary)" }}
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="pd-reveal text-center">
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
            >
              See what your page will look like
            </h2>
          </div>

          <div className="pd-reveal mt-12 mx-auto max-w-2xl">
            {/* Browser frame */}
            <div
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--pd-border)" }}
            >
              {/* Chrome bar */}
              <div
                className="flex items-center gap-2 border-b px-4 py-2.5"
                style={{
                  background: "var(--pd-bg-elevated)",
                  borderColor: "var(--pd-border)",
                }}
              >
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/60" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/60" />
                  <span className="h-3 w-3 rounded-full bg-green-400/60" />
                </div>
                <div
                  className="flex-1 rounded-md px-3 py-1 text-center text-xs"
                  style={{ background: "var(--pd-bg-primary)", color: "var(--pd-text-tertiary)" }}
                >
                  pagedrop.app/ahmeds-biryani-house
                </div>
              </div>

              {/* Page preview */}
              <div
                className="px-6 py-10 text-center"
                style={{
                  background: previewTheme === "dark" ? "#0f0f23" : "#ffffff",
                  color: previewTheme === "dark" ? "#f8f8f8" : "#111",
                  transition: "all 0.4s ease",
                }}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: previewTheme === "dark" ? "rgba(37,211,102,0.2)" : "rgba(37,211,102,0.1)",
                  }}
                >
                  <Store className="h-8 w-8 text-[#25D366]" />
                </div>
                <h3 className="mt-4 text-2xl font-bold">Ahmed&apos;s Biryani House</h3>
                <p className="mt-2 text-lg font-semibold text-[#25D366]">
                  The Taste of Home, Served Fresh Daily 🍚
                </p>
                <p style={{ color: previewTheme === "dark" ? "#999" : "#666" }} className="mt-1 text-sm">
                  Authentic Dhaka-style biryani made with love and the finest spices.
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-sm" style={{ color: previewTheme === "dark" ? "#666" : "#999" }}>
                  <MapPin className="h-3.5 w-3.5" /> Dhanmondi, Dhaka
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3 text-left">
                  {[
                    { name: "Beef Biryani", price: "৳180" },
                    { name: "Chicken Special", price: "৳220" },
                    { name: "Family Pack", price: "৳650" },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="rounded-xl p-3"
                      style={{
                        border: `1px solid ${previewTheme === "dark" ? "rgba(255,255,255,0.1)" : "#eee"}`,
                        background: previewTheme === "dark" ? "rgba(255,255,255,0.03)" : "#fff",
                      }}
                    >
                      <p className="text-xs font-medium">{p.name}</p>
                      <p className="text-sm font-bold text-[#25D366]">{p.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white">
                    <MessageCircle className="h-4 w-4" /> Order on WhatsApp
                  </span>
                </div>
              </div>
            </div>

            {/* Caption + toggles */}
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-xs" style={{ color: "var(--pd-text-tertiary)" }}>
                ⏱ This page was created in 47 seconds
              </p>
              <div className="flex gap-2">
                <Link
                  href="/signup"
                  className="rounded-lg bg-[#6366F1] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4F46E5]"
                >
                  Create Yours Free
                </Link>
                <button
                  onClick={() => setPreviewTheme(previewTheme === "default" ? "dark" : "default")}
                  className="rounded-lg border px-5 py-2 text-xs font-medium transition-colors"
                  style={{ borderColor: "var(--pd-border)", color: "var(--pd-text-secondary)" }}
                >
                  {previewTheme === "default" ? "Try Dark Theme" : "Try Default Theme"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 — PRICING TEASER
      ═══════════════════════════════════════════════ */}
      <section
        className="px-4 py-20 sm:py-24"
        style={{ background: "var(--pd-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="pd-reveal text-center">
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
            >
              Start free. Always.
            </h2>
          </div>

          <div className="pd-reveal mt-12 mx-auto max-w-[400px]">
            <div
              className="rounded-2xl border p-8 text-center"
              style={{
                background: "var(--pd-bg-elevated)",
                borderColor: "var(--pd-border-accent)",
              }}
            >
              <p className="text-sm font-semibold text-[#6366F1]">Free Forever (for now)</p>
              <p
                className="mt-3 text-5xl font-extrabold"
                style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--pd-text-primary)" }}
              >
                $0
                <span className="text-base font-normal" style={{ color: "var(--pd-text-tertiary)" }}>
                  {" "}/ month
                </span>
              </p>
              <ul className="mt-6 space-y-2.5 text-left">
                {[
                  "1 business page",
                  "AI-generated content",
                  "WhatsApp button",
                  "Basic analytics",
                  "Mobile-optimized",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--pd-text-secondary)" }}>
                    <Check className="h-4 w-4 shrink-0 text-[#10B981]" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs" style={{ color: "var(--pd-text-tertiary)" }}>
                Paid plans coming soon
              </p>
              <Link
                href="/signup"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: "var(--pd-gradient-hero)" }}
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-center text-xs" style={{ color: "var(--pd-text-tertiary)" }}>
              No credit card needed. Ever. (for now)
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7 — CTA BANNER
      ═══════════════════════════════════════════════ */}
      <section className="pd-reveal px-4 py-20 sm:py-24" style={{ background: "var(--pd-gradient-hero)" }}>
        <div className="mx-auto max-w-[680px] text-center">
          <h2
            className="text-3xl font-bold text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            Your customers are searching for you online
          </h2>
          <p className="mt-3 text-base text-white/70">
            Give them a page to find. It takes 2 minutes.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-[10px] bg-white px-8 py-4 text-sm font-bold text-[#4F46E5] shadow-xl transition-transform duration-200 hover:scale-[1.02]"
          >
            Create My Page Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 8 — FOOTER
      ═══════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
}
