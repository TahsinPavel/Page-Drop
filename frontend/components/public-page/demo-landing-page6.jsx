"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Check, ChevronUp, Diamond, Package, RotateCcw, ShieldCheck, Sparkles, Star, Truck, Zap } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Eclipse Runner", hook: "Premium craftsmanship designed for everyday elegance.", price: "$189", badge: "Best Seller", accent: "rgba(52,211,153,0.5)", image: "/demo/sneaker-1.png" },
  { id: 2, name: "Nebula Chronos", hook: "Time, redefined for the modern visionary.", price: "$589", badge: "Limited Edition", accent: "rgba(129,140,248,0.5)", image: "/demo/watch-1.png" },
  { id: 3, name: "Aura Pods", hook: "Sound that surrounds, style that defines.", price: "$349", badge: "Only Few Left", accent: "rgba(251,191,36,0.45)", image: "/demo/headphones-1.png" },
  { id: 4, name: "Orbit Prime", hook: "A bold statement with refined comfort.", price: "$279", badge: "Trending Now", accent: "rgba(56,189,248,0.45)", image: "/demo/headphones-2.png" },
  { id: 5, name: "Velvet Stride", hook: "Crafted for confident, standout moments.", price: "$219", badge: "New Arrival", accent: "rgba(244,114,182,0.45)", image: "/demo/sneaker-2.png" },
];

const FEATURES = [
  { icon: Diamond, title: "Premium Quality", desc: "Carefully curated materials with luxe finish and comfort-first construction." },
  { icon: Sparkles, title: "Curated Selection", desc: "Hand-picked products chosen for design excellence and lasting value." },
  { icon: Zap, title: "Fast Delivery", desc: "Orders confirmed on WhatsApp and dispatched fast to your doorstep." },
  { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free returns and exchanges within 7 days of delivery." },
];

const REVIEWS = [
  { name: "Sarah Chen", text: "The reveal experience was incredible. Product matched perfectly. Fast delivery!" },
  { name: "Marcus Rivera", text: "Ordering via WhatsApp was seamless. Arrived in 2 days. Will buy again." },
  { name: "Aisha Patel", text: "Cash on delivery removed all hesitation. Quality exceeded expectations." },
];

const wrap = (i, n) => ((i % n) + n) % n;

function WaIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );
}

/* ── Floating Stack ──────────────────────────────────────────────── */

function FloatingStack({ products, activeIndex, onChange, onInteract }) {
  const reduced = useReducedMotion();
  const touchY = useRef(0);
  const spring = useMemo(() => reduced ? { duration: 0.25 } : { type: "spring", stiffness: 200, damping: 24, mass: 0.9 }, [reduced]);

  const swipe = useCallback((dy) => {
    if (Math.abs(dy) < 40) return;
    onChange(dy < 0 ? activeIndex + 1 : activeIndex - 1);
    onInteract();
  }, [activeIndex, onChange, onInteract]);

  const active = products[activeIndex];
  const total = products.length;

  return (
    <div className="relative mx-auto w-full max-w-md select-none"
      onTouchStart={(e) => { touchY.current = e.touches[0].clientY; }}
      onTouchEnd={(e) => { swipe(e.changedTouches[0].clientY - touchY.current); }}
    >
      {/* Ambient glow */}
      <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
        style={{ background: `radial-gradient(circle, ${active.accent} 0%, transparent 70%)` }}
        animate={reduced ? { opacity: 0.6 } : { opacity: [0.4, 0.75, 0.4], scale: [0.9, 1.12, 0.9] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stack container */}
      <div className="relative mx-auto h-[340px] w-[280px] sm:h-[400px] sm:w-[320px] lg:h-[440px] lg:w-[360px]"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        {products.map((p, i) => {
          let offset = i - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const abs = Math.abs(offset);
          const isActive = offset === 0;
          const visible = offset >= 0 && offset <= 3;

          const y = offset * 28;
          const sc = 1 - offset * 0.07;
          const op = isActive ? 1 : offset === 1 ? 0.55 : offset === 2 ? 0.3 : 0.12;
          const z = 100 - offset * 50;
          const br = isActive ? 1 : 1 - offset * 0.15;
          const bl = isActive ? 0 : offset * 1.5;

          if (!visible) return null;

          return (
            <motion.button key={p.id} type="button" aria-label={`Reveal ${p.name}`}
              onClick={() => { if (!isActive) { onChange(i); onInteract(); } }}
              className="absolute inset-0 cursor-pointer border-none bg-transparent p-0"
              initial={false}
              animate={{ y, scale: sc, opacity: op, filter: `brightness(${br}) blur(${bl}px)` }}
              transition={spring}
              style={{ zIndex: isActive ? 30 : 20 - abs, pointerEvents: visible ? "auto" : "none", transformStyle: "preserve-3d" }}
            >
              {/* Active floating shadow */}
              {isActive && (
                <motion.div className="pointer-events-none absolute bottom-[-16px] left-1/2 h-8 w-[60%] -translate-x-1/2 rounded-full bg-black/40 blur-xl"
                  animate={reduced ? { opacity: 0.5 } : { opacity: [0.25, 0.55, 0.25] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {/* Float animation */}
              <motion.div className="relative flex h-full w-full items-center justify-center"
                animate={isActive && !reduced ? { y: [0, -12, 0] } : { y: 0 }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={p.image} alt={p.name} loading="lazy" draggable={false}
                  className="max-h-[85%] max-w-[85%] object-contain"
                  style={{ filter: isActive ? "drop-shadow(0 30px 50px rgba(0,0,0,0.55))" : "drop-shadow(0 16px 30px rgba(0,0,0,0.4))" }}
                />
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Reveal hint */}
      <motion.div className="mt-6 flex flex-col items-center gap-1 text-xs text-white/35"
        animate={reduced ? {} : { opacity: [0.25, 0.65, 0.25] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronUp className="h-4 w-4" />
        <span>Swipe up to reveal next</span>
      </motion.div>

      {/* Navigation buttons */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button type="button" aria-label="Previous product"
          onClick={() => { onChange(activeIndex - 1); onInteract(); }}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/60 transition hover:bg-white/[0.12] hover:text-white"
        >
          <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
        </button>
        <div className="flex gap-1.5">
          {products.map((p, i) => (
            <button key={p.id} type="button" aria-label={`Go to ${p.name}`}
              onClick={() => { onChange(i); onInteract(); }}
              className={`cursor-pointer rounded-full transition-all duration-300 ${i === activeIndex ? "h-2 w-7 bg-white" : "h-2 w-2 bg-white/30 hover:bg-white/55"}`}
            />
          ))}
        </div>
        <button type="button" aria-label="Next product"
          onClick={() => { onChange(activeIndex + 1); onInteract(); }}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/60 transition hover:bg-white/[0.12] hover:text-white"
        >
          <ChevronUp className="h-4 w-4 rotate-90" />
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */

export default function DemoLandingPage6() {
  const reduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = PRODUCTS.length;
  const active = PRODUCTS[activeIdx];

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setActiveIdx((p) => wrap(p + 1, total)), 5200);
    return () => clearInterval(id);
  }, [autoplay, total]);

  const change = useCallback((n) => setActiveIdx(wrap(n, total)), [total]);
  const pause = useCallback(() => { setAutoplay(false); setTimeout(() => setAutoplay(true), 12000); }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_15%_8%,rgba(99,102,241,0.1),transparent_34%),radial-gradient(ellipse_at_85%_12%,rgba(16,185,129,0.08),transparent_32%),linear-gradient(165deg,#020617_0%,#0a0f1e_45%,#0f172a_100%)] font-sans text-white antialiased">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col px-4 pb-14 pt-5 sm:px-6 lg:px-10">

        {/* Top Bar */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.06]">
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-white/90">REVEALUX</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/75 sm:text-sm">
            <BadgeCheck className="h-4 w-4 text-violet-400" />
            <span className="hidden sm:inline">Best Seller Collection</span>
            <span className="sm:hidden">Best Sellers</span>
          </div>
        </header>

        {/* Headline */}
        <div className="mx-auto mt-10 max-w-2xl text-center sm:mt-14">
          <motion.span initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-block rounded-full border border-violet-300/25 bg-violet-400/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.26em] text-violet-200"
          >Reveal the Collection</motion.span>
          <motion.h1 initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]"
          >Reveal Premium Picks Designed for You</motion.h1>
          <motion.p initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg"
          >Swipe through our curated premium collection and reveal your perfect pick.</motion.p>
        </div>

        {/* Stack + CTA centered */}
        <div className="mx-auto mt-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-10 lg:mt-8">
          <FloatingStack products={PRODUCTS} activeIndex={activeIdx} onChange={change} onInteract={pause} />

          {/* Reveal CTA Block */}
          <AnimatePresence mode="wait">
            <motion.div key={active.id}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md text-center"
            >
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-300">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
                {active.badge}
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">{active.name}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-white/60">{active.hook}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-white">{active.price}</p>

              <button type="button"
                onClick={() => { const m = encodeURIComponent(`Hi, I'd like to order ${active.name}. Please share details.`); window.open(`https://wa.me/?text=${m}`, "_blank"); }}
                className="group mx-auto mt-6 flex w-full max-w-xs cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-4 text-base font-bold text-white shadow-[0_16px_44px_rgba(124,58,237,0.4)] transition-all duration-300 hover:shadow-[0_20px_52px_rgba(124,58,237,0.55)] hover:brightness-110"
              >
                <WaIcon className="h-5 w-5" />
                Order on WhatsApp
              </button>
              <p className="mt-3 text-xs text-white/40">No payment required now · Ask anything first</p>

              {/* Trust strip */}
              <div className="mx-auto mt-5 flex max-w-sm flex-wrap items-center justify-center gap-2">
                {[{ icon: Check, l: "Cash on Delivery" }, { icon: Truck, l: "Fast Delivery" }, { icon: RotateCcw, l: "Easy Returns" }].map(({ icon: I, l }) => (
                  <span key={l} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white/60">
                    <I className="h-3.5 w-3.5 text-violet-400/70" />{l}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">Why Choose Us</p>
            <h3 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">Built on trust, designed with care.</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.2)] backdrop-blur-sm"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-violet-400/20 bg-violet-400/10">
                  <f.icon className="h-5 w-5 text-violet-400" />
                </div>
                <h4 className="text-base font-bold text-white">{f.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">Social Proof</p>
            <h3 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Loved by 1,200+ happy customers.</h3>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white/80">
              <Star className="h-4 w-4 fill-current text-amber-300" />4.8 average rating
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <motion.article key={r.name}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
              >
                <div className="mb-3 flex gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm leading-relaxed text-white/65">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-4 border-t border-white/[0.07] pt-4">
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <p className="text-xs text-white/45">Verified Buyer</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/[0.1] bg-[linear-gradient(135deg,rgba(124,58,237,0.16)_0%,rgba(15,23,42,0.92)_55%,rgba(2,6,23,0.96)_100%)] p-8 text-center shadow-[0_40px_100px_rgba(0,0,0,0.4)] sm:p-14">
          <h3 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Found the one you love?<br className="hidden sm:block" /> Order now.
          </h3>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/60">
            Move from discovery to action in seconds with premium support and a smooth WhatsApp ordering flow.
          </p>
          <button type="button" onClick={() => window.open("#", "_blank")}
            className="mt-8 inline-flex cursor-pointer items-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 px-10 py-4 text-base font-bold text-white shadow-[0_18px_48px_rgba(124,58,237,0.45)] transition-all duration-300 hover:shadow-[0_22px_56px_rgba(124,58,237,0.6)] hover:brightness-110"
          >
            <WaIcon className="h-5 w-5" />Order on WhatsApp
          </button>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/55">
            <Package className="h-4 w-4 text-violet-400/70" />Premium support available after purchase
          </div>
        </div>
      </section>
    </div>
  );
}
