"use client";

import PremiumPage from "@/components/public-page/PremiumPage";
import type { PublicPage } from "@/types";

interface Props {
    page: PublicPage;
}

export default function PublicPageClient({ page }: Props) {
    return <PremiumPage page={page} />;
}
