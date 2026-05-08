import { BlockDefinition } from "./types";
import { HeroBlock } from "@/components/blocks/hero";
import { TestimonialsBlock } from "@/components/blocks/testimonials";
import { FeaturesBlock } from "@/components/blocks/features";
import { CTABlock } from "@/components/blocks/cta";
import { FooterBlock } from "@/components/blocks/footer";

class BuilderRegistry {
    private blocks: Map<string, BlockDefinition> = new Map();

    register(block: BlockDefinition) {
        if (this.blocks.has(block.type)) {
            console.warn(`Block with type ${block.type} is already registered. Overwriting.`);
        }
        this.blocks.set(block.type, block);
    }

    getBlock(type: string): BlockDefinition | undefined {
        return this.blocks.get(type);
    }

    getAllBlocks(): BlockDefinition[] {
        return Array.from(this.blocks.values());
    }

    getBlocksByCategory(): Record<string, BlockDefinition[]> {
        const categories: Record<string, BlockDefinition[]> = {};
        for (const block of this.blocks.values()) {
            if (!categories[block.category]) {
                categories[block.category] = [];
            }
            categories[block.category].push(block);
        }
        return categories;
    }
}

// Singleton instance
export const registry = new BuilderRegistry();

// Register all blocks
registry.register(HeroBlock);
registry.register(TestimonialsBlock);
registry.register(FeaturesBlock);
registry.register(CTABlock);
registry.register(FooterBlock);
