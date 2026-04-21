"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const WATCHES = [
  {
    id: 1,
    name: "Eclipse Black",
    tagline: "Lightweight aerospace carbon fiber body with deep matte finish for the ultimate stealth aesthetic.",
    price: "$899",
    originalPrice: null,
    badge: "SIGNATURE",
    badgeColor: "#c9a227",
    image: "/demo/watch-1.png",
    dotColor: "#1a1a2e",
  },
  {
    id: 2,
    name: "Nebula Blue",
    tagline: "A deep iridescent blue sapphire glass face that shifts colors from navy to violet under different lighting.",
    price: "$589",
    originalPrice: "$749",
    badge: "LIMITED EDITION",
    badgeColor: "#6366f1",
    image: "/demo/watch-2.png",
    dotColor: "#3b49df",
  },
  {
    id: 3,
    name: "Obsidian Gold",
    tagline: "18K gold accents on forged carbon framework with brushed titanium caseback.",
    price: "$1,199",
    originalPrice: null,
    badge: "EXCLUSIVE",
    badgeColor: "#d4a017",
    image: "/demo/watch-3.png",
    dotColor: "#d4a017",
  },
];

const TESTIMONIALS = [
  {
    quote: "Ordering via WhatsApp was so easy. No complex checkout forms. Got my watch in 2 days!",
    name: "Kevin Thorne",
    role: "Verified Buyer",
    avatar: "#f59e0b",
  },
  {
    quote: "The Eclipse Black is stunning. The matte finish is even better in person. Highly recommend!",
    name: "Sarah Chen",
    role: "Verified Buyer",
    avatar: "#10b981",
  },
  {
    quote: "Best customer service I've ever had. They answered all my questions on WhatsApp before I bought.",
    name: "Markus Weber",
    role: "Verified Buyer",
    avatar: "#8b5cf6",
  },
];

const WHY_CHOOSE_ITEMS = [
  {
    id: "premium",
    title: "Premium Quality",
    description: "Precision-crafted materials and finish that feel luxurious from day one.",
    marker: "PQ",
  },
  {
    id: "fast",
    title: "Fast Delivery",
    description: "Quick dispatch with tracking so customers can order without waiting anxiety.",
    marker: "FD",
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Flexible payment confidence that helps first-time buyers convert faster.",
    marker: "CD",
  },
  {
    id: "returns",
    title: "Easy Returns",
    description: "Simple return support designed to remove hesitation before clicking order.",
    marker: "ER",
  },
];

// ── Inject keyframes ──────────────────────────
function useGlobalStyles() {
  useEffect(() => {
    const id = "chronos-lp2-conversion-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
      @keyframes lp2FadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
      @keyframes lp2HintFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      @keyframes lp2GlowPulse{0%,100%{opacity:.45}50%{opacity:.9}}
      @keyframes lp2Shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    `;
    document.head.appendChild(s);
  }, []);
}

// ── Fade observer ─────────────────────────────
function useFade() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.12 });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return { ref, v };
}

function Fade({ children, delay = 0, style = {} }) {
  const { ref, v } = useFade();
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(40px)", transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

// ── 3D Watch Carousel ─────────────────────────
function WatchCarousel({ watches, activeIndex, onChangeIndex }) {
  const touchX = useRef(0);
  const mouseX = useRef(null);
  const total = watches.length;

  const onSwipe = useCallback(
    (diff) => {
      if (Math.abs(diff) > 50) {
        onChangeIndex(activeIndex + (diff > 0 ? 1 : -1));
      }
    },
    [activeIndex, onChangeIndex]
  );

  const getTransform = (i) => {
    let offset = i - activeIndex;
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    const isActive = offset === 0;
    const absOff = Math.abs(offset);
    const x = offset * 280;
    const z = isActive ? 80 : -190 * absOff;
    const scale = isActive ? 1.1 : absOff === 1 ? 0.74 : 0.62;
    const opacity = isActive ? 1 : absOff === 1 ? 0.44 : 0.14;
    const brightness = isActive ? 1.2 : absOff === 1 ? 0.58 : 0.32;
    const blur = isActive ? 0 : absOff === 1 ? 1.8 : 3.6;

    return { x, z, scale, opacity, isActive, brightness, blur };
  };

  return (
    <div
      style={{
        position: "relative", width: "100%", height: "100%",
        perspective: "1300px", display: "flex", alignItems: "center",
        justifyContent: "center",
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const diff = touchX.current - e.changedTouches[0].clientX;
        onSwipe(diff);
      }}
      onMouseDown={(e) => {
        mouseX.current = e.clientX;
      }}
      onMouseUp={(e) => {
        if (mouseX.current == null) return;
        const diff = mouseX.current - e.clientX;
        mouseX.current = null;
        onSwipe(diff);
      }}
      onMouseLeave={() => {
        mouseX.current = null;
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: "66%", height: "66%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,162,39,0.18) 0%, rgba(99,102,241,0.08) 45%, transparent 75%)",
        filter: "blur(62px)",
        animation: "lp2GlowPulse 5s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {watches.map((w, i) => {
        const t = getTransform(i);
        return (
          <div
            key={w.id}
            onClick={() => onChangeIndex(i)}
            style={{
              position: "absolute", width: "280px", height: "280px",
              transform: `translateX(${t.x}px) translateZ(${t.z}px) scale(${t.scale})`,
              opacity: t.opacity,
              transition: "all 0.85s cubic-bezier(.22,.61,.36,1)",
              zIndex: t.isActive ? 20 : 10 - Math.abs(i - activeIndex),
              cursor: "pointer",
              filter: `brightness(${t.brightness}) saturate(${t.isActive ? 1.08 : 0.84}) blur(${t.blur}px)`,
              willChange: "transform, opacity, filter",
            }}
          >
            {t.isActive && (
              <div
                style={{
                  position: "absolute",
                  inset: "12%",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(201,162,39,0.25) 30%, rgba(99,102,241,0.15) 55%, transparent 75%)",
                  filter: "blur(30px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            )}
            <img
              src={w.image}
              alt={w.name}
              style={{
                width: "100%", height: "100%", objectFit: "contain",
                filter: t.isActive
                  ? "drop-shadow(0 36px 70px rgba(0,0,0,0.7)) drop-shadow(0 0 30px rgba(201,162,39,0.28))"
                  : "drop-shadow(0 22px 38px rgba(0,0,0,0.35))",
                transition: "filter 0.5s ease",
                position: "relative",
                zIndex: 1,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════
export default function DemoLandingPage2() {
  useGlobalStyles();
  const [activeWatch, setActiveWatch] = useState(1); // Start with Nebula Blue
  const [autoplay, setAutoplay] = useState(true);
  const total = WATCHES.length;

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setActiveWatch((p) => (p + 1) % total), 5000);
    return () => clearInterval(id);
  }, [autoplay, total]);

  const goTo = useCallback((i) => {
    setActiveWatch(((i % total) + total) % total);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  }, [total]);

  const watch = WATCHES[activeWatch];
  const urgencyNote =
    watch.badge === "LIMITED EDITION"
      ? "Limited drop. Stock updates hourly."
      : watch.badge === "EXCLUSIVE"
      ? "Only few left in this finish."
      : "Best seller this week.";

  return (
    <div style={{
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 700px at 15% -10%, rgba(99,102,241,0.16), transparent 62%), radial-gradient(900px 540px at 86% 0%, rgba(201,162,39,0.16), transparent 58%), #07080d",
      color: "#f3efe8",
      fontFamily: "'Manrope', sans-serif",
      overflowX: "hidden",
    }}>
      {/* ── HERO SECTION (Desire → Selection → Action) ────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          padding: "22px 24px 56px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(9,10,16,0.9) 0%, rgba(10,11,18,0.65) 42%, rgba(7,8,13,0.98) 100%)",
          }}
        />

        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Top bar */}
          <div
            className="lp2-topbar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              padding: "12px 16px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "1px solid rgba(201,162,39,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "#e7d5a1",
                }}
              >
                AC
              </div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                  color: "rgba(243,239,232,0.94)",
                }}
              >
                AURA CHRONOS
              </p>
            </div>

            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: "rgba(243,239,232,0.75)",
                background: "rgba(201,162,39,0.1)",
                border: "1px solid rgba(201,162,39,0.28)",
                borderRadius: "999px",
                padding: "6px 12px",
                whiteSpace: "nowrap",
              }}
            >
              Trusted by 1,200+ customers
            </div>
          </div>

          {/* Headline block */}
          <Fade delay={0.06}>
            <div
              style={{
                textAlign: "center",
                margin: "44px auto 26px",
                maxWidth: "860px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.24em",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#d6b760",
                }}
              >
                LIMITED EDITION DROP
              </p>
              <h1
                style={{
                  margin: "12px 0 14px",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(42px, 8.2vw, 78px)",
                  fontWeight: 700,
                  lineHeight: 0.95,
                  letterSpacing: "0.01em",
                  color: "#f5f1e9",
                }}
              >
                Find the Style Everyone Wants
              </h1>
              <p
                style={{
                  margin: "0 auto",
                  maxWidth: "620px",
                  fontSize: "clamp(14px, 2.6vw, 17px)",
                  lineHeight: 1.7,
                  color: "rgba(243,239,232,0.66)",
                }}
              >
                Premium quality. Limited stock. Instant WhatsApp ordering with no payment required now.
              </p>
            </div>
          </Fade>

          {/* Carousel + floating CTA card */}
          <div
            className="lp2-hero-main"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 380px",
              gap: "28px",
              alignItems: "center",
            }}
          >
            <Fade delay={0.1}>
              <div
                style={{
                  borderRadius: "28px",
                  background: "linear-gradient(180deg, rgba(22,24,36,0.5) 0%, rgba(10,12,19,0.45) 100%)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(20px)",
                  padding: "26px 12px 18px",
                  boxShadow: "0 44px 90px rgba(0,0,0,0.52)",
                }}
              >
                <div style={{ height: "460px", maxWidth: "820px", margin: "0 auto" }}>
                  <WatchCarousel watches={WATCHES} activeIndex={activeWatch} onChangeIndex={goTo} />
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
                  {WATCHES.map((w, i) => (
                    <button
                      key={w.id}
                      onClick={() => goTo(i)}
                      aria-label={`Select ${w.name}`}
                      style={{
                        width: i === activeWatch ? "28px" : "10px",
                        height: "10px",
                        borderRadius: "999px",
                        border: i === activeWatch ? `1px solid ${w.badgeColor}` : "1px solid rgba(255,255,255,0.22)",
                        background: i === activeWatch ? w.badgeColor : "rgba(255,255,255,0.22)",
                        transition: "all 0.25s ease",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

                <p
                  style={{
                    margin: "14px 0 2px",
                    textAlign: "center",
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(243,239,232,0.5)",
                    animation: "lp2HintFloat 2.6s ease-in-out infinite",
                  }}
                >
                  Swipe to explore products
                </p>
              </div>
            </Fade>

            <Fade delay={0.15}>
              <aside
                key={watch.id}
                className="lp2-cta-card"
                style={{
                  borderRadius: "22px",
                  padding: "24px",
                  background:
                    "linear-gradient(180deg, rgba(25,26,38,0.88) 0%, rgba(13,15,22,0.94) 100%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 34px 80px rgba(0,0,0,0.5)",
                  animation: "lp2FadeUp .45s ease",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: `${watch.badgeColor}20`,
                    border: `1px solid ${watch.badgeColor}5c`,
                    borderRadius: "999px",
                    padding: "6px 12px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: watch.badgeColor,
                      boxShadow: `0 0 16px ${watch.badgeColor}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: watch.badgeColor,
                    }}
                  >
                    {watch.badge}
                  </span>
                </div>

                <h2
                  style={{
                    margin: "16px 0 4px",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "40px",
                    lineHeight: 0.95,
                    fontWeight: 700,
                    color: "#f5f1e9",
                  }}
                >
                  {watch.name}
                </h2>

                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "rgba(243,239,232,0.86)",
                  }}
                >
                  Designed to elevate your everyday style.
                </p>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: "12px",
                    lineHeight: 1.7,
                    color: "rgba(243,239,232,0.58)",
                  }}
                >
                  {watch.tagline}
                </p>

                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px" }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "34px",
                      fontWeight: 700,
                      color: "#f7f2e9",
                    }}
                  >
                    {watch.price}
                  </span>
                  {watch.originalPrice && (
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "16px",
                        color: "rgba(243,239,232,0.38)",
                        textDecoration: "line-through",
                      }}
                    >
                      {watch.originalPrice}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    borderRadius: "12px",
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.35)",
                    color: "#fecaca",
                    padding: "8px 11px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                >
                  {urgencyNote}
                </div>

                <button
                  onClick={() => window.open("#", "_blank")}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "14px",
                    padding: "15px 14px",
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "#081109",
                    background:
                      "linear-gradient(95deg, #25d366 0%, #56f08c 48%, #25d366 100%)",
                    backgroundSize: "200% 100%",
                    boxShadow: "0 14px 30px rgba(37,211,102,0.33)",
                    cursor: "pointer",
                    transition: "transform .2s ease, box-shadow .2s ease",
                    animation: "lp2Shimmer 3.6s linear infinite",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 18px 34px rgba(37,211,102,0.42)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 14px 30px rgba(37,211,102,0.33)";
                  }}
                >
                  Order on WhatsApp
                </button>

                <p
                  style={{
                    margin: "10px 0 14px",
                    fontSize: "11px",
                    textAlign: "center",
                    color: "rgba(243,239,232,0.56)",
                  }}
                >
                  No payment required now • Ask anything first
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "8px",
                  }}
                >
                  {[
                    "Cash on Delivery",
                    "Fast Delivery",
                    "Easy Returns",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.13)",
                        background: "rgba(255,255,255,0.03)",
                        padding: "8px 6px",
                        fontSize: "10px",
                        fontWeight: 700,
                        textAlign: "center",
                        color: "rgba(243,239,232,0.82)",
                        lineHeight: 1.35,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </aside>
            </Fade>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────── */}
      <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "34px 24px 44px" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(214,183,96,0.92)",
              }}
            >
              Why Choose Us
            </p>
            <h3
              style={{
                margin: "10px 0 0",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(30px, 5vw, 48px)",
                fontWeight: 700,
                color: "#f5f1e9",
              }}
            >
              Built to Convert Curiosity into Confidence
            </h3>
          </div>
        </Fade>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {WHY_CHOOSE_ITEMS.map((item, idx) => (
            <Fade key={item.id} delay={idx * 0.06}>
              <article
                style={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.09)",
                  background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(16,17,26,0.65) 100%)",
                  padding: "18px 16px",
                  boxShadow: "0 18px 34px rgba(0,0,0,0.28)",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    border: "1px solid rgba(201,162,39,0.5)",
                    background: "rgba(201,162,39,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e7d5a1",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    marginBottom: "12px",
                  }}
                >
                  {item.marker}
                </div>
                <h4
                  style={{
                    margin: "0 0 6px",
                    fontSize: "16px",
                    color: "#f6f1e9",
                    fontWeight: 800,
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    lineHeight: 1.7,
                    color: "rgba(243,239,232,0.62)",
                  }}
                >
                  {item.description}
                </p>
              </article>
            </Fade>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────── */}
      <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "26px 24px 66px" }}>
        <Fade>
          <div
            style={{
              marginBottom: "22px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                borderRadius: "999px",
                border: "1px solid rgba(245,158,11,0.4)",
                background: "rgba(245,158,11,0.12)",
                color: "#fcd68a",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                padding: "10px 16px",
              }}
            >
              ★ 4.8 from 1,200+ happy customers
            </div>
          </div>
        </Fade>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "14px",
          }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <Fade key={t.name} delay={idx * 0.07}>
              <article
                style={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "linear-gradient(160deg, rgba(20,22,34,0.92) 0%, rgba(11,13,20,0.97) 100%)",
                  padding: "22px 20px",
                  boxShadow: "0 20px 38px rgba(0,0,0,0.32)",
                }}
              >
                <p style={{ margin: "0 0 8px", color: "#f59e0b", fontSize: "13px", letterSpacing: "0.04em" }}>★★★★★</p>
                <p
                  style={{
                    margin: "0 0 16px",
                    color: "rgba(243,239,232,0.7)",
                    lineHeight: 1.75,
                    fontSize: "13px",
                  }}
                >
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: t.avatar,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#f5f1e9" }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "rgba(243,239,232,0.42)" }}>{t.role}</p>
                  </div>
                </div>
              </article>
            </Fade>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────── */}
      <section style={{ padding: "0 24px 100px" }}>
        <Fade>
          <div
            style={{
              maxWidth: "940px",
              margin: "0 auto",
              borderRadius: "28px",
              overflow: "hidden",
              background:
                "linear-gradient(105deg, rgba(8,11,21,0.95) 0%, rgba(19,23,39,0.95) 34%, rgba(23,18,8,0.94) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 44px 100px rgba(0,0,0,0.5)",
              textAlign: "center",
              padding: "74px 24px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-120px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "430px",
                height: "240px",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(201,162,39,0.28) 0%, transparent 74%)",
                filter: "blur(26px)",
                pointerEvents: "none",
              }}
            />

            <h3
              style={{
                position: "relative",
                margin: "0 0 10px",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(34px, 6vw, 58px)",
                lineHeight: 0.95,
                color: "#f7f2e9",
                fontWeight: 700,
              }}
            >
              Found the one you like? Order now.
            </h3>

            <p
              style={{
                position: "relative",
                margin: "0 auto 24px",
                maxWidth: "560px",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "rgba(243,239,232,0.64)",
              }}
            >
              This drop is moving fast. Message us on WhatsApp to reserve your preferred model before it sells out.
            </p>

            <button
              onClick={() => window.open("#", "_blank")}
              style={{
                position: "relative",
                border: "none",
                borderRadius: "14px",
                padding: "16px 34px",
                fontSize: "15px",
                fontWeight: 800,
                letterSpacing: "0.02em",
                color: "#081109",
                background: "linear-gradient(95deg, #25d366 0%, #62f39a 52%, #25d366 100%)",
                backgroundSize: "200% 100%",
                boxShadow: "0 16px 34px rgba(37,211,102,0.35)",
                cursor: "pointer",
                animation: "lp2Shimmer 3.4s linear infinite",
              }}
            >
              Order on WhatsApp
            </button>

            <p
              style={{
                position: "relative",
                margin: "14px 0 0",
                fontSize: "11px",
                color: "rgba(243,239,232,0.55)",
              }}
            >
              Cash on Delivery • Fast Delivery • Easy Returns
            </p>
          </div>
        </Fade>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px 30px" }}>
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px", color: "rgba(243,239,232,0.48)", letterSpacing: "0.1em" }}>
            AURA CHRONOS
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "rgba(243,239,232,0.32)" }}>
            Premium selections for ad-driven commerce.
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 1040px) {
          .lp2-hero-main {
            grid-template-columns: 1fr !important;
          }
          .lp2-cta-card {
            max-width: 640px;
            margin: 0 auto;
          }
        }

        @media (max-width: 760px) {
          .lp2-topbar {
            padding: 10px 12px !important;
          }
        }

        @media (max-width: 640px) {
          .lp2-topbar {
            flex-direction: column;
            align-items: flex-start !important;
          }
        }

        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
