import { z } from "zod";

export const CTASchema = z.object({
    kickerText: z.string().default("READY TO ORDER?"),
    headline: z.string().default("Get Yours Today"),
    subheadline: z.string().default("Tap below to order directly on WhatsApp. No app downloads. No long forms. Just simple, fast ordering."),
    buttonText: z.string().default("Order on WhatsApp"),
    whatsappNumber: z.string().default(""),
    whatsappMessage: z.string().default("Hi, I'd like to place an order. Please share the details."),
    showBadges: z.boolean().default(true),
    badges: z.array(z.string()).default([
        "Cash on Delivery",
        "Fast Shipping",
        "Easy Returns",
    ]),
});

export type CTAConfig = z.infer<typeof CTASchema>;
