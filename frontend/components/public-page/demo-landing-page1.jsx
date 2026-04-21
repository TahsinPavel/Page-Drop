"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

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
    title: "Premium Quality",
    description:
      "Crafted from aerospace-grade aluminum and memory foam for lasting durability and supreme comfort.",
    icon: "diamond",
  },
  {
    title: "Fast Delivery",
    description:
      "Custom-tuned logistics and support ensure you get your order quickly with full purchase guidance.",
    icon: "sound",
  },
  {
    title: "Cash on Delivery",
    description:
      "Order with confidence and pay on delivery, with direct WhatsApp confirmation before dispatch.",
    icon: "lock",
  },
  {
    title: "Easy Returns",
    description:
      "Simple return support and responsive human assistance if you need adjustments after delivery.",
    icon: "diamond",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Absolutely stunning design. The sound quality blew me away, and ordering through WhatsApp was surprisingly easy.",
    name: "James D.",
    role: "Verified Buyer",
    avatar: "#6366f1",
  },
  {
    quote:
      "I've owned many premium headphones, but these take the crown for both comfort and aesthetic. Highly recommend.",
    name: "Sarah M.",
    role: "Verified Buyer",
    avatar: "#10b981",
  },
  {
    quote:
      "Fast delivery, exact product as shown. The noise cancellation on the Buds is top tier for commuting.",
    name: "Robert T.",
    role: "Verified Buyer",
    avatar: "#f59e0b",
  },
];

function DiamondIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(244,244,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M2 9h20" />
      <path d="M10 3l-2 6 4 13 4-13-2-6" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(244,244,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="4" height="8" rx="1" />
      <path d="M8 10l4-4v12l-4-4" />
      <path d="M15 9a3 3 0 010 6" />
      <path d="M18 7a7 7 0 010 10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(244,244,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );
}

const ICON_MAP = { diamond: DiamondIcon, sound: SoundIcon, lock: LockIcon };

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getUrgencyNote(product) {
  if (product.badge === "BESTSELLER") return "Best Seller - moving quickly";
  if (product.badge === "NEW") return "Limited Edition - early access";
  return "Only few left in stock";
}

function useGlobalStyles() {
  useEffect(() => {
    const id = "aura-spotlight-lp-styles";
    if (document.getElementById(id)) return;

    const styleTag = document.createElement("style");
    styleTag.id = id;
    styleTag.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

      @keyframes lp1-fade-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes lp1-active-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      @keyframes lp1-breathe {
        0%, 100% { opacity: 0.72; }
        50% { opacity: 1; }
      }

      @keyframes lp1-swipe-pulse {
        0%, 100% { opacity: 0.45; transform: translateY(0); }
        50% { opacity: 0.9; transform: translateY(-4px); }
      }

      .lp1-root {
        --lp1-bg-0: #06070b;
        --lp1-bg-1: #0c101a;
        --lp1-bg-2: #0f1421;
        --lp1-surface: rgba(255, 255, 255, 0.04);
        --lp1-surface-strong: rgba(255, 255, 255, 0.08);
        --lp1-border: rgba(255, 255, 255, 0.12);
        --lp1-text: #f7f8ff;
        --lp1-muted: rgba(240, 242, 255, 0.66);
        --lp1-muted-soft: rgba(240, 242, 255, 0.5);
        --lp1-step: 260px;
        --lp1-card-size: 330px;
        min-height: 100vh;
        color: var(--lp1-text);
        font-family: 'Plus Jakarta Sans', sans-serif;
        overflow-x: hidden;
        background:
          radial-gradient(circle at 20% 16%, rgba(99, 102, 241, 0.2) 0%, transparent 45%),
          radial-gradient(circle at 80% 10%, rgba(37, 211, 102, 0.14) 0%, transparent 40%),
          linear-gradient(165deg, var(--lp1-bg-0) 0%, var(--lp1-bg-1) 52%, var(--lp1-bg-2) 100%);
      }

      .lp1-hero {
        position: relative;
        min-height: 100vh;
        padding: 24px 24px 56px;
      }

      .lp1-topbar {
        max-width: 1180px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 20px;
        border-radius: 999px;
        border: 1px solid var(--lp1-border);
        background: rgba(5, 8, 16, 0.62);
        backdrop-filter: blur(16px);
      }

      .lp1-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Outfit', sans-serif;
        letter-spacing: 0.08em;
        font-weight: 700;
        font-size: 14px;
      }

      .lp1-brand-mark {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(145deg, rgba(99,102,241,0.45), rgba(37,211,102,0.2));
        border: 1px solid rgba(255,255,255,0.2);
        font-size: 14px;
      }

      .lp1-top-trust {
        font-size: 12px;
        font-weight: 600;
        color: var(--lp1-muted);
        white-space: nowrap;
      }

      .lp1-headline {
        max-width: 980px;
        margin: 34px auto 30px;
        text-align: center;
        animation: lp1-fade-up .7s ease;
      }

      .lp1-kicker {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 13px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.05);
        color: rgba(235, 236, 255, 0.84);
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 700;
      }

      .lp1-headline h1 {
        margin: 16px auto 10px;
        font-family: 'Outfit', sans-serif;
        font-size: clamp(30px, 5vw, 64px);
        font-weight: 800;
        line-height: 1.03;
        letter-spacing: -0.02em;
        max-width: 14ch;
      }

      .lp1-subheadline {
        margin: 0 auto;
        color: var(--lp1-muted);
        font-size: clamp(14px, 1.5vw, 18px);
        line-height: 1.6;
        max-width: 55ch;
      }

      .lp1-hero-grid {
        max-width: 1180px;
        margin: 24px auto 0;
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.9fr);
        gap: 28px;
        align-items: center;
      }

      .lp1-spotlight-wrap {
        position: relative;
        padding: 28px 22px 16px;
        min-height: 490px;
        border-radius: 28px;
        border: 1px solid rgba(255,255,255,0.13);
        background: linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03));
        box-shadow: 0 30px 90px rgba(0,0,0,0.45);
        backdrop-filter: blur(15px);
      }

      .lp1-stage {
        position: relative;
        height: 390px;
        perspective: 1500px;
        transform-style: preserve-3d;
        touch-action: pan-y;
      }

      .lp1-spot-glow {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 420px;
        height: 270px;
        border-radius: 50%;
        transform: translate(-50%, -42%);
        filter: blur(20px);
        animation: lp1-breathe 3.6s ease-in-out infinite;
        pointer-events: none;
      }

      .lp1-shadow-pad {
        position: absolute;
        left: 50%;
        bottom: 42px;
        width: 280px;
        height: 48px;
        border-radius: 50%;
        transform: translateX(-50%);
        background: radial-gradient(circle, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0) 70%);
        filter: blur(8px);
        pointer-events: none;
      }

      .lp1-product-card {
        position: absolute;
        top: 50%;
        left: 50%;
        width: var(--lp1-card-size);
        height: var(--lp1-card-size);
        transition: transform .85s cubic-bezier(.22,.7,0,1), opacity .65s ease, filter .65s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        will-change: transform, opacity, filter;
      }

      .lp1-product-card img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        user-select: none;
        pointer-events: none;
      }

      .lp1-product-card.active img {
        filter: drop-shadow(0 28px 50px rgba(0, 0, 0, 0.58));
        animation: lp1-active-float 3.5s ease-in-out infinite;
      }

      .lp1-slider-nav {
        position: absolute;
        top: 50%;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.22);
        background: rgba(5, 10, 18, 0.56);
        color: rgba(245, 247, 255, 0.92);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        backdrop-filter: blur(8px);
        transition: transform .2s ease, border-color .2s ease, background .2s ease;
        z-index: 40;
      }

      .lp1-slider-nav:hover {
        transform: translateY(-2px);
        border-color: rgba(255,255,255,0.42);
        background: rgba(17, 26, 40, 0.78);
      }

      .lp1-slider-nav.left { left: 6px; transform: translateY(-50%); }
      .lp1-slider-nav.right { right: 6px; transform: translateY(-50%); }

      .lp1-dot-row {
        margin-top: 6px;
        display: flex;
        justify-content: center;
        gap: 8px;
      }

      .lp1-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        border: 0;
        background: rgba(255,255,255,0.34);
        cursor: pointer;
        transition: width .24s ease, background .24s ease;
      }

      .lp1-dot.active {
        width: 22px;
        background: rgba(255,255,255,0.92);
      }

      .lp1-swipe-hint {
        margin-top: 16px;
        text-align: center;
        color: rgba(242, 245, 255, 0.64);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        animation: lp1-swipe-pulse 2s ease-in-out infinite;
      }

      .lp1-cta-card {
        width: 100%;
        max-width: 390px;
        justify-self: end;
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,0.16);
        background: linear-gradient(175deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05));
        box-shadow: 0 28px 70px rgba(0, 0, 0, 0.48);
        backdrop-filter: blur(16px);
        padding: 26px;
        animation: lp1-fade-up .65s ease;
      }

      .lp1-card-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border-radius: 999px;
        padding: 7px 12px;
        font-size: 11px;
        letter-spacing: 0.11em;
        text-transform: uppercase;
        font-weight: 700;
        border: 1px solid rgba(255,255,255,0.2);
      }

      .lp1-card-title {
        margin: 14px 0 6px;
        font-family: 'Outfit', sans-serif;
        font-size: clamp(27px, 3.2vw, 36px);
        letter-spacing: -0.02em;
        line-height: 1.05;
      }

      .lp1-card-copy {
        margin: 0;
        color: var(--lp1-muted-soft);
        font-size: 14px;
        line-height: 1.65;
      }

      .lp1-price {
        margin: 18px 0 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 34px;
        font-weight: 700;
      }

      .lp1-urgency {
        margin: 0 0 18px;
        color: rgba(255, 225, 150, 0.95);
        font-size: 13px;
        font-weight: 600;
      }

      .lp1-order-btn {
        width: 100%;
        height: 54px;
        border-radius: 14px;
        border: 0;
        font-size: 16px;
        font-weight: 800;
        color: white;
        background: linear-gradient(90deg, #1ecb5e, #28dd72);
        box-shadow: 0 10px 30px rgba(30, 203, 94, 0.34);
        cursor: pointer;
        transition: transform .22s ease, box-shadow .22s ease;
      }

      .lp1-order-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 34px rgba(30, 203, 94, 0.44);
      }

      .lp1-card-note {
        margin: 11px 0 14px;
        font-size: 12px;
        color: rgba(246, 248, 255, 0.72);
        text-align: center;
      }

      .lp1-trust-chips {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .lp1-chip {
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.16);
        background: rgba(255,255,255,0.05);
        padding: 10px 12px;
        font-size: 12px;
        color: rgba(242,245,255,0.88);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .lp1-support-section {
        max-width: 1140px;
        margin: 0 auto;
        padding: 86px 24px 84px;
      }

      .lp1-section-head {
        text-align: center;
        margin-bottom: 34px;
      }

      .lp1-section-kicker {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: rgba(236,239,255,0.62);
        margin-bottom: 10px;
      }

      .lp1-section-title {
        margin: 0;
        font-family: 'Outfit', sans-serif;
        font-size: clamp(30px, 4vw, 48px);
        line-height: 1.05;
        letter-spacing: -0.02em;
      }

      .lp1-section-copy {
        margin: 12px auto 0;
        max-width: 62ch;
        color: rgba(233,238,255,0.68);
        line-height: 1.7;
        font-size: 15px;
      }

      .lp1-feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
      }

      .lp1-feature-card {
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.16);
        background: linear-gradient(170deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03));
        padding: 24px 20px;
        transition: transform .24s ease, border-color .24s ease;
      }

      .lp1-feature-card:hover {
        transform: translateY(-4px);
        border-color: rgba(255,255,255,0.33);
      }

      .lp1-feature-icon {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.08);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 14px;
      }

      .lp1-feature-title {
        margin: 0 0 8px;
        font-size: 17px;
        font-weight: 700;
        font-family: 'Outfit', sans-serif;
      }

      .lp1-feature-copy {
        margin: 0;
        color: rgba(236,240,255,0.66);
        line-height: 1.65;
        font-size: 13px;
      }

      .lp1-proof-wrap {
        max-width: 1140px;
        margin: 0 auto;
        padding: 20px 24px 90px;
      }

      .lp1-proof-top {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 18px;
      }

      .lp1-proof-stat {
        margin-top: 10px;
        font-size: 14px;
        color: rgba(252, 210, 120, 0.98);
        font-weight: 600;
      }

      .lp1-proof-nav {
        display: flex;
        gap: 8px;
      }

      .lp1-proof-nav button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.22);
        background: rgba(255,255,255,0.06);
        color: rgba(247,249,255,0.88);
        cursor: pointer;
        transition: border-color .2s ease, transform .2s ease;
      }

      .lp1-proof-nav button:hover {
        border-color: rgba(255,255,255,0.46);
        transform: translateY(-2px);
      }

      .lp1-review-row {
        display: flex;
        overflow-x: auto;
        gap: 14px;
        scroll-snap-type: x mandatory;
        padding-bottom: 8px;
        scrollbar-width: none;
        ms-overflow-style: none;
      }

      .lp1-review-row::-webkit-scrollbar {
        display: none;
      }

      .lp1-review-card {
        min-width: min(370px, 88vw);
        scroll-snap-align: start;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.18);
        background: linear-gradient(175deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04));
        padding: 22px;
      }

      .lp1-review-stars {
        color: #f7bb3a;
        letter-spacing: 0.08em;
        margin-bottom: 12px;
      }

      .lp1-review-copy {
        margin: 0 0 16px;
        font-size: 14px;
        color: rgba(241,244,255,0.76);
        line-height: 1.7;
      }

      .lp1-review-footer {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .lp1-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 13px;
        font-weight: 700;
      }

      .lp1-cta-wrap {
        padding: 0 24px 96px;
      }

      .lp1-cta-panel {
        max-width: 980px;
        margin: 0 auto;
        border-radius: 30px;
        border: 1px solid rgba(255,255,255,0.18);
        background:
          radial-gradient(circle at 20% 10%, rgba(37,211,102,0.2), transparent 50%),
          linear-gradient(155deg, rgba(7, 13, 23, 0.96), rgba(11, 21, 36, 0.96));
        padding: clamp(36px, 6vw, 68px) clamp(20px, 5vw, 56px);
        text-align: center;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
      }

      .lp1-cta-panel h2 {
        margin: 0;
        font-family: 'Outfit', sans-serif;
        font-size: clamp(30px, 5vw, 58px);
        line-height: 1.03;
        letter-spacing: -0.02em;
      }

      .lp1-cta-panel p {
        margin: 14px auto 28px;
        max-width: 58ch;
        color: rgba(236,240,255,0.74);
        line-height: 1.7;
        font-size: 15px;
      }

      .lp1-footer {
        max-width: 1140px;
        margin: 0 auto;
        padding: 26px 24px 42px;
        border-top: 1px solid rgba(255,255,255,0.11);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
      }

      .lp1-footer-left {
        display: flex;
        align-items: center;
        gap: 10px;
        color: rgba(242,245,255,0.7);
        font-size: 12px;
      }

      .lp1-footer-links {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .lp1-footer-links a {
        color: rgba(242,245,255,0.58);
        font-size: 12px;
        text-decoration: none;
      }

      .lp1-footer-links a:hover {
        color: rgba(255,255,255,0.92);
      }

      @media (max-width: 1160px) {
        .lp1-hero-grid {
          grid-template-columns: minmax(0, 1fr);
        }

        .lp1-cta-card {
          justify-self: stretch;
          max-width: 100%;
        }
      }

      @media (max-width: 900px) {
        .lp1-root {
          --lp1-step: 165px;
          --lp1-card-size: 236px;
        }

        .lp1-hero {
          padding: 14px 12px 44px;
        }

        .lp1-topbar {
          border-radius: 16px;
          padding: 12px 14px;
        }

        .lp1-headline {
          margin: 24px auto 18px;
        }

        .lp1-kicker {
          font-size: 9px;
          letter-spacing: 0.14em;
        }

        .lp1-spotlight-wrap {
          padding: 16px 12px 12px;
          min-height: 372px;
          border-radius: 20px;
        }

        .lp1-stage {
          height: 286px;
        }

        .lp1-slider-nav {
          display: none;
        }

        .lp1-spot-glow {
          width: 270px;
          height: 180px;
        }

        .lp1-shadow-pad {
          width: 174px;
          bottom: 33px;
        }

        .lp1-cta-card {
          padding: 18px;
          border-radius: 18px;
        }

        .lp1-card-title {
          font-size: 28px;
        }

        .lp1-price {
          font-size: 29px;
        }

        .lp1-proof-top {
          align-items: center;
        }

        .lp1-proof-nav {
          display: none;
        }
      }
    `;

    document.head.appendChild(styleTag);
  }, []);
}

function SpotlightSlider({ products, activeIndex, onChangeIndex, accentColor }) {
  const pointerStartX = useRef(0);
  const dragging = useRef(false);

  const total = products.length;

  const normalizeOffset = useCallback(
    (offset) => {
      if (offset > Math.floor(total / 2)) return offset - total;
      if (offset < -Math.floor(total / 2)) return offset + total;
      return offset;
    },
    [total]
  );

  const getMotion = useCallback(
    (index) => {
      const offset = normalizeOffset(index - activeIndex);
      const abs = Math.abs(offset);
      const scale = offset === 0 ? 1 : abs === 1 ? 0.78 : 0.62;
      const depth = offset === 0 ? 120 : abs === 1 ? -120 : -260;
      const rotateY = offset === 0 ? 0 : offset < 0 ? 18 : -18;
      const opacity = offset === 0 ? 1 : abs === 1 ? 0.54 : 0;
      const blur = offset === 0 ? 0 : abs === 1 ? 1.8 : 3;
      const brightness = offset === 0 ? 1 : 0.56;
      const zIndex = offset === 0 ? 30 : abs === 1 ? 20 : 10;

      return {
        offset,
        transform: `translate(-50%, -50%) translateX(calc(var(--lp1-step) * ${offset})) translateZ(${depth}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px) brightness(${brightness})`,
        zIndex,
      };
    },
    [activeIndex, normalizeOffset]
  );

  const onPointerDown = (event) => {
    dragging.current = true;
    pointerStartX.current = event.clientX;
  };

  const onPointerUp = (event) => {
    if (!dragging.current) return;
    const delta = event.clientX - pointerStartX.current;
    dragging.current = false;

    if (Math.abs(delta) < 45) return;
    if (delta < 0) onChangeIndex(activeIndex + 1);
    if (delta > 0) onChangeIndex(activeIndex - 1);
  };

  const onPointerLeave = () => {
    dragging.current = false;
  };

  return (
    <div className="lp1-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave}>
      <div
        className="lp1-spot-glow"
        style={{
          background: `radial-gradient(circle, ${hexToRgba(accentColor, 0.42)} 0%, ${hexToRgba(accentColor, 0.18)} 40%, rgba(0,0,0,0) 75%)`,
        }}
      />

      <div className="lp1-shadow-pad" />

      {products.map((item, index) => {
        const motion = getMotion(index);
        const isActive = index === activeIndex;
        const isVisible = Math.abs(motion.offset) <= 1;

        return (
          <button
            key={item.id}
            type="button"
            className={`lp1-product-card${isActive ? " active" : ""}`}
            onClick={() => onChangeIndex(index)}
            style={{
              transform: motion.transform,
              opacity: isVisible ? motion.opacity : 0,
              filter: motion.filter,
              zIndex: motion.zIndex,
              border: "none",
              background: "transparent",
              cursor: isVisible ? "pointer" : "default",
              pointerEvents: isVisible ? "auto" : "none",
            }}
            aria-label={`Show ${item.name}`}
          >
            <img src={item.image} alt={item.name} draggable="false" />
          </button>
        );
      })}

      <button type="button" className="lp1-slider-nav left" onClick={() => onChangeIndex(activeIndex - 1)} aria-label="Previous product">
        ‹
      </button>
      <button type="button" className="lp1-slider-nav right" onClick={() => onChangeIndex(activeIndex + 1)} aria-label="Next product">
        ›
      </button>

      <div className="lp1-dot-row">
        {products.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`lp1-dot${index === activeIndex ? " active" : ""}`}
            onClick={() => onChangeIndex(index)}
            aria-label={`Switch to ${item.name}`}
          />
        ))}
      </div>
    </div>
  );
}

function Fade({ children, delay = 0 }) {
  return (
    <div style={{ animation: `lp1-fade-up .75s ease ${delay}s both` }}>
      {children}
    </div>
  );
}

export default function DemoLandingPage1() {
  useGlobalStyles();

  const [activeProduct, setActiveProduct] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const testimonialRef = useRef(null);
  const total = PRODUCTS.length;

  useEffect(() => {
    if (!autoplay) return undefined;
    const id = setInterval(() => {
      setActiveProduct((current) => (current + 1) % total);
    }, 4500);
    return () => clearInterval(id);
  }, [autoplay, total]);

  const goTo = useCallback(
    (index) => {
      setActiveProduct(((index % total) + total) % total);
      setAutoplay(false);
      window.setTimeout(() => setAutoplay(true), 10000);
    },
    [total]
  );

  const current = PRODUCTS[activeProduct];
  const badgeTone = {
    color: current.badgeColor,
    background: hexToRgba(current.badgeColor, 0.16),
  };

  const openWhatsApp = () => {
    window.open("#", "_blank");
  };

  const scrollTestimonials = (direction) => {
    if (!testimonialRef.current) return;
    testimonialRef.current.scrollBy({ left: direction * 390, behavior: "smooth" });
  };

  return (
    <div className="lp1-root">
      <section className="lp1-hero">
        <div className="lp1-topbar">
          <div className="lp1-brand">
            <span className="lp1-brand-mark">✦</span>
            <span>AURA</span>
          </div>
          <div className="lp1-top-trust">⭐ Trusted by 1,200+ customers</div>
        </div>

        <div className="lp1-headline">
          <span className="lp1-kicker">LIMITED EDITION DROP</span>
          <h1>Find the style that matches you best.</h1>
          <p className="lp1-subheadline">Premium quality. Limited stock. Instant ordering with a focused product spotlight built to convert.</p>
        </div>

        <div className="lp1-hero-grid">
          <div className="lp1-spotlight-wrap">
            <SpotlightSlider products={PRODUCTS} activeIndex={activeProduct} onChangeIndex={goTo} accentColor={current.badgeColor} />
            <div className="lp1-swipe-hint">Swipe to explore products</div>
          </div>

          <aside className="lp1-cta-card" key={current.id}>
            <span className="lp1-card-badge" style={badgeTone}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: current.badgeColor, display: "inline-block" }} />
              {current.badge}
            </span>

            <h2 className="lp1-card-title">{current.name}</h2>
            <p className="lp1-card-copy">{current.tagline}</p>
            <div className="lp1-price">{current.price}</div>
            <p className="lp1-urgency">{getUrgencyNote(current)}</p>

            <button className="lp1-order-btn" onClick={openWhatsApp}>
              Order on WhatsApp
            </button>

            <p className="lp1-card-note">No payment required now • Ask anything first</p>

            <div className="lp1-trust-chips">
              <div className="lp1-chip">📦 Cash on Delivery</div>
              <div className="lp1-chip">🚚 Fast Delivery</div>
              <div className="lp1-chip">↺ Easy Returns</div>
            </div>
          </aside>
        </div>
      </section>

      <section className="lp1-support-section">
        <Fade>
          <div className="lp1-section-head">
            <div className="lp1-section-kicker">Why Choose Us</div>
            <h2 className="lp1-section-title">Premium confidence beyond the hero.</h2>
            <p className="lp1-section-copy">
              Built to turn desire into trust with reliable fulfillment, premium quality control, and human support that keeps your purchase simple.
            </p>
          </div>
        </Fade>

        <div className="lp1-feature-grid">
          {FEATURES.map((feature, index) => {
            const Icon = ICON_MAP[feature.icon];
            return (
              <Fade key={feature.title} delay={index * 0.08}>
                <article className="lp1-feature-card">
                  <div className="lp1-feature-icon">
                    <Icon />
                  </div>
                  <h3 className="lp1-feature-title">{feature.title}</h3>
                  <p className="lp1-feature-copy">{feature.description}</p>
                </article>
              </Fade>
            );
          })}
        </div>
      </section>

      <section className="lp1-proof-wrap">
        <Fade>
          <div className="lp1-proof-top">
            <div>
              <div className="lp1-section-kicker" style={{ marginBottom: 8 }}>Social Proof</div>
              <h2 className="lp1-section-title" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>The Verdict from real customers.</h2>
              <p className="lp1-proof-stat">⭐ 4.8 from 1,200+ happy customers</p>
            </div>
            <div className="lp1-proof-nav">
              <button type="button" onClick={() => scrollTestimonials(-1)} aria-label="Previous review">
                ‹
              </button>
              <button type="button" onClick={() => scrollTestimonials(1)} aria-label="Next review">
                ›
              </button>
            </div>
          </div>
        </Fade>

        <div className="lp1-review-row" ref={testimonialRef}>
          {TESTIMONIALS.map((item, index) => (
            <article className="lp1-review-card" key={index}>
              <div className="lp1-review-stars">★★★★★</div>
              <p className="lp1-review-copy">"{item.quote}"</p>
              <div className="lp1-review-footer">
                <span className="lp1-avatar" style={{ background: item.avatar }}>
                  {item.name.charAt(0)}
                </span>
                <span>
                  <strong style={{ display: "block", fontSize: 13 }}>{item.name}</strong>
                  <span style={{ color: "rgba(239, 242, 255, 0.62)", fontSize: 12 }}>{item.role}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lp1-cta-wrap">
        <Fade>
          <div className="lp1-cta-panel">
            <h2>Found your perfect style? Order instantly now.</h2>
            <p>
              You have seen the spotlight picks. Now secure your favorite with a direct WhatsApp order flow optimized for speed, confidence, and support.
            </p>
            <button className="lp1-order-btn" style={{ maxWidth: 320 }} onClick={openWhatsApp}>
              Order on WhatsApp
            </button>
            <p style={{ marginTop: 14, marginBottom: 0, fontSize: 12, color: "rgba(239,243,255,0.66)" }}>
              Fast response • Human support • No upfront payment required
            </p>
          </div>
        </Fade>
      </section>

      <footer className="lp1-footer">
        <div className="lp1-footer-left">
          <span className="lp1-brand-mark" style={{ width: 26, height: 26, borderRadius: 8 }}>✦</span>
          <strong style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "0.08em" }}>AURA</strong>
          <span>© 2026. All rights reserved.</span>
        </div>
        <nav className="lp1-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Shipping Info</a>
        </nav>
      </footer>
    </div>
  );
}
