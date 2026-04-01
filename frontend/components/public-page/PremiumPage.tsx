"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import {
    ExternalLink,
    MapPin,
    MessageCircle,
    Phone,
    Share2,
    X,
} from "lucide-react";
import { trackWhatsAppClick } from "@/lib/api";
import type { BusinessHours, Product, PublicPage } from "@/types";
import ProductCarousel3D from "./ProductCarousel3D";
import TemplateShowroom from "../three/scenes/TemplateShowroom";

const SHOWROOM_CATEGORIES = [
    'restaurant', 'retail', 'bakery', 'cafe',
    'salon', 'spa', 'fitness', 'photography',
    'clothing', 'grocery', 'electronics',
];

const syne = Syne({ subsets: ["latin"], weight: ["700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

interface PremiumPageProps {
    page: PublicPage;
}

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

function getCategoryTitle(categoryRaw: string): "OUR MENU" | "OUR SERVICES" | "OUR PRODUCTS" {
    const category = categoryRaw.toLowerCase();
    if (["restaurant", "bakery", "cafe"].some((item) => category.includes(item))) {
        return "OUR MENU";
    }
    if (["salon", "spa", "fitness"].some((item) => category.includes(item))) {
        return "OUR SERVICES";
    }
    return "OUR PRODUCTS";
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
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 0,
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
    if (!hours) {
        return null;
    }

    const now = new Date();
    const currentDayIndex = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayEntry = DAY_LABELS.find((item) => getWeekIndexFromDayKey(item.key) === currentDayIndex);
    const today = todayEntry ? hours[todayEntry.key] : undefined;

    if (today && !today.closed && today.open && today.close) {
        const openMinutes = toMinutes(today.open);
        const closeMinutes = toMinutes(today.close);
        if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
            return {
                isOpen: true,
                closesAt: today.close,
                nextOpen: null as null | { day: string; open: string },
            };
        }
    }

    for (let offset = 0; offset < 7; offset += 1) {
        const dayIndex = (currentDayIndex + offset) % 7;
        const dayEntry = DAY_LABELS.find((item) => getWeekIndexFromDayKey(item.key) === dayIndex);
        if (!dayEntry) continue;
        const dayHours = hours[dayEntry.key];
        if (!dayHours || dayHours.closed || !dayHours.open) {
            continue;
        }

        if (offset === 0) {
            if (today && today.close && currentMinutes < toMinutes(today.open)) {
                return {
                    isOpen: false,
                    closesAt: null as string | null,
                    nextOpen: {
                        day: "today",
                        open: dayHours.open,
                    },
                };
            }
            continue;
        }

        return {
            isOpen: false,
            closesAt: null as string | null,
            nextOpen: {
                day: dayEntry.label,
                open: dayHours.open,
            },
        };
    }

    return {
        isOpen: false,
        closesAt: null as string | null,
        nextOpen: null as null | { day: string; open: string },
    };
}

interface ProductCardProps {
    page: PublicPage;
    product: Product;
    index: number;
    description: string;
    onOpenModal: (product: Product, index: number) => void;
    onOrderProduct: (productName: string) => void;
}

function ProductCard({
    page,
    product,
    index,
    description,
    onOpenModal,
    onOrderProduct,
}: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const frameRef = useRef<number | null>(null);
    const [glareStyle, setGlareStyle] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (window.innerWidth < 1024 || !cardRef.current) {
            return;
        }

        const rect = cardRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const dx = (x / rect.width - 0.5) * 2;
        const dy = (y / rect.height - 0.5) * 2;

        const rotateY = dx * 8;
        const rotateX = -dy * 8;

        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
        }

        frameRef.current = requestAnimationFrame(() => {
            if (!cardRef.current) return;
            cardRef.current.style.transform =
                `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
            setGlareStyle({
                x: (x / rect.width) * 100,
                y: (y / rect.height) * 100,
                opacity: 1,
            });
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current) {
            return;
        }
        cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
    }, []);

    useEffect(() => {
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    const priceLabel = formatPrice(product.price);

    return (
        <article
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onOpenModal(product, index)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[var(--pp-surface)] transition-all duration-300 ease-out hover:border-indigo-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
            <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    opacity: glareStyle.opacity,
                    background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 48%)`,
                }}
            />

            {product.image_url ? (
                <div className="relative h-40 sm:h-48">
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--pp-surface)] to-transparent" />
                    {priceLabel ? (
                        <span
                            className={`${jetbrainsMono.className} absolute right-3 top-3 rounded-md border border-indigo-500/40 bg-black/80 px-2.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-sm`}
                        >
                            {priceLabel}
                        </span>
                    ) : null}
                </div>
            ) : (
                <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-[var(--pp-surface-2)] to-[var(--pp-surface)] text-4xl opacity-80">
                    {getCategoryEmoji(page.category)}
                    {priceLabel ? (
                        <span
                            className={`${jetbrainsMono.className} absolute right-3 top-3 rounded-md border border-indigo-500/40 bg-black/80 px-2.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-sm`}
                        >
                            {priceLabel}
                        </span>
                    ) : null}
                </div>
            )}

            <div className="space-y-3 p-4 sm:p-5">
                <h3 className={`${syne.className} line-clamp-2 text-base font-semibold text-[var(--pp-text-primary)]`}>
                    {product.name}
                </h3>
                <p className={`${dmSans.className} line-clamp-3 text-sm leading-6 text-[var(--pp-text-secondary)]`}>
                    {description || "Crafted with care and available on WhatsApp order."}
                </p>

                <div className="flex items-center justify-between pt-1">
                    {!product.image_url && priceLabel ? (
                        <span className={`${jetbrainsMono.className} text-sm font-bold text-[var(--pp-accent)]`}>
                            {priceLabel}
                        </span>
                    ) : (
                        <span />
                    )}

                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onOrderProduct(product.name);
                        }}
                        className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/20"
                    >
                        Order →
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function PremiumPage({ page }: PremiumPageProps) {
    const [selectedProduct, setSelectedProduct] = useState<ProductModalState>(null);

    const products = page.products ?? [];
    const businessHours = page.business_hours ?? null;
    const showHours = Boolean(businessHours) && !page.is_online_only;
    const showLocation = Boolean(page.location) && !page.is_online_only;
    const openState = getOpenState(businessHours);

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

    const handleWhatsAppOrder = useCallback(
        (productName: string) => {
            openWhatsApp(`Hi! I'm interested in ordering: ${productName}`);
        },
        [openWhatsApp]
    );

    const handleWhatsAppContact = useCallback(() => {
        openWhatsApp();
    }, [openWhatsApp]);

    const useShowroom = SHOWROOM_CATEGORIES.includes(
        page.category?.toLowerCase()
    );

    const currentDayIndex = new Date().getDay();

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedProduct(null);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    if (useShowroom) {
        return (
            <TemplateShowroom
                page={page}
                onWhatsAppOrder={handleWhatsAppOrder}
                onWhatsAppContact={handleWhatsAppContact}
            />
        );
    }

    return (
        <div className={`${dmSans.className} min-h-screen bg-[var(--pp-bg)] text-[var(--pp-text-primary)]`}>
            <style>{`
                :root {
                    --pp-bg: #0C0C0F;
                    --pp-surface: #141418;
                    --pp-surface-2: #1C1C22;
                    --pp-border: rgba(255,255,255,0.07);
                    --pp-border-accent: rgba(99,102,241,0.35);
                    --pp-text-primary: #F0F0FF;
                    --pp-text-secondary: #8888A8;
                    --pp-text-tertiary: #4A4A6A;
                    --pp-accent: #6366F1;
                    --pp-accent-2: #10B981;
                    --pp-whatsapp: #25D366;
                }
                @keyframes blobFloatA {
                    from { transform: translate(0px, 0px); }
                    to { transform: translate(28px, -24px); }
                }
                @keyframes blobFloatB {
                    from { transform: translate(0px, 0px); }
                    to { transform: translate(-30px, 26px); }
                }
                @keyframes blobFloatC {
                    from { transform: translate(0px, 0px); }
                    to { transform: translate(20px, 30px); }
                }
                @keyframes pulseDot {
                    0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.7); }
                    100% { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
                }
                @keyframes pingRing {
                    75%, 100% {
                        transform: scale(1.15);
                        opacity: 0;
                    }
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalScaleIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.92); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `}</style>

            <section className="relative isolate flex min-h-[280px] items-end overflow-hidden sm:min-h-[420px]">
                {page.banner_image_url ? (
                    <>
                        <Image
                            src={page.banner_image_url}
                            alt={`${page.business_name} banner`}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(12,12,15,0.3)_0%,rgba(12,12,15,0.7)_60%,rgba(12,12,15,1)_100%)]" />
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-[var(--pp-bg)]" />
                        <div className="absolute -left-20 top-[-60px] h-[400px] w-[400px] rounded-full bg-indigo-500/15 blur-3xl [animation:blobFloatA_18s_ease-in-out_infinite_alternate]" />
                        <div className="absolute -right-16 top-[-80px] h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-3xl [animation:blobFloatB_16s_ease-in-out_infinite_alternate]" />
                        <div className="absolute left-1/2 top-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl [animation:blobFloatC_20s_ease-in-out_infinite_alternate]" />
                    </>
                )}

                <div className="relative z-10 w-full px-6 pb-10 pt-14 text-center sm:px-8 sm:pb-16">
                    <div className="mx-auto flex max-w-3xl items-center justify-center gap-4">
                        {page.logo_url ? (
                            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-indigo-500/45 sm:h-16 sm:w-16">
                                <Image
                                    src={page.logo_url}
                                    alt={`${page.business_name} logo`}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                        ) : (
                            <div className={`${syne.className} flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-500/45 bg-[var(--pp-surface-2)] text-xl font-bold text-[var(--pp-accent)] sm:h-16 sm:w-16 sm:text-2xl`}>
                                {page.business_name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h1 className={`${syne.className} text-3xl font-bold tracking-tight text-[var(--pp-text-primary)] sm:text-[42px]`}>
                            {page.business_name}
                        </h1>
                    </div>

                    {page.ai_headline ? (
                        <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--pp-text-secondary)] sm:mt-4 sm:text-lg">
                            {page.ai_headline}
                        </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-5">
                        {showLocation ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pp-border)] bg-white/5 px-3 py-1.5 text-xs text-[var(--pp-text-secondary)]">
                                <MapPin className="h-3.5 w-3.5" />
                                {page.location}
                            </span>
                        ) : null}
                        <span className="inline-flex items-center rounded-full border border-[var(--pp-border)] bg-white/5 px-3 py-1.5 text-xs capitalize text-[var(--pp-text-secondary)]">
                            {page.category}
                        </span>
                    </div>

                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-7 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => openWhatsApp()}
                            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-xl bg-[var(--pp-whatsapp)] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,211,102,0.35)]"
                        >
                            <MessageCircle className="h-4 w-4" />
                            {page.ai_cta_text || "Chat on WhatsApp"}
                        </button>

                        {page.phone_number ? (
                            <a
                                href={`tel:${page.phone_number}`}
                                className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl border border-indigo-500/35 px-6 py-3.5 text-sm font-semibold text-[var(--pp-text-primary)] transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-500/10"
                            >
                                <Phone className="h-4 w-4" />
                                Call Now
                            </a>
                        ) : null}
                    </div>
                </div>
            </section>

            {page.ai_about ? (
                <section className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pp-accent)]">ABOUT</p>
                    <div className="mt-3 rounded-md border-l-4 border-indigo-500/45 pl-5">
                        <p className="text-base leading-8 text-[var(--pp-text-secondary)]">{page.ai_about}</p>
                    </div>
                </section>
            ) : null}

            {products.length > 0 ? (
                <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pp-accent)]">
                                {getCategoryTitle(page.category)}
                            </p>
                            <p className="mt-1 text-xs text-[var(--pp-text-tertiary)]">{products.length} items</p>
                        </div>
                    </div>

                    {/* 3D Carousel — shown when there are 3+ products */}
                    {products.length >= 3 ? (
                        <div className="mb-12">
                            <ProductCarousel3D
                                page={page}
                                products={products}
                                onOpenModal={(targetProduct, targetIndex) =>
                                    setSelectedProduct({ product: targetProduct, index: targetIndex })
                                }
                                onOrderProduct={(productName) => {
                                    openWhatsApp(`Hi! I'm interested in ordering: ${productName}`);
                                }}
                            />
                        </div>
                    ) : null}

                    {/* Product grid — always rendered below the carousel as a browsable list */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((product, index) => (
                            <ProductCard
                                key={`${product.name}-${index}`}
                                page={page}
                                product={product}
                                index={index}
                                description={getProductDescription(page, product, index)}
                                onOpenModal={(targetProduct, targetIndex) => setSelectedProduct({ product: targetProduct, index: targetIndex })}
                                onOrderProduct={(productName) => {
                                    openWhatsApp(`Hi! I'm interested in ordering: ${productName}`);
                                }}
                            />
                        ))}
                    </div>
                </section>
            ) : null}

            {showHours && businessHours ? (
                <section className="mx-auto max-w-3xl px-6 pb-14 sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pp-accent)]">HOURS</p>

                    {openState ? (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                            <span
                                className={`inline-block h-2 w-2 rounded-full ${openState.isOpen ? "bg-emerald-400 [animation:pulseDot_1.8s_ease-in-out_infinite]" : "bg-red-400"}`}
                            />
                            <span className={openState.isOpen ? "font-semibold text-emerald-400" : "font-semibold text-red-400"}>
                                {openState.isOpen ? "Open now" : "Closed now"}
                            </span>
                            {openState.isOpen && openState.closesAt ? (
                                <span className="text-[var(--pp-text-secondary)]">· Closes at {openState.closesAt}</span>
                            ) : null}
                            {!openState.isOpen && openState.nextOpen ? (
                                <span className="text-[var(--pp-text-secondary)]">
                                    · Opens {openState.nextOpen.day} at {openState.nextOpen.open}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--pp-border)] bg-[var(--pp-surface)]">
                        {DAY_LABELS.map((item, index) => {
                            const entry = businessHours[item.key];
                            const isToday = getWeekIndexFromDayKey(item.key) === currentDayIndex;

                            return (
                                <div
                                    key={item.key}
                                    className={`flex items-center justify-between px-5 py-3.5 ${index !== DAY_LABELS.length - 1 ? "border-b border-[var(--pp-border)]" : ""}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm ${isToday ? "font-semibold text-[var(--pp-text-primary)]" : "text-[var(--pp-text-secondary)]"}`}>
                                            {item.label}
                                        </span>
                                        {isToday ? (
                                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                                                Today
                                            </span>
                                        ) : null}
                                    </div>

                                    {entry && !entry.closed ? (
                                        <span className={`${jetbrainsMono.className} text-sm ${isToday ? "text-[var(--pp-text-primary)]" : "text-[var(--pp-text-secondary)]"}`}>
                                            {entry.open} - {entry.close}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-[var(--pp-text-tertiary)]">Closed</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            ) : null}

            {showLocation ? (
                <section className="mx-auto max-w-3xl px-6 pb-14 sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pp-accent)]">FIND US</p>
                    <div className="mt-4 flex items-start gap-4 rounded-2xl border border-[var(--pp-border)] bg-[var(--pp-surface)] p-5">
                        <MapPin className="mt-0.5 h-6 w-6 text-[var(--pp-accent)]" />
                        <div>
                            <p className="text-base font-medium text-[var(--pp-text-primary)]">{page.location}</p>
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(page.location ?? "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--pp-accent)] hover:underline"
                            >
                                Get Directions
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                </section>
            ) : null}

            <footer className="border-t border-[var(--pp-border)] bg-[var(--pp-bg)] px-6 py-8 text-center text-xs text-[var(--pp-text-tertiary)] sm:px-8">
                Powered by {" "}
                <Link href="/" className="text-[var(--pp-text-secondary)] transition-colors hover:text-[var(--pp-text-primary)]">
                    PageDrop
                </Link>
            </footer>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--pp-border)] bg-black/90 px-5 py-3 backdrop-blur-xl md:hidden" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
                <div className="flex items-center gap-3">
                    <p className="line-clamp-1 text-xs text-[var(--pp-text-secondary)]">{page.business_name}</p>
                    <button
                        type="button"
                        onClick={() => openWhatsApp()}
                        className="relative ml-auto inline-flex items-center gap-2 rounded-lg bg-[var(--pp-whatsapp)] px-5 py-2.5 text-sm font-bold text-white"
                    >
                        <span className="pointer-events-none absolute inset-0 rounded-lg border-2 border-emerald-400/40 [animation:pingRing_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        <MessageCircle className="h-4 w-4" />
                        Chat Now
                    </button>
                </div>
            </div>

            {selectedProduct ? (
                <>
                    <button
                        type="button"
                        aria-label="Close product modal"
                        onClick={() => setSelectedProduct(null)}
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
                        style={{ animation: "modalFadeIn 200ms ease" }}
                    />

                    <div
                        className="fixed left-1/2 top-1/2 z-[51] max-h-[85vh] w-[min(520px,92vw)] overflow-y-auto rounded-[20px] border border-indigo-500/35 bg-[var(--pp-surface)]"
                        style={{ animation: "modalScaleIn 250ms ease forwards" }}
                    >
                        <button
                            type="button"
                            aria-label="Close modal"
                            onClick={() => setSelectedProduct(null)}
                            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--pp-border)] bg-[var(--pp-surface-2)] text-[var(--pp-text-secondary)] transition-colors hover:text-[var(--pp-text-primary)]"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {selectedProduct.product.image_url ? (
                            <div className="relative h-56 w-full sm:h-64">
                                <Image
                                    src={selectedProduct.product.image_url}
                                    alt={selectedProduct.product.name}
                                    fill
                                    className="rounded-t-[20px] object-cover"
                                    sizes="(max-width: 768px) 92vw, 520px"
                                />
                            </div>
                        ) : null}

                        <div className="space-y-4 p-6">
                            <h3 className={`${syne.className} text-2xl font-bold text-[var(--pp-text-primary)]`}>
                                {selectedProduct.product.name}
                            </h3>

                            {selectedProduct.product.price ? (
                                <p className={`${jetbrainsMono.className} text-2xl font-bold text-[var(--pp-accent)]`}>
                                    {formatPrice(selectedProduct.product.price)}
                                </p>
                            ) : null}

                            <p className="text-sm leading-7 text-[var(--pp-text-secondary)]">
                                {getProductDescription(page, selectedProduct.product, selectedProduct.index) ||
                                    "Ask us on WhatsApp for full details and customization options."}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    openWhatsApp(`Hi! I'm interested in ordering: ${selectedProduct.product.name}`);
                                    setSelectedProduct(null);
                                }}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--pp-whatsapp)] py-3.5 text-sm font-bold text-white transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,211,102,0.35)]"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Order on WhatsApp
                            </button>

                            {typeof navigator !== "undefined" && "share" in navigator ? (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await navigator.share({
                                                title: selectedProduct.product.name,
                                                text: getProductDescription(page, selectedProduct.product, selectedProduct.index),
                                                url: window.location.href,
                                            });
                                        } catch {
                                            // User cancelled share.
                                        }
                                    }}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--pp-border)] py-3 text-sm font-semibold text-[var(--pp-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--pp-text-primary)]"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Share this item
                                </button>
                            ) : null}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
