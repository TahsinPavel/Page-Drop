"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "Eclipse Runner",
    tagline: "Looks premium from every angle.",
    description:
      "Ultra-lightweight carbon-weave upper with responsive foam midsole. Engineered for all-day comfort.",
    price: "$189",
    originalPrice: "$249",
    badge: "BESTSELLER",
    badgeColor: "#10b981",
    accentHue: 160,
    images: ["/demo/sneaker-1.png", "/demo/sneaker-2.png", "/demo/sneaker-3.png"],
  },
  {
    id: 2,
    name: "Nebula Chronos",
    tagline: "Time, redefined for the modern visionary.",
    description:
      "A deep iridescent sapphire glass face that shifts colors from navy to violet under different lighting.",
    price: "$589",
    originalPrice: "$749",
    badge: "LIMITED EDITION",
    badgeColor: "#6366f1",
    accentHue: 245,
    images: ["/demo/watch-1.png", "/demo/watch-2.png", "/demo/watch-3.png"],
  },
  {
    id: 3,
    name: "Aura Pods",
    tagline: "Sound that surrounds, style that defines.",
    description:
      "Active noise cancellation meets premium design. 40-hour battery with spatial audio technology.",
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

const WHY_CHOOSE_US = [
  {
    icon: "◆",
    title: "Premium Quality",
    description:
      "Carefully selected materials with luxe finish and comfort-first construction for everyday wear.",
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    description:
      "Orders are confirmed on WhatsApp and dispatched fast so your product arrives without delay.",
  },
  {
    icon: "💰",
    title: "Cash On Delivery",
    description:
      "Shop with confidence and pay at delivery for a smooth, low-friction purchase experience.",
  },
  {
    icon: "↺",
    title: "Easy Returns",
    description:
      "Simple support process in case you need size help or a quick exchange after receiving your order.",
  },
];

const SOCIAL_STATS = [
  { label: "Average Rating", value: "4.8/5", note: "From 1,200+ buyers" },
  { label: "Orders Delivered", value: "12,000+", note: "Across major cities" },
  { label: "Repeat Customers", value: "63%", note: "Strong return buyers" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Verified Buyer",
    quote:
      "Ordering through WhatsApp was so easy. The product looked exactly like the hero visuals and arrived quickly.",
  },
  {
    name: "Marcus Rivera",
    role: "Verified Buyer",
    quote:
      "The 3D card fan gave me confidence before purchase. It felt premium and helped me decide instantly.",
  },
  {
    name: "Aisha Patel",
    role: "Verified Buyer",
    quote:
      "Cash on delivery removed the risk for me. Support replied fast and the quality exceeded my expectations.",
  },
];

function useGlobalStyles() {
  useEffect(() => {
    const id = "poker-lp3-styles";
    if (document.getElementById(id)) return;

    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
      @keyframes lp3FadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes lp3Pulse { 0%, 100% { opacity: .38; } 50% { opacity: .92; } }
      @keyframes lp3SpotlightPulse { 0%, 100% { opacity: .07; } 50% { opacity: .13; } }
      @keyframes lp3Hint { 0%, 100% { transform: translateY(0); opacity: .48; } 50% { transform: translateY(4px); opacity: .85; } }
      @keyframes lp3Shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    `;

    document.head.appendChild(s);
  }, []);
}

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

function PokerFan({ images, isActive, accentHue, isMobile }) {
  const [centerIdx, setCenterIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const total = images.length;

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

  const cardW = isMobile ? 176 : 314;
  const cardH = isMobile ? 248 : 446;
  const containerW = cardW + (isMobile ? 194 : 358);
  const containerH = cardH + (isMobile ? 82 : 104);

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

        const rotationAngle = isMobile ? 22 : 27;
        const rotation = offset * rotationAngle * (isExpanded ? 1.08 : 1);

        const spreadX = isMobile ? 82 : 146;
        const tx = offset * spreadX * (isExpanded ? 1.12 : 1);

        const ty = absOff * (isMobile ? 24 : 32);

        const scale = isCenter ? 1 : 0.9;
        const zIdx = 10 - absOff;

        const shadow = isCenter
          ? `0 40px 92px rgba(0,0,0,0.94), 0 0 34px hsla(${accentHue}, 62%, 36%, 0.15)`
          : "0 20px 56px rgba(0,0,0,0.84)";

        return (
          <div
            key={idx}
            onClick={() => handleCardClick(idx)}
            style={{
              position: "absolute",
              width: `${cardW}px`,
              height: `${cardH}px`,
              borderRadius: isMobile ? "16px" : "24px",
              overflow: "hidden",
              transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rotation}deg) scale(${scale})`,
              transformOrigin: "center 88%",
              zIndex: zIdx,
              transition:
                "transform 0.6s cubic-bezier(0.2, 1, 0.4, 1), background 0.6s, opacity 0.6s",
              boxShadow: shadow,
              cursor: isActive && !isCenter ? "pointer" : "default",
              border: isCenter
                ? "1px solid rgba(255,255,255,0.11)"
                : "1px solid rgba(255,255,255,0.05)",
              background:
                "linear-gradient(180deg, #17181b 0%, #0e0f11 45%, #07080a 100%)",
              opacity: isCenter ? 1 : 0.62,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                background: isCenter
                  ? `linear-gradient(180deg, hsla(${accentHue}, 36%, 56%, 0.07) 0%, transparent 35%)`
                  : "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 30%)",
                pointerEvents: "none",
              }}
            />

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

            {isCenter && (
              <div
                style={{
                  position: "absolute",
                  bottom: isMobile ? "16px" : "24px",
                  left: isMobile ? "18px" : "24px",
                  fontSize: isMobile ? "10px" : "12px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: "#10B981",
                  textTransform: "uppercase",
                  fontFamily: "'Space Grotesk', sans-serif",
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

function ProductCarousel({ products, activeIndex, onChangeIndex, isMobile }) {
  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const total = products.length;

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
    if (!isDragging) return undefined;

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
  }, [isDragging, onPointerMove, onPointerUp]);

  const getProductTransform = (idx) => {
    let offset = idx - activeIndex;

    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    const isActive = offset === 0;
    const absOff = Math.abs(offset);
    const gap = isMobile ? 300 : 454;
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
        height: isMobile ? "390px" : "560px",
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

function WhatsAppCTA({ productName, accentHue, label = "Order on WhatsApp" }) {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <button
      onClick={() => {
        const msg = encodeURIComponent(
          `Hi, I'd like to order ${productName}. Please share available variants.`
        );
        window.open(`https://wa.me/?text=${msg}`, "_blank");
      }}
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width: "100%",
        padding: "16px 18px",
        backgroundImage: btnHovered
          ? `linear-gradient(135deg, #25D366 0%, hsl(${accentHue}, 68%, 54%) 100%)`
          : "none",
        backgroundColor: "#25D366",
        backgroundSize: "200% 100%",
        color: "#fff",
        border: "none",
        borderRadius: "14px",
        fontSize: "14px",
        fontWeight: 800,
        fontFamily: "'Manrope', sans-serif",
        cursor: "pointer",
        letterSpacing: "0.01em",
        transition: "all .35s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: btnHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: btnHovered
          ? "0 12px 40px rgba(37,211,102,.42)"
          : "0 8px 24px rgba(37,211,102,.28)",
        animation: btnHovered ? "lp3Shimmer 2s linear infinite" : "none",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
      </svg>
      {label}
    </button>
  );
}

function ProductInfoPanel({ product, isMobile }) {
  if (!product) return null;

  return (
    <div
      key={product.id}
      style={{
        width: "100%",
        maxWidth: isMobile ? "100%" : "408px",
        background:
          "linear-gradient(170deg, rgba(22,24,31,.84) 0%, rgba(11,12,18,.92) 100%)",
        border: `1px solid hsla(${product.accentHue}, 48%, 62%, .2)`,
        borderRadius: "24px",
        padding: isMobile ? "24px" : "28px",
        backdropFilter: "blur(22px)",
        boxShadow: "0 24px 70px rgba(0,0,0,.48)",
        animation: "lp3FadeUp .5s ease",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          marginBottom: "14px",
          background: `${product.badgeColor}14`,
          border: `1px solid ${product.badgeColor}33`,
          borderRadius: "999px",
          padding: "6px 12px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "999px",
            background: product.badgeColor,
            animation: "lp3Pulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: ".12em",
            color: product.badgeColor,
            textTransform: "uppercase",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {product.badge}
        </span>
      </div>

      <h2
        style={{
          margin: "0 0 6px",
          fontSize: isMobile ? "31px" : "36px",
          lineHeight: 1.04,
          color: "#f8f4ec",
          fontWeight: 700,
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {product.name}
      </h2>

      <p
        style={{
          margin: "0 0 8px",
          fontSize: "14px",
          color: "rgba(245, 242, 235, .84)",
          fontWeight: 600,
          lineHeight: 1.5,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {product.tagline}
      </p>

      <p
        style={{
          margin: "0 0 18px",
          fontSize: "12px",
          color: "rgba(245, 242, 235, .54)",
          lineHeight: 1.7,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {product.description}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <span
          style={{
            fontSize: "34px",
            lineHeight: 1,
            color: "#fff",
            letterSpacing: "-.02em",
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {product.price}
        </span>
        {product.originalPrice && (
          <span
            style={{
              fontSize: "16px",
              color: "rgba(245, 242, 235, .35)",
              textDecoration: "line-through",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {product.originalPrice}
          </span>
        )}
      </div>

      <WhatsAppCTA productName={product.name} accentHue={product.accentHue} />

      <p
        style={{
          margin: "10px 0 14px",
          fontSize: "11px",
          color: "rgba(245, 242, 235, .44)",
          textAlign: "center",
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        No payment required now • Ask anything first
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
          gap: "8px",
        }}
      >
        {["Cash on Delivery", "Fast Delivery", "Easy Returns"].map((item) => (
          <div
            key={item}
            style={{
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.03)",
              borderRadius: "10px",
              padding: "8px 9px",
              textAlign: "center",
              fontSize: "10px",
              color: "rgba(245,242,235,.74)",
              fontWeight: 600,
              fontFamily: "'Manrope', sans-serif",
              letterSpacing: ".01em",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
        }}
      >
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#ef4444",
            animation: "lp3Pulse 1.4s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: "11px",
            color: "rgba(245,242,235,.54)",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          Limited stock available for this drop
        </span>
      </div>
    </div>
  );
}

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
        [direction === "left" ? "left" : "right"]: "16px",
        transform: "translateY(-50%)",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: hovered
          ? `hsla(${accentHue},60%,60%,0.2)`
          : "rgba(255,255,255,0.05)",
        border: hovered
          ? `1px solid hsla(${accentHue},60%,65%,0.38)`
          : "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? "#fff" : "rgba(245,242,235,.6)",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        transition: "all .25s ease",
        zIndex: 22,
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

function SectionIntro({ eyebrow, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "28px" }}>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: "11px",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "rgba(245,242,235,.46)",
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          margin: "0",
          color: "#f7f3ec",
          fontSize: "clamp(32px, 4.2vw, 52px)",
          lineHeight: 0.95,
          fontWeight: 700,
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: "12px auto 0",
          maxWidth: "62ch",
          color: "rgba(245,242,235,.6)",
          lineHeight: 1.65,
          fontSize: "14px",
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export default function DemoLandingPage3() {
  useGlobalStyles();

  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [activeProduct, setActiveProduct] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = PRODUCTS.length;

  useEffect(() => {
    if (!autoplay) return undefined;

    const id = setInterval(() => {
      setActiveProduct((p) => (p + 1) % total);
    }, 6000);

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
        color: "#f7f2ea",
        fontFamily: "'Manrope', system-ui, sans-serif",
        background:
          "radial-gradient(1300px 620px at 50% -6%, rgba(255,255,255,.06), transparent 48%), linear-gradient(176deg, #11141b 0%, #0a0d13 52%, #06070b 100%)",
        overflowX: "hidden",
      }}
    >
      <section
        style={{
          position: "relative",
          padding: isMobile ? "18px 14px 28px" : "26px 26px 38px",
          maxWidth: "1380px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)",
            backgroundSize: "68px 68px",
            maskImage:
              "radial-gradient(circle at center, rgba(0,0,0,.68) 0%, rgba(0,0,0,.24) 56%, transparent 84%)",
          }}
        />

        <div
          style={{
            borderRadius: "32px",
            border: "1px solid rgba(255,255,255,.06)",
            background:
              "linear-gradient(180deg, rgba(18,22,30,.9) 0%, rgba(10,12,18,.92) 100%)",
            backdropFilter: "blur(8px)",
            padding: isMobile ? "14px 14px 20px" : "18px 26px 32px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 24px 62px rgba(0,0,0,.42)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: isMobile ? "28px" : "40px",
              padding: isMobile ? "0 4px" : "2px 8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: isMobile ? "30px" : "34px",
                  height: isMobile ? "30px" : "34px",
                  borderRadius: "12px",
                  border: `1px solid hsla(${product.accentHue}, 60%, 66%, .3)`,
                  background: `linear-gradient(145deg, hsla(${product.accentHue}, 65%, 56%, .28) 0%, rgba(255,255,255,.05) 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                }}
              >
                ◆
              </div>
              <span
                style={{
                  fontSize: isMobile ? "11px" : "12px",
                  fontWeight: 700,
                  letterSpacing: ".12em",
                  color: "rgba(247,242,234,.88)",
                  textTransform: "uppercase",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Poker Showroom
              </span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                borderRadius: "999px",
                padding: isMobile ? "7px 10px" : "8px 12px",
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.09)",
                color: "rgba(247,242,234,.8)",
                fontSize: isMobile ? "10px" : "11px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              <span style={{ color: "#fbbf24" }}>★</span>
              Trusted by 1,200+ customers
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              maxWidth: "860px",
              margin: "0 auto",
              padding: isMobile ? "0 2px" : "0 16px",
            }}
          >
            <p
              style={{
                margin: "0 0 12px",
                fontSize: isMobile ? "10px" : "11px",
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: `hsl(${product.accentHue}, 72%, 70%)`,
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Limited Edition Drop
            </p>

            <h1
              style={{
                margin: "0",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? "40px" : "clamp(56px, 5.8vw, 86px)",
                lineHeight: isMobile ? 0.95 : 0.9,
                letterSpacing: "-.02em",
                color: "#fbf8f3",
                maxWidth: "18ch",
                marginInline: "auto",
              }}
            >
              Choose the Style That Fits You Best
            </h1>

            <p
              style={{
                margin: "14px auto 0",
                fontSize: isMobile ? "14px" : "16px",
                color: "rgba(247,242,234,.66)",
                maxWidth: "54ch",
                lineHeight: 1.65,
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Premium quality. Limited stock. Instant ordering through WhatsApp in under a minute.
            </p>
          </div>

          <div
            style={{
              marginTop: isMobile ? "24px" : "34px",
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "minmax(0, 1.35fr) minmax(344px, 408px)",
              alignItems: "center",
              gap: isMobile ? "14px" : "30px",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", minHeight: isMobile ? "468px" : "626px" }}>
              <div
                style={{
                  position: "absolute",
                  top: isMobile ? "50%" : "50%",
                  left: isMobile ? "50%" : "43%",
                  transform: "translate(-50%, -50%)",
                  width: isMobile ? "330px" : "730px",
                  height: isMobile ? "300px" : "590px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, hsla(${product.accentHue}, 70%, 55%, .16) 0%, hsla(${product.accentHue}, 58%, 44%, .08) 30%, transparent 72%)`,
                  filter: "blur(40px)",
                  animation: "lp3SpotlightPulse 5s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: isMobile ? "52%" : "54%",
                  left: isMobile ? "50%" : "38%",
                  transform: "translate(-50%, -50%)",
                  width: isMobile ? "300px" : "620px",
                  height: isMobile ? "260px" : "360px",
                  borderRadius: "42px",
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,0) 58%)",
                  filter: "blur(16px)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  transform: isMobile ? "none" : "translateX(-38px)",
                  zIndex: 4,
                }}
              >
                <ProductCarousel
                  products={PRODUCTS}
                  activeIndex={activeProduct}
                  onChangeIndex={goTo}
                  isMobile={isMobile}
                />

                {!isMobile && (
                  <>
                    <CarouselArrow
                      direction="left"
                      onClick={() => goTo(((activeProduct - 1) % total + total) % total)}
                      accentHue={product.accentHue}
                    />
                    <CarouselArrow
                      direction="right"
                      onClick={() => goTo((activeProduct + 1) % total)}
                      accentHue={product.accentHue}
                    />
                  </>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: isMobile ? "8px" : "4px",
                  }}
                >
                  {PRODUCTS.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => goTo(i)}
                      aria-label={`Go to ${p.name}`}
                      style={{
                        width: i === activeProduct ? "30px" : "8px",
                        height: "8px",
                        borderRadius: "999px",
                        border: "none",
                        cursor: "pointer",
                        background:
                          i === activeProduct
                            ? `hsl(${p.accentHue}, 74%, 62%)`
                            : "rgba(255,255,255,.2)",
                        transition: "all .34s ease",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "12px",
                    gap: "4px",
                    color: "rgba(247,242,234,.52)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: ".11em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    Swipe to explore styles
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      lineHeight: 1,
                      animation: "lp3Hint 1.8s ease-in-out infinite",
                    }}
                    aria-hidden
                  >
                    ↔
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 8,
                width: "100%",
                alignSelf: "center",
                marginTop: isMobile ? "6px" : "0",
              }}
            >
              <ProductInfoPanel product={product} isMobile={isMobile} />
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: isMobile ? "12px 16px 30px" : "14px 24px 52px",
        }}
      >
        <SectionIntro
          eyebrow="Why Choose Us"
          title="Built for premium feel and confidence"
          subtitle="Every detail is designed to reduce hesitation and help paid-traffic visitors convert quickly with trust."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          {WHY_CHOOSE_US.map((item, index) => (
            <div
              key={item.title}
              style={{
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,.08)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.035) 0%, rgba(255,255,255,.016) 100%)",
                padding: "20px 16px",
                boxShadow: "0 14px 34px rgba(0,0,0,.25)",
                animation: `lp3FadeUp .55s ease ${index * 0.08}s both`,
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "rgba(255,255,255,.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                  color: "rgba(247,242,235,.9)",
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "15px",
                  color: "rgba(247,242,235,.92)",
                  fontWeight: 700,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "rgba(247,242,235,.56)",
                  lineHeight: 1.65,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: isMobile ? "4px 16px 34px" : "4px 24px 62px",
        }}
      >
        <SectionIntro
          eyebrow="Social Proof"
          title="Trusted by real customers"
          subtitle="Proof-driven messaging to reduce purchase anxiety and reinforce confidence before checkout."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          {SOCIAL_STATS.map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,.08)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.03) 0%, rgba(255,255,255,.014) 100%)",
                padding: "14px 14px",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: "11px",
                  color: "rgba(247,242,235,.46)",
                  fontWeight: 600,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: "24px",
                  color: "#f8f4ec",
                  lineHeight: 1,
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {item.value}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  color: "rgba(247,242,235,.52)",
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                {item.note}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          {TESTIMONIALS.map((item, index) => (
            <div
              key={item.name}
              style={{
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,.08)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.03) 0%, rgba(255,255,255,.015) 100%)",
                padding: "18px 16px",
                boxShadow: "0 14px 34px rgba(0,0,0,.24)",
                animation: `lp3FadeUp .6s ease ${index * 0.1}s both`,
              }}
            >
              <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: "#f59e0b", fontSize: "13px" }}>
                    ★
                  </span>
                ))}
              </div>

              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: "13px",
                  color: "rgba(247,242,235,.72)",
                  lineHeight: 1.72,
                  fontStyle: "italic",
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                "{item.quote}"
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,.12)",
                    background: "rgba(255,255,255,.06)",
                    color: "rgba(247,242,235,.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "13px",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 1px",
                      fontSize: "13px",
                      color: "rgba(247,242,235,.92)",
                      fontWeight: 700,
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "rgba(247,242,235,.5)",
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: "920px",
          margin: "0 auto",
          padding: isMobile ? "6px 16px 56px" : "8px 24px 86px",
        }}
      >
        <div
          style={{
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,.09)",
            background:
              "linear-gradient(165deg, rgba(28,31,40,.9) 0%, rgba(12,14,20,.96) 52%, rgba(8,9,14,.98) 100%)",
            padding: isMobile ? "34px 20px" : "54px 40px",
            textAlign: "center",
            boxShadow: "0 26px 70px rgba(0,0,0,.46)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-36px",
              left: "50%",
              transform: "translateX(-50%)",
              width: isMobile ? "260px" : "380px",
              height: isMobile ? "120px" : "180px",
              borderRadius: "999px",
              background: `radial-gradient(ellipse, hsla(${product.accentHue}, 70%, 56%, .17) 0%, transparent 72%)`,
              pointerEvents: "none",
            }}
          />

          <p
            style={{
              margin: "0 0 8px",
              fontSize: "11px",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "rgba(245,242,235,.52)",
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Final Step
          </p>

          <h2
            style={{
              margin: "0",
              color: "#f8f4ec",
              fontSize: "clamp(34px, 5vw, 58px)",
              lineHeight: 0.93,
              fontWeight: 700,
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Found your style? Order instantly now.
          </h2>

          <p
            style={{
              margin: "14px auto 20px",
              maxWidth: "52ch",
              color: "rgba(245,242,235,.62)",
              fontSize: "14px",
              lineHeight: 1.68,
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Quick WhatsApp checkout, real support, and no upfront payment required. Confirm your order in minutes.
          </p>

          <div style={{ maxWidth: "360px", margin: "0 auto" }}>
            <WhatsAppCTA
              productName={product.name}
              accentHue={product.accentHue}
              label="Order on WhatsApp"
            />
          </div>

          <p
            style={{
              margin: "12px 0 0",
              fontSize: "11px",
              color: "rgba(245,242,235,.42)",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Fast Delivery • Cash On Delivery • Easy Returns
          </p>
        </div>
      </section>
    </div>
  );
}
