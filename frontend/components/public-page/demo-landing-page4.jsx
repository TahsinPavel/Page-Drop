"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Package,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Auralux One",
    hook: "Designed to elevate your everyday style.",
    price: "$329",
    badge: "TRENDING COLLECTION",
    glow: "rgba(52, 211, 153, 0.4)",
    image: "/demo/headphones-1.png",
  },
  {
    id: 2,
    name: "Nova Studio",
    hook: "Premium sound and modern minimal design.",
    price: "$279",
    badge: "LIMITED DROP",
    glow: "rgba(129, 140, 248, 0.42)",
    image: "/demo/headphones-2.png",
  },
  {
    id: 3,
    name: "Lumen Air",
    hook: "Crafted for confident, standout moments.",
    price: "$359",
    badge: "BEST PICKS",
    glow: "rgba(251, 191, 36, 0.42)",
    image: "/demo/headphones-3.png",
  },
  {
    id: 4,
    name: "Orbit Prime",
    hook: "A premium statement with refined comfort.",
    price: "$389",
    badge: "EXCLUSIVE RELEASE",
    glow: "rgba(56, 189, 248, 0.4)",
    image: "/demo/headphones-1.png",
  },
];

const REVIEWS = [
  {
    name: "Sophia Tran",
    role: "Verified Buyer",
    quote:
      "This feels like a premium showroom. The coverflow made exploring products effortless and enjoyable.",
  },
  {
    name: "Daniel Wright",
    role: "Verified Buyer",
    quote:
      "Browsing before buying felt natural. The product looked exactly like the center spotlight when delivered.",
  },
  {
    name: "Lina Moreno",
    role: "Verified Buyer",
    quote:
      "Fast support, clear trust badges, and an elegant flow from curiosity to checkout intent.",
  },
];

function wrapIndex(index, length) {
  return ((index % length) + length) % length;
}

function relativePosition(index, activeIndex, length) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function Coverflow({ products, activeIndex, onChange, onInteract }) {
  const reducedMotion = useReducedMotion();
  const touchStartX = useRef(0);

  const spring = useMemo(
    () =>
      reducedMotion
        ? { duration: 0.2 }
        : {
            type: "spring",
            stiffness: 260,
            damping: 28,
            mass: 0.8,
          },
    [reducedMotion]
  );

  const swipe = useCallback(
    (deltaX) => {
      if (Math.abs(deltaX) < 48) return;
      if (deltaX < 0) onChange(activeIndex + 1);
      if (deltaX > 0) onChange(activeIndex - 1);
      onInteract();
    },
    [activeIndex, onChange, onInteract]
  );

  const activeProduct = products[activeIndex];

  return (
    <div className="relative w-full">
      <div
        className="relative h-[330px] sm:h-[390px] lg:h-[470px]"
        style={{ perspective: "1600px", transformStyle: "preserve-3d" }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          swipe(e.changedTouches[0].clientX - touchStartX.current);
        }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[45%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${activeProduct.glow} 0%, rgba(255,255,255,0) 72%)`,
          }}
          animate={
            reducedMotion
              ? { opacity: 0.78 }
              : { opacity: [0.56, 0.9, 0.56], scale: [0.95, 1.08, 0.95] }
          }
          transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="pointer-events-none absolute bottom-7 left-1/2 h-8 w-[170px] -translate-x-1/2 rounded-full bg-black/50 blur-lg" />

        {products.map((product, index) => {
          const rel = relativePosition(index, activeIndex, products.length);
          const abs = Math.abs(rel);
          const isActive = rel === 0;
          const visible = abs <= 2;

          const x = rel * 192;
          const y = isActive ? -8 : abs === 1 ? 8 : 20;
          const scale = isActive ? 1 : abs === 1 ? 0.74 : 0.58;
          const rotateY = isActive ? 0 : rel < 0 ? 40 : -40;
          const z = isActive ? 120 : abs === 1 ? -20 : -120;
          const opacity = isActive ? 1 : abs === 1 ? 0.56 : 0.22;
          const brightness = isActive ? 1 : abs === 1 ? 0.68 : 0.52;
          const blur = isActive ? 0 : abs === 1 ? 1.4 : 2.8;

          return (
            <motion.button
              key={product.id}
              type="button"
              aria-label={`Show ${product.name}`}
              onClick={() => {
                onChange(index);
                onInteract();
              }}
              className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 border-none bg-transparent p-0 sm:h-[260px] sm:w-[260px] lg:h-[320px] lg:w-[320px]"
              initial={false}
              animate={{
                x,
                y,
                scale,
                rotateY,
                z,
                opacity: visible ? opacity : 0,
                filter: `brightness(${brightness}) blur(${blur}px)`,
              }}
              transition={spring}
              style={{
                transformStyle: "preserve-3d",
                zIndex: isActive ? 30 : 20 - abs,
                pointerEvents: visible ? "auto" : "none",
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                swipe(info.offset.x + info.velocity.x * 0.14);
              }}
            >
              {isActive && (
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-[64%] h-8 w-[160px] -translate-x-1/2 rounded-full bg-black/45 blur-md"
                  animate={reducedMotion ? { opacity: 0.56 } : { opacity: [0.38, 0.7, 0.38] }}
                  transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <motion.div
                className="relative h-full w-full"
                animate={isActive && !reducedMotion ? { y: [0, -8, 0] } : { y: 0 }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-contain"
                  style={{
                    filter: isActive
                      ? "drop-shadow(0 24px 42px rgba(0,0,0,0.58))"
                      : "drop-shadow(0 12px 24px rgba(0,0,0,0.38))",
                  }}
                />
              </motion.div>
            </motion.button>
          );
        })}

        <button
          type="button"
          aria-label="Previous product"
          onClick={() => {
            onChange(activeIndex - 1);
            onInteract();
          }}
          className="absolute left-1 top-1/2 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 md:flex"
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
          className="absolute right-1 top-1/2 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 md:flex"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            aria-label={`Go to ${product.name}`}
            onClick={() => {
              onChange(index);
              onInteract();
            }}
            className={`rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
              index === activeIndex ? "h-2 w-8 bg-white" : "h-2 w-2 bg-white/40 hover:bg-white/65"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DemoLandingPage4() {
  const reducedMotion = useReducedMotion();
  const [activeProduct, setActiveProduct] = useState(1);
  const [autoplay, setAutoplay] = useState(true);

  const total = PRODUCTS.length;
  const active = PRODUCTS[activeProduct];

  useEffect(() => {
    if (!autoplay) return undefined;
    const id = window.setInterval(() => {
      setActiveProduct((prev) => wrapIndex(prev + 1, total));
    }, 4600);

    return () => window.clearInterval(id);
  }, [autoplay, total]);

  const changeProduct = useCallback(
    (next) => {
      setActiveProduct(wrapIndex(next, total));
    },
    [total]
  );

  const pauseAutoplay = useCallback(() => {
    setAutoplay(false);
    window.setTimeout(() => setAutoplay(true), 9000);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_12%_12%,rgba(16,185,129,0.15),transparent_30%),radial-gradient(circle_at_86%_16%,rgba(59,130,246,0.16),transparent_34%),linear-gradient(160deg,#04060c_0%,#0a101b_46%,#101927_100%)] text-white">
      <section className="min-h-screen px-3 pb-12 pt-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10">
                <Sparkles className="h-5 w-5 text-emerald-300" />
              </div>
              <p className="text-sm font-semibold tracking-[0.18em] text-white">AURALUX</p>
            </div>

            <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
              <BadgeCheck className="h-4 w-4 text-emerald-300" />
              Trusted by 1,200+ customers
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl text-center sm:mt-12">
          <p className="inline-flex items-center rounded-full border border-emerald-200/35 bg-emerald-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100">
            Explore Our Best Picks
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Explore premium picks designed for you.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
            Browse premium products in an immersive shopping experience and order instantly when you find your favorite.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-white/15 bg-white/[0.05] px-3 py-5 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-md sm:px-5 sm:py-6">
          <Coverflow
            products={PRODUCTS}
            activeIndex={activeProduct}
            onChange={changeProduct}
            onInteract={pauseAutoplay}
          />

          <motion.div
            key={active.id}
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-2xl text-center"
          >
            <h2 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">{active.name}</h2>
            <p className="mt-2 text-base text-white/80">{active.hook}</p>
            <div className="mt-3 text-4xl font-semibold tracking-tight text-white">{active.price}</div>

            <button
              type="button"
              onClick={() => window.open("#", "_blank")}
              className="mt-6 min-h-12 min-w-[240px] rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 px-8 text-base font-semibold text-emerald-950 shadow-[0_14px_36px_rgba(16,185,129,0.5)] transition hover:shadow-[0_18px_42px_rgba(16,185,129,0.58)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            >
              Order on WhatsApp
            </button>

            <p className="mt-3 text-sm text-white/72">No payment required now - Ask anything first</p>
          </motion.div>

          <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
              <Check className="h-4 w-4 text-emerald-300" />
              Cash on Delivery
            </span>
            <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
              <Truck className="h-4 w-4 text-emerald-300" />
              Fast Delivery
            </span>
            <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
              <RotateCcw className="h-4 w-4 text-emerald-300" />
              Easy Returns
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/68">Featured Collection</p>
            <h3 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">Discover more from the lineup.</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {PRODUCTS.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  changeProduct(product.id - 1);
                  pauseAutoplay();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="cursor-pointer rounded-2xl border border-white/15 bg-white/[0.06] p-3 text-left transition hover:border-white/30 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                aria-label={`View ${product.name} in hero`}
              >
                <div className="mb-2 flex h-24 items-center justify-center rounded-xl bg-black/20">
                  <img src={product.image} alt={product.name} loading="lazy" className="h-full object-contain" />
                </div>
                <p className="text-sm font-semibold text-white">{product.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/68">Social Proof</p>
            <h3 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              Buyers love the premium discovery flow.
            </h3>
            <p className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/92">
              <Star className="h-4 w-4 fill-current text-amber-300" />
              4.8 from 1,200+ happy customers
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {REVIEWS.map((review, index) => (
              <motion.article
                key={review.name}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.32, delay: index * 0.06 }}
                className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-3 flex items-center gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-white/76">{review.quote}</p>
                <div className="mt-4 border-t border-white/12 pt-4">
                  <p className="text-sm font-semibold text-white">{review.name}</p>
                  <p className="text-xs text-white/62">{review.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/18 bg-[linear-gradient(135deg,rgba(16,185,129,0.22)_0%,rgba(17,24,39,0.92)_56%,rgba(8,12,18,0.96)_100%)] p-8 text-center shadow-[0_36px_90px_rgba(0,0,0,0.48)] sm:p-12">
          <h3 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            Found your favorite? Order instantly now.
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/78">
            Move from discovery to action in seconds with premium support and a smooth WhatsApp ordering flow.
          </p>
          <button
            type="button"
            onClick={() => window.open("#", "_blank")}
            className="mt-8 min-h-12 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 px-8 text-base font-semibold text-emerald-950 shadow-[0_16px_40px_rgba(16,185,129,0.5)] transition hover:shadow-[0_20px_46px_rgba(16,185,129,0.62)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
          >
            Order on WhatsApp
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/75">
            <Package className="h-4 w-4 text-emerald-300" />
            Premium support available after purchase
          </div>
        </div>
      </section>
    </div>
  );
}
