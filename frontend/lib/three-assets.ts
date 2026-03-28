/**
 * 3D Asset manifest for PageDrop.
 * Maps business categories to their 3D asset files.
 * Replace placeholder paths with real GLB files as you add them.
 */

export interface CategoryAssets {
  scene: string;        // path to main GLB scene
  accent: string;       // path to accent GLB object
  particleColor: string; // hex color for particle system
  fogColor: string;     // hex color for scene fog/atmosphere
  available: boolean;   // true when real GLB file is added
}

export interface PremiumAsset {
  id: string;
  name: string;
  scene: string;        // path to GLB
  preview: string;      // path to preview image
  price: number;        // in USD
  available: boolean;
}

// ─── Category Asset Map ───────────────────────────────────────

export const CATEGORY_ASSETS: Record<string, CategoryAssets> = {
  restaurant: {
    scene: '/3d/categories/restaurant/scene.glb',
    accent: '/3d/categories/restaurant/accent.glb',
    particleColor: '#F59E0B',   // warm amber
    fogColor: '#1a0a00',
    available: false            // set true when GLB added
  },
  salon: {
    scene: '/3d/categories/salon/scene.glb',
    accent: '/3d/categories/salon/accent.glb',
    particleColor: '#EC4899',   // pink
    fogColor: '#1a0010',
    available: false
  },
  spa: {
    scene: '/3d/categories/salon/scene.glb',  // shares salon assets
    accent: '/3d/categories/salon/accent.glb',
    particleColor: '#A78BFA',   // soft purple
    fogColor: '#0d0010',
    available: false
  },
  tech: {
    scene: '/3d/categories/tech/scene.glb',
    accent: '/3d/categories/tech/accent.glb',
    particleColor: '#6366F1',   // indigo
    fogColor: '#00001a',
    available: false
  },
  fitness: {
    scene: '/3d/categories/fitness/scene.glb',
    accent: '/3d/categories/fitness/accent.glb',
    particleColor: '#EF4444',   // bold red
    fogColor: '#1a0000',
    available: false
  },
  retail: {
    scene: '/3d/categories/retail/scene.glb',
    accent: '/3d/categories/retail/accent.glb',
    particleColor: '#10B981',   // emerald
    fogColor: '#001a0a',
    available: false
  },
  photography: {
    scene: '/3d/categories/photography/scene.glb',
    accent: '/3d/categories/photography/accent.glb',
    particleColor: '#F59E0B',   // gold
    fogColor: '#0d0d00',
    available: false
  },
  consultant: {
    scene: '/3d/categories/consultant/scene.glb',
    accent: '/3d/categories/consultant/accent.glb',
    particleColor: '#3B82F6',   // blue
    fogColor: '#00001a',
    available: false
  },
  general: {
    scene: '/3d/categories/general/scene.glb',
    accent: '/3d/categories/general/accent.glb',
    particleColor: '#8B5CF6',   // purple
    fogColor: '#0d0010',
    available: false
  }
};

// ─── Premium Asset Marketplace ───────────────────────────────

export const PREMIUM_ASSETS: PremiumAsset[] = [
  {
    id: 'gold-luxury',
    name: 'Gold Luxury',
    scene: '/3d/premium/gold-luxury/scene.glb',
    preview: '/3d/premium/gold-luxury/preview.png',
    price: 2,
    available: false
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    scene: '/3d/premium/neon-city/scene.glb',
    preview: '/3d/premium/neon-city/preview.png',
    price: 2,
    available: false
  },
  {
    id: 'diamond',
    name: 'Diamond Crystal',
    scene: '/3d/premium/diamond/scene.glb',
    preview: '/3d/premium/diamond/preview.png',
    price: 2,
    available: false
  },
  {
    id: 'matrix',
    name: 'Matrix Code Rain',
    scene: '/3d/premium/matrix/scene.glb',
    preview: '/3d/premium/matrix/preview.png',
    price: 2,
    available: false
  },
  {
    id: 'galaxy',
    name: 'Galaxy Nebula',
    scene: '/3d/premium/galaxy/scene.glb',
    preview: '/3d/premium/galaxy/preview.png',
    price: 1,
    available: false
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    scene: '/3d/premium/cherry-blossom/scene.glb',
    preview: '/3d/premium/cherry-blossom/preview.png',
    price: 1,
    available: false
  },
  {
    id: 'money-rain',
    name: 'Money Rain',
    scene: '/3d/premium/money-rain/scene.glb',
    preview: '/3d/premium/money-rain/preview.png',
    price: 2,
    available: false
  },
  {
    id: 'fire-ember',
    name: 'Fire & Ember',
    scene: '/3d/premium/fire-ember/scene.glb',
    preview: '/3d/premium/fire-ember/preview.png',
    price: 1,
    available: false
  }
];

// ─── Homepage Asset ───────────────────────────────────────────

export const HOMEPAGE_ASSET = {
  scene: '/3d/homepage/hero.glb',
  available: false   // set true when GLB added
};

// ─── Helper Functions ─────────────────────────────────────────

/**
 * Get category assets for a business page.
 * Falls back to 'general' if category not found.
 */
export function getCategoryAssets(category: string): CategoryAssets {
  const normalized = category.toLowerCase().trim();
  return CATEGORY_ASSETS[normalized] ?? CATEGORY_ASSETS['general'];
}

/**
 * Get premium asset by ID.
 */
export function getPremiumAsset(id: string): PremiumAsset | null {
  return PREMIUM_ASSETS.find(a => a.id === id) ?? null;
}

/**
 * Check if a category has real 3D assets ready.
 * Returns false if GLB files not yet added.
 */
export function hasCategoryAssets(category: string): boolean {
  const assets = getCategoryAssets(category);
  return assets.available;
}
