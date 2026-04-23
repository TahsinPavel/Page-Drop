"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, ChevronDown, Diamond, Package, RotateCcw, ShieldCheck, Sparkles, Star, Truck, Zap } from "lucide-react";

/* ── Data ───────────────────────────────────────────────────────────── */

const PRODUCTS = [
  { id: 1, name: "Eclipse Runner", hook: "Designed to elevate your everyday style.", price: "$189", badge: "Best Seller", glow: "rgba(52,211,153,0.45)", image: "/demo/sneaker-1.png" },
  { id: 2, name: "Nebula Chronos", hook: "Time, redefined for the modern visionary.", price: "$589", badge: "Limited Edition", glow: "rgba(129,140,248,0.45)", image: "/demo/watch-1.png" },
  { id: 3, name: "Aura Pods", hook: "Sound that surrounds, style that defines.", price: "$349", badge: "Only few left", glow: "rgba(251,191,36,0.42)", image: "/demo/headphones-1.png" },
  { id: 4, name: "Orbit Prime", hook: "A premium statement with refined comfort.", price: "$279", badge: "Trending Now", glow: "rgba(56,189,248,0.42)", image: "/demo/headphones-2.png" },
  { id: 5, name: "Velvet Stride", hook: "Crafted for confident, standout moments.", price: "$219", badge: "New Arrival", glow: "rgba(244,114,182,0.42)", image: "/demo/sneaker-2.png" },
];

const FEATURES = [
  { icon: Diamond, title: "Premium Quality", desc: "Carefully curated materials with luxe finish and comfort-first construction." },
  { icon: Zap, title: "Fast Delivery", desc: "Orders confirmed on WhatsApp and dispatched fast to your doorstep." },
  { icon: ShieldCheck, title: "Cash on Delivery", desc: "Pay when you receive. Zero risk, maximum confidence." },
  { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free returns and exchanges within 7 days of delivery." },
];

const REVIEWS = [
  { name: "Sarah Chen", stars: 5, text: "The product looked exactly like the showcase. Premium quality and fast delivery!" },
  { name: "Marcus Rivera", stars: 5, text: "Ordering via WhatsApp was seamless. Arrived in 2 days. Will buy again." },
  { name: "Aisha Patel", stars: 5, text: "Cash on delivery removed all hesitation. Quality exceeded expectations." },
];

/* ── Helpers ─────────────────────────────────────────────────────────── */

const wrap = (i, n) => ((i % n) + n) % n;

function relPos(index, active, len) {
  let o = index - active;
  if (o > len / 2) o -= len;
  if (o < -len / 2) o += len;
  return o;
}

/* ── WhatsApp SVG ────────────────────────────────────────────────────── */

function WaIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );
}

/* ── 3D Coverflow ────────────────────────────────────────────────────── */

function Coverflow({ products, activeIndex, onChange, onInteract }) {
  const reduced = useReducedMotion();
  const touchX = useRef(0);
  const spring = useMemo(() => reduced ? { duration: 0.2 } : { type: "spring", stiffness: 240, damping: 26, mass: 0.85 }, [reduced]);

  const swipe = useCallback((dx) => {
    if (Math.abs(dx) < 44) return;
    onChange(dx < 0 ? activeIndex + 1 : activeIndex - 1);
    onInteract();
  }, [activeIndex, onChange, onInteract]);

  const active = products[activeIndex];

  return (
    <div className="relative w-full select-none" style={{ perspective: "1800px" }}>
      {/* Ambient glow */}
      <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-[42%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: `radial-gradient(circle, ${active.glow} 0%, transparent 72%)` }}
        animate={reduced ? { opacity: 0.7 } : { opacity: [0.5, 0.85, 0.5], scale: [0.92, 1.1, 0.92] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ground shadow */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 h-6 w-[200px] -translate-x-1/2 rounded-full bg-black/40 blur-xl" />

      {/* Products */}
      <div className="relative mx-auto h-[300px] sm:h-[360px] lg:h-[420px]"
        style={{ transformStyle: "preserve-3d" }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { swipe(e.changedTouches[0].clientX - touchX.current); }}
      >
        {products.map((p, i) => {
          const rel = relPos(i, activeIndex, products.length);
          const abs = Math.abs(rel);
          const isActive = rel === 0;
          const visible = abs <= 2;

          const x = rel * 200;
          const y = isActive ? -10 : abs === 1 ? 6 : 18;
          const sc = isActive ? 1 : abs === 1 ? 0.72 : 0.55;
          const ry = isActive ? 0 : rel < 0 ? 45 : -45;
          const z = isActive ? 140 : abs === 1 ? -30 : -140;
          const op = isActive ? 1 : abs === 1 ? 0.5 : 0.18;
          const br = isActive ? 1 : abs === 1 ? 0.65 : 0.45;
          const bl = isActive ? 0 : abs === 1 ? 1.5 : 3;

          return (
            <motion.button key={p.id} type="button" aria-label={`View ${p.name}`}
              onClick={() => { onChange(i); onInteract(); }}
              className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 border-none bg-transparent p-0 sm:h-[250px] sm:w-[250px] lg:h-[310px] lg:w-[310px]"
              initial={false}
              animate={{ x, y, scale: sc, rotateY: ry, z, opacity: visible ? op : 0, filter: `brightness(${br}) blur(${bl}px)` }}
              transition={spring}
              style={{ transformStyle: "preserve-3d", zIndex: isActive ? 30 : 20 - abs, pointerEvents: visible ? "auto" : "none" }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.14}
              onDragEnd={(_, info) => { swipe(info.offset.x + info.velocity.x * 0.12); }}
            >
              {/* Active floating shadow */}
              {isActive && (
                <motion.div className="pointer-events-none absolute left-1/2 top-[66%] h-6 w-[150px] -translate-x-1/2 rounded-full bg-black/50 blur-lg"
                  animate={reduced ? { opacity: 0.5 } : { opacity: [0.3, 0.65, 0.3] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {/* Float animation for active */}
              <motion.div className="relative h-full w-full"
                animate={isActive && !reduced ? { y: [0, -10, 0] } : { y: 0 }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={p.image} alt={p.name} loading="lazy" draggable={false}
                  className="h-full w-full object-contain"
                  style={{ filter: isActive ? "drop-shadow(0 28px 48px rgba(0,0,0,0.6))" : "drop-shadow(0 14px 28px rgba(0,0,0,0.4))" }}
                />
              </motion.div>
            </motion.button>
          );
        })}

        {/* Arrow buttons (desktop) */}
        <button type="button" aria-label="Previous"
          onClick={() => { onChange(activeIndex - 1); onInteract(); }}
          className="absolute left-0 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white/70 backdrop-blur-sm transition hover:bg-white/15 hover:text-white md:flex"
        ><ArrowLeft className="h-5 w-5" /></button>
        <button type="button" aria-label="Next"
          onClick={() => { onChange(activeIndex + 1); onInteract(); }}
          className="absolute right-0 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white/70 backdrop-blur-sm transition hover:bg-white/15 hover:text-white md:flex"
        ><ArrowRight className="h-5 w-5" /></button>
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {products.map((p, i) => (
          <button key={p.id} type="button" aria-label={`Go to ${p.name}`}
            onClick={() => { onChange(i); onInteract(); }}
            className={`rounded-full transition-all duration-300 ${i === activeIndex ? "h-2 w-8 bg-white" : "h-2 w-2 bg-white/35 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {/* Interaction hint */}
      <motion.p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40"
        animate={reduced ? {} : { opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
        Swipe to explore products
        <ChevronDown className="h-3.5 w-3.5 rotate-90" />
      </motion.p>
    </div>
  );
}

/* ── Dynamic CTA Card ────────────────────────────────────────────────── */

function CTACard({ product, reduced }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={product.id}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-white/[0.12] bg-white/[0.05] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7"
      >
        {/* Urgency badge */}
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {product.badge}
        </span>

        {/* Product name */}
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{product.name}</h2>

        {/* Hook */}
        <p className="mt-2 text-[15px] leading-relaxed text-white/70">{product.hook}</p>

        {/* Price */}
        <p className="mt-4 text-4xl font-bold tracking-tight text-white">{product.price}</p>

        {/* CTA Button */}
        <button type="button"
          onClick={() => {
            const msg = encodeURIComponent(`Hi, I'd like to order ${product.name}. Please share details.`);
            window.open(`https://wa.me/?text=${msg}`, "_blank");
          }}
          className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-4 text-base font-bold text-white shadow-[0_16px_44px_rgba(16,185,129,0.45)] transition-all duration-300 hover:shadow-[0_20px_52px_rgba(16,185,129,0.6)] hover:brightness-110"
        >
          <WaIcon className="h-5 w-5" />
          Order on WhatsApp
        </button>

        {/* Sub-CTA text */}
        <p className="mt-3 text-center text-xs text-white/45">No payment required now • Ask anything first</p>

        {/* Trust row */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { icon: Check, label: "Cash on Delivery" },
            { icon: Truck, label: "Fast Delivery" },
            { icon: RotateCcw, label: "Easy Returns" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2 py-2.5 text-center">
              <Icon className="h-3.5 w-3.5 text-emerald-400/80" />
              <span className="text-[10px] font-semibold leading-tight text-white/65">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Page Component ─────────────────────────────────────────────── */

export default function DemoLandingPage4() {
  const reduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = PRODUCTS.length;
  const active = PRODUCTS[activeIdx];

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setActiveIdx((p) => wrap(p + 1, total)), 4800);
    return () => clearInterval(id);
  }, [autoplay, total]);

  const change = useCallback((n) => setActiveIdx(wrap(n, total)), [total]);
  const pause = useCallback(() => {
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_10%_10%,rgba(16,185,129,0.12),transparent_32%),radial-gradient(ellipse_at_88%_14%,rgba(99,102,241,0.1),transparent_36%),linear-gradient(160deg,#030711_0%,#0a1120_48%,#0f172a_100%)] font-sans text-white antialiased">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen px-4 pb-12 pt-5 sm:px-6 lg:px-10">

        {/* Top Bar */}
        <header className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.07]">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-white/90">LUXEFLOW</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white/80 sm:text-sm">
            <BadgeCheck className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Trusted by 1,200+ customers</span>
            <span className="sm:hidden">1,200+ trusted</span>
          </div>
        </header>

        {/* Headline Block */}
        <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-14 lg:mt-16">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-200"
          >
            Exclusive Collection
          </motion.span>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Discover the Style Everyone Wants
          </motion.h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
          >
            Premium quality products designed to stand out — browse, explore, and order instantly in seconds.
          </motion.p>
        </div>

        {/* Hero Layout: Coverflow + CTA */}
        <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center gap-8 lg:mt-12 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
          {/* Coverflow */}
          <div className="w-full max-w-3xl flex-1">
            <Coverflow products={PRODUCTS} activeIndex={activeIdx} onChange={change} onInteract={pause} />
          </div>
          {/* CTA Card */}
          <div className="flex w-full max-w-md shrink-0 justify-center lg:mt-6 lg:w-auto">
            <CTACard product={active} reduced={reduced} />
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ────────────────────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/50">Why Choose Us</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Built on trust, designed with care.</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.25)] backdrop-blur-sm"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                  <f.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white">{f.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─────────────────────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/50">Social Proof</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Loved by customers everywhere.</h3>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white/85">
              <Star className="h-4 w-4 fill-current text-amber-300" />
              4.8 from 1,200+ happy customers
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <motion.article key={r.name}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
              >
                <div className="mb-3 flex gap-1 text-amber-300">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-white/70">"{r.text}"</p>
                <div className="mt-4 border-t border-white/[0.08] pt-4">
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <p className="text-xs text-white/50">Verified Buyer</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/[0.12] bg-[linear-gradient(135deg,rgba(16,185,129,0.18)_0%,rgba(15,23,42,0.92)_55%,rgba(3,7,17,0.96)_100%)] p-8 text-center shadow-[0_40px_100px_rgba(0,0,0,0.45)] sm:p-14">
          <h3 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Found the perfect product?<br className="hidden sm:block" /> Order instantly now.
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/65">
            Move from discovery to action in seconds with premium support and a smooth WhatsApp ordering flow.
          </p>
          <button type="button"
            onClick={() => window.open("#", "_blank")}
            className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-10 py-4 text-base font-bold text-white shadow-[0_18px_48px_rgba(16,185,129,0.5)] transition-all duration-300 hover:shadow-[0_22px_56px_rgba(16,185,129,0.65)] hover:brightness-110"
          >
            <WaIcon className="h-5 w-5" />
            Order on WhatsApp
          </button>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/60">
            <Package className="h-4 w-4 text-emerald-400/70" />
            Premium support available after purchase
          </div>
        </div>
      </section>
    </div>
  );
}
