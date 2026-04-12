"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
 * AURA — Premium Audio Showroom  (Landing Page 1)
 * Matches the Variant.com design exactly:
 *   - Top nav: AURA logo | Support + Cart
 *   - Hero: 3D product carousel (left) + product info card (right)
 *   - Trust badges bar
 *   - Features: "Engineered for Perfection" + 3 cards
 *   - Testimonials: "The Verdict" + horizontal slider
 *   - CTA: "Ready to upgrade your sound?"
 *   - Footer
 * ═══════════════════════════════════════════════════════════ */

const PRODUCTS = [
  {
    id: 1,
    name: "Aura Studio Pro",
    tagline: "Studio-grade sound, sculpted to blend perfectly into your modern space.",
    price: "$349",
    badge: "IN STOCK",
    badgeColor: "#25D366",
    image: "/demo/headphones-1.png",
  },
  {
    id: 2,
    name: "Aura Wireless Buds",
    tagline: "Crystal-clear audio in a compact, wireless design for life on the move.",
    price: "$199",
    badge: "BESTSELLER",
    badgeColor: "#f59e0b",
    image: "/demo/headphones-2.png",
  },
  {
    id: 3,
    name: "Aura Pro Monitor",
    tagline: "Reference-grade monitoring headphones for demanding studio professionals.",
    price: "$499",
    badge: "NEW",
    badgeColor: "#6366f1",
    image: "/demo/headphones-3.png",
  },
];

const FEATURES = [
  {
    title: "Premium Materials",
    description: "Crafted from aerospace-grade aluminum and memory foam for lasting durability and supreme comfort.",
    icon: "diamond",
  },
  {
    title: "Immersive Acoustics",
    description: "Custom-tuned drivers deliver an expansive soundstage, deep bass, and crystal-clear highs.",
    icon: "sound",
  },
  {
    title: "Frictionless Ordering",
    description: "Skip the complex checkout. Chat with us directly on WhatsApp to confirm details and place your order instantly.",
    icon: "lock",
  },
];

const TESTIMONIALS = [
  {
    quote: "Absolutely stunning design. The sound quality blew me away, and ordering through WhatsApp was surprisingly easy.",
    name: "James D.",
    role: "Verified Buyer",
    avatar: "#6366f1",
  },
  {
    quote: "I've owned many premium headphones, but these take the crown for both comfort and aesthetic. Highly recommend.",
    name: "Sarah M.",
    role: "Verified Buyer",
    avatar: "#10b981",
  },
  {
    quote: "Fast delivery, exact product as shown. The noise cancellation on the Buds is top tier for commuting.",
    name: "Robert T.",
    role: "Verified Buyer",
    avatar: "#f59e0b",
  },
];

// ── SVG Icon components ───────────────────────
function DiamondIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M2 9h20" />
      <path d="M10 3l-2 6 4 13 4-13-2-6" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="4" height="8" rx="1"/>
      <path d="M8 10l4-4v12l-4-4"/>
      <path d="M15 9a3 3 0 010 6"/>
      <path d="M18 7a7 7 0 010 10"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2"/>
      <path d="M8 11V7a4 4 0 018 0v4"/>
      <circle cx="12" cy="16" r="1"/>
    </svg>
  );
}

const ICON_MAP = { diamond: DiamondIcon, sound: SoundIcon, lock: LockIcon };

// ── Global styles ─────────────────────────────
function useGlobalStyles() {
  useEffect(() => {
    const id = "aura-lp1-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
      @keyframes lp1FadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes lp1Float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      @keyframes lp1Pulse{0%,100%{opacity:.4}50%{opacity:1}}
      @keyframes lp1SlideRight{from{transform:translateX(-30px);opacity:0}to{transform:translateX(0);opacity:1}}
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

// ── 3D Product Carousel ───────────────────────
function ProductCarousel({ products, activeIndex, onChangeIndex }) {
  const touchX = useRef(0);
  const total = products.length;

  const getTransform = (i) => {
    let offset = i - activeIndex;
    // Wrap
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    const isActive = offset === 0;
    const absOff = Math.abs(offset);
    const x = offset * 320;
    const z = isActive ? 0 : -200 * absOff;
    const scale = isActive ? 1 : 0.72;
    const opacity = absOff > 1 ? 0.3 : isActive ? 1 : 0.6;
    const brightness = isActive ? 1 : 0.5;

    return { x, z, scale, opacity, isActive, brightness };
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        perspective: "1200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const diff = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) onChangeIndex(activeIndex + (diff > 0 ? 1 : -1));
      }}
    >
      {/* Subtle glow behind carousel */}
      <div style={{
        position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)",
        width: "70%", height: "40%", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      {/* Reflective surface */}
      <div style={{
        position: "absolute", bottom: 0, left: "5%", right: "5%", height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
      }} />

      {products.map((p, i) => {
        const t = getTransform(i);
        return (
          <div
            key={p.id}
            onClick={() => onChangeIndex(i)}
            style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              transform: `translateX(${t.x}px) translateZ(${t.z}px) scale(${t.scale})`,
              opacity: t.opacity,
              transition: "all 0.8s cubic-bezier(.25,.1,.25,1)",
              zIndex: t.isActive ? 10 : 5 - Math.abs(i - activeIndex),
              cursor: "pointer",
              filter: `brightness(${t.brightness})`,
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: t.isActive ? "drop-shadow(0 20px 40px rgba(0,0,0,0.6))" : "none",
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
export default function DemoLandingPage1() {
  useGlobalStyles();
  const [activeProduct, setActiveProduct] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [testimonialScroll, setTestimonialScroll] = useState(0);
  const testimonialRef = useRef(null);
  const total = PRODUCTS.length;

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setActiveProduct((p) => (p + 1) % total), 4500);
    return () => clearInterval(id);
  }, [autoplay, total]);

  const goTo = useCallback((i) => {
    setActiveProduct(((i % total) + total) % total);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  }, [total]);

  const product = PRODUCTS[activeProduct];

  const scrollTestimonials = (dir) => {
    if (!testimonialRef.current) return;
    const amount = 400;
    testimonialRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", color: "#f0f0f5",
      fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden",
    }}>
      {/* ── NAV ─────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "64px",
        background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>⚙</span>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "16px",
            letterSpacing: "0.08em", color: "#fff",
          }}>AURA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="#" style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Support</a>
          <button style={{
            background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", padding: "4px",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ────────────────────────── */}
      <section style={{
        minHeight: "100vh", paddingTop: "64px",
        display: "flex", position: "relative", overflow: "hidden",
      }}>
        {/* Background gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #0a0a14 0%, #0d0d18 40%, #0a0a0f 100%)",
        }} />

        {/* Subtle glow orbs */}
        <div style={{
          position: "absolute", top: "20%", left: "30%", width: "400px", height: "400px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        {/* Left: 3D Carousel */}
        <div style={{
          flex: "1 1 60%", position: "relative", display: "flex",
          alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)",
          zIndex: 2,
        }}>
          <ProductCarousel
            products={PRODUCTS}
            activeIndex={activeProduct}
            onChangeIndex={goTo}
          />
        </div>

        {/* Right: Product Info Card */}
        <div style={{
          flex: "0 0 380px", display: "flex", alignItems: "center",
          justifyContent: "center", padding: "40px 32px 40px 0",
          zIndex: 3, position: "relative",
        }}>
          <div
            key={product.id}
            style={{
              width: "100%", maxWidth: "350px",
              background: "rgba(20,20,28,0.9)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px", padding: "28px",
              backdropFilter: "blur(20px)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              animation: "lp1FadeUp 0.5s ease",
            }}
          >
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: `${product.badgeColor}18`, border: `1px solid ${product.badgeColor}30`,
              borderRadius: "6px", padding: "4px 10px", marginBottom: "16px",
            }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: product.badgeColor,
              }} />
              <span style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
                color: product.badgeColor, textTransform: "uppercase",
              }}>{product.badge}</span>
            </div>

            {/* Product name */}
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: 800,
              color: "#fff", margin: "0 0 8px", lineHeight: 1.15,
            }}>{product.name}</h2>

            {/* Description */}
            <p style={{
              fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6,
              margin: "0 0 20px",
            }}>{product.tagline}</p>

            {/* Price */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "28px",
              fontWeight: 700, color: "#fff", marginBottom: "20px",
            }}>{product.price}</div>

            {/* Trust items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {[
                { icon: "⚡", text: "Fast, Free Delivery" },
                { icon: "📦", text: "Cash on Delivery Available" },
                { icon: "⭐", text: "1,000+ Happy Customers" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "14px", width: "20px", textAlign: "center" }}>{item.icon}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => window.open("#", "_blank")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", width: "100%", padding: "14px 0",
                background: "#25D366", color: "#fff", border: "none",
                borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                fontFamily: "'Inter', sans-serif", cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 4px 20px rgba(37,211,102,0.2)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 30px rgba(37,211,102,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order {product.name.split(' ').slice(-1)} via WhatsApp
            </button>

            {/* Sub-note */}
            <p style={{
              fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center",
              marginTop: "12px",
            }}>No payment required now • Ask anything first</p>
          </div>
        </div>

        {/* SCROLL indicator */}
        <div style={{
          position: "absolute", bottom: "30px", left: "42%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          animation: "lp1Pulse 2.5s ease-in-out infinite", zIndex: 5,
        }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>SCROLL</span>
          <div style={{ width: "1px", height: "24px", background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }} />
        </div>
      </section>

      {/* ── TRUST BADGES BAR ────────────────────── */}
      <Fade>
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: "32px", padding: "32px 24px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          flexWrap: "wrap",
        }}>
          {[
            { icon: "⭐⭐⭐⭐⭐", text: "4.8/5 Average Rating" },
            { icon: "⚡", text: "Next-Day Delivery" },
            { icon: "📦", text: "30-Day Easy Returns" },
          ].map((b, i) => (
            <React.Fragment key={b.text}>
              {i > 0 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "4px" }}>●</span>}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px" }}>{b.icon}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{b.text}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Fade>

      {/* ── FEATURES ────────────────────────────── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 32px 80px" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800, margin: "0 0 16px", color: "#fff",
            }}>Engineered for Perfection.</h2>
            <p style={{
              fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "550px",
              margin: "0 auto", lineHeight: 1.7,
            }}>
              Every detail is meticulously crafted to provide an unparalleled experience. Discover the difference of premium design.
            </p>
          </div>
        </Fade>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {FEATURES.map((f, i) => {
            const IconComponent = ICON_MAP[f.icon];
            return (
              <Fade key={i} delay={i * 0.12}>
                <div style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "16px", padding: "32px 28px",
                  transition: "border-color 0.3s, background 0.3s",
                  cursor: "default",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.035)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "20px",
                  }}>
                    <IconComponent />
                  </div>
                  <h3 style={{
                    fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700,
                    margin: "0 0 10px", color: "#fff",
                  }}>{f.title}</h3>
                  <p style={{
                    fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0,
                  }}>{f.description}</p>
                </div>
              </Fade>
            );
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────── */}
      <section style={{ padding: "60px 32px 80px" }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: "32px",
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "clamp(24px, 3.5vw, 36px)",
              fontWeight: 800, margin: "0 0 6px", color: "#fff",
            }}>The Verdict.</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
              Don't just take our word for it.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => scrollTestimonials(-1)}
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >‹</button>
            <button
              onClick={() => scrollTestimonials(1)}
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >›</button>
          </div>
        </div>

        {/* Horizontal scrolling testimonials */}
        <div
          ref={testimonialRef}
          style={{
            display: "flex", gap: "20px", overflowX: "auto",
            scrollSnapType: "x mandatory", maxWidth: "1100px", margin: "0 auto",
            paddingBottom: "8px",
            scrollbarWidth: "none", msOverflowStyle: "none",
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              flex: "0 0 420px", scrollSnapAlign: "start",
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px", padding: "28px",
            }}>
              {/* Stars */}
              <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                {[...Array(5)].map((_, si) => (
                  <span key={si} style={{ color: "#f59e0b", fontSize: "13px" }}>★</span>
                ))}
              </div>
              <p style={{
                fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7,
                margin: "0 0 20px",
              }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: t.avatar, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#fff",
                }}>{t.name.charAt(0)}</div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Hide scrollbar */}
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
      </section>

      {/* ── CTA SECTION ─────────────────────────── */}
      <section style={{ padding: "80px 32px 100px" }}>
        <Fade>
          <div style={{
            maxWidth: "700px", margin: "0 auto", textAlign: "center",
            background: "linear-gradient(180deg, rgba(20,20,30,0.6) 0%, rgba(15,15,22,0.8) 100%)",
            borderRadius: "28px", padding: "80px 40px",
            border: "1px solid rgba(255,255,255,0.04)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)",
              width: "300px", height: "200px", borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(37,211,102,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 800, margin: "0 0 16px", color: "#fff", position: "relative",
            }}>Ready to upgrade your sound?</h2>
            <p style={{
              fontSize: "14px", color: "rgba(255,255,255,0.4)", maxWidth: "450px",
              margin: "0 auto 32px", lineHeight: 1.7, position: "relative",
            }}>
              Found something you like? Connect with us instantly. No bots, just human support ready to process your order.
            </p>
            <button
              onClick={() => window.open("#", "_blank")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "#25D366", color: "#fff", border: "none",
                borderRadius: "14px", padding: "16px 36px", fontSize: "15px",
                fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: "pointer",
                transition: "all 0.3s", boxShadow: "0 4px 30px rgba(37,211,102,0.2)",
                position: "relative",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 40px rgba(37,211,102,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 30px rgba(37,211,102,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with us on WhatsApp
            </button>
            <p style={{
              fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "16px", position: "relative",
            }}>Average response time: &lt; 2 minutes</p>
          </div>
        </Fade>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "28px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: "1200px", margin: "0 auto", flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px" }}>⚙</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>AURA</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginLeft: "8px" }}>© 2024. All rights reserved.</span>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Shipping Info"].map((link) => (
            <a key={link} href="#" style={{
              fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
            >{link}</a>
          ))}
        </div>
      </footer>

      {/* ── Mobile responsive overrides ────────── */}
      <style>{`
        @media (max-width: 900px) {
          section:first-of-type {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
