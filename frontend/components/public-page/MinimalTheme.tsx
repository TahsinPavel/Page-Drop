"use client";

import { MapPin, Store } from "lucide-react";
import type { PublicPage } from "@/types";

interface ThemeProps {
    page: PublicPage;
    onWhatsAppClick: () => void;
}

export default function MinimalTheme({ page, onWhatsAppClick }: ThemeProps) {
    const whatsappUrl = `https://wa.me/${page.whatsapp_number.replace(/[^0-9]/g, "")}`;
    const products = (page.ai_products?.length ? page.ai_products : page.products) ?? [];

    return (
        <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Hero */}
            <section className="px-4 py-20 text-center sm:py-28">
                <div className="mx-auto max-w-xl">
                    {page.logo_url ? (
                        <img
                            src={page.logo_url}
                            alt={page.business_name}
                            className="mx-auto mb-8 h-16 w-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <Store className="h-8 w-8 text-gray-400" />
                        </div>
                    )}

                    <h1 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl">
                        {page.business_name}
                    </h1>

                    {page.ai_headline && (
                        <p className="mt-6 text-lg text-gray-600">
                            {page.ai_headline}
                        </p>
                    )}

                    {page.ai_subheadline && (
                        <p className="mt-2 text-base text-gray-400">
                            {page.ai_subheadline}
                        </p>
                    )}

                    {page.location && (
                        <p className="mt-6 inline-flex items-center gap-1 text-sm text-gray-400">
                            <MapPin className="h-3.5 w-3.5" />
                            {page.location}
                        </p>
                    )}

                    <div className="mt-10">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onWhatsAppClick}
                            className="inline-flex items-center gap-2 rounded-full border-2 border-gray-900 px-8 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
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
                <section className="border-t px-4 py-16 sm:py-20">
                    <div className="mx-auto max-w-lg text-center">
                        <p className="text-lg leading-relaxed text-gray-600">{page.ai_about}</p>
                    </div>
                </section>
            )}

            {/* Products */}
            {products.length > 0 && (
                <section className="border-t px-4 py-16 sm:py-20">
                    <div className="mx-auto max-w-2xl">
                        <div className="space-y-0 divide-y">
                            {products.map((product, i) => (
                                <div key={i} className="flex items-start justify-between py-5">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                                        {product.description && (
                                            <p className="mt-1 text-sm text-gray-400">
                                                {product.description}
                                            </p>
                                        )}
                                    </div>
                                    {product.price && (
                                        <p className="ml-4 shrink-0 font-medium text-gray-900">
                                            {product.price}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sticky WhatsApp CTA on mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-3 sm:hidden">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onWhatsAppClick}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 py-3 text-base font-medium text-white"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.914.914l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                    </svg>
                    {page.ai_cta_text || "Chat on WhatsApp"}
                </a>
            </div>

            {/* Footer */}
            <footer className="border-t px-4 py-6 pb-20 text-center sm:pb-6">
                <a href="/" className="text-xs text-gray-300 transition-colors hover:text-gray-500">
                    Powered by PageDrop
                </a>
            </footer>
        </div>
    );
}
