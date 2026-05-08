import { z } from "zod";

export const FooterSchema = z.object({
    brandName: z.string().default("AURA"),
    brandLogoText: z.string().default("✦"),
    tagline: z.string().default("Premium products. Effortless ordering."),
    copyrightText: z.string().default("All rights reserved."),
    links: z.array(
        z.object({
            id: z.string(),
            label: z.string(),
            url: z.string(),
        })
    ).default([
        { id: "1", label: "Privacy Policy", url: "#" },
        { id: "2", label: "Terms of Service", url: "#" },
        { id: "3", label: "Contact Us", url: "#" },
    ]),
    showPoweredBy: z.boolean().default(true),
});

export type FooterConfig = z.infer<typeof FooterSchema>;
