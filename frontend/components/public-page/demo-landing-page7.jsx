"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Diamond,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Eclipse Runner Pro",
    benefit: "Featherweight comfort engineered for all-day premium performance — feel unstoppable from morning to night.",
    price: "$189",
    originalPrice: "$249",
    badge: "Selling Fast",
    urgencyNote: "Only 4 left in stock — 23 sold in the last 6 hours",
    glow: "rgba(52,211,153,0.45)",
    image: "/demo/sneaker-1.png",
  },
  {
    id: 2,
    name: "Nebula Chronos Elite",
    benefit: "Command attention with a timepiece designed for modern achievers who refuse to blend in.",
    price: "$589",
    originalPrice: "$749",
    badge: "Limited Edition",
    urgencyNote: "Only 12 pieces crafted — 9 already claimed",
    glow: "rgba(129,140,248,0.45)",
    image: "/demo/watch-1.png",
  },
  {
    id: 3,
    name: "Aura Pods Ultra",
    benefit: "Immersive sound that transforms every moment — studio clarity meets signature street style.",
    price: "$349",
    originalPrice: "$429",
    badge: "#1 Best Seller",
    urgencyNote: "Restocked today — last batch sold out in 48 hours",
    glow: "rgba(251,191,36,0.42)",
    image: "/demo/headphones-1.png",
  },
  {
    id: 4,
    name: "Orbit Prime X",
    benefit: "Bold acoustics wrapped in premium comfort — designed to match your energy, wherever you go.",
    price: "$279",
    originalPrice: "$359",
    badge: "Trending #1",
    urgencyNote: "Most wishlisted this week — stock dropping fast",
    glow: "rgba(56,189,248,0.42)",
    image: "/demo/headphones-2.png",
  },
  {
    id: 5,
    name: "Velvet Stride Max",
    benefit: "Walk with confidence in buttery-soft comfort that turns heads and keeps you moving all day.",
    price: "$219",
    originalPrice: "$289",
    badge: "New Drop",
    urgencyNote: "Launch edition — first 50 orders get priority shipping",
    glow: "rgba(244,114,182,0.42)",
    image: "/demo/sneaker-2.png",
  },
];

const FEATURE_CARDS = [
  {
    icon: Diamond,
    title: "Verified Premium Quality",
    desc: "Every product is hand-inspected and quality-certified before it ships — your satisfaction is guaranteed or your money back.",
  },
  {
    icon: Truck,
    title: "Free Express Delivery",
    desc: "Dispatched within 24 hours with live WhatsApp tracking — know exactly when your order arrives.",
  },
  {
    icon: RotateCcw,
    title: "30-Day Easy Returns",
    desc: "Changed your mind? No questions asked. Free return pickup and full refund within 30 days.",
  },
];

const REVIEWS = [
  {
    name: "Sarah Chen",
    text: "I hesitated but the cash-on-delivery option made it risk-free. Product arrived in 2 days and looks even better in person.",
  },
  {
    name: "Marcus Rivera",
    text: "Ordered on WhatsApp in under 60 seconds. Got tracking updates instantly. Quality blew me away — already bought two more.",
  },
  {
    name: "Aisha Patel",
    text: "Was skeptical but the easy returns policy convinced me. Didn't need it though — the quality is genuinely premium. 10/10.",
  },
];

const wrap = (index, length) => ((index % length) + length) % length;

function relPos(index, activeIndex, length) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function WaIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );
}

function Coverflow({ products, activeIndex, onChange, onInteract }) {
  const reduced = useReducedMotion();
  const touchX = useRef(0);
  const N = products.length;
  const theta = 360 / N; // 72° per face for 5 products

  /* Calculate prism radius (apothem) based on viewport */
  const [radius, setRadius] = useState(234);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const faceW = w < 640 ? 240 : w < 1024 ? 290 : 340;
      setRadius(Math.round(faceW / (2 * Math.tan(Math.PI / N))));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [N]);

  const spring = useMemo(
    () =>
      reduced
        ? { duration: 0.2 }
        : { type: "spring", stiffness: 180, damping: 26, mass: 0.95 },
    [reduced]
  );

  const swipe = useCallback(
    (dx) => {
      if (Math.abs(dx) < 44) return;
      onChange(dx < 0 ? activeIndex + 1 : activeIndex - 1);
      onInteract();
    },
    [activeIndex, onChange, onInteract]
  );

  const active = products[activeIndex];

  return (
    <div className="relative w-full select-none" style={{ perspective: "1000px" }}>
      {/* Ambient glow behind active card */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[45%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
        style={{ background: `radial-gradient(circle, ${active.glow} 0%, transparent 68%)` }}
        animate={
          reduced ? { opacity: 0.5 } : { opacity: [0.35, 0.65, 0.35], scale: [0.95, 1.08, 0.95] }
        }
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Carousel viewport */}
      <div
        className="relative mx-auto h-[340px] sm:h-[400px] lg:h-[480px]"
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          swipe(event.changedTouches[0].clientX - touchX.current);
        }}
      >
        {/* 3D rotating prism — the whole container rotates */}
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: -activeIndex * theta }}
          transition={spring}
        >
          {products.map((product, index) => {
            const rel = relPos(index, activeIndex, N);
            const absRel = Math.abs(rel);
            const isActive = rel === 0;
            const faceAngle = index * theta;

            /* Blur & brightness based on distance from active face */
            const blur = isActive ? 0 : absRel === 1 ? 6 : 12;
            const brightness = isActive ? 1 : absRel === 1 ? 0.7 : 0.4;

            return (
              <div
                key={product.id}
                className="absolute left-1/2 top-1/2 cursor-pointer"
                style={{
                  width: "clamp(240px, 48vw, 340px)",
                  height: "clamp(300px, 62vw, 430px)",
                  transform: `translate(-50%, -50%) rotateY(${faceAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  filter: `blur(${blur}px) brightness(${brightness})`,
                  transition: "filter 0.5s ease, box-shadow 0.5s ease",
                }}
                onClick={() => {
                  onChange(index);
                  onInteract();
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${product.name}`}
              >
                {/* Card panel — light bg with rounded corners */}
                <div
                  className="relative h-full w-full overflow-hidden rounded-2xl"
                  style={{
                    background: "linear-gradient(160deg, #f5f5f5 0%, #e8e8e8 50%, #d5d5d5 100%)",
                    boxShadow: isActive
                      ? "0 32px 64px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)"
                      : "0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-contain p-5 sm:p-6"
                    style={{
                      filter: isActive
                        ? "drop-shadow(0 12px 24px rgba(0,0,0,0.25))"
                        : "drop-shadow(0 6px 12px rgba(0,0,0,0.15))",
                    }}
                  />
                </div>

                {/* Reflection under the active card */}
                {isActive && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2"
                    style={{
                      width: "80%",
                      height: "40px",
                      background:
                        "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
                      filter: "blur(8px)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Navigation arrows */}
        <button
          type="button"
          aria-label="Previous product"
          onClick={() => {
            onChange(activeIndex - 1);
            onInteract();
          }}
          className="absolute left-0 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white/70 backdrop-blur-sm transition hover:bg-white/15 hover:text-white md:flex"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Next product"
          onClick={() => {
            onChange(activeIndex + 1);
            onInteract();
          }}
          className="absolute right-0 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white/70 backdrop-blur-sm transition hover:bg-white/15 hover:text-white md:flex"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Pagination dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            aria-label={`Go to ${product.name}`}
            onClick={() => {
              onChange(index);
              onInteract();
            }}
            className={`cursor-pointer rounded-full transition-all duration-300 ${
              index === activeIndex ? "h-2 w-8 bg-white" : "h-2 w-2 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      <motion.p
        className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40"
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

function HeroCTA({ product, reducedMotion, onOrder }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={product.id}
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full rounded-3xl border border-white/[0.14] bg-white/[0.06] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-amber-200">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
          {product.badge}
        </span>

        {product.originalPrice && (
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-200">
            <Check className="h-3 w-3" />
            Save {Math.round(((parseFloat(product.originalPrice.replace('$','')) - parseFloat(product.price.replace('$',''))) / parseFloat(product.originalPrice.replace('$',''))) * 100)}% Today
          </span>
        )}

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{product.name}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-white/70">{product.benefit}</p>

        <div className="mt-4 flex items-baseline gap-3">
          <p className="text-4xl font-bold tracking-tight text-white">{product.price}</p>
          {product.originalPrice && (
            <p className="text-lg font-medium text-white/40 line-through">{product.originalPrice}</p>
          )}
        </div>

        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-xs font-semibold text-rose-100">
          <Zap className="h-3.5 w-3.5" />
          {product.urgencyNote}
        </p>

        <button
          type="button"
          onClick={() => onOrder(product.name)}
          className="mt-6 inline-flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-7 py-4 text-base font-extrabold text-white shadow-[0_18px_56px_rgba(16,185,129,0.55)] transition-all duration-300 hover:shadow-[0_22px_66px_rgba(16,185,129,0.7)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]"
        >
          <WaIcon className="h-5 w-5" />
          Claim Yours Now — Pay on Delivery
        </button>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {[
            { icon: ShieldCheck, label: "Pay on Delivery" },
            { icon: Truck, label: "Free Express Shipping" },
            { icon: RotateCcw, label: "30-Day Free Returns" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/80"
            >
              <Icon className="h-3.5 w-3.5 text-emerald-300" />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {["bg-emerald-400", "bg-indigo-400", "bg-amber-400", "bg-rose-400"].map((color, i) => (
              <div key={i} className={`h-5 w-5 rounded-full border-2 border-[#0b1220] ${color}`} />
            ))}
          </div>
          <p className="text-sm font-semibold text-white/85">1,247 happy customers this month</p>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/55">
          <Check className="h-3 w-3 text-emerald-400" />
          Zero payment needed now — only pay when it arrives at your door.
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export default function DemoLandingPage7() {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = PRODUCTS.length;
  const activeProduct = PRODUCTS[activeIndex];

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setActiveIndex((prev) => wrap(prev + 1, total)), 5000);
    return () => clearInterval(id);
  }, [autoplay, total]);

  const changeProduct = useCallback((next) => setActiveIndex(wrap(next, total)), [total]);

  const pauseAutoplay = useCallback(() => {
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  }, []);

  const openWhatsAppOrder = useCallback((productName) => {
    const message = encodeURIComponent(
      `Hi, I want to order ${productName}. Please share delivery details.`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_8%_8%,rgba(16,185,129,0.12),transparent_34%),radial-gradient(ellipse_at_90%_10%,rgba(99,102,241,0.12),transparent_36%),linear-gradient(160deg,#030711_0%,#0b1220_48%,#0f172a_100%)] font-sans text-white antialiased">
      <section className="relative min-h-screen px-4 pb-14 pt-5 sm:px-6 lg:px-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.07]">
              <Sparkles className="h-5 w-5 text-emerald-300" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-white/90">VARIANT</span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white/80 sm:text-sm">
            <BadgeCheck className="h-4 w-4 text-emerald-300" />
            Premium Picks
          </span>
        </header>

        <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-14 lg:mt-16">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-rose-300/25 bg-rose-300/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.24em] text-rose-100"
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-rose-300" />
            Limited Drop — Ends When Stock Runs Out
          </motion.p>

          <motion.h1
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Own the Premium Piece Everyone Wants — Before It's Gone
          </motion.h1>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg"
          >
            Hand-picked premium products with free express delivery and pay-on-delivery confidence. Swipe, choose, and order via WhatsApp in 60 seconds.
          </motion.p>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-8 lg:mt-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="w-full lg:w-[58%]">
            <Coverflow
              products={PRODUCTS}
              activeIndex={activeIndex}
              onChange={changeProduct}
              onInteract={pauseAutoplay}
            />
          </div>

          <div className="w-full lg:w-[42%]">
            <div className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-[460px]">
              <HeroCTA
                product={activeProduct}
                reducedMotion={reducedMotion}
                onOrder={openWhatsAppOrder}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/50">The Zero-Risk Promise</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Every reason to say yes — zero reasons to hesitate.</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FEATURE_CARDS.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
                className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-emerald-300/25 bg-emerald-300/10">
                  <feature.icon className="h-5 w-5 text-emerald-300" />
                </div>
                <h3 className="text-base font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{feature.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/50">Verified Reviews</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Don't take our word for it — hear from real buyers.</h2>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white/85">
              <Star className="h-4 w-4 fill-current text-amber-300" />
              4.9 average from 1,247 verified purchases
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {REVIEWS.map((review, index) => (
              <motion.article
                key={review.name}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
              >
                <div className="mb-3 flex gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-white/70">&ldquo;{review.text}&rdquo;</p>
                <div className="mt-4 border-t border-white/[0.08] pt-4">
                  <p className="text-sm font-semibold text-white">{review.name}</p>
                  <p className="text-xs text-white/50">Verified Buyer</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/[0.12] bg-[linear-gradient(135deg,rgba(16,185,129,0.18)_0%,rgba(15,23,42,0.92)_55%,rgba(3,7,17,0.96)_100%)] p-8 text-center shadow-[0_40px_100px_rgba(0,0,0,0.45)] sm:p-14">
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Still thinking? This drop won't last.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/65">
            Secure yours now with zero risk — pay only when it arrives. Free returns, free shipping, and WhatsApp ordering in under 60 seconds.
          </p>

          <button
            type="button"
            onClick={() => openWhatsAppOrder(activeProduct.name)}
            className="mt-8 inline-flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-10 py-4 text-base font-extrabold text-white shadow-[0_18px_48px_rgba(16,185,129,0.52)] transition-all duration-300 hover:shadow-[0_22px_56px_rgba(16,185,129,0.66)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]"
          >
            <WaIcon className="h-5 w-5" />
            Order Now — Pay on Delivery
          </button>

          <p className="mt-4 text-sm text-white/60">No upfront payment required. Free express shipping. 30-day hassle-free returns. 1,247+ happy customers.</p>
        </div>
      </section>
    </div>
  );
}
