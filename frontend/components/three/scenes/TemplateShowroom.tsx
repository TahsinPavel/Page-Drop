'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import type { PublicPage } from '@/types';
import ProductCarousel3D from '../../public-page/ProductCarousel3D';

/* ── Fonts ────────────────────────────────────────────────────── */

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
});
const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});
const mono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['500'],
    display: 'swap',
});

/* ── Types ────────────────────────────────────────────────────── */

interface TemplateShowroomProps {
    page: PublicPage;
    onWhatsAppOrder: (productName: string) => void;
    onWhatsAppContact: () => void;
}

/* ── Helpers ──────────────────────────────────────────────────── */

function formatPrice(value?: string | null): string {
    if (!value) return '';
    const hasCurrency = /[$€£¥৳₹]/.test(value);
    return hasCurrency ? value : `৳${value}`;
}

function getCollectionLabel(category: string): string {
    const cat = category.toLowerCase();
    if (['restaurant', 'bakery', 'cafe'].includes(cat)) return 'Our Menu';
    if (['salon', 'spa'].includes(cat)) return 'Our Services';
    if (['fitness'].includes(cat)) return 'Our Programs';
    if (['photography'].includes(cat)) return 'Our Portfolio';
    return 'Our Collection';
}

function getCategoryFeatures(category: string): Array<{ icon: string; title: string; desc: string }> {
    const cat = category.toLowerCase();
    if (['restaurant', 'bakery', 'cafe'].includes(cat)) {
        return [
            { icon: '✦', title: 'Fresh Ingredients', desc: 'Sourced daily for peak flavor and quality.' },
            { icon: '◈', title: 'Artisan Craft', desc: 'Each item prepared with expertise and passion.' },
            { icon: '◉', title: 'Instant Ordering', desc: 'Order via WhatsApp — straight to your door.' },
        ];
    }
    if (['salon', 'spa', 'fitness'].includes(cat)) {
        return [
            { icon: '✦', title: 'Expert Professionals', desc: 'Trained specialists ensuring premium results.' },
            { icon: '◈', title: 'Premium Products', desc: 'Only the finest materials for your experience.' },
            { icon: '◉', title: 'Easy Booking', desc: 'Book your session instantly via WhatsApp.' },
        ];
    }
    return [
        { icon: '✦', title: 'Premium Quality', desc: 'Meticulously crafted to stand the test of time.' },
        { icon: '◈', title: 'Durable Materials', desc: 'Built with the highest quality materials available.' },
        { icon: '◉', title: 'Instant Concierge', desc: 'Direct WhatsApp support for seamless service.' },
    ];
}

/* ── CSS ──────────────────────────────────────────────────────── */

const SHOWROOM_CSS = `
    @keyframes osFadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes osFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
    }
    @keyframes osPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.35); }
        50% { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
    }
    @keyframes osPingRing {
        75%, 100% { transform: scale(1.15); opacity: 0; }
    }

    @media (max-width: 860px) {
        .os-hero { flex-direction: column !important; text-align: center !important; }
        .os-hero-media { width: 280px !important; height: 260px !important; margin: 0 auto !important; }
        .os-hero-img-main { width: 220px !important; height: 220px !important; left: 30px !important; }
        .os-hero-img-thumb { display: none !important; }
        .os-hero-badge { margin-left: auto; margin-right: auto; }
        .os-features-inner { flex-direction: column !important; }
        .os-features-images { width: 100% !important; height: 200px !important; }
        .os-features-img-1 { width: 55% !important; height: 180px !important; }
        .os-features-img-2 { width: 45% !important; height: 140px !important; }
        .os-nav-links { display: none !important; }
        .os-trust { gap: 20px !important; flex-wrap: wrap; }
    }
    @media (max-width: 500px) {
        .os-header { padding: 14px 20px !important; }
        .os-hero { padding: 0 20px !important; margin-top: 48px !important; }
        .os-products { padding: 0 20px !important; }
        .os-features { padding: 0 20px !important; }
        .os-features-inner { padding: 32px 24px !important; }
        .os-about { padding: 0 20px !important; }
        .os-bottom-cta { padding: 60px 20px !important; }
    }
`;

/* ── Component ───────────────────────────────────────────────── */

export default function TemplateShowroom({
    page,
    onWhatsAppOrder,
    onWhatsAppContact,
}: TemplateShowroomProps) {
    if (!page) return null;

    const hasProducts = page.products && page.products.length > 0;
    const products = page.products ?? [];
    const featuredProduct = products[0] ?? null;
    const features = getCategoryFeatures(page.category);
    const collectionLabel = getCollectionLabel(page.category);

    const scrollTo = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    /* ── Shared inline style objects ─────────────────────────────── */
    const bg = '#000000';
    const surface = '#0a0a0e';
    const surface2 = '#111116';
    const surface3 = '#1a1a20';
    const border = 'rgba(255,255,255,0.06)';
    const text1 = '#f5f5f5';
    const text2 = '#888888';
    const text3 = '#444444';

    return (
        <div className={inter.className} style={{ minHeight: '100vh', background: bg, color: text1, overflowX: 'hidden' }}>
            <style>{SHOWROOM_CSS}</style>

            {/* ── HEADER ──────────────────────────────────────────────── */}
            <header
                className="os-header"
                style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 48px',
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${border}`,
                }}
            >
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>
                    {page.business_name}
                </span>

                <nav className="os-nav-links" style={{ display: 'flex', gap: 32 }}>
                    {hasProducts && (
                        <button
                            type="button"
                            onClick={() => scrollTo('os-products')}
                            style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', color: text2, cursor: 'pointer', border: 'none', background: 'none', padding: 0, transition: 'color 0.2s' }}
                        >
                            {collectionLabel}
                        </button>
                    )}
                    {page.ai_about && (
                        <button
                            type="button"
                            onClick={() => scrollTo('os-about')}
                            style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', color: text2, cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
                        >
                            About
                        </button>
                    )}
                    {!page.is_online_only && page.location && (
                        <button
                            type="button"
                            onClick={() => scrollTo('os-contact')}
                            style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', color: text2, cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
                        >
                            Contact
                        </button>
                    )}
                </nav>

                <button
                    type="button"
                    onClick={() => onWhatsAppContact()}
                    style={{
                        fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                        padding: '10px 24px', borderRadius: 100, background: '#fff', color: '#000',
                        border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
                    }}
                >
                    Order Now
                </button>
            </header>

            {/* ── HERO ────────────────────────────────────────────────── */}
            <section
                className="os-hero"
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48,
                    maxWidth: 1000, margin: '80px auto 40px', padding: '0 48px',
                    animation: 'osFadeUp 0.8s ease both',
                }}
            >
                {/* Media side */}
                {(featuredProduct?.image_url || page.banner_image_url || page.logo_url) && (
                    <div
                        className="os-hero-media"
                        style={{ position: 'relative', flexShrink: 0, width: 380, height: 340 }}
                    >
                        <div
                            className="os-hero-img-main"
                            style={{
                                position: 'absolute', top: 0, left: 40, width: 300, height: 300,
                                borderRadius: 24, overflow: 'hidden', background: surface2,
                                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            }}
                        >
                            <Image
                                src={featuredProduct?.image_url || page.banner_image_url || page.logo_url || ''}
                                alt={featuredProduct?.name || page.business_name}
                                fill
                                className="object-cover"
                                sizes="300px"
                                priority
                            />
                        </div>
                        {products.length > 1 && products[1]?.image_url && (
                            <div
                                className="os-hero-img-thumb"
                                style={{
                                    position: 'absolute', bottom: 0, left: 0, width: 100, height: 120,
                                    borderRadius: 16, overflow: 'hidden', background: surface3,
                                    border: `2px solid ${bg}`, boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                                    animation: 'osFloat 5s ease-in-out infinite',
                                }}
                            >
                                <Image
                                    src={products[1].image_url}
                                    alt={products[1].name}
                                    fill
                                    className="object-cover"
                                    sizes="100px"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Details side */}
                <div className="os-hero-details" style={{ flex: 1, maxWidth: 400 }}>
                    {featuredProduct && (
                        <div
                            className="os-hero-badge"
                            style={{
                                display: 'inline-block', fontSize: 9, fontWeight: 700,
                                letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                                padding: '5px 12px', borderRadius: 6,
                                background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                                marginBottom: 16,
                            }}
                        >
                            Featured
                        </div>
                    )}

                    <h1
                        className={playfair.className}
                        style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.15, margin: '0 0 12px' }}
                    >
                        {featuredProduct ? featuredProduct.name : page.business_name}
                    </h1>

                    <p style={{ fontSize: 14, lineHeight: 1.7, color: text2, margin: '0 0 24px' }}>
                        {page.ai_subheadline || page.ai_headline || `Welcome to ${page.business_name}. Browse our collection and order instantly via WhatsApp.`}
                    </p>

                    {featuredProduct && formatPrice(featuredProduct.price) && (
                        <p className={mono.className} style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.5px', margin: '0 0 24px' }}>
                            {formatPrice(featuredProduct.price)}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={() => featuredProduct ? onWhatsAppOrder(featuredProduct.name) : onWhatsAppContact()}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '14px 32px', borderRadius: 100, background: '#fff', color: '#000',
                            fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                            border: 'none', cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s',
                        }}
                    >
                        <MessageCircle style={{ width: 14, height: 14 }} />
                        {featuredProduct ? 'Order on WhatsApp' : (page.ai_cta_text || 'Chat on WhatsApp')}
                    </button>

                    <p style={{ fontSize: 11, color: text3, marginTop: 10 }}>
                        Prices include all applicable taxes
                    </p>
                </div>
            </section>

            {/* ── TRUST BADGES ────────────────────────────────────────── */}
            <div
                className="os-trust"
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40,
                    padding: '24px 48px', animation: 'osFadeUp 0.8s ease 0.2s both',
                }}
            >
                {[
                    { color: '#25D366', label: '4.8 Rating' },
                    { color: '#818cf8', label: 'Fast Delivery' },
                    { color: '#38bdf8', label: 'Easy Ordering' },
                ].map((badge) => (
                    <span key={badge.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: text2 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: badge.color }} />
                        {badge.label}
                    </span>
                ))}
            </div>

            {/* ── PRODUCTS ────────────────────────────────────────────── */}
            {hasProducts && (
                <section
                    id="os-products"
                    className="os-products"
                    style={{ maxWidth: 1100, margin: '60px auto', padding: '0 48px', animation: 'osFadeUp 0.8s ease 0.3s both' }}
                >
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: text3, marginBottom: 8 }}>
                        {collectionLabel}
                    </p>
                    <h2 className={playfair.className} style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.15, margin: '0 0 40px' }}>
                        Explore the Collection
                    </h2>

                    {products.length >= 3 ? (
                        <ProductCarousel3D
                            page={page}
                            products={products}
                            onOpenModal={(product) => onWhatsAppOrder(product.name)}
                            onOrderProduct={onWhatsAppOrder}
                        />
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                            {products.map((product, i) => (
                                <div
                                    key={`${product.name}-${i}`}
                                    style={{
                                        background: surface, border: `1px solid ${border}`,
                                        borderRadius: 20, overflow: 'hidden',
                                        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                                    }}
                                >
                                    {product.image_url && (
                                        <div style={{ width: '100%', height: 200, position: 'relative', overflow: 'hidden' }}>
                                            <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                                        </div>
                                    )}
                                    <div style={{ padding: 20 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>{product.name}</h3>
                                        {product.price && (
                                            <p className={mono.className} style={{ fontSize: 14, fontWeight: 700, color: '#6366f1', margin: '0 0 12px' }}>
                                                {formatPrice(product.price)}
                                            </p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => onWhatsAppOrder(product.name)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                                padding: '10px 20px', borderRadius: 100,
                                                background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)',
                                                color: '#6ee7b7', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                            }}
                                        >
                                            <MessageCircle style={{ width: 12, height: 12 }} />
                                            Order on WhatsApp
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ── FEATURES ────────────────────────────────────────────── */}
            <section
                className="os-features"
                style={{ maxWidth: 1000, margin: '80px auto', padding: '0 48px', animation: 'osFadeUp 0.8s ease 0.4s both' }}
            >
                <div
                    className="os-features-inner"
                    style={{
                        background: surface, border: `1px solid ${border}`,
                        borderRadius: 32, padding: '56px 48px',
                        display: 'flex', alignItems: 'center', gap: 56,
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <h2 className={playfair.className} style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.3px', margin: '0 0 32px' }}>
                            Crafted for the<br />
                            <em style={{ fontStyle: 'italic', color: text2 }}>{page.business_name}</em> Soul
                        </h2>

                        {features.map((feat) => (
                            <div key={feat.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 10, background: surface3,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, flexShrink: 0, marginTop: 2,
                                }}>
                                    {feat.icon}
                                </div>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{feat.title}</p>
                                    <p style={{ fontSize: 13, color: text2, lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Feature images */}
                    <div
                        className="os-features-images"
                        style={{ flexShrink: 0, width: 300, height: 300, position: 'relative' }}
                    >
                        {products.length > 0 && products[0]?.image_url ? (
                            <div style={{ position: 'absolute', top: 0, right: 0, width: 220, height: 200, borderRadius: 20, overflow: 'hidden', background: surface2 }}>
                                <Image src={products[0].image_url} alt={products[0].name} fill className="object-cover" sizes="220px" />
                            </div>
                        ) : (
                            <div style={{ position: 'absolute', top: 0, right: 0, width: 220, height: 200, borderRadius: 20, background: `linear-gradient(135deg, ${surface2}, ${surface3})` }} />
                        )}
                        {products.length > 2 && products[2]?.image_url ? (
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 180, height: 160, borderRadius: 16, overflow: 'hidden', background: surface3, border: `3px solid ${bg}` }}>
                                <Image src={products[2].image_url} alt={products[2].name} fill className="object-cover" sizes="180px" />
                            </div>
                        ) : (
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 180, height: 160, borderRadius: 16, background: `linear-gradient(135deg, ${surface3}, ${surface2})`, border: `3px solid ${bg}` }} />
                        )}
                    </div>
                </div>
            </section>

            {/* ── ABOUT ───────────────────────────────────────────────── */}
            {page.ai_about && (
                <section id="os-about" style={{ maxWidth: 700, margin: '0 auto 60px', padding: '0 48px', textAlign: 'center' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: text3 }}>About</p>
                    <p style={{ fontSize: 16, lineHeight: 1.9, color: text2, marginTop: 16 }}>{page.ai_about}</p>
                </section>
            )}

            {/* ── CONTACT INFO ────────────────────────────────────────── */}
            {(!page.is_online_only && page.location) || page.phone_number ? (
                <section id="os-contact" style={{ maxWidth: 600, margin: '0 auto 60px', padding: '0 48px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: text3, textAlign: 'center', marginBottom: 16 }}>Contact</p>
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {!page.is_online_only && page.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <MapPin style={{ width: 18, height: 18, color: text2, flexShrink: 0 }} />
                                <span style={{ fontSize: 14, color: text2 }}>{page.location}</span>
                            </div>
                        )}
                        {page.phone_number && (
                            <a href={`tel:${page.phone_number}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: text2 }}>
                                <Phone style={{ width: 18, height: 18, flexShrink: 0 }} />
                                <span style={{ fontSize: 14 }}>{page.phone_number}</span>
                            </a>
                        )}
                    </div>
                </section>
            ) : null}

            {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
            <section
                className="os-bottom-cta"
                style={{ maxWidth: 700, margin: '40px auto 0', padding: '80px 48px', textAlign: 'center' }}
            >
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: text3, marginBottom: 16 }}>
                    Join our community
                </p>
                <h2 className={playfair.className} style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.5px', margin: '0 0 16px' }}>
                    Found something<br />you like?
                </h2>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: text2, maxWidth: 480, margin: '0 auto 32px' }}>
                    Experience the seamless transition from discovery to ownership. {page.business_name} — simply unforgettable.
                </p>
                <button
                    type="button"
                    onClick={() => onWhatsAppContact()}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '16px 40px', borderRadius: 100, background: '#fff', color: '#000',
                        fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                        border: 'none', cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s',
                    }}
                >
                    <MessageCircle style={{ width: 16, height: 16 }} />
                    Order Instantly via WhatsApp
                </button>
                <p style={{ fontSize: 11, color: text3, marginTop: 12 }}>
                    ✦ Exclusive offers and updates
                </p>
            </section>

            {/* ── FOOTER ──────────────────────────────────────────────── */}
            <footer style={{
                borderTop: `1px solid ${border}`, padding: '32px 48px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 16, maxWidth: 1100, margin: '0 auto',
            }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>
                    {page.business_name}
                </span>
                <span style={{ fontSize: 11, color: text3 }}>
                    Powered by{' '}
                    <Link href="/" style={{ color: text2, transition: 'color 0.2s' }}>PageDrop</Link>
                </span>
            </footer>

            {/* ── MOBILE STICKY BAR ───────────────────────────────────── */}
            <div style={{
                position: 'fixed', inset: 'auto 0 0 0', zIndex: 40,
                borderTop: `1px solid ${border}`, background: 'rgba(0,0,0,0.92)',
                padding: '12px 20px', paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                display: 'none',
            }}
                className="os-mobile-bar"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <p style={{ fontSize: 12, color: text2, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, flex: 1 }}>
                        {page.business_name}
                    </p>
                    <button
                        type="button"
                        onClick={() => onWhatsAppContact()}
                        style={{
                            position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '10px 20px', borderRadius: 10, background: '#25D366',
                            color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    >
                        <MessageCircle style={{ width: 14, height: 14 }} />
                        Chat Now
                    </button>
                </div>
            </div>

            {/* Mobile bar visibility */}
            <style>{`
                @media (max-width: 768px) {
                    .os-mobile-bar { display: block !important; }
                    .os-page { padding-bottom: 80px; }
                }
            `}</style>
        </div>
    );
}
