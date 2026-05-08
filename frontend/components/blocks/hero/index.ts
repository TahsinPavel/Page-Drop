import { BlockDefinition } from "@/lib/builder/types";
import { HeroSchema } from "./schema";
import DefaultHero from "./variants/default-hero";

export const HeroBlock: BlockDefinition = {
    type: "hero",
    name: "Hero Section",
    category: "Headers",
    thumbnail: "/thumbnails/hero-default.png",
    configSchema: HeroSchema,
    defaultConfig: {
        brandName: "AURA",
        brandLogoText: "✦",
        trustedText: "⭐ Trusted by 1,200+ customers",
        kickerText: "LIMITED EDITION DROP",
        headline: "Find the style that matches you best.",
        subheadline: "Premium quality. Limited stock. Instant ordering with a focused product spotlight built to convert.",
        whatsappNumber: "1234567890",
        products: [
            {
                id: 1,
                name: "Aura Studio Pro",
                tagline: "Studio-grade sound, sculpted to blend perfectly into your modern space.",
                price: "$349",
                badge: "IN STOCK",
                badgeColor: "#25D366",
                image: "/demo/headphones-1.png",
            },
            {
                id: 2,
                name: "Aura Wireless Buds",
                tagline: "Crystal-clear audio in a compact, wireless design for life on the move.",
                price: "$199",
                badge: "BESTSELLER",
                badgeColor: "#f59e0b",
                image: "/demo/headphones-2.png",
            },
            {
                id: 3,
                name: "Aura Pro Monitor",
                tagline: "Reference-grade monitoring headphones for demanding studio professionals.",
                price: "$499",
                badge: "NEW",
                badgeColor: "#6366f1",
                image: "/demo/headphones-3.png",
            },
        ],
    },
    variants: [
        {
            id: "default-hero",
            name: "Default 3D Spotlight",
            Component: DefaultHero
        }
    ]
};
