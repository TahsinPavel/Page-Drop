import { z } from "zod";

export const TestimonialsSchema = z.object({
  kickerText: z.string().default("Social Proof"),
  title: z.string().default("The Verdict from real customers."),
  stat: z.string().default("⭐ 4.8 from 1,200+ happy customers"),
  testimonials: z.array(
    z.object({
      id: z.string(),
      quote: z.string(),
      name: z.string(),
      role: z.string(),
      avatarColor: z.string(),
    })
  ).default([
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
  ]),
});

export type TestimonialsConfig = z.infer<typeof TestimonialsSchema>;
