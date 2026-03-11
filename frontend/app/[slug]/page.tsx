import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicPageClient from "./PublicPageClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface Props {
    params: Promise<{ slug: string }>;
}

async function fetchPage(slug: string) {
    try {
        const res = await fetch(`${API_URL}/pages/public/${slug}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const page = await fetchPage(slug);
    if (!page) return { title: "Page Not Found" };

    return {
        title: page.seo_title || `${page.business_name} — PageDrop`,
        description:
            page.seo_description ||
            `${page.business_name} — contact us on WhatsApp.`,
        openGraph: {
            title: page.seo_title || page.business_name,
            description: page.seo_description || page.ai_subheadline || "",
            type: "website",
        },
    };
}

export default async function PublicPageRoute({ params }: Props) {
    const { slug } = await params;
    const page = await fetchPage(slug);
    if (!page) notFound();

    return <PublicPageClient page={page} />;
}
