import React from "react";
import { PublicPage } from "@/types";
import { registry } from "@/lib/builder/registry";
import { BlockInstance } from "@/lib/builder/types";

interface LayoutConfigShape {
    blocks?: BlockInstance[];
    globalSettings?: Record<string, unknown>;
}

interface BuilderRendererProps {
    page: PublicPage;
}

export default function BuilderRenderer({ page }: BuilderRendererProps) {
    const layoutConfig = page.layout_config as LayoutConfigShape | null | undefined;

    if (!layoutConfig || !layoutConfig.blocks || layoutConfig.blocks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b] text-white">
                <p>This page has no content yet.</p>
            </div>
        );
    }

    // Sort blocks by order
    const sortedBlocks = [...layoutConfig.blocks].sort((a, b) => a.order - b.order);

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#0a0a0b] overflow-x-hidden">
            {sortedBlocks.map((block) => {
                const definition = registry.getBlock(block.type);
                if (!definition) return null;

                const variant = definition.variants.find(v => v.id === block.variant) || definition.variants[0];
                if (!variant) return null;

                const Component = variant.Component;

                return (
                    <div key={block.id} className="relative w-full">
                        <Component config={block.config} isPreview={false} />
                    </div>
                );
            })}
        </div>
    );
}
