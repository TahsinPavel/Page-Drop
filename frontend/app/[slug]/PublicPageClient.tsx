"use client";

import { useCallback } from "react";
import { trackWhatsAppClick } from "@/lib/api";
import DefaultTheme from "@/components/public-page/DefaultTheme";
import DarkTheme from "@/components/public-page/DarkTheme";
import MinimalTheme from "@/components/public-page/MinimalTheme";
import VibrantTheme from "@/components/public-page/VibrantTheme";
import type { PublicPage } from "@/types";

interface Props {
    page: PublicPage;
}

const themeMap = {
    default: DefaultTheme,
    dark: DarkTheme,
    minimal: MinimalTheme,
    vibrant: VibrantTheme,
} as const;

export default function PublicPageClient({ page }: Props) {
    const handleWhatsAppClick = useCallback(() => {
        trackWhatsAppClick(page.slug).catch(() => {
            /* fire-and-forget */
        });
    }, [page.slug]);

    const ThemeComponent = themeMap[page.theme] || DefaultTheme;

    return <ThemeComponent page={page} onWhatsAppClick={handleWhatsAppClick} />;
}
