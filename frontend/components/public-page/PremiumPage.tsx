"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    MessageCircle,
    Phone,
    Share2,
    X,
    Star,
    ExternalLink
} from "lucide-react";
import { trackWhatsAppClick, trackPageEvent } from "@/lib/api";
import type { BusinessHours, Product, PublicPage } from "@/types";

const WHY_CHOOSE_US = [
  { icon: "◆", title: "Premium Quality", description: "Carefully selected materials with luxe finish and comfort-first construction for everyday wear." },
  { icon: "⚡", title: "Fast Delivery", description: "Orders are confirmed on WhatsApp and dispatched fast so your product arrives without delay." },
  { icon: "💰", title: "Cash On Delivery", description: "Shop with confidence and pay at delivery for a smooth, low-friction purchase experience." },
  { icon: "↺", title: "Easy Returns", description: "Simple support process in case you need size help or a quick exchange after receiving your order." },
];

const SOCIAL_STATS = [
  { label: "Average Rating", value: "4.8/5", note: "From 1,200+ buyers" },
  { label: "Orders Delivered", value: "12,000+", note: "Across major cities" },
  { label: "Repeat Customers", value: "63%", note: "Strong return buyers" },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Verified Buyer", quote: "Ordering through WhatsApp was so easy. The product looked exactly like the hero visuals and arrived quickly." },
  { name: "Marcus Rivera", role: "Verified Buyer", quote: "The presentation gave me confidence before purchase. It felt premium and helped me decide instantly." },
  { name: "Aisha Patel", role: "Verified Buyer", quote: "Cash on delivery removed the risk for me. Support replied fast and the quality exceeded my expectations." },
];

type DayKey = keyof NonNullable<BusinessHours>;

type ProductModalState = {
    product: Product;
    index: number;
} | null;

const DAY_LABELS: Array<{ key: DayKey; label: string }> = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
];

// --- Helper Functions ---
function getCategoryEmoji(categoryRaw: string): string {
    const category = categoryRaw.toLowerCase();
    if (category.includes("restaurant")) return "🍽️";
    if (category.includes("salon") || category.includes("spa")) return "💆";
    if (category.includes("clothing")) return "👕";
    if (category.includes("electronics")) return "📱";
    if (category.includes("bakery")) return "🥐";
    return "✨";
}

function getCategoryTitle(categoryRaw?: string | null): string {
    if (!categoryRaw) return "OUR COLLECTION";
    const c = categoryRaw.toLowerCase();
    if (c.includes("restaurant") || c.includes("cafe") || c.includes("bakery")) return "MENU";
    if (c.includes("service") || c.includes("salon") || c.includes("spa") || c.includes("fitness")) return "SERVICES";
    return "COLLECTION";
}

function formatPrice(value?: string | null): string {
    if (!value) return "";
    const hasCurrency = /[$€£¥৳₹]/.test(value);
    return hasCurrency ? value : `৳${value}`;
}

function toMinutes(timeValue: string): number {
    const [hours, minutes] = timeValue.split(":").map((part) => Number(part));
    return hours * 60 + minutes;
}

function getWeekIndexFromDayKey(day: DayKey): number {
    const map: Record<DayKey, number> = {
        monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
        friday: 5, saturday: 6, sunday: 0,
    };
    return map[day];
}

function normalizeWhatsAppNumber(numberRaw: string): string {
    return numberRaw.replace(/[^\d]/g, "");
}

function getProductDescription(page: PublicPage, product: Product, index: number): string {
    const aiProduct = Array.isArray(page.ai_products) ? page.ai_products[index] : null;
    return aiProduct?.description ?? product.description ?? "";
}

function getOpenState(hours: BusinessHours | null | undefined) {
    if (!hours) return null;
    const now = new Date();
    const currentDayIndex = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayEntry = DAY_LABELS.find((item) => getWeekIndexFromDayKey(item.key) === currentDayIndex);
    const today = todayEntry ? hours[todayEntry.key] : undefined;

    if (today && !today.closed && today.open && today.close) {
        const openMinutes = toMinutes(today.open);
        const closeMinutes = toMinutes(today.close);
        if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
            return { isOpen: true, closesAt: today.close, nextOpen: null };
        }
    }

    for (let offset = 0; offset < 7; offset += 1) {
        const dayIndex = (currentDayIndex + offset) % 7;
        const dayEntry = DAY_LABELS.find((item) => getWeekIndexFromDayKey(item.key) === dayIndex);
        if (!dayEntry) continue;
        const dayHours = hours[dayEntry.key];
        if (!dayHours || dayHours.closed || !dayHours.open) continue;

        if (offset === 0) {
            if (today && today.close && currentMinutes < toMinutes(today.open)) {
                return { isOpen: false, closesAt: null, nextOpen: { day: "today", open: dayHours.open } };
            }
            continue;
        }

        return { isOpen: false, closesAt: null, nextOpen: { day: dayEntry.label, open: dayHours.open } };
    }

    return { isOpen: false, closesAt: null, nextOpen: null };
}

// --- Components ---

function WhatsAppCTA({ productName, openWhatsApp, isLarge = false }: { productName: string | null, openWhatsApp: (msg?: string) => void, isLarge?: boolean }) {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <button
      onClick={(e) => {
          e.stopPropagation();
          openWhatsApp(productName ? `Hi, I'd like to order ${productName}...` : undefined);
      }}
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width: "100%",
        padding: isLarge ? "18px 24px" : "14px 18px",
        backgroundImage: btnHovered
          ? `linear-gradient(135deg, #25D366 0%, #10B981 100%)`
          : "none",
        backgroundColor: "#25D366",
        backgroundSize: "200% 100%",
        color: "#fff",
        border: "none",
        borderRadius: "14px",
        fontSize: isLarge ? "16px" : "14px",
        fontWeight: 800,
        fontFamily: "'Manrope', sans-serif",
        cursor: "pointer",
        transition: "all .35s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: btnHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: btnHovered
          ? "0 12px 40px rgba(37,211,102,.42)"
          : "0 8px 24px rgba(37,211,102,.28)",
        animation: btnHovered ? "lp3Shimmer 2s linear infinite" : "none",
      }}
    >
      <MessageCircle className={isLarge ? "h-5 w-5" : "h-4 w-4"} />
      {productName ? "Order on WhatsApp" : "Chat on WhatsApp"}
    </button>
  );
}

// --- Demo 3 Components ---

type MappedProduct = {
  id: string | number;
  name: string;
  tagline?: string;
  price?: string | null;
  description?: string;
  image_url?: string | null;
  images: string[];
  accentHue: number;
  badge?: string;
  badgeColor?: string;
};

function PokerFan({ images, isActive, accentHue, isMobile }: { images: string[]; isActive: boolean; accentHue: number; isMobile: boolean }) {
  const [centerIdx, setCenterIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const total = images.length || 1;
  const safeImages = images.length > 0 ? images : [""];

  useEffect(() => {
    if (!isActive) {
      setCenterIdx(0);
      setHovered(false);
      setTapped(false);
    }
  }, [isActive]);

  const handleCardClick = useCallback(
    (idx: number) => {
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
      {safeImages.map((src: string, idx: number) => {
        const rawOffset = idx - centerIdx;
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
              {src ? (
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
              ) : (
                  <div className="flex h-full items-center justify-center text-5xl opacity-40">✨</div>
              )}
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

function ProductCarousel({ products, activeIndex, onChangeIndex, isMobile }: { products: MappedProduct[]; activeIndex: number; onChangeIndex: (idx: number) => void; isMobile: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const total = products.length;

  const onPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
        dragStartX.current = e.touches[0].clientX;
    } else {
        dragStartX.current = e.clientX;
    }
    dragOffset.current = 0;
  }, []);

  const onPointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
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

  const getProductTransform = (idx: number) => {
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
      onTouchStart={onPointerDown}
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
      {products.map((product: MappedProduct, idx: number) => {
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

function ProductInfoPanel({ product, isMobile, openWhatsApp }: { product: MappedProduct | null; isMobile: boolean; openWhatsApp: (msg?: string) => void }) {
  if (!product) return null;

  return (
    <div
      key={product.id}
      style={{
        width: "100%",
        maxWidth: isMobile ? "100%" : "408px",
        background: "linear-gradient(170deg, rgba(22,24,31,.84) 0%, rgba(11,12,18,.92) 100%)",
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
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
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
      </div>

      <WhatsAppCTA productName={product.name} openWhatsApp={openWhatsApp} />

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

// --- Main Page Component ---
export default function PremiumPage({ page }: { page: PublicPage }) {
    const [selectedProduct, setSelectedProduct] = useState<ProductModalState | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [activeProductIdx, setActiveProductIdx] = useState(0);

    const businessHours = page.business_hours ?? null;
    const showHours = Boolean(businessHours) && !page.is_online_only;
    const showLocation = Boolean(page.location) && !page.is_online_only;
    const openState = getOpenState(businessHours);

    // Map the actual products to the format needed for the demo components
    const mappedProducts = useMemo(() => {
        const prods = page.products ?? [];
        if (prods.length === 0) return [];
        return prods.map((p, i) => {
            const hasMultipleImgs = p.image_url ? [p.image_url, p.image_url, p.image_url] : [];
            return {
                id: i,
                name: p.name,
                tagline: "Quality you can trust.",
                description: getProductDescription(page, p, i),
                price: formatPrice(p.price),
                badge: i === 0 ? "FEATURED" : "PREMIUM",
                badgeColor: i === 0 ? "#6366f1" : "#10b981",
                accentHue: i === 0 ? 245 : 160,
                images: hasMultipleImgs,
            };
        });
    }, [page]);

    const normalizedWhatsApp = useMemo(
        () => normalizeWhatsAppNumber(page.whatsapp_number),
        [page.whatsapp_number]
    );

    const trackWhatsApp = useCallback(() => {
        trackWhatsAppClick(page.slug).catch(() => undefined);
    }, [page.slug]);

    const openWhatsApp = useCallback(
        (message?: string) => {
            trackWhatsApp();
            const base = `https://wa.me/${normalizedWhatsApp}`;
            const url = message ? `${base}?text=${encodeURIComponent(message)}` : base;
            window.open(url, "_blank", "noopener,noreferrer");
        },
        [normalizedWhatsApp, trackWhatsApp]
    );

    const currentDayIndex = new Date().getDay();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Analytics tracking
    useEffect(() => {
        const timer15 = setTimeout(() => trackPageEvent(page.slug, "focus_time_15s"), 15000);
        const timer30 = setTimeout(() => trackPageEvent(page.slug, "focus_time_30s"), 30000);
        return () => { clearTimeout(timer15); clearTimeout(timer30); };
    }, [page.slug]);

    useEffect(() => {
        let tracked = false;
        const handleScroll = () => {
            if (!tracked && window.scrollY > 100) {
                tracked = true;
                trackPageEvent(page.slug, "interaction");
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [page.slug]);

    const activeProduct = mappedProducts[activeProductIdx] || null;

    return (
        <div className="min-h-screen text-[#f8f4ec] font-sans selection:bg-[#25D366]/30" style={{
            background: "radial-gradient(1300px 620px at 50% -6%, rgba(255,255,255,.06), transparent 48%), linear-gradient(176deg, #11141b 0%, #0a0d13 52%, #06070b 100%)",
            backgroundAttachment: "fixed"
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
                @keyframes lp3FadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes lp3Pulse { 0%, 100% { opacity: .38; } 50% { opacity: .92; } }
                @keyframes lp3SpotlightPulse { 0%, 100% { opacity: .07; } 50% { opacity: .13; } }
                @keyframes lp3Shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                @keyframes lp3Hint { 0%, 100% { transform: translateY(0); opacity: .48; } 50% { transform: translateY(4px); opacity: .85; } }
                
                .font-serif { font-family: 'Cormorant Garamond', serif; }
                .font-mono { font-family: 'Space Grotesk', sans-serif; }
                .font-sans { font-family: 'Manrope', sans-serif; }
                
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .animation-lp3FadeUp { animation: lp3FadeUp 0.8s ease cubic-bezier(0.2, 1, 0.4, 1); }
            `}</style>

            {/* TOP HEADER */}
            <header className="absolute top-0 left-0 w-full p-6 sm:p-8 flex items-center justify-between z-50">
                <div className="flex items-center gap-3">
                    {page.logo_url ? (
                        <Image src={page.logo_url} alt="Logo" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-serif font-bold text-lg">
                            {page.business_name.charAt(0)}
                        </div>
                    )}
                    <span className="font-sans font-bold tracking-widest uppercase text-sm">{page.business_name}</span>
                </div>
                {page.phone_number && (
                    <a href={`tel:${page.phone_number}`} className="hidden sm:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#25D366] hover:text-[#10b981] transition-colors">
                        <Phone className="h-4 w-4" />
                        Call Us
                    </a>
                )}
            </header>

            {/* HERO CAROUSEL SECTION */}
            <div className="relative min-h-screen flex flex-col pt-32 pb-16">
                <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-8 max-w-[1400px] mx-auto">
                    
                    <div style={{ textAlign: "center", marginBottom: isMobile ? "24px" : "48px", animation: "lp3FadeUp 0.6s ease" }}>
                        <p style={{ margin: "0 0 10px", fontSize: "11px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(245,242,235,.46)", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                            {getCategoryTitle(page.category)}
                        </p>
                        <h2 style={{ margin: "0", color: "#f7f3ec", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 0.95, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>
                            {page.ai_headline || "Discover Premium Quality"}
                        </h2>
                        {page.ai_about && (
                            <p style={{ margin: "16px auto 0", maxWidth: "62ch", color: "rgba(245,242,235,.6)", lineHeight: 1.65, fontSize: "15px", fontFamily: "'Manrope', sans-serif" }}>
                                {page.ai_about}
                            </p>
                        )}
                    </div>

                    {mappedProducts.length > 0 && (
                        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 items-center" style={{ animation: "lp3FadeUp 0.8s ease 0.1s both" }}>
                            {/* Carousel */}
                            <div className="relative w-full overflow-hidden lg:overflow-visible">
                                <ProductCarousel 
                                    products={mappedProducts} 
                                    activeIndex={activeProductIdx} 
                                    onChangeIndex={setActiveProductIdx} 
                                    isMobile={isMobile} 
                                />
                                
                                <div style={{ marginTop: isMobile ? "-20px" : "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", zIndex: 20, position: "relative" }}>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        {mappedProducts.map((_: unknown, idx: number) => (
                                            <div
                                                key={idx}
                                                onClick={() => setActiveProductIdx(idx)}
                                                style={{
                                                    width: idx === activeProductIdx ? "20px" : "6px",
                                                    height: "6px",
                                                    borderRadius: "3px",
                                                    background: idx === activeProductIdx ? "#10B981" : "rgba(255,255,255,0.15)",
                                                    transition: "all 0.3s ease",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Swipe to explore
                                    </span>
                                </div>
                            </div>

                            {/* Info Panel */}
                            <div className="flex justify-center lg:justify-start w-full">
                                <ProductInfoPanel 
                                    product={activeProduct} 
                                    isMobile={isMobile} 
                                    openWhatsApp={openWhatsApp} 
                                />
                            </div>
                        </div>
                    )}
                </div>
                
                <div style={{
                    position: "absolute",
                    bottom: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    opacity: 0.6,
                    animation: "lp3Hint 2.5s ease-in-out infinite",
                }}>
                    <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
                        Scroll
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                </div>
            </div>

            {/* WHY CHOOSE US */}
            <section className="mx-auto max-w-7xl px-4 sm:px-8 py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {WHY_CHOOSE_US.map((item, i) => (
                        <div key={i} className="rounded-[18px] p-6" style={{
                            border: "1px solid rgba(255,255,255,.08)",
                            background: "linear-gradient(180deg, rgba(255,255,255,.035) 0%, rgba(255,255,255,.016) 100%)",
                            animation: `lp3FadeUp 0.6s ease ${i * 0.1}s both`
                        }}>
                            <div className="text-3xl mb-4">{item.icon}</div>
                            <h4 className="font-sans font-bold text-[#f8f4ec] text-lg mb-2">{item.title}</h4>
                            <p className="font-sans text-sm text-[rgba(245,242,235,.6)] leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SOCIAL PROOF */}
            <section className="mx-auto max-w-7xl px-4 sm:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {SOCIAL_STATS.map((stat, i) => (
                        <div key={i} className="text-center" style={{ animation: `lp3FadeUp 0.6s ease ${i * 0.1}s both` }}>
                            <div className="font-serif font-bold text-5xl sm:text-6xl text-[#f8f4ec] mb-3">{stat.value}</div>
                            <div className="font-mono text-sm uppercase tracking-widest text-[#25D366] mb-2">{stat.label}</div>
                            <div className="font-sans text-sm text-[rgba(245,242,235,.5)]">{stat.note}</div>
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="p-8 rounded-[24px]" style={{
                            background: "linear-gradient(170deg, rgba(22,24,31,.6) 0%, rgba(11,12,18,.8) 100%)",
                            border: "1px solid rgba(255,255,255,.05)",
                            animation: `lp3FadeUp 0.6s ease ${i * 0.1}s both`
                        }}>
                            <div className="flex text-[#25D366] mb-6">
                                {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                            </div>
                            <p className="font-serif italic text-xl text-[rgba(245,242,235,.9)] mb-8 leading-relaxed">"{t.quote}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-300 text-lg">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-[15px] text-[#f8f4ec]">{t.name}</div>
                                    <div className="text-sm text-[rgba(245,242,235,.5)] mt-0.5">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOURS AND LOCATION */}
            {(showHours || showLocation) ? (
                <section className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
                    <div className="rounded-[32px] border border-white/10 p-6 sm:p-10" style={{
                        background: "linear-gradient(170deg, rgba(22,24,31,.84) 0%, rgba(11,12,18,.92) 100%)",
                        backdropFilter: "blur(22px)",
                    }}>
                        {showHours && businessHours && (
                            <div className="mb-10">
                                <p className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#25D366] mb-6">BUSINESS HOURS</p>
                                {openState ? (
                                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-sans">
                                        <span className={`inline-block h-2 w-2 rounded-full ${openState.isOpen ? "bg-[#25D366] [animation:lp3Pulse_2s_ease-in-out_infinite]" : "bg-red-400"}`} />
                                        <span className={openState.isOpen ? "font-semibold text-[#25D366]" : "font-semibold text-red-400"}>
                                            {openState.isOpen ? "Open now" : "Closed now"}
                                        </span>
                                        {openState.isOpen && openState.closesAt && (
                                            <span className="text-[rgba(245,242,235,.6)]">· Closes at {openState.closesAt}</span>
                                        )}
                                        {!openState.isOpen && openState.nextOpen && (
                                            <span className="text-[rgba(245,242,235,.6)]">· Opens {openState.nextOpen.day} at {openState.nextOpen.open}</span>
                                        )}
                                    </div>
                                ) : null}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                                    {DAY_LABELS.map((item) => {
                                        const entry = businessHours[item.key];
                                        const isToday = getWeekIndexFromDayKey(item.key) === currentDayIndex;
                                        return (
                                            <div key={item.key} className="flex items-center justify-between py-2 border-b border-white/5">
                                                <span className={`font-sans text-[15px] ${isToday ? "font-bold text-[#f8f4ec]" : "text-[rgba(245,242,235,.7)]"}`}>
                                                    {item.label} {isToday && <span className="ml-2 text-[10px] uppercase tracking-wider text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-full">Today</span>}
                                                </span>
                                                <span className={`font-mono text-sm ${isToday ? "text-[#f8f4ec]" : "text-[rgba(245,242,235,.5)]"}`}>
                                                    {entry && !entry.closed ? `${entry.open} - ${entry.close}` : "Closed"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {showLocation && (
                            <div>
                                <p className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#25D366] mb-4">LOCATION</p>
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                                    <MapPin className="h-6 w-6 text-[#25D366] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-sans text-base font-medium text-[#f8f4ec] leading-relaxed mb-2">{page.location}</p>
                                        <a href={`https://maps.google.com/?q=${encodeURIComponent(page.location ?? "")}`} target="_blank" rel="noopener noreferrer" className="font-sans inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                            Get Directions <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            ) : null}

            {/* FINAL CTA */}
            <section className="mx-auto max-w-[920px] px-4 sm:px-8 py-20 pb-32">
                <div className="text-center p-8 sm:p-16 rounded-[32px]" style={{
                    background: "linear-gradient(165deg, rgba(28,31,40,.9) 0%, rgba(12,14,20,.96) 52%, rgba(8,9,14,.98) 100%)",
                    border: "1px solid rgba(255,255,255,.08)"
                }}>
                    <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#25D366] mb-4">FINAL STEP</div>
                    <h2 className="font-serif font-bold text-[#f8f4ec] mb-6" style={{ fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1.1 }}>
                        Found your style?<br/>Order instantly now.
                    </h2>
                    <p className="font-sans text-[rgba(245,242,235,.7)] mb-10 max-w-lg mx-auto leading-relaxed">
                        Connect directly on WhatsApp to confirm details, arrange payment, and schedule delivery. No automated bots, just real people helping you.
                    </p>
                    <div className="max-w-xs mx-auto mb-8">
                        <WhatsAppCTA productName={null} openWhatsApp={openWhatsApp} isLarge />
                    </div>
                    <div className="font-sans text-xs font-semibold text-[rgba(245,242,235,.4)]">
                        Fast Delivery • Cash On Delivery • Easy Returns
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-[#0a0d13]/80 px-6 py-8 text-center font-sans text-sm text-[rgba(245,242,235,.4)] sm:px-8">
                Powered by {" "}
                <Link href="/" className="font-semibold text-[rgba(245,242,235,.7)] transition-colors hover:text-[#f8f4ec]">
                    PageDrop
                </Link>
            </footer>

            {/* MOBILE BOTTOM BAR */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0d13]/90 px-5 py-3 backdrop-blur-xl lg:hidden" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <p className="line-clamp-1 font-serif text-lg font-bold text-[#f8f4ec]">{page.business_name}</p>
                    </div>
                    <WhatsAppCTA productName={null} openWhatsApp={openWhatsApp} />
                </div>
            </div>

            {/* PRODUCT MODAL */}
            {selectedProduct ? (
                <>
                    <div className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
                        <button
                            type="button"
                            aria-label="Close product modal"
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md pointer-events-auto"
                            style={{ animation: "lp3FadeUp 200ms ease" }}
                        />

                        <div
                            className="pointer-events-auto relative z-10 max-h-[85vh] w-full max-w-[520px] overflow-y-auto rounded-[24px] border border-white/10 bg-[#11141b] shadow-2xl"
                            style={{ animation: "lp3FadeUp 250ms ease forwards" }}
                        >
                            <button
                                type="button"
                                aria-label="Close modal"
                                onClick={() => setSelectedProduct(null)}
                                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-[rgba(245,242,235,.8)] backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {selectedProduct.product.image_url ? (
                                <div className="relative h-72 w-full sm:h-[380px]" style={{
                                    background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%), #0a0d13",
                                }}>
                                    <Image
                                        src={selectedProduct.product.image_url}
                                        alt={selectedProduct.product.name}
                                        fill
                                        className="object-contain p-8 drop-shadow-2xl"
                                        sizes="(max-width: 768px) 92vw, 520px"
                                    />
                                </div>
                            ) : null}

                            <div className="space-y-6 p-6 sm:p-8">
                                <div>
                                    <h3 className="font-serif text-3xl font-bold text-[#f8f4ec] mb-2">
                                        {selectedProduct.product.name}
                                    </h3>
                                    {selectedProduct.product.price && (
                                        <p className="font-mono text-2xl font-bold text-[#25D366]">
                                            {formatPrice(selectedProduct.product.price)}
                                        </p>
                                    )}
                                </div>

                                <p className="font-sans text-base leading-relaxed text-[rgba(245,242,235,.8)]">
                                    {getProductDescription(page, selectedProduct.product, selectedProduct.index) ||
                                        "Ask us on WhatsApp for full details and customization options."}
                                </p>

                                <div className="pt-2">
                                    <WhatsAppCTA 
                                        productName={selectedProduct.product.name} 
                                        openWhatsApp={(msg) => {
                                            openWhatsApp(msg);
                                            setSelectedProduct(null);
                                        }} 
                                        isLarge 
                                    />
                                </div>

                                {typeof navigator !== "undefined" && "share" in navigator && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                await navigator.share({
                                                    title: selectedProduct.product.name,
                                                    text: getProductDescription(page, selectedProduct.product, selectedProduct.index),
                                                    url: window.location.href,
                                                });
                                            } catch {}
                                        }}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3.5 font-sans text-sm font-semibold text-[rgba(245,242,235,.7)] transition-colors hover:bg-white/5 hover:text-[#f8f4ec]"
                                    >
                                        <Share2 className="h-4 w-4" />
                                        Share this item
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
