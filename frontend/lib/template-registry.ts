/**
 * Template Registry — Single source of truth for all demo landing page templates.
 * To add a new template: just add an entry to TEMPLATES array. Nothing else needs to change.
 */

export interface TemplateProduct {
  id: number | string;
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string | null;
  badge: string;
  badgeColor: string;
  image: string;
}

export interface TemplateConfig {
  businessName: string;
  whatsappNumber: string;
  headline: string;
  subheadline: string;
  kickerText: string;
  trustedText: string;
  products: TemplateProduct[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  carouselStyle: string;
}

// ─── Default config ───────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: TemplateConfig = {
  businessName: "AURA",
  whatsappNumber: "+1234567890",
  headline: "Own the Premium Piece Everyone Wants",
  subheadline: "Premium quality. Limited stock. Order via WhatsApp in 60 seconds.",
  kickerText: "LIMITED EDITION DROP",
  trustedText: "⭐ Trusted by 1,000+ customers",
  products: [
    {
      id: 1,
      name: "Product One",
      tagline: "Your product description goes here.",
      price: "$99",
      originalPrice: "$149",
      badge: "BESTSELLER",
      badgeColor: "#25D366",
      image: "/demo/headphones-1.png",
    },
    {
      id: 2,
      name: "Product Two",
      tagline: "Another great product description.",
      price: "$149",
      originalPrice: null,
      badge: "NEW",
      badgeColor: "#6366f1",
      image: "/demo/headphones-2.png",
    },
    {
      id: 3,
      name: "Product Three",
      tagline: "Premium quality, unbeatable value.",
      price: "$199",
      originalPrice: "$249",
      badge: "LIMITED",
      badgeColor: "#f59e0b",
      image: "/demo/watch-1.png",
    },
  ],
};

// ─── Templates ────────────────────────────────────────────────────────────────
// Add new templates here. The builder auto-picks them up.

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "demo-landing-page1",
    name: "Spotlight Carousel",
    description: "3D spotlight with depth effect. Best for electronics, accessories.",
    thumbnail: "/thumbnails/template1.png",
    tags: ["3D", "Spotlight", "Premium"],
    carouselStyle: "Spotlight",
  },
  {
    id: "demo-landing-page2",
    name: "Luxury Watch",
    description: "Gold-accented luxury design for high-end products.",
    thumbnail: "/thumbnails/template2.png",
    tags: ["3D", "Luxury", "Gold"],
    carouselStyle: "Depth Carousel",
  },
  {
    id: "demo-landing-page3",
    name: "Poker Fan Cards",
    description: "Fan card layout showing multiple product angles.",
    thumbnail: "/thumbnails/template3.png",
    tags: ["3D", "Fan Cards", "Fashion"],
    carouselStyle: "Poker Fan",
  },
  {
    id: "demo-landing-page4",
    name: "Coverflow Pro",
    description: "Glass cards with ambient glow and coverflow rotation.",
    thumbnail: "/thumbnails/template4.png",
    tags: ["3D", "Coverflow", "Glass"],
    carouselStyle: "Coverflow",
  },
  {
    id: "demo-landing-page5",
    name: "Minimal Dark",
    description: "Clean minimal design with subtle 3D. Works for any niche.",
    thumbnail: "/thumbnails/template5.png",
    tags: ["Minimal", "Dark", "Clean"],
    carouselStyle: "Minimal Slider",
  },
  {
    id: "demo-landing-page6",
    name: "Orbit Carousel",
    description: "Floating orbital product display with ambient lighting.",
    thumbnail: "/thumbnails/template6.png",
    tags: ["3D", "Orbit", "Premium"],
    carouselStyle: "Orbit",
  },
  {
    id: "demo-landing-page7",
    name: "Deep Coverflow",
    description: "Deep perspective coverflow with full product info panel.",
    thumbnail: "/thumbnails/template7.png",
    tags: ["3D", "Coverflow", "Info Panel"],
    carouselStyle: "Deep Coverflow",
  },
  {
    id: "demo-landing-page8",
    name: "Floating Orbit",
    description: "Luxury floating elements with dynamic lighting.",
    thumbnail: "/thumbnails/template8.png",
    tags: ["3D", "Floating", "Luxury"],
    carouselStyle: "Floating",
  },
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
