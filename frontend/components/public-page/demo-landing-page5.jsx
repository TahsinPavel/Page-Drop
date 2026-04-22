"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Crown,
  Gem,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Noir Atelier One",
    hook: "Crafted to bring timeless elegance to your everyday style.",
    description:
      "A luxury statement silhouette with refined detailing and premium finish designed for high perceived value.",
    price: "$459",
    prestige: "Exclusive Collection",
    supportLine: "No payment required now - Premium support available",
    badge: "LIMITED LUXURY DROP",
    glow: "rgba(248, 200, 120, 0.48)",
    image: "/demo/headphones-1.png",
  },
  {
    id: 2,
    name: "Aurum Signature",
    hook: "Made for customers who choose prestige first.",
    description:
      "Balanced luxury aesthetics and premium comfort profile presented in a showroom-inspired buying experience.",
    price: "$529",
    prestige: "Premium Choice",
    supportLine: "No payment required now - Premium support available",
    badge: "EXCLUSIVE RELEASE",
    glow: "rgba(245, 180, 75, 0.45)",
    image: "/demo/headphones-2.png",
  },
  {
    id: 3,
    name: "Velvet Crown Pro",
    hook: "Luxury crafted for everyday elegance.",
    description:
      "A high-ticket premium product with elevated detail language and rich visual identity for conversion confidence.",
    price: "$499",
    prestige: "Limited Edition",
    supportLine: "No payment required now - Premium support available",
    badge: "PREMIUM COLLECTION",
    glow: "rgba(255, 214, 153, 0.44)",
    image: "/demo/headphones-3.png",
  },
];

const WHY_CHOOSE_US = [
  {
    icon: Gem,
    title: "Premium Quality",
    description:
      "Selected materials and finishing standards designed to create immediate premium perception.",
  },
  {
    icon: Crown,
    title: "Luxury Craftsmanship",
    description:
      "Design language, detailing, and polish tuned for high-end positioning and desirability.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Premium delivery flow with clear communication that preserves buyer confidence after checkout intent.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description:
      "Simple return support to reduce friction and hesitation for first-time high-ticket buyers.",
  },
];

const TESTIMONIALS = [
  {
    name: "Olivia Reed",
    role: "Verified Buyer",
    review:
      "The pedestal presentation made the product look premium instantly. The order process felt exclusive and smooth.",
  },
  {
    name: "Hugo Martins",
    role: "Verified Buyer",
    review:
      "Excellent quality and premium support. The visual experience gave me confidence before I clicked order.",
  },
  {
    name: "Mia Patel",
    role: "Verified Buyer",
    review:
      "Very elegant design and clear trust signals. Fast delivery and exactly the premium feel I expected.",
  },
];

function wrapIndex(index, length) {
  return ((index % length) + length) % length;
}

function relativeOffset(index, activeIndex, length) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function PedestalShowcase({ products, activeIndex, onChange, onInteract }) {
  const reducedMotion = useReducedMotion();
  const touchStartX = useRef(0);

  const transition = useMemo(
    () =>
      reducedMotion
        ? { duration: 0.2 }
        : {
            type: "spring",
            stiffness: 230,
            damping: 26,
            mass: 0.85,
          },
    [reducedMotion]
  );

  const handleSwipe = useCallback(
    (deltaX) => {
      if (Math.abs(deltaX) < 50) return;
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
        className="relative h-[360px] sm:h-[420px] lg:h-[500px]"
        style={{ perspective: "1700px", transformStyle: "preserve-3d" }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          handleSwipe(e.changedTouches[0].clientX - touchStartX.current);
        }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[42%] h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          animate={
            reducedMotion
              ? { opacity: 0.75 }
              : {
                  opacity: [0.58, 0.9, 0.58],
                  scale: [0.95, 1.06, 0.95],
                }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(circle, ${activeProduct.glow} 0%, rgba(255,255,255,0) 72%)`,
          }}
        />

        <div className="pointer-events-none absolute bottom-10 left-1/2 h-24 w-[320px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-100/35 via-amber-200/20 to-transparent blur-xl" />
        <div className="pointer-events-none absolute bottom-8 left-1/2 h-14 w-[290px] -translate-x-1/2 rounded-full border border-amber-100/30 bg-gradient-to-r from-amber-100/25 via-amber-200/18 to-amber-100/25" />
        <div className="pointer-events-none absolute bottom-5 left-1/2 h-10 w-[240px] -translate-x-1/2 rounded-full bg-black/45 blur-lg" />

        {products.map((product, index) => {
          const rel = relativeOffset(index, activeIndex, products.length);
          const abs = Math.abs(rel);
          const isActive = rel === 0;
          const isVisible = abs <= 1;

          const x = rel * 210;
          const y = isActive ? -24 : 8 + abs * 20;
          const scale = isActive ? 1 : 0.66;
          const rotateY = isActive ? 0 : rel < 0 ? 34 : -34;
          const z = isActive ? 110 : -75;
          const opacity = isActive ? 1 : 0.42;
          const brightness = isActive ? 1 : 0.62;
          const blur = isActive ? 0 : 2;

          return (
            <motion.button
              key={product.id}
              type="button"
              aria-label={`Show ${product.name}`}
              onClick={() => {
                onChange(index);
                onInteract();
              }}
              className="absolute left-1/2 top-[48%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 border-none bg-transparent p-0 sm:h-[270px] sm:w-[270px] lg:h-[330px] lg:w-[330px]"
              initial={false}
              animate={{
                x,
                y,
                scale,
                rotateY,
                z,
                opacity: isVisible ? opacity : 0,
                filter: `brightness(${brightness}) blur(${blur}px)`,
              }}
              transition={transition}
              style={{
                transformStyle: "preserve-3d",
                zIndex: isActive ? 40 : 20 - abs,
                pointerEvents: isVisible ? "auto" : "none",
              }}
              drag="x"
              dragElastic={0.14}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                handleSwipe(info.offset.x + info.velocity.x * 0.12);
              }}
              whileTap={{ scale: isActive ? 0.99 : 0.64 }}
            >
              {isActive && (
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-[62%] h-8 w-[160px] -translate-x-1/2 rounded-full bg-black/45 blur-md"
                  animate={reducedMotion ? { opacity: 0.56 } : { opacity: [0.38, 0.66, 0.38] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <motion.div
                className="relative h-full w-full"
                animate={
                  isActive && !reducedMotion
                    ? { y: [0, -8, 0] }
                    : { y: 0 }
                }
                transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-contain"
                  style={{
                    filter: isActive
                      ? "drop-shadow(0 22px 38px rgba(0,0,0,0.56))"
                      : "drop-shadow(0 12px 22px rgba(0,0,0,0.36))",
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
          className="absolute left-1 top-1/2 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 md:flex"
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
          className="absolute right-1 top-1/2 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 md:flex"
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
            className={`min-h-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${
              index === activeIndex ? "h-2 w-8 bg-amber-100" : "h-2 w-2 bg-white/40 hover:bg-white/65"
            }`}
          />
        ))}
      </div>

      <motion.p
        className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-white/65"
        animate={
          reducedMotion
            ? { opacity: 0.75 }
            : { opacity: [0.45, 0.92, 0.45], y: [0, -3, 0] }
        }
        transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
      >
        Swipe to explore the collection
      </motion.p>
    </div>
  );
}

export default function DemoLandingPage5() {
  const reducedMotion = useReducedMotion();
  const [activeProduct, setActiveProduct] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const total = PRODUCTS.length;
  const active = PRODUCTS[activeProduct];

  useEffect(() => {
    if (!autoplay) return undefined;
    const id = window.setInterval(() => {
      setActiveProduct((prev) => wrapIndex(prev + 1, total));
    }, 5000);
    return () => window.clearInterval(id);
  }, [autoplay, total]);

  const handleChange = useCallback(
    (nextIndex) => {
      setActiveProduct(wrapIndex(nextIndex, total));
    },
    [total]
  );

  const pauseAutoplay = useCallback(() => {
    setAutoplay(false);
    window.setTimeout(() => setAutoplay(true), 9500);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_15%_12%,rgba(255,220,160,0.14),transparent_30%),radial-gradient(circle_at_82%_14%,rgba(214,170,96,0.12),transparent_32%),linear-gradient(160deg,#050507_0%,#0a0c12_42%,#11151f_100%)] text-white">
      <section className="min-h-screen px-3 pb-10 pt-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-2xl border border-amber-100/20 bg-white/[0.04] px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-100/25 bg-amber-100/10">
                <Crown className="h-5 w-5 text-amber-200" />
              </div>
              <p className="text-sm font-semibold tracking-[0.18em] text-amber-100">LUXORA</p>
            </div>

            <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-amber-100/25 bg-amber-100/10 px-4 py-2 text-sm text-amber-50/95">
              <BadgeCheck className="h-4 w-4 text-amber-200" />
              Trusted Luxury Quality
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl text-center sm:mt-12">
          <p className="inline-flex items-center rounded-full border border-amber-100/35 bg-amber-100/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-100">
            Premium Collection
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Luxury crafted for everyday elegance.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
            Discover premium quality products crafted to elevate your style instantly with a luxury showroom pedestal experience.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(330px,1fr)] lg:gap-8">
          <div className="rounded-3xl border border-amber-100/20 bg-white/[0.05] px-3 py-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-5 sm:py-6">
            <PedestalShowcase
              products={PRODUCTS}
              activeIndex={activeProduct}
              onChange={handleChange}
              onInteract={pauseAutoplay}
            />
          </div>

          <motion.aside
            key={active.id}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: "easeOut" }}
            className="rounded-3xl border border-amber-100/25 bg-white/[0.08] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-6"
          >
            <div className="inline-flex items-center rounded-full border border-amber-100/30 bg-amber-100/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-100">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {active.badge}
            </div>

            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">{active.name}</h2>
            <p className="mt-2 text-base font-medium text-amber-50/95">{active.hook}</p>
            <p className="mt-3 text-base leading-relaxed text-white/72">{active.description}</p>

            <div className="mt-4 text-4xl font-semibold tracking-tight text-amber-50">{active.price}</div>
            <div className="mt-2 inline-flex min-h-11 items-center rounded-full border border-amber-100/30 bg-amber-100/12 px-4 text-sm font-medium text-amber-100">
              {active.prestige}
            </div>

            <button
              type="button"
              onClick={() => window.open("#", "_blank")}
              className="mt-5 min-h-12 w-full rounded-xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 px-5 text-base font-semibold text-amber-950 shadow-[0_14px_34px_rgba(245,180,75,0.42)] transition hover:shadow-[0_18px_42px_rgba(245,180,75,0.56)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
            >
              Order on WhatsApp
            </button>

            <p className="mt-3 text-center text-sm text-white/75">{active.supportLine}</p>

            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-white/90">
              <div className="flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3">
                <Gem className="h-4 w-4 text-amber-200" />
                Premium Quality
              </div>
              <div className="flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3">
                <Truck className="h-4 w-4 text-amber-200" />
                Fast Delivery
              </div>
              <div className="flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3">
                <ShieldCheck className="h-4 w-4 text-amber-200" />
                Easy Returns
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/70">Why Choose Us</p>
            <h3 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              Trust built for premium buyers.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/72">
              Prestige matters, but conversion depends on trust signals. Every section is designed to remove hesitation and reinforce value.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item, index) => (
              <motion.article
                key={item.title}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.32, delay: index * 0.05 }}
                className="rounded-2xl border border-amber-100/20 bg-white/[0.06] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-amber-100/25 bg-amber-100/10">
                  <item.icon className="h-5 w-5 text-amber-200" />
                </div>
                <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/72">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/70">Social Proof</p>
            <h3 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              Premium customers, proven satisfaction.
            </h3>
            <p className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-amber-100/30 bg-amber-100/10 px-4 py-2 text-sm text-amber-50">
              <Star className="h-4 w-4 fill-current text-amber-200" />
              4.9 from premium customers
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.32, delay: index * 0.06 }}
                className="rounded-2xl border border-amber-100/20 bg-white/[0.06] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-3 flex items-center gap-1 text-amber-200">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-white/74">{testimonial.review}</p>
                <div className="mt-4 border-t border-white/12 pt-4">
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-white/62">{testimonial.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-amber-100/25 bg-[linear-gradient(135deg,rgba(245,180,75,0.18)_0%,rgba(17,24,39,0.9)_52%,rgba(8,10,15,0.95)_100%)] p-8 text-center shadow-[0_34px_90px_rgba(0,0,0,0.5)] sm:p-12">
          <h3 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            Experience premium quality - order today.
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/76">
            Move from prestige to action in seconds with a luxury flow built to increase confidence and maximize conversion.
          </p>
          <button
            type="button"
            onClick={() => window.open("#", "_blank")}
            className="mt-8 min-h-12 rounded-xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 px-8 text-base font-semibold text-amber-950 shadow-[0_16px_38px_rgba(245,180,75,0.45)] transition hover:shadow-[0_20px_44px_rgba(245,180,75,0.58)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
          >
            Order on WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
}
