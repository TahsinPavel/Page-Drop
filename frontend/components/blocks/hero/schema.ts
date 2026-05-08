import { z } from "zod";

export const HeroSchema = z.object({
  brandName: z.string().default("AURA"),
  brandLogoText: z.string().default("✦"),
  trustedText: z.string().default("⭐ Trusted by 1,200+ customers"),
  kickerText: z.string().default("LIMITED EDITION DROP"),
  headline: z.string().default("Find the style that matches you best."),
  subheadline: z.string().default("Premium quality. Limited stock. Instant ordering with a focused product spotlight built to convert."),
  whatsappNumber: z.string().default(""),
  products: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      name: z.string(),
      tagline: z.string(),
      price: z.string(),
      badge: z.string(),
      badgeColor: z.string(),
      image: z.string(),
    })
  ).default([
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
  ]),
});

export type HeroConfig = z.infer<typeof HeroSchema>;
