import { BlockDefinition } from "@/lib/builder/types";
import { TestimonialsSchema } from "./schema";
import DefaultTestimonials from "./variants/default-testimonials";

export const TestimonialsBlock: BlockDefinition = {
    type: "testimonials",
    name: "Social Proof",
    category: "Trust",
    thumbnail: "/thumbnails/testimonials-default.png",
    configSchema: TestimonialsSchema,
    defaultConfig: {
        kickerText: "Social Proof",
        title: "The Verdict from real customers.",
        stat: "⭐ 4.8 from 1,200+ happy customers",
        testimonials: [
            {
                id: "1",
                quote: "Absolutely stunning design. The sound quality blew me away, and ordering through WhatsApp was surprisingly easy.",
                name: "James D.",
                role: "Verified Buyer",
                avatarColor: "#6366f1",
            },
            {
                id: "2",
                quote: "I've owned many premium headphones, but these take the crown for both comfort and aesthetic. Highly recommend.",
                name: "Sarah M.",
                role: "Verified Buyer",
                avatarColor: "#10b981",
            },
            {
                id: "3",
                quote: "Fast delivery, exact product as shown. The noise cancellation on the Buds is top tier for commuting.",
                name: "Robert T.",
                role: "Verified Buyer",
                avatarColor: "#f59e0b",
            },
        ],
    },
    variants: [
        {
            id: "default-testimonials",
            name: "Default Testimonials Slider",
            Component: DefaultTestimonials
        }
    ]
};
