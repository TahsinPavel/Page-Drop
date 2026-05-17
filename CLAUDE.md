# PageDrop — Project Context

Welcome to the PageDrop codebase. This file provides the full context of the project architecture, tech stack, and key workflows. It is intended to help AI assistants (Claude, ChatGPT, Gemini, etc.) quickly understand the project.

## Overview
**PageDrop** is an AI-powered landing page generator designed for small and WhatsApp-based businesses. It allows users to quickly generate, customize, and publish high-converting landing pages featuring premium 3D showrooms and advanced animations.

## Tech Stack Summary

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4, shadcn/ui
- **3D & Animations**: Three.js, React Three Fiber (R3F), Drei, Framer Motion, GSAP, Lenis (smooth scrolling)
- **State & Data**: React `useState` for local state, Zustand for global auth, TanStack React Query + Axios for API fetching
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (NeonDB) accessed via SQLAlchemy 2.0 (async) + `asyncpg`
- **Migrations**: Alembic
- **Authentication**: JWT tokens (passwords hashed via `argon2-cffi`)
- **AI Integration**: Google Gemini 2.0 Flash (used for automatic copywriting and content generation)
- **Media Storage**: Cloudinary (for user logo and product image uploads)

---

## Core Architecture & Features

### 1. AeroBuilder (Frontend Page Builder)
The core feature of the application is the **AeroBuilder**, located at `/dashboard/build`. 
- **Layout**: It uses a 3-column layout:
  1. **Template Picker**: Users can select from 8 meticulously crafted premium templates (`demo-landing-page1.jsx` to `demo-landing-page8.jsx`).
  2. **Settings Panel**: Dynamic accordions to edit Brand Name, Copy (Headlines), WhatsApp number, and Product details.
  3. **Live Preview**: A MacBook-framed `iframe`-like container that renders the selected template in real-time.
- **Registry Architecture**: Templates are registered in `frontend/lib/template-registry.ts`, which enforces strict TypeScript typing (`TemplateConfig`) for all dynamic props.
- **State Flow**: The builder uses local `useState` to maintain the configuration. As the user edits the settings, the state is passed down as a `config` prop to the dynamically imported templates, instantly updating the preview.

### 2. Database Schema (Backend)
The central data model is the `BusinessPage`. Key columns include:
- `id` (UUID)
- `user_id` (UUID - foreign key to the Users table)
- `slug` (String - unique URL slug for the public page)
- `layout_config` (JSONB) - **Critical field**: Stores the entire page configuration built by the AeroBuilder (business name, headlines, product arrays, selected template ID).
- `whatsapp_number` (String)
- Analytics columns: `page_views`, `whatsapp_clicks`

### 3. API & Authentication Flow
- The backend serves a REST API at `/api/v1`.
- Authentication is handled via Bearer JWT tokens.
- On the frontend, routing protection and API proxying is managed via a custom proxy/middleware implementation to ensure secure communication with the backend.
- The AeroBuilder saves configurations via `POST /pages/` (create) and `PUT /pages/my-pages/{page_id}` (update).

---

## Key Directories

### Frontend (`/frontend`)
- `app/dashboard/build/`: The AeroBuilder main page and CSS.
- `app/[slug]/`: Dynamic route for rendering public-facing landing pages based on their `slug`.
- `components/public-page/`: Contains all 8 premium 3D landing page templates. These components accept a `config` prop for dynamic rendering but fallback to hardcoded defaults.
- `lib/template-registry.ts`: The central schema and registry linking the builder to the templates.

### Backend (`/backend`)
- `app/models/`: SQLAlchemy ORM models (`business_page.py`, `user.py`).
- `app/routers/`: FastAPI endpoint definitions (`pages.py`, `auth.py`, `ai.py`).
- `app/services/`: Core business logic (AI generation, Cloudinary uploads, password hashing).
- `alembic/`: Database migration scripts.

---

## Development Commands

**Backend**:
```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate   # Windows
source venv/bin/activate  # Mac/Linux
uvicorn app.main:app --reload --port 8000
```

**Frontend**:
```bash
cd frontend
npm run dev
# Runs on port 3000 (Next.js 16 + Turbopack)
```

## AI Assistant Guidelines for this Project
1. **Frontend Styling**: When writing frontend code, always use Tailwind CSS v4 syntax. Do not use generic colors; prefer curated, high-end aesthetics (glassmorphism, subtle gradients) as per PageDrop's premium brand.
2. **TypeScript**: Strictly adhere to the types defined in `frontend/lib/template-registry.ts` and `frontend/types/index.ts`. Avoid `any`.
3. **Database Changes**: Any changes to backend models *must* be followed by an Alembic migration (`alembic revision --autogenerate -m "..."`).
4. **Builder Components**: If creating new landing page templates, they must be registered in the `template-registry.ts` and accept the standard `config?: TemplateConfig` prop.
