"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Product, PublicPage } from "@/types";

/* ── helpers shared with PremiumPage ─────────────────────────── */

function formatPrice(value?: string | null): string {
    if (!value) return "";
    const hasCurrency = /[$€£¥৳₹]/.test(value);
    return hasCurrency ? value : `৳${value}`;
}

function getCategoryEmoji(categoryRaw: string): string {
    const category = categoryRaw.toLowerCase();
    if (category.includes("restaurant")) return "🍽️";
    if (category.includes("salon") || category.includes("spa")) return "💆";
    if (category.includes("clothing")) return "👕";
    if (category.includes("electronics")) return "📱";
    if (category.includes("bakery")) return "🥐";
    return "✨";
}

function getProductDescription(page: PublicPage, product: Product, index: number): string {
    const aiProduct = Array.isArray(page.ai_products) ? page.ai_products[index] : null;
    return aiProduct?.description ?? product.description ?? "";
}

/* ── types ───────────────────────────────────────────────────── */

interface ProductCarousel3DProps {
    page: PublicPage;
    products: Product[];
    onOpenModal: (product: Product, index: number) => void;
    onOrderProduct: (productName: string) => void;
}

/* ── CSS (scoped via unique class prefix `pc3d-`) ────────────── */

const CAROUSEL_CSS = `
  .pc3d-stage {
    width: 100%;
    max-width: 900px;
    height: 460px;
    margin: 0 auto;
    background: rgba(250, 249, 246, 0.06);
    backdrop-filter: blur(40px) saturate(110%);
    -webkit-backdrop-filter: blur(40px) saturate(110%);
    border-radius: 48px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.06),
      0 30px 60px -10px rgba(0,0,0,0.4);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    user-select: none;
    cursor: grab;
  }
  .pc3d-stage.pc3d-grabbing {
    transform: scale(0.99);
    cursor: grabbing;
  }
  .pc3d-stage::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 60%; height: 60%;
    background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .pc3d-scene {
    width: 100%;
    height: 100%;
    perspective: 1200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    transform: translateX(-15%);
  }
  .pc3d-carousel {
    width: 220px;
    height: 280px;
    position: relative;
    transform-style: preserve-3d;
  }
  .pc3d-item {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(20,20,24,0.95);
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 15px 35px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0;
    transition: opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease;
    opacity: 0.35;
    filter: blur(2px);
    backface-visibility: hidden;
  }
  .pc3d-item.pc3d-active {
    opacity: 1;
    filter: blur(0px);
    box-shadow:
      0 20px 40px rgba(0,0,0,0.35),
      0 0 0 1px rgba(99,102,241,0.2);
  }
  .pc3d-item-img {
    width: 100%;
    height: 65%;
    position: relative;
    overflow: hidden;
  }
  .pc3d-item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    -webkit-user-drag: none;
    user-select: none;
    transition: transform 0.4s ease;
  }
  .pc3d-active .pc3d-item-img img {
    transform: scale(1.05);
  }
  .pc3d-item-emoji {
    width: 100%;
    height: 65%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 56px;
    background: linear-gradient(135deg, rgba(30,30,36,1), rgba(20,20,24,1));
  }
  .pc3d-item-body {
    padding: 12px 14px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .pc3d-item-name {
    font-size: 13px;
    font-weight: 600;
    color: #F0F0FF;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pc3d-item-price {
    font-size: 12px;
    font-weight: 700;
    color: #6366F1;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── info panel ─────────────────────────────────────────────── */
  .pc3d-info {
    position: absolute;
    right: 32px;
    width: 260px;
    height: calc(100% - 64px);
    background: rgba(20, 20, 24, 0.7);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 32px;
    border: 1px solid rgba(255,255,255,0.08);
    padding: 28px 22px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    pointer-events: auto;
    z-index: 10;
  }
  .pc3d-info-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  .pc3d-info-content.pc3d-fade {
    opacity: 0;
    transform: translateY(10px);
  }
  .pc3d-badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6366F1;
    background: rgba(99,102,241,0.12);
    padding: 4px 10px;
    border-radius: 8px;
    align-self: flex-start;
  }
  .pc3d-title {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.3px;
    color: #F0F0FF;
  }
  .pc3d-desc {
    font-size: 13px;
    color: #8888A8;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .pc3d-price {
    font-size: 26px;
    font-weight: 300;
    color: #F0F0FF;
    letter-spacing: -0.5px;
    font-family: 'JetBrains Mono', monospace;
  }
  .pc3d-order-btn {
    margin-top: auto;
    align-self: flex-end;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    border-radius: 14px;
    border: 1px solid rgba(16,185,129,0.25);
    background: rgba(16,185,129,0.1);
    color: #6EE7B7;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    line-height: 1;
  }
  .pc3d-order-btn:hover {
    background: rgba(16,185,129,0.2);
    border-color: rgba(16,185,129,0.4);
  }

  .pc3d-drag-hint {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(136,136,168,0.5);
    font-size: 11px;
    font-weight: 500;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .pc3d-stage:hover .pc3d-drag-hint { opacity: 1; }
  .pc3d-stage.pc3d-grabbing .pc3d-drag-hint { opacity: 0 !important; }

  /* ── responsive ─────────────────────────────────────────────── */
  @media (max-width: 960px) {
    .pc3d-scene { transform: translateX(0); height: 55%; align-items: flex-start; margin-top: 36px; }
    .pc3d-stage { height: 580px; flex-direction: column; border-radius: 40px; }
    .pc3d-info {
      position: relative; right: auto; bottom: 0;
      width: calc(100% - 40px); height: auto;
      margin-bottom: 16px; border-radius: 24px;
      padding: 20px;
    }
  }
  @media (max-width: 500px) {
    .pc3d-stage { height: 540px; border-radius: 32px; }
    .pc3d-info { padding: 16px; width: calc(100% - 24px); margin-bottom: 12px; }
    .pc3d-title { font-size: 18px; }
    .pc3d-price { font-size: 22px; }
  }
`;

/* ── component ───────────────────────────────────────────────── */

export default function ProductCarousel3D({
    page,
    products,
    onOpenModal,
    onOrderProduct,
}: ProductCarousel3DProps) {
    const numItems = products.length;
    const theta = 360 / numItems;
    const itemWidth = 220;
    const radius = useMemo(
        () => Math.round(itemWidth / 2 / Math.tan(Math.PI / numItems)) + 40,
        [numItems],
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [infoFade, setInfoFade] = useState(false);
    const [isGrabbing, setIsGrabbing] = useState(false);

    const carouselRef = useRef<HTMLDivElement | null>(null);
    const currentRotationRef = useRef(0);
    const targetRotationRef = useRef(0);
    const isDraggingRef = useRef(false);
    const lastXRef = useRef(0);
    const velocityRef = useRef(0);
    const activeIndexRef = useRef(0);
    const animFrameRef = useRef<number | null>(null);

    /* ── info panel cross-fade ──────────────────────────────────── */
    const updateInfoPanel = useCallback(
        (index: number) => {
            setInfoFade(true);
            setTimeout(() => {
                setDisplayedIndex(index);
                setInfoFade(false);
            }, 300);
        },
        [],
    );

    /* ── animation loop ─────────────────────────────────────────── */
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const animate = () => {
            currentRotationRef.current +=
                (targetRotationRef.current - currentRotationRef.current) * 0.1;
            carousel.style.transform = `translateZ(${-radius}px) rotateY(${currentRotationRef.current}deg)`;

            let normalizedRotation = currentRotationRef.current % 360;
            if (normalizedRotation > 0) normalizedRotation -= 360;
            let closestIndex = Math.round(Math.abs(normalizedRotation) / theta) % numItems;
            if (currentRotationRef.current > 0) {
                closestIndex = (numItems - closestIndex) % numItems;
            }

            if (closestIndex !== activeIndexRef.current) {
                activeIndexRef.current = closestIndex;
                setActiveIndex(closestIndex);
                updateInfoPanel(closestIndex);
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        carousel.style.transform = `translateZ(${-radius}px) rotateY(0deg)`;
        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [radius, theta, numItems, updateInfoPanel]);

    /* ── pointer handlers ───────────────────────────────────────── */
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        isDraggingRef.current = true;
        lastXRef.current = e.pageX;
        velocityRef.current = 0;
        setIsGrabbing(true);
    }, []);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!isDraggingRef.current) return;
        const deltaX = e.pageX - lastXRef.current;
        lastXRef.current = e.pageX;
        targetRotationRef.current += deltaX * 0.4;
        velocityRef.current = deltaX;
    }, []);

    const handlePointerUp = useCallback(() => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        setIsGrabbing(false);
        targetRotationRef.current += velocityRef.current * 5;
        const snapAngle = Math.round(targetRotationRef.current / theta) * theta;
        targetRotationRef.current = snapAngle;
    }, [theta]);

    useEffect(() => {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);

    /* ── displayed product ──────────────────────────────────────── */
    const displayedProduct = products[displayedIndex] ?? products[0];
    const displayedDesc = getProductDescription(page, displayedProduct, displayedIndex);
    const displayedPrice = formatPrice(displayedProduct?.price);
    const categoryEmoji = getCategoryEmoji(page.category);

    /* ── don't render carousel for < 3 products ─────────────────── */
    if (numItems < 3) return null;

    return (
        <>
            <style>{CAROUSEL_CSS}</style>

            <section
                className={`pc3d-stage${isGrabbing ? " pc3d-grabbing" : ""}`}
                onPointerDown={handlePointerDown}
            >
                {/* 3-D carousel ring */}
                <div className="pc3d-scene">
                    <div className="pc3d-carousel" ref={carouselRef}>
                        {products.map((prod, i) => {
                            const rotation = i * theta;
                            return (
                                <div
                                    key={`${prod.name}-${i}`}
                                    className={`pc3d-item${activeIndex === i ? " pc3d-active" : ""}`}
                                    style={{
                                        transform: `rotateY(${rotation}deg) translateZ(${radius}px)`,
                                    }}
                                >
                                    {prod.image_url ? (
                                        <div className="pc3d-item-img">
                                            <Image
                                                src={prod.image_url}
                                                alt={prod.name}
                                                fill
                                                draggable={false}
                                                className="object-cover"
                                                sizes="220px"
                                            />
                                        </div>
                                    ) : (
                                        <div className="pc3d-item-emoji">{categoryEmoji}</div>
                                    )}
                                    <div className="pc3d-item-body">
                                        <span className="pc3d-item-name">{prod.name}</span>
                                        {formatPrice(prod.price) ? (
                                            <span className="pc3d-item-price">
                                                {formatPrice(prod.price)}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info panel */}
                <div className="pc3d-info">
                    <div className={`pc3d-info-content${infoFade ? " pc3d-fade" : ""}`}>
                        <span className="pc3d-badge">{page.category}</span>
                        <h2 className="pc3d-title">{displayedProduct.name}</h2>
                        {displayedDesc ? (
                            <p className="pc3d-desc">{displayedDesc}</p>
                        ) : null}
                        {displayedPrice ? (
                            <div className="pc3d-price">{displayedPrice}</div>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        className="pc3d-order-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOrderProduct(displayedProduct.name);
                        }}
                    >
                        Order on WhatsApp →
                    </button>
                </div>

                {/* Drag hint */}
                <div className="pc3d-drag-hint">
                    <svg
                        viewBox="0 0 24 24"
                        style={{
                            width: 14,
                            height: 14,
                            stroke: "currentColor",
                            fill: "none",
                            strokeWidth: 1.5,
                        }}
                    >
                        <path d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
                    </svg>
                    Drag to explore
                </div>
            </section>
        </>
    );
}
