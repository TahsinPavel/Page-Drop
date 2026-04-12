"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
 * AURA CHRONOS — Premium Watch Showroom  (Landing Page 2)
 * Matches the Variant.com design exactly:
 *   - Top nav: AURA CHRONOS logo | nav links | search + cart
 *   - Hero: 3D watch carousel (left) + product info card (right)
 *   - Trust badges bar (stars, delivery, ordering)
 *   - Craftsmanship: left text + right watch image + customer voice
 *   - Testimonials: 3 cards
 *   - CTA card
 *   - Footer with social icons
 * ═══════════════════════════════════════════════════════════ */

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

const NAV_LINKS = ["Collections", "Our Story", "Tech", "Support"];

// ── Inject keyframes ──────────────────────────
function useGlobalStyles() {
  useEffect(() => {
    const id = "chronos-lp2-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=JetBrains+Mono:wght@500;700&display=swap');
      @keyframes lp2FadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes lp2Float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes lp2Pulse{0%,100%{opacity:.35}50%{opacity:.9}}
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
  const total = watches.length;

  const getTransform = (i) => {
    let offset = i - activeIndex;
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    const isActive = offset === 0;
    const absOff = Math.abs(offset);
    const x = offset * 300;
    const z = isActive ? 0 : -180 * absOff;
    const scale = isActive ? 1 : 0.7;
    const opacity = absOff > 1 ? 0.25 : isActive ? 1 : 0.55;
    const brightness = isActive ? 1 : 0.45;

    return { x, z, scale, opacity, isActive, brightness };
  };

  return (
    <div
      style={{
        position: "relative", width: "100%", height: "100%",
        perspective: "1200px", display: "flex", alignItems: "center",
        justifyContent: "center",
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const diff = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) onChangeIndex(activeIndex + (diff > 0 ? 1 : -1));
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: "60%", height: "60%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,162,39,0.04) 0%, transparent 70%)",
        filter: "blur(50px)", pointerEvents: "none",
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
              transition: "all 0.8s cubic-bezier(.25,.1,.25,1)",
              zIndex: t.isActive ? 10 : 5 - Math.abs(i - activeIndex),
              cursor: "pointer",
              filter: `brightness(${t.brightness})`,
            }}
          >
            <img
              src={w.image}
              alt={w.name}
              style={{
                width: "100%", height: "100%", objectFit: "contain",
                filter: t.isActive ? "drop-shadow(0 20px 50px rgba(0,0,0,0.7))" : "none",
                transition: "filter 0.5s",
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
  const [mobileNav, setMobileNav] = useState(false);
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

  return (
    <div style={{
      minHeight: "100vh", background: "#08080c", color: "#f0ece4",
      fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden",
    }}>
      {/* ── NAV ─────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "60px",
        background: "rgba(8,8,12,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            border: "1.5px solid rgba(201,162,39,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px",
          }}>⌚</div>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "13px",
            letterSpacing: "0.1em", color: "#f0ece4",
          }}>AURA CHRONOS</span>
        </div>

        {/* Center nav links (desktop) */}
        <div className="lp2-desktop-nav" style={{
          display: "flex", alignItems: "center", gap: "28px",
          position: "absolute", left: "50%", transform: "translateX(-50%)",
        }}>
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" style={{
              fontSize: "12px", fontWeight: 500, color: "rgba(240,236,228,0.5)",
              textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#c9a227"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(240,236,228,0.5)"; }}
            >{link}</a>
          ))}
        </div>

        {/* Right icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(240,236,228,0.5)", padding: "4px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(240,236,228,0.5)", padding: "4px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
          {/* Mobile hamburger */}
          <button className="lp2-mobile-toggle" onClick={() => setMobileNav(!mobileNav)} style={{
            display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px",
          }}>
            <div style={{ width: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ height: "2px", background: "#c9a227", borderRadius: "2px", transition: "all 0.3s", transform: mobileNav ? "rotate(45deg) translate(4px,4px)" : "none" }} />
              <span style={{ height: "2px", background: "#c9a227", borderRadius: "2px", transition: "all 0.3s", opacity: mobileNav ? 0 : 1 }} />
              <span style={{ height: "2px", background: "#c9a227", borderRadius: "2px", transition: "all 0.3s", transform: mobileNav ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileNav && (
        <div style={{
          position: "fixed", top: "60px", left: 0, right: 0, bottom: 0,
          background: "rgba(8,8,12,0.97)", backdropFilter: "blur(20px)",
          zIndex: 99, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "28px",
          animation: "lp2FadeUp 0.3s ease",
        }}>
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" onClick={() => setMobileNav(false)} style={{
              fontSize: "18px", fontWeight: 600, color: "#f0ece4", textDecoration: "none",
            }}>{link}</a>
          ))}
        </div>
      )}

      {/* ── HERO SECTION ────────────────────────── */}
      <section style={{
        minHeight: "100vh", paddingTop: "60px", display: "flex",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #0b0b14 0%, #0a0a12 40%, #08080c 100%)",
        }} />

        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: "25%", left: "35%", width: "400px", height: "400px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,39,0.04) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        {/* Left: 3D Carousel */}
        <div style={{
          flex: "1 1 60%", position: "relative", display: "flex",
          alignItems: "center", justifyContent: "center",
          minHeight: "calc(100vh - 60px)", zIndex: 2,
        }}>
          <WatchCarousel watches={WATCHES} activeIndex={activeWatch} onChangeIndex={goTo} />

          {/* "EXPLORE THE COLLECTION" */}
          <div style={{
            position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
            animation: "lp2Pulse 3s ease-in-out infinite",
          }}>
            <span style={{ fontSize: "9px", color: "rgba(240,236,228,0.2)", letterSpacing: "0.2em", fontWeight: 600 }}>EXPLORE THE COLLECTION</span>
            <div style={{ width: "1px", height: "20px", background: "linear-gradient(to bottom, rgba(201,162,39,0.3), transparent)" }} />
          </div>
        </div>

        {/* Right: Product Info Card */}
        <div style={{
          flex: "0 0 380px", display: "flex", alignItems: "center",
          justifyContent: "center", padding: "40px 32px 40px 0", zIndex: 3,
        }}>
          <div
            key={watch.id}
            style={{
              width: "100%", maxWidth: "340px",
              background: "rgba(18,18,24,0.92)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px", padding: "28px", backdropFilter: "blur(20px)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              animation: "lp2FadeUp 0.5s ease",
            }}
          >
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: `${watch.badgeColor}15`, border: `1px solid ${watch.badgeColor}30`,
              borderRadius: "6px", padding: "4px 10px", marginBottom: "14px",
            }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: watch.badgeColor }} />
              <span style={{
                fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
                color: watch.badgeColor, textTransform: "uppercase",
              }}>{watch.badge}</span>
            </div>

            {/* Color dots */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
              {WATCHES.map((w, i) => (
                <button
                  key={w.id}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === activeWatch ? "10px" : "8px",
                    height: i === activeWatch ? "10px" : "8px",
                    borderRadius: "50%", border: i === activeWatch ? `2px solid ${w.dotColor}` : "1px solid rgba(255,255,255,0.1)",
                    background: w.dotColor, cursor: "pointer",
                    transition: "all 0.3s", padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Watch name */}
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700,
              fontStyle: "italic", color: "#f0ece4", margin: "0 0 8px", lineHeight: 1.15,
            }}>{watch.name}</h2>

            {/* Description */}
            <p style={{
              fontSize: "12px", color: "rgba(240,236,228,0.4)", lineHeight: 1.65,
              margin: "0 0 18px",
            }}>{watch.tagline}</p>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "18px" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "26px",
                fontWeight: 700, color: "#f0ece4",
              }}>{watch.price}</span>
              {watch.originalPrice && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "14px",
                  color: "rgba(240,236,228,0.3)", textDecoration: "line-through",
                }}>{watch.originalPrice}</span>
              )}
            </div>

            {/* Trust items */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "22px" }}>
              {[
                { icon: "🚚", text: "Free Delivery" },
                { icon: "⏱️", text: "72H Installable" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px" }}>{item.icon}</span>
                  <span style={{ fontSize: "11px", color: "rgba(240,236,228,0.45)" }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => window.open("#", "_blank")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", width: "100%", padding: "14px 0",
                background: "#f0ece4", color: "#08080c", border: "none",
                borderRadius: "12px", fontSize: "13px", fontWeight: 700,
                fontFamily: "'Inter', sans-serif", cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f0ece4"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order {watch.name} on WhatsApp
            </button>

            {/* Sub-note */}
            <p style={{
              fontSize: "10px", color: "rgba(240,236,228,0.25)", textAlign: "center",
              marginTop: "12px",
            }}>No payment required now • Ask anything first</p>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES BAR ────────────────────── */}
      <Fade>
        <div style={{
          display: "flex", justifyContent: "center", gap: "60px",
          padding: "40px 24px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          flexWrap: "wrap",
        }}>
          {[
            { stars: true, title: "4.8 Average Rating", sub: "Based on 1,500+ genuine reviews" },
            { icon: "⚡", title: "Lightning Fast Delivery", sub: "Ships within 24 hours of order" },
            { icon: "🛒", title: "Hassle-Free Ordering", sub: "Order via WhatsApp, Pay at doorstep" },
          ].map((b) => (
            <div key={b.title} style={{ textAlign: "center" }}>
              {b.stars ? (
                <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "8px" }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#f59e0b", fontSize: "14px" }}>★</span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: "20px", marginBottom: "8px" }}>{b.icon}</div>
              )}
              <p style={{
                fontSize: "14px", fontWeight: 700, color: "#f0ece4", margin: "0 0 4px",
              }}>{b.title}</p>
              <p style={{ fontSize: "11px", color: "rgba(240,236,228,0.35)", margin: 0 }}>{b.sub}</p>
            </div>
          ))}
        </div>
      </Fade>

      {/* ── CRAFTSMANSHIP SECTION ───────────────── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          {/* Left: Text */}
          <Fade>
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800,
                lineHeight: 1.15, margin: "0 0 20px", color: "#f0ece4",
              }}>
                Masterfully crafted<br />for the modern{" "}
                <span style={{ fontStyle: "italic", color: "#c9a227" }}>visionary.</span>
              </h2>
              <p style={{
                fontSize: "14px", color: "rgba(240,236,228,0.4)", lineHeight: 1.7,
                margin: "0 0 36px", maxWidth: "420px",
              }}>
                We don't just make watches. We create statements of engineering
                that bridge the gap between digital luxury and physical excellence.
              </p>

              {/* Spec items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { icon: "◆", title: "Premium Grade 5 Titanium", desc: "Ultra-lightweight yet stronger than steel. Used in aerospace applications." },
                  { icon: "◆", title: "100M Water Resistance", desc: "Designed for both deep boardroom discussions and deep ocean exploration." },
                ].map((spec) => (
                  <div key={spec.title} style={{ display: "flex", gap: "14px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#c9a227", fontSize: "12px", flexShrink: 0, marginTop: "2px",
                    }}>{spec.icon}</div>
                    <div>
                      <p style={{
                        fontSize: "14px", fontWeight: 700, color: "#f0ece4", margin: "0 0 4px",
                      }}>{spec.title}</p>
                      <p style={{
                        fontSize: "12px", color: "rgba(240,236,228,0.4)", margin: 0, lineHeight: 1.6,
                      }}>{spec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Fade>

          {/* Right: Watch illustration + customer voice */}
          <Fade delay={0.15}>
            <div style={{ position: "relative" }}>
              {/* Watch image */}
              <div style={{
                width: "100%", aspectRatio: "1", maxWidth: "380px", margin: "0 auto",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,162,39,0.06) 0%, rgba(20,20,28,0.8) 60%, transparent 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                {/* Minimalist clock face */}
                <div style={{
                  width: "65%", height: "65%", borderRadius: "50%",
                  border: "2px solid rgba(240,236,228,0.08)",
                  position: "relative",
                  background: "rgba(20,20,28,0.5)",
                }}>
                  {/* Hour marks */}
                  {[...Array(12)].map((_, i) => (
                    <div key={i} style={{
                      position: "absolute", top: "50%", left: "50%",
                      width: i % 3 === 0 ? "2px" : "1px",
                      height: i % 3 === 0 ? "10px" : "6px",
                      background: "rgba(240,236,228,0.2)",
                      transformOrigin: "50% 0",
                      transform: `rotate(${i * 30}deg) translateY(-${i % 3 === 0 ? 90 : 92}px)`,
                    }} />
                  ))}
                  {/* Hands */}
                  <div style={{
                    position: "absolute", bottom: "50%", left: "50%",
                    width: "2px", height: "35%", background: "#f0ece4",
                    transformOrigin: "bottom center", transform: "translateX(-50%) rotate(-30deg)",
                    borderRadius: "1px",
                  }} />
                  <div style={{
                    position: "absolute", bottom: "50%", left: "50%",
                    width: "1.5px", height: "45%", background: "rgba(240,236,228,0.6)",
                    transformOrigin: "bottom center", transform: "translateX(-50%) rotate(60deg)",
                    borderRadius: "1px",
                  }} />
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#c9a227", transform: "translate(-50%, -50%)",
                  }} />
                </div>
              </div>

              {/* Customer Voice card */}
              <div style={{
                position: "absolute", bottom: "-20px", right: "-10px",
                background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.12)",
                borderRadius: "14px", padding: "18px 20px", maxWidth: "260px",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: "rgba(201,162,39,0.1)", borderRadius: "4px",
                  padding: "3px 8px", marginBottom: "10px",
                }}>
                  <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em", color: "#c9a227", textTransform: "uppercase" }}>Customer Voices</span>
                </div>
                <p style={{
                  fontSize: "12px", color: "rgba(240,236,228,0.6)", fontStyle: "italic",
                  lineHeight: 1.6, margin: "0 0 10px",
                }}>
                  "The weight is perfect. Feels like quality engineering on your wrist."
                </p>
                <p style={{ fontSize: "11px", color: "#c9a227", margin: 0, fontWeight: 600 }}>— Alex R., Founder</p>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────── */}
      <section style={{ padding: "60px 32px 80px" }}>
        <Fade>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800,
            textAlign: "center", margin: "0 0 48px", color: "#f0ece4",
          }}>Trusted by the Global Community</h2>
        </Fade>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px", maxWidth: "1100px", margin: "0 auto",
        }}>
          {TESTIMONIALS.map((t, i) => (
            <Fade key={i} delay={i * 0.12}>
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "16px", padding: "28px",
                transition: "border-color 0.3s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                  {[...Array(5)].map((_, si) => (
                    <span key={si} style={{ color: "#f59e0b", fontSize: "13px" }}>★</span>
                  ))}
                </div>
                <p style={{
                  fontSize: "13px", color: "rgba(240,236,228,0.6)", lineHeight: 1.7,
                  margin: "0 0 20px",
                }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: t.avatar, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff",
                  }}>{t.name.charAt(0)}</div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#f0ece4", margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: "11px", color: "rgba(240,236,228,0.35)", margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────── */}
      <section style={{ padding: "40px 32px 100px" }}>
        <Fade>
          <div style={{
            maxWidth: "700px", margin: "0 auto", textAlign: "center",
            background: "linear-gradient(180deg, rgba(20,20,28,0.7) 0%, rgba(14,14,20,0.9) 100%)",
            borderRadius: "28px", padding: "80px 40px",
            border: "1px solid rgba(255,255,255,0.04)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Subtle glow */}
            <div style={{
              position: "absolute", top: "-50px", left: "50%", transform: "translateX(-50%)",
              width: "300px", height: "200px", borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(201,162,39,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800,
              margin: "0 0 16px", color: "#f0ece4", position: "relative",
            }}>Ready to upgrade your<br />wrist game?</h2>
            <p style={{
              fontSize: "14px", color: "rgba(240,236,228,0.4)",
              margin: "0 auto 32px", lineHeight: 1.7, maxWidth: "400px", position: "relative",
            }}>
              Join 10,000+ others who have redefined their style with Aura Chronos.
            </p>

            <button
              onClick={() => window.open("#", "_blank")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "#f0ece4", color: "#08080c", border: "none",
                borderRadius: "14px", padding: "16px 36px", fontSize: "14px",
                fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: "pointer",
                transition: "all 0.3s", position: "relative",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f0ece4"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order Instantly via WhatsApp
            </button>

            <p style={{
              fontSize: "11px", color: "rgba(240,236,228,0.25)", marginTop: "16px", position: "relative",
            }}>Free Shipping Worldwide • 24/7 Support</p>
          </div>
        </Fade>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "28px 32px",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "16px",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%",
              border: "1.5px solid rgba(201,162,39,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px",
            }}>⌚</div>
            <span style={{
              fontWeight: 700, fontSize: "12px", letterSpacing: "0.08em", color: "rgba(240,236,228,0.5)",
            }}>AURA CHRONOS</span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Service", "Shipping Policy"].map((link) => (
              <a key={link} href="#" style={{
                fontSize: "11px", color: "rgba(240,236,228,0.3)", textDecoration: "none",
                transition: "color 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#c9a227"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(240,236,228,0.3)"; }}
              >{link}</a>
            ))}
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "12px" }}>
            {["instagram", "twitter", "facebook", "globe"].map((social) => (
              <a key={social} href="#" style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(240,236,228,0.4)", textDecoration: "none",
                transition: "all 0.2s", fontSize: "14px",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.3)"; e.currentTarget.style.color = "#c9a227"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(240,236,228,0.4)"; }}
              >
                {social === "instagram" && "📷"}
                {social === "twitter" && "𝕏"}
                {social === "facebook" && "f"}
                {social === "globe" && "🌐"}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p style={{
          textAlign: "center", fontSize: "11px", color: "rgba(240,236,228,0.15)",
          margin: "20px 0 0",
        }}>© 2024 Aura Chronos. All rights reserved.</p>
      </footer>

      {/* Responsive CSS */}
      <style>{`
        @media(max-width:900px){
          .lp2-desktop-nav{display:none!important}
          .lp2-mobile-toggle{display:block!important}
          section:nth-of-type(1){flex-direction:column!important}
          section:nth-of-type(1)>div:last-child{flex:1!important;padding:0 24px 40px!important}
        }
        @media(max-width:768px){
          section>div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
        }
        div::-webkit-scrollbar{display:none}
      `}</style>
    </div>
  );
}
