# PageDrop — Frontend

> Next.js 16 frontend for PageDrop — AI-powered landing pages for small businesses, featuring premium 3D showrooms and high-converting designs.

## Features

- **Premium 3D Showrooms**: Immersive 3D product carousels (floating stacks, poker-style fans, rotating cubes) built with Three.js.
- **High-Converting Landing Pages**: 8+ meticulously crafted, pixel-perfect public page templates focused on emotional persuasion and lifestyle messaging.
- **Advanced Animations**: Smooth page transitions, inertia-based scrolling, and complex animations powered by Framer Motion, GSAP, and Lenis.
- **Robust Dashboard**: Manage generated pages, track conversions, and view analytics via Recharts.
- **Streamlined Creation Flow**: Multi-step forms for generating new AI-powered landing pages.
- **Proxy/Middleware**: Secure route protection and API proxying.

## Tech Stack

- **Framework**: **Next.js 16** (App Router, strict mode, React Compiler)
- **Styling**: **Tailwind CSS v4** + **shadcn/ui** components
- **State Management**: **Zustand** (global/auth state)
- **Data Fetching**: **@tanstack/react-query** (query caching) + **Axios** (API client)
- **Forms**: **React Hook Form** + **Zod** (schema validation)
- **3D & Graphics**: **Three.js**, **@react-three/fiber**, **@react-three/drei**
- **Animations & UX**: **Framer Motion**, **GSAP**, **@studio-freight/lenis** (smooth scrolling)
- **Charts**: **Recharts**
- **Icons & UI**: **Lucide React**, **react-hot-toast** (notifications)

---

## Quick Start

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Copy env template
cp .env.local.example .env.local

# 3. Start dev server
npm run dev
```

Open **http://localhost:3000**.

> Make sure the backend is running at **http://localhost:8000**.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `http://localhost:8000/api/v1`) |

---

## Routing & Pages

| Path | Description |
|---|---|
| `/` | Marketing landing page |
| `/login` | Login |
| `/signup` | Registration |
| `/dashboard` | User dashboard (list pages, analytics) |
| `/dashboard/create` | Multi-step create page form |
| `/dashboard/pages/[id]` | Edit existing page |
| `/[slug]` | Public landing page (SSR & Dynamic Routes) |

---

## Project Structure

```
frontend/
├── app/                    # Next.js 16 App Router pages
│   ├── (auth)/             # Login & signup routes
│   ├── [slug]/             # Public landing pages
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── dashboard/          # Protected dashboard routes
│   ├── demo-landing-page*/ # Demo landing pages (1-8)
│   └── pricing/            # Pricing page
├── components/
│   ├── analytics/          # Analytics components
│   ├── dashboard/          # Dashboard components
│   ├── forms/              # Reusable form components
│   ├── layout/             # Layout components (Navbar, Footer, etc.)
│   ├── payments/           # Payment-related components
│   ├── public-page/        # Premium 3D components & 8+ Landing Page templates
│   ├── three/              # 3D canvas and elements (Three.js/Fiber)
│   └── ui/                 # shadcn/ui generic components
├── hooks/                  # Custom React hooks (auth, themes, lenis, 3D)
├── lib/                    # Utilities, API client, Three.js assets
├── types/                  # TypeScript interfaces and types
└── proxy.ts                # Route protection and proxy logic
```
