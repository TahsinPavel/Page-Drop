# PageDrop 3D Assets

## How to Add Category Assets

1. Get your GLB file (from Poly.pizza, Spline, or Meshy.ai)
2. Compress at gltf.report (keep under 1MB)
3. Place in: public/3d/categories/{category}/scene.glb
4. Open lib/three-assets.ts
5. Set available: true for that category

## How to Add Premium Assets

1. Create GLB file
2. Take a screenshot as preview.png (400x300px)
3. Place in: public/3d/premium/{asset-id}/
4. Set available: true in PREMIUM_ASSETS array

## File Size Rules

| Asset Type      | Max Size |
|----------------|----------|
| Category scene  | 2MB      |
| Accent object   | 500KB    |
| Premium scene   | 3MB      |
| User uploaded   | 10MB     |

## Supported Formats

- .glb (preferred — binary, fast loading)
- .gltf (with separate texture files)
- .splinescene (Spline only)

## Tools

- Download free models: poly.pizza
- Generate with AI: meshy.ai, spline.design
- Compress: gltf.report
