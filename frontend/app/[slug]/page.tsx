import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PremiumPage from "@/components/public-page/PremiumPage";

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
    if (!page) return { title: "PageDrop" };

    const imageUrl = page.banner_image_url || page.logo_url || null;

    return {
        title: page.seo_title || page.business_name,
        description: page.seo_description || page.ai_subheadline || `${page.business_name} — contact us on WhatsApp.`,
        openGraph: {
            title: page.business_name,
            description: page.ai_subheadline || page.seo_description || "",
            type: "website",
            images: imageUrl ? [{ url: imageUrl }] : [],
        },
    };
}

export default async function PublicPageRoute({ params }: Props) {
    const { slug } = await params;
    const page = await fetchPage(slug);
    if (!page) notFound();

    return <PremiumPage page={page} />;
}
