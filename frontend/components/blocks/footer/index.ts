import { BlockDefinition } from "@/lib/builder/types";
import { FooterSchema } from "./schema";
import DefaultFooter from "./variants/default-footer";

export const FooterBlock: BlockDefinition = {
    type: "footer",
    name: "Footer",
    category: "Footer",
    thumbnail: "/thumbnails/footer-default.png",
    configSchema: FooterSchema,
    defaultConfig: {
        brandName: "AURA",
        brandLogoText: "✦",
        tagline: "Premium products. Effortless ordering.",
        copyrightText: "All rights reserved.",
        links: [
            { id: "1", label: "Privacy Policy", url: "#" },
            { id: "2", label: "Terms of Service", url: "#" },
            { id: "3", label: "Contact Us", url: "#" },
        ],
        showPoweredBy: true,
    },
    variants: [
        {
            id: "default-footer",
            name: "Default Footer",
            Component: DefaultFooter,
        },
    ],
};
