import { z } from "zod";

export const FeaturesSchema = z.object({
    kickerText: z.string().default("WHY CHOOSE US"),
    title: z.string().default("Crafted for Excellence"),
    subtitle: z.string().default("Every detail is designed with precision, quality, and your satisfaction in mind."),
    features: z.array(
        z.object({
            id: z.string(),
            icon: z.string(),
            title: z.string(),
            description: z.string(),
        })
    ).default([
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
    ]),
});

export type FeaturesConfig = z.infer<typeof FeaturesSchema>;
