# PageDrop — Frontend

> Next.js 14 frontend for PageDrop — AI-powered landing pages for small businesses.

## Tech Stack

- **Next.js 14** (App Router, TypeScript, strict mode)
- **Tailwind CSS** v4 + **shadcn/ui** components
- **React Hook Form** + **Zod** validation
- **@tanstack/react-query** for data fetching
- **Zustand** for auth state
- **Axios** for API calls
- **Lucide React** icons
- **react-hot-toast** for notifications

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

## Pages

| Path | Description |
|---|---|
| `/` | Marketing landing page |
| `/login` | Login |
| `/signup` | Registration |
| `/dashboard` | User dashboard (list pages) |
| `/dashboard/create` | Multi-step create page form |
| `/dashboard/pages/[id]` | Edit existing page |
| `/[slug]` | Public landing page (SSR) |

---

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login & signup
│   ├── dashboard/          # Protected dashboard routes
│   └── [slug]/             # Public landing pages (SSR)
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Navbar, Sidebar, Footer
│   ├── forms/              # CreatePageForm, EditPageForm
│   ├── dashboard/          # PageCard, StatsCard
│   └── public-page/        # 4 theme components
├── lib/                    # API client, auth store, utils
├── hooks/                  # useAuth, usePages
├── types/                  # TypeScript interfaces
└── middleware.ts            # Route protection
```
