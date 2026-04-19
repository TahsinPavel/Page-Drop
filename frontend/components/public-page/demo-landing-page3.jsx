"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
 * POKER SHOWROOM — Premium eCommerce Landing Page (Landing Page 3)
 *
 *  Core concept:
 *   • Two-layer interaction system:
 *     LEVEL 1 — Horizontal product carousel (swipe / drag)
 *     LEVEL 2 — Per-product "poker-fan" of images
 *   • Active product snaps to center with spotlight effect
 *   • Clicking a side-card in the fan brings it to center
 *   • Hover expands the fan (desktop)
 *   • Glassmorphism product-info panel
 *   • Full mobile support (touch, bottom-sheet, etc.)
 * ═══════════════════════════════════════════════════════════════════ */

// ── PRODUCTS DATA ──────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Eclipse Runner",
    tagline: "Looks premium from every angle.",
    description: "Ultra-lightweight carbon-weave upper with responsive foam midsole. Engineered for all-day comfort.",
    price: "$189",
    originalPrice: "$249",
    badge: "BESTSELLER",
    badgeColor: "#10b981",
    accentHue: 160,
    images: [
      "/demo/sneaker-1.png",
      "/demo/sneaker-2.png",
      "/demo/sneaker-3.png",
    ],
  },
  {
    id: 2,
    name: "Nebula Chronos",
    tagline: "Time, redefined for the modern visionary.",
    description: "A deep iridescent sapphire glass face that shifts colors from navy to violet under different lighting.",
    price: "$589",
    originalPrice: "$749",
    badge: "LIMITED EDITION",
    badgeColor: "#6366f1",
    accentHue: 245,
    images: [
      "/demo/watch-1.png",
      "/demo/watch-2.png",
      "/demo/watch-3.png",
    ],
  },
  {
    id: 3,
    name: "Aura Pods",
    tagline: "Sound that surrounds, style that defines.",
    description: "Active noise cancellation meets premium design. 40-hour battery with spatial audio technology.",
    price: "$349",
    originalPrice: null,
    badge: "NEW ARRIVAL",
    badgeColor: "#f59e0b",
    accentHue: 38,
    images: [
      "/demo/headphones-1.png",
      "/demo/headphones-2.png",
      "/demo/headphones-3.png",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "The shopping experience felt like walking through a luxury boutique. Ordering on WhatsApp was effortless!",
    name: "Sarah Chen",
    role: "Verified Buyer",
    avatar: "#10b981",
  },
  {
    quote: "I've never seen a product page this immersive. The card fan is addictive – I kept swiping through all the angles.",
    name: "Marcus Rivera",
    role: "Verified Buyer",
    avatar: "#6366f1",
  },
  {
    quote: "Got my order in 2 days. The quality is exactly what the photos promised. Cash on delivery made it risk-free.",
    name: "Aisha Patel",
    role: "Verified Buyer",
    avatar: "#f59e0b",
  },
];

const NAV_LINKS = ["Collection", "About", "Support", "Contact"];

// ─── Inject global keyframes ───────────────────────────────────────
function useGlobalStyles() {
  useEffect(() => {
    const id = "poker-lp3-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=JetBrains+Mono:wght@500;700&display=swap');
      @keyframes lp3FadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes lp3Float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes lp3Pulse{0%,100%{opacity:.35}50%{opacity:.9}}
      @keyframes lp3Glow{0%,100%{box-shadow:0 0 20px rgba(var(--accent-rgb),0.15)}50%{box-shadow:0 0 40px rgba(var(--accent-rgb),0.3)}}
      @keyframes lp3Shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      @keyframes lp3SpotlightPulse{0%,100%{opacity:0.04}50%{opacity:0.08}}
    `;
    document.head.appendChild(s);
  }, []);
}

// ─── Intersection observer hook ────────────────────────────────────
function useFade() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } },
      { threshold: 0.12 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return { ref, v };
}

function Fade({ children, delay = 0, style = {} }) {
  const { ref, v } = useFade();
  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(40px)",
        transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── useMediaQuery ─────────────────────────────────────────────────
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

// ═══════════════════════════════════════════════════════════════════
// POKER-FAN IMAGE COMPONENT (per-product)
// ═══════════════════════════════════════════════════════════════════
function PokerFan({ images, isActive, accentHue, isMobile }) {
  const [centerIdx, setCenterIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const total = images.length;

  // Reset center when product becomes inactive
  useEffect(() => {
    if (!isActive) {
      setCenterIdx(0);
      setHovered(false);
      setTapped(false);
    }
  }, [isActive]);

  const handleCardClick = useCallback(
    (idx) => {
      if (!isActive) return;
      if (idx !== centerIdx) {
        setCenterIdx(idx);
      } else if (isMobile) {
        setTapped((t) => !t);
      }
    },
    [isActive, centerIdx, isMobile]
  );

  const isExpanded = hovered || tapped;

  // Reference-like portrait cards with controlled fan spread
  const cardW = isMobile ? 160 : 290;
  const cardH = isMobile ? 230 : 420;
  const containerW = cardW + (isMobile ? 170 : 320);
  const containerH = cardH + (isMobile ? 70 : 90);

  return (
    <div
      style={{
        position: "relative",
        width: `${containerW}px`,
        height: `${containerH}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isActive ? "pointer" : "default",
      }}
      onMouseEnter={() => isActive && !isMobile && setHovered(true)}
      onMouseLeave={() => isActive && !isMobile && setHovered(false)}
    >
      {images.map((src, idx) => {
        let rawOffset = idx - centerIdx;
        let offset = rawOffset;
        if (Math.abs(offset) > total / 2) {
          offset = offset > 0 ? offset - total : offset + total;
        }
        
        const absOff = Math.abs(offset);
        const isCenter = offset === 0;

        // Fan rotation from lower-center pivot to mimic the reference composition
        const rotationAngle = isMobile ? 22 : 27;
        const rotation = offset * rotationAngle * (isExpanded ? 1.08 : 1);

        // Horizontal spread: compact on mobile, dramatic on desktop
        const spreadX = isMobile ? 78 : 136;
        const tx = offset * spreadX * (isExpanded ? 1.12 : 1);

        // Side cards sit slightly lower than center card
        const ty = absOff * (isMobile ? 24 : 30);

        // Side cards are slightly smaller and dimmer
        const scale = isCenter ? 1 : 0.9;

        // Z-index: center card on top
        const zIdx = 10 - absOff;

        // Shadows
        const shadow = isCenter
          ? `0 32px 80px rgba(0,0,0,0.95), 0 0 30px hsla(${accentHue},60%,35%,0.12)`
          : `0 18px 48px rgba(0,0,0,0.85)`;

        return (
          <div
            key={idx}
            onClick={() => handleCardClick(idx)}
            style={{
              position: "absolute",
              width: `${cardW}px`,
              height: `${cardH}px`,
              borderRadius: isMobile ? "16px" : "22px",
              overflow: "hidden",
              transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rotation}deg) scale(${scale})`,
              transformOrigin: "center 88%",
              zIndex: zIdx,
              transition: "transform 0.6s cubic-bezier(0.2, 1, 0.4, 1), background 0.6s, opacity 0.6s",
              boxShadow: shadow,
              cursor: isActive && !isCenter ? "pointer" : "default",
              border: isCenter
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(255,255,255,0.05)",
              background:
                "linear-gradient(180deg, #17181b 0%, #0e0f11 45%, #07080a 100%)",
              opacity: isCenter ? 1 : 0.62,
            }}
          >
            {/* Subtle top-edge highlight on center card */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                background: isCenter
                  ? `linear-gradient(180deg, hsla(${accentHue},35%,55%,0.06) 0%, transparent 35%)`
                  : "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 30%)",
                pointerEvents: "none",
              }}
            />

            {/* Product image — centered and contained, not full-bleed */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? "24px 20px 36px" : "32px 28px 50px",
              }}
            >
              <img
                src={src}
                alt={`Product view ${idx + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block",
                  pointerEvents: "none",
                  filter: isCenter
                    ? "drop-shadow(0 10px 30px rgba(0,0,0,0.45))"
                    : "brightness(0.5) saturate(0.9) drop-shadow(0 6px 16px rgba(0,0,0,0.35))",
                  transition: "filter 0.5s ease",
                }}
                draggable={false}
              />
            </div>

            {/* Dark overlay on side cards */}
            {!isCenter && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(6,6,12,0.3)",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* View label — only on center card */}
            {isCenter && (
              <div
                style={{
                  position: "absolute",
                  bottom: isMobile ? "16px" : "24px",
                  left: isMobile ? "18px" : "24px",
                  fontSize: isMobile ? "10px" : "12px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: "#10B981", // Exact mint green from reference
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                FRONT VIEW
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCT CAROUSEL (outer level – switches products)
// ═══════════════════════════════════════════════════════════════════
function ProductCarousel({ products, activeIndex, onChangeIndex, isMobile }) {
  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const total = products.length;

  // Mouse drag handlers
  const onPointerDown = useCallback((e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    dragOffset.current = 0;
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const x = e.clientX || e.touches?.[0]?.clientX || 0;
      dragOffset.current = x - dragStartX.current;
      setDragDelta(dragOffset.current);
    },
    [isDragging]
  );

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = isMobile ? 55 : 80;
    if (dragOffset.current > threshold) {
      onChangeIndex(((activeIndex - 1) % total + total) % total);
    } else if (dragOffset.current < -threshold) {
      onChangeIndex((activeIndex + 1) % total);
    }
    setDragDelta(0);
    dragOffset.current = 0;
  }, [isDragging, isMobile, activeIndex, onChangeIndex, total]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("mouseup", onPointerUp);
      window.addEventListener("touchmove", onPointerMove);
      window.addEventListener("touchend", onPointerUp);
      return () => {
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("touchend", onPointerUp);
      };
    }
  }, [isDragging, onPointerMove, onPointerUp]);

  const getProductTransform = (idx) => {
    let offset = idx - activeIndex;
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    const isActive = offset === 0;
    const absOff = Math.abs(offset);
    const gap = isMobile ? 280 : 420;
    const x = offset * gap + (isDragging ? dragDelta * 0.55 : 0);
    const scale = isActive ? 1 : 0.88;
    const opacity = isActive ? 1 : isDragging ? 0.2 : 0;
    const blur = isActive ? 0 : 6;
    const z = isActive ? 10 : 5 - absOff;

    return { x, scale, opacity, blur, z, isActive };
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={onPointerDown}
      onTouchStart={(e) => {
        setIsDragging(true);
        dragStartX.current = e.touches[0].clientX;
        dragOffset.current = 0;
      }}
      style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "370px" : "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "pan-y",
        userSelect: "none",
      }}
    >
      {products.map((product, idx) => {
        const t = getProductTransform(idx);
        return (
          <div
            key={product.id}
            onClick={() => !t.isActive && onChangeIndex(idx)}
            style={{
              position: "absolute",
              transform: `translateX(${t.x}px) scale(${t.scale})`,
              opacity: t.opacity,
              filter: `blur(${t.blur}px)`,
              zIndex: t.z,
              transition: isDragging
                ? "none"
                : "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
              cursor: t.isActive ? "default" : "pointer",
            }}
          >
            <PokerFan
              images={product.images}
              isActive={t.isActive}
              accentHue={product.accentHue}
              isMobile={isMobile}
            />
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// WHATSAPP CTA BUTTON
// ═══════════════════════════════════════════════════════════════════
function WhatsAppCTA({ productName, accentHue, fullWidth = false }) {
  const [btnHovered, setBtnHovered] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          const msg = encodeURIComponent(`Hi, I'd like to order the ${productName}!`);
          window.open(`https://wa.me/?text=${msg}`, "_blank");
        }}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          width: fullWidth ? "100%" : "auto",
          padding: "15px 32px",
          background: btnHovered
            ? `linear-gradient(135deg, #25D366 0%, hsl(${accentHue},60%,50%) 100%)`
            : "#25D366",
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          fontSize: "14px",
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: btnHovered ? "translateY(-2px) scale(1.02)" : "translateY(0) scale(1)",
          boxShadow: btnHovered
            ? "0 12px 40px rgba(37,211,102,0.35)"
            : "0 6px 24px rgba(37,211,102,0.2)",
          letterSpacing: "0.01em",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Order {productName} on WhatsApp
      </button>
      <p
        style={{
          fontSize: "11px",
          color: "rgba(240,236,228,0.3)",
          textAlign: "center",
          marginTop: "10px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        No payment required now • Ask anything first
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCT INFO PANEL (desktop: floating right / mobile: bottom sheet)
// ═══════════════════════════════════════════════════════════════════
function ProductInfoPanel({ product, isMobile }) {
  if (!product) return null;

  const panelContent = (
    <>
      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: `${product.badgeColor}15`,
          border: `1px solid ${product.badgeColor}30`,
          borderRadius: "8px",
          padding: "5px 12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: product.badgeColor,
            animation: "lp3Pulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: product.badgeColor,
            textTransform: "uppercase",
          }}
        >
          {product.badge}
        </span>
      </div>

      {/* Name */}
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? "26px" : "32px",
          fontWeight: 700,
          fontStyle: "italic",
          color: "#f0ece4",
          margin: "0 0 8px",
          lineHeight: 1.15,
        }}
      >
        {product.name}
      </h2>

      {/* Tagline */}
      <p
        style={{
          fontSize: "14px",
          color: `hsla(${product.accentHue},50%,70%,0.8)`,
          lineHeight: 1.5,
          margin: "0 0 6px",
          fontWeight: 500,
        }}
      >
        {product.tagline}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: "12px",
          color: "rgba(240,236,228,0.4)",
          lineHeight: 1.7,
          margin: "0 0 20px",
        }}
      >
        {product.description}
      </p>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "28px",
            fontWeight: 700,
            color: "#f0ece4",
          }}
        >
          {product.price}
        </span>
        {product.originalPrice && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "15px",
              color: "rgba(240,236,228,0.3)",
              textDecoration: "line-through",
            }}
          >
            {product.originalPrice}
          </span>
        )}
      </div>

      {/* Trust signals */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {[
          { icon: "💰", text: "Cash on Delivery" },
          { icon: "⚡", text: "Fast Delivery" },
          { icon: "🔥", text: "Limited Stock" },
        ].map((item) => (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "8px",
              padding: "5px 10px",
            }}
          >
            <span style={{ fontSize: "12px" }}>{item.icon}</span>
            <span
              style={{
                fontSize: "11px",
                color: "rgba(240,236,228,0.55)",
                fontWeight: 500,
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <WhatsAppCTA
        productName={product.name}
        accentHue={product.accentHue}
        fullWidth={true}
      />

      {/* Urgency */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginTop: "12px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#ef4444",
            animation: "lp3Pulse 1.5s ease-in-out infinite",
          }}
        />
        <span style={{ fontSize: "11px", color: "rgba(240,236,228,0.35)" }}>
          Only few left in stock
        </span>
      </div>
    </>
  );

  if (isMobile) {
    // Bottom sheet style
    return (
      <div
        key={product.id}
        style={{
          background: "rgba(14,14,20,0.96)",
          backdropFilter: "blur(30px)",
          borderTop: `1px solid hsla(${product.accentHue},40%,40%,0.15)`,
          borderRadius: "28px 28px 0 0",
          padding: "28px 24px 32px",
          animation: "lp3FadeUp 0.45s ease",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: "40px",
            height: "4px",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.12)",
            margin: "0 auto 20px",
          }}
        />
        {panelContent}
      </div>
    );
  }

  // Desktop: floating glass panel
  return (
    <div
      key={product.id}
      style={{
        width: "100%",
        maxWidth: "380px",
        background: "rgba(14,14,20,0.88)",
        border: `1px solid hsla(${product.accentHue},40%,40%,0.12)`,
        borderRadius: "24px",
        padding: "32px",
        backdropFilter: "blur(30px)",
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 hsla(${product.accentHue},40%,60%,0.06)`,
        animation: "lp3FadeUp 0.5s ease",
      }}
    >
      {panelContent}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// NAVIGATION ARROWS (carousel controls)
// ═══════════════════════════════════════════════════════════════════
function CarouselArrow({ direction, onClick, accentHue }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={direction === "left" ? "Previous product" : "Next product"}
      style={{
        position: "absolute",
        top: "50%",
        [direction === "left" ? "left" : "right"]: "24px",
        transform: "translateY(-50%)",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: hovered
          ? `hsla(${accentHue},50%,50%,0.15)`
          : "rgba(255,255,255,0.05)",
        border: hovered
          ? `1px solid hsla(${accentHue},50%,50%,0.3)`
          : "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 20,
        transition: "all 0.3s ease",
        color: hovered ? `hsl(${accentHue},60%,70%)` : "rgba(240,236,228,0.5)",
        backdropFilter: "blur(10px)",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        {direction === "left" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 6 15 12 9 18" />
        )}
      </svg>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function DemoLandingPage3() {
  useGlobalStyles();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [activeProduct, setActiveProduct] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const total = PRODUCTS.length;

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(
      () => setActiveProduct((p) => (p + 1) % total),
      6000
    );
    return () => clearInterval(id);
  }, [autoplay, total]);

  const goTo = useCallback(
    (i) => {
      setActiveProduct(((i % total) + total) % total);
      setAutoplay(false);
      setTimeout(() => setAutoplay(true), 12000);
    },
    [total]
  );

  const product = PRODUCTS[activeProduct];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06060b",
        color: "#f0ece4",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflowX: "hidden",
        "--accent-rgb": (() => {
          // rough hsl->rgb for the glow animation
          const h = product.accentHue;
          if (h < 60) return "245,158,11";
          if (h < 180) return "16,185,129";
          return "99,102,241";
        })(),
      }}
    >
      {/* ─── NAV ─────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: "60px",
          background: "rgba(6,6,11,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "10px",
              background: `linear-gradient(135deg, hsla(${product.accentHue},60%,50%,0.2) 0%, rgba(255,255,255,0.03) 100%)`,
              border: `1px solid hsla(${product.accentHue},50%,50%,0.2)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              transition: "all 0.5s ease",
            }}
          >
            ◆
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: "14px",
              letterSpacing: "0.08em",
              color: "#f0ece4",
            }}
          >
            POKER SHOWROOM
          </span>
        </div>

        {/* Desktop nav links */}
        <div
          className="lp3-desktop-nav"
          style={{
            display: isMobile ? "none" : "flex",
            alignItems: "center",
            gap: "28px",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(240,236,228,0.45)",
                textDecoration: "none",
                letterSpacing: "0.03em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = `hsl(${product.accentHue},60%,65%)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(240,236,228,0.45)";
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Social proof ticker */}
          <div
            style={{
              display: isMobile ? "none" : "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "5px 12px",
            }}
          >
            <span style={{ fontSize: "12px" }}>⭐</span>
            <span
              style={{
                fontSize: "11px",
                color: "rgba(240,236,228,0.5)",
                fontWeight: 500,
              }}
            >
              1,000+ happy customers
            </span>
          </div>

          {/* Cart icon */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(240,236,228,0.5)",
              padding: "6px",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </button>

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileNav(!mobileNav)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    height: "2px",
                    background: `hsl(${product.accentHue},60%,60%)`,
                    borderRadius: "2px",
                    transition: "all 0.3s",
                    transform: mobileNav
                      ? "rotate(45deg) translate(4px,4px)"
                      : "none",
                  }}
                />
                <span
                  style={{
                    height: "2px",
                    background: `hsl(${product.accentHue},60%,60%)`,
                    borderRadius: "2px",
                    transition: "all 0.3s",
                    opacity: mobileNav ? 0 : 1,
                  }}
                />
                <span
                  style={{
                    height: "2px",
                    background: `hsl(${product.accentHue},60%,60%)`,
                    borderRadius: "2px",
                    transition: "all 0.3s",
                    transform: mobileNav
                      ? "rotate(-45deg) translate(4px,-4px)"
                      : "none",
                  }}
                />
              </div>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileNav && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(6,6,11,0.97)",
            backdropFilter: "blur(20px)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
            animation: "lp3FadeUp 0.3s ease",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => setMobileNav(false)}
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#f0ece4",
                textDecoration: "none",
              }}
            >
              {link}
            </a>
          ))}
        </div>
      )}

      {/* ─── HERO SECTION (FULL-SCREEN SHOWROOM) ──── */}
      <section
        style={{
          minHeight: "100vh",
          paddingTop: "60px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background layers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, #08080e 0%, #06060b 40%, #050509 100%)",
          }}
        />

        {/* Animated spotlight behind active product */}
        <div
          key={`spotlight-${product.id}`}
          style={{
            position: "absolute",
            top: isMobile ? "30%" : "35%",
            left: isMobile ? "50%" : "38%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "300px" : "500px",
            height: isMobile ? "300px" : "500px",
            borderRadius: "50%",
            background: `radial-gradient(circle, hsla(${product.accentHue},50%,45%,0.06) 0%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
            transition: "all 1s ease",
            animation: "lp3SpotlightPulse 4s ease-in-out infinite",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        {/* LEFT: Carousel area */}
        <div
          style={{
            flex: isMobile ? "none" : "1 1 60%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: isMobile ? "auto" : "calc(100vh - 60px)",
            padding: isMobile ? "40px 0 0" : "0",
            zIndex: 2,
          }}
        >
          {/* Section label */}
          <div
            style={{
              marginBottom: isMobile ? "16px" : "24px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: `hsla(${product.accentHue},50%,60%,0.5)`,
                textTransform: "uppercase",
                transition: "color 0.5s",
              }}
            >
              ◆ DRAG OR SWIPE TO EXPLORE ◆
            </span>
          </div>

          {/* Product Carousel */}
          <div style={{ position: "relative", width: "100%" }}>
            <ProductCarousel
              products={PRODUCTS}
              activeIndex={activeProduct}
              onChangeIndex={goTo}
              isMobile={isMobile}
            />

            {/* Arrows (desktop only) */}
            {!isMobile && (
              <>
                <CarouselArrow
                  direction="left"
                  onClick={() =>
                    goTo(((activeProduct - 1) % total + total) % total)
                  }
                  accentHue={product.accentHue}
                />
                <CarouselArrow
                  direction="right"
                  onClick={() => goTo((activeProduct + 1) % total)}
                  accentHue={product.accentHue}
                />
              </>
            )}
          </div>

          {/* Dot indicators */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: isMobile ? "16px" : "28px",
              alignItems: "center",
            }}
          >
            {PRODUCTS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                aria-label={`Go to ${p.name}`}
                style={{
                  width: i === activeProduct ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  background:
                    i === activeProduct
                      ? `hsl(${p.accentHue},55%,55%)`
                      : "rgba(255,255,255,0.12)",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Explore label */}
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                animation: "lp3Pulse 3s ease-in-out infinite",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  color: "rgba(240,236,228,0.2)",
                  letterSpacing: "0.2em",
                  fontWeight: 600,
                }}
              >
                SCROLL TO EXPLORE
              </span>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  background: `linear-gradient(to bottom, hsla(${product.accentHue},50%,50%,0.3), transparent)`,
                }}
              />
            </div>
          )}
        </div>

        {/* RIGHT: Product info panel */}
        <div
          style={{
            flex: isMobile ? "none" : "0 0 420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "0" : "40px 40px 40px 0",
            zIndex: 3,
          }}
        >
          <ProductInfoPanel product={product} isMobile={isMobile} />
        </div>
      </section>

      {/* ─── TRUST BAR ──────────────────────────────── */}
      <Fade>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? "30px" : "80px",
            padding: "48px 24px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            flexWrap: "wrap",
            background:
              "linear-gradient(180deg, rgba(14,14,20,0.5) 0%, rgba(6,6,11,0) 100%)",
          }}
        >
          {[
            {
              stars: true,
              title: "4.8 Average Rating",
              sub: "Based on 1,500+ genuine reviews",
            },
            {
              icon: "⚡",
              title: "Lightning Fast Delivery",
              sub: "Ships within 24 hours of order",
            },
            {
              icon: "💬",
              title: "Easy WhatsApp Ordering",
              sub: "Chat, Ask, Order – Simple as that",
            },
          ].map((b) => (
            <div key={b.title} style={{ textAlign: "center" }}>
              {b.stars ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "2px",
                    marginBottom: "8px",
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{ color: "#f59e0b", fontSize: "16px" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                  {b.icon}
                </div>
              )}
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#f0ece4",
                  margin: "0 0 4px",
                }}
              >
                {b.title}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(240,236,228,0.35)",
                  margin: 0,
                }}
              >
                {b.sub}
              </p>
            </div>
          ))}
        </div>
      </Fade>

      {/* ─── FEATURE HIGHLIGHTS ─────────────────────── */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "100px 32px 80px",
        }}
      >
        <Fade>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "rgba(240,236,228,0.3)",
                textTransform: "uppercase",
              }}
            >
              Why Choose Us
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.15,
                margin: "12px 0 0",
                color: "#f0ece4",
              }}
            >
              Premium quality,{" "}
              <span style={{ fontStyle: "italic", color: `hsl(${product.accentHue},55%,60%)` }}>
                effortless
              </span>{" "}
              experience.
            </h2>
          </div>
        </Fade>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {[
            {
              icon: "💎",
              title: "Premium Materials",
              desc: "Each product is crafted from the finest materials, ensuring durability and a luxurious feel that lasts.",
              hue: 160,
            },
            {
              icon: "🛡️",
              title: "Quality Guaranteed",
              desc: "Every item passes rigorous quality checks. We stand behind every product with our satisfaction guarantee.",
              hue: 245,
            },
            {
              icon: "📱",
              title: "WhatsApp Ordering",
              desc: "No complex checkout. Just message us on WhatsApp, ask anything, and place your order in seconds.",
              hue: 38,
            },
          ].map((feat, i) => (
            <Fade key={feat.title} delay={i * 0.12}>
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  padding: "32px 28px",
                  transition: "all 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `hsla(${feat.hue},50%,50%,0.2)`;
                  e.currentTarget.style.background = `hsla(${feat.hue},50%,50%,0.03)`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: `hsla(${feat.hue},50%,50%,0.08)`,
                    border: `1px solid hsla(${feat.hue},50%,50%,0.15)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    marginBottom: "20px",
                  }}
                >
                  {feat.icon}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#f0ece4",
                    margin: "0 0 10px",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(240,236,228,0.4)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────── */}
      <section style={{ padding: "60px 32px 80px" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "rgba(240,236,228,0.3)",
                textTransform: "uppercase",
              }}
            >
              Social Proof
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: 800,
                margin: "12px 0 0",
                color: "#f0ece4",
              }}
            >
              Loved by customers worldwide
            </h2>
          </div>
        </Fade>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "20px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <Fade key={i} delay={i * 0.12}>
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "18px",
                  padding: "28px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Stars */}
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    marginBottom: "16px",
                  }}
                >
                  {[...Array(5)].map((_, si) => (
                    <span
                      key={si}
                      style={{ color: "#f59e0b", fontSize: "13px" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(240,236,228,0.6)",
                    lineHeight: 1.7,
                    margin: "0 0 20px",
                    fontStyle: "italic",
                  }}
                >
                  "{t.quote}"
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: t.avatar,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#f0ece4",
                        margin: 0,
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "rgba(240,236,228,0.35)",
                        margin: 0,
                      }}
                    >
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ──────────────────────── */}
      <section style={{ padding: "40px 32px 100px" }}>
        <Fade>
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              textAlign: "center",
              background: `linear-gradient(180deg, rgba(14,14,20,0.7) 0%, rgba(6,6,11,0.95) 100%)`,
              borderRadius: "28px",
              padding: isMobile ? "60px 24px" : "80px 48px",
              border: "1px solid rgba(255,255,255,0.04)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative glow */}
            <div
              style={{
                position: "absolute",
                top: "-60px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "350px",
                height: "200px",
                borderRadius: "50%",
                background: `radial-gradient(ellipse, hsla(${product.accentHue},50%,45%,0.06) 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(26px, 4vw, 40px)",
                fontWeight: 800,
                margin: "0 0 16px",
                color: "#f0ece4",
                position: "relative",
              }}
            >
              See something you like?
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(240,236,228,0.4)",
                margin: "0 auto 36px",
                lineHeight: 1.7,
                maxWidth: "400px",
                position: "relative",
              }}
            >
              Order instantly via WhatsApp. No complicated checkout, no account
              needed. Just tap and go.
            </p>

            <div style={{ position: "relative" }}>
              <WhatsAppCTA
                productName="Now"
                accentHue={product.accentHue}
              />
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "rgba(240,236,228,0.2)",
                marginTop: "20px",
                position: "relative",
              }}
            >
              Free Shipping • Cash on Delivery • 24/7 Support
            </p>
          </div>
        </Fade>
      </section>

      {/* ─── FOOTER ─────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "28px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
            >
              ◆
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.08em",
                color: "rgba(240,236,228,0.5)",
              }}
            >
              POKER SHOWROOM
            </span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Service", "Shipping Policy"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontSize: "11px",
                    color: "rgba(240,236,228,0.3)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      `hsl(${product.accentHue},55%,60%)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(240,236,228,0.3)";
                  }}
                >
                  {link}
                </a>
              )
            )}
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "10px" }}>
            {["instagram", "twitter", "tiktok", "whatsapp"].map((social) => (
              <a
                key={social}
                href="#"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(240,236,228,0.4)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `hsla(${product.accentHue},50%,50%,0.3)`;
                  e.currentTarget.style.color = `hsl(${product.accentHue},55%,65%)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "rgba(240,236,228,0.4)";
                }}
              >
                {social === "instagram" && "📷"}
                {social === "twitter" && "𝕏"}
                {social === "tiktok" && "♪"}
                {social === "whatsapp" && "💬"}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "rgba(240,236,228,0.12)",
            margin: "20px 0 0",
          }}
        >
          © 2024 Poker Showroom. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
