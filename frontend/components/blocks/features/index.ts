import { BlockDefinition } from "@/lib/builder/types";
import { FeaturesSchema } from "./schema";
import DefaultFeatures from "./variants/default-features";

export const FeaturesBlock: BlockDefinition = {
    type: "features",
    name: "Features Grid",
    category: "Content",
    thumbnail: "/thumbnails/features-default.png",
    configSchema: FeaturesSchema,
    defaultConfig: {
        kickerText: "WHY CHOOSE US",
        title: "Crafted for Excellence",
        subtitle: "Every detail is designed with precision, quality, and your satisfaction in mind.",
        features: [
            {
                id: "1",
                icon: "◆",
                title: "Premium Quality",
                description: "Carefully selected materials with luxe finish and comfort-first construction for everyday wear.",
            },
            {
                id: "2",
                icon: "⚡",
                title: "Fast Delivery",
                description: "Orders are confirmed on WhatsApp and dispatched fast so your product arrives without delay.",
            },
            {
                id: "3",
                icon: "💰",
                title: "Cash On Delivery",
                description: "Shop with confidence and pay at delivery for a smooth, low-friction purchase experience.",
            },
            {
                id: "4",
                icon: "↺",
                title: "Easy Returns",
                description: "Simple support process in case you need size help or a quick exchange after receiving your order.",
            },
        ],
    },
    variants: [
        {
            id: "default-features",
            name: "Default Feature Cards",
            Component: DefaultFeatures,
        },
    ],
};
