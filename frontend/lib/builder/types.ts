import { z } from "zod";

export interface GlobalSettings {
    primaryColor: string;
    fontFamily: string;
    theme: "light" | "dark";
    language: string;
}

export interface BlockInstance {
    id: string; // Unique ID for this instance in the page
    type: string; // Matches a registered BlockDefinition
    variant: string; // The selected variant ID
    order: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>; // The props/settings for this block
}

export interface PageDetails {
    businessName: string;
    slug: string;
    category: string;
    whatsappNumber: string;
}

export interface LayoutConfig {
    globalSettings: GlobalSettings;
    blocks: BlockInstance[];
}

export interface PageModel {
    id: string;
    userId: string;
    slug: string;
    name: string;
    status: "draft" | "published";
    layout_config: LayoutConfig;
}

// Registry Types
export interface BlockVariant {
    id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component: React.ComponentType<any>; // React Component
}

export interface BlockDefinition {
    type: string;
    name: string;
    category: string;
    thumbnail?: string;
    isPremium?: boolean;
    minPlan?: string;
    variants: BlockVariant[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configSchema: z.ZodType<any, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultConfig: Record<string, any>;
}
