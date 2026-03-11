"use client";

import { MapPin, Store } from "lucide-react";
import type { PublicPage } from "@/types";

interface ThemeProps {
    page: PublicPage;
    onWhatsAppClick: () => void;
}

export default function VibrantTheme({ page, onWhatsAppClick }: ThemeProps) {
    const whatsappUrl = `https://wa.me/${page.whatsapp_number.replace(/[^0-9]/g, "")}`;
    const products = (page.ai_products?.length ? page.ai_products : page.products) ?? [];

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Hero with gradient */}
            <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 px-4 py-16 text-center text-white sm:py-24">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjwvc3ZnPg==')] opacity-50" />
                <div className="relative mx-auto max-w-2xl">
                    {page.logo_url ? (
                        <img
                            src={page.logo_url}
                            alt={page.business_name}
                            className="mx-auto mb-6 h-24 w-24 rounded-3xl object-cover ring-4 ring-white/30 shadow-2xl"
                        />
                    ) : (
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 ring-4 ring-white/30 shadow-2xl backdrop-blur-sm">
                            <Store className="h-12 w-12 text-white" />
                        </div>
                    )}

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        {page.business_name}
                    </h1>

                    {page.ai_headline && (
                        <p className="mt-4 text-xl font-bold text-yellow-200 sm:text-2xl">
                            {page.ai_headline}
                        </p>
                    )}

                    {page.ai_subheadline && (
                        <p className="mt-2 text-base text-white/80 sm:text-lg">
                            {page.ai_subheadline}
                        </p>
                    )}

                    {page.location && (
                        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/60">
                            <MapPin className="h-4 w-4" />
                            {page.location}
                        </p>
                    )}

                    <div className="mt-8">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onWhatsAppClick}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-lg font-bold text-purple-700 shadow-2xl transition-all hover:scale-105 hover:shadow-3xl"
                        >
                            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#25D366]">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.914.914l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                            </svg>
                            {page.ai_cta_text || "Chat on WhatsApp"}
                        </a>
                    </div>
                </div>
            </section>

            {/* About */}
            {page.ai_about && (
                <section className="px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-2xl font-extrabold text-gray-900">About Us</h2>
                        <p className="mt-4 text-gray-600 leading-relaxed">{page.ai_about}</p>
                    </div>
                </section>
            )}

            {/* Products */}
            {products.length > 0 && (
                <section className="bg-gradient-to-br from-gray-50 to-purple-50 px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-8 text-center text-2xl font-extrabold text-gray-900">
                            Our Products & Services
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl bg-white p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                                    {product.price && (
                                        <p className="mt-1 text-lg font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                            {product.price}
                                        </p>
                                    )}
                                    {product.description && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            {product.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sticky WhatsApp CTA on mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-violet-600 to-pink-500 p-3 sm:hidden">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onWhatsAppClick}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-base font-bold text-purple-700"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#25D366]">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.914.914l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                    </svg>
                    {page.ai_cta_text || "Chat on WhatsApp"}
                </a>
            </div>

            {/* Footer */}
            <footer className="border-t px-4 py-6 pb-20 text-center sm:pb-6">
                <a href="/" className="text-xs text-gray-400 transition-colors hover:text-gray-600">
                    Powered by PageDrop
                </a>
            </footer>
        </div>
    );
}
