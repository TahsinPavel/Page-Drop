import { BlockDefinition } from "@/lib/builder/types";
import { CTASchema } from "./schema";
import DefaultCTA from "./variants/default-cta";

export const CTABlock: BlockDefinition = {
    type: "cta",
    name: "WhatsApp CTA",
    category: "Actions",
    thumbnail: "/thumbnails/cta-default.png",
    configSchema: CTASchema,
    defaultConfig: {
        kickerText: "READY TO ORDER?",
        headline: "Get Yours Today",
        subheadline: "Tap below to order directly on WhatsApp. No app downloads. No long forms. Just simple, fast ordering.",
        buttonText: "Order on WhatsApp",
        whatsappNumber: "",
        whatsappMessage: "Hi, I'd like to place an order. Please share the details.",
        showBadges: true,
        badges: [
            "Cash on Delivery",
            "Fast Shipping",
            "Easy Returns",
        ],
    },
    variants: [
        {
            id: "default-cta",
            name: "Default WhatsApp CTA",
            Component: DefaultCTA,
        },
    ],
};
