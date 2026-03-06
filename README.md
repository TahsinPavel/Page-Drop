<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-NeonDB-4169E1?logo=postgresql" alt="NeonDB" />
  <img src="https://img.shields.io/badge/AI-Gemini%202.0%20Flash-4285F4?logo=google" alt="Gemini" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

# 🚀 PageDrop

**Instant AI-powered landing pages for small & WhatsApp-based businesses.**

PageDrop lets anyone create a professional landing page in under 60 seconds — no coding, no design skills needed. Users fill a simple form, Google Gemini AI writes the marketing copy, and a beautiful themed page goes live instantly with a WhatsApp CTA button.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI-Generated Copy** | Google Gemini 2.0 Flash writes headlines, about text, product descriptions, and SEO metadata |
| 💬 **WhatsApp CTA** | Every page includes a prominent WhatsApp button for instant customer contact |
| 🎨 **4 Themes** | Default, Dark, Minimal, and Vibrant — each fully responsive and mobile-first |
| 📊 **Analytics** | Track page views and WhatsApp clicks in real-time on the dashboard |
| 🖼️ **Logo Upload** | Upload business logos via Cloudinary (JPG/PNG/WebP, max 2 MB) |
| 🔗 **Clean URLs** | Auto-generated slugs like `/ahmeds-biryani-house` |
| 🔒 **JWT Auth** | Secure authentication with bcrypt password hashing |
| ⚡ **SSR + SEO** | Public pages are server-rendered with dynamic meta tags and OpenGraph data |

---

## 🏗️ Architecture

```
PageDrop/
├── backend/          → Python FastAPI REST API
│   ├── app/
│   │   ├── main.py           # App entry, CORS, routers
│   │   ├── config.py         # Environment settings
│   │   ├── database.py       # Async SQLAlchemy engine
│   │   ├── dependencies.py   # JWT auth dependency
│   │   ├── models/           # User, BusinessPage ORM models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── routers/          # Auth, Pages, AI route handlers
│   │   └── services/         # Business logic & integrations
│   ├── alembic/              # Database migrations
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/         → Next.js 14 App Router (TypeScript)
│   ├── app/
│   │   ├── (auth)/           # Login & Signup pages
│   │   ├── dashboard/        # Protected dashboard routes
│   │   ├── [slug]/           # Public landing pages (SSR)
│   │   └── page.tsx          # Marketing landing page
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── layout/           # Navbar, Sidebar, Footer
│   │   ├── forms/            # Create & Edit page forms
│   │   ├── dashboard/        # PageCard, StatsCard
│   │   └── public-page/      # 4 theme components
│   ├── lib/                  # API client, auth store, utils
│   ├── hooks/                # useAuth, usePages
│   ├── types/                # TypeScript interfaces
│   └── middleware.ts         # Route protection
│
├── .gitignore
└── README.md                 ← You are here
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.11+** | Runtime |
| **FastAPI** | REST API framework |
| **SQLAlchemy 2.0 (async)** | ORM with async support |
| **asyncpg** | PostgreSQL async driver |
| **NeonDB** | Serverless PostgreSQL database |
| **Alembic** | Database migrations |
| **Google Gemini 2.0 Flash** | AI content generation |
| **Cloudinary** | Image hosting & transformation |
| **python-jose** | JWT token handling |
| **passlib + bcrypt** | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **React Hook Form + Zod** | Form handling & validation |
| **@tanstack/react-query** | Server state management |
| **Zustand** | Client auth state |
| **Axios** | HTTP client |
| **Lucide React** | Icon library |
| **react-hot-toast** | Toast notifications |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+** installed
- **Node.js 18+** and **npm** installed
- **NeonDB** account (or any PostgreSQL database)
- **Cloudinary** account (for logo uploads)
- **Google Gemini API key** (for AI content generation)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/PageDrop.git
cd PageDrop
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your real credentials (see Environment Variables below)

# Run database migrations
alembic upgrade head

# Start the dev server
uvicorn app.main:app --reload --port 8000
```

The API docs are available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local if your backend runs on a different URL

# Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://user:pass@host/db?ssl=require` |
| `SECRET_KEY` | JWT signing key (min 32 chars) | `your-secret-key-here` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_DAYS` | Token expiry in days | `7` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc123...` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api/v1` |

---

## 📡 API Endpoints

### Auth — `/api/v1/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | — | Create account → returns JWT |
| `POST` | `/login` | — | OAuth2 form login → returns JWT |
| `GET` | `/me` | ✅ | Get current user profile |
| `PUT` | `/me` | ✅ | Update user's full name |

### Pages — `/api/v1/pages`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✅ | Create page + auto AI generation |
| `GET` | `/my-pages` | ✅ | List user's pages |
| `GET` | `/my-pages/{id}` | ✅ | Get single page |
| `PUT` | `/my-pages/{id}` | ✅ | Update page (re-triggers AI if name/products change) |
| `DELETE` | `/my-pages/{id}` | ✅ | Soft-delete page |
| `POST` | `/my-pages/{id}/regenerate-ai` | ✅ | Re-run AI generation |
| `GET` | `/public/{slug}` | — | Public page (increments views) |
| `POST` | `/public/{slug}/whatsapp-click` | — | Track WhatsApp click |
| `POST` | `/upload/logo` | ✅ | Upload logo (JPG/PNG/WebP, max 2 MB) |

### AI — `/api/v1/ai`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/generate` | ✅ | Standalone AI content preview |

---

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Marketing landing page |
| `/login` | User login |
| `/signup` | User registration |
| `/dashboard` | User dashboard — manage pages & view stats |
| `/dashboard/create` | Multi-step page creation form |
| `/dashboard/pages/[id]` | Edit existing page |
| `/[slug]` | Public landing page (SSR with SEO) |

---

## 🎨 Themes

PageDrop offers 4 built-in themes for public landing pages:

| Theme | Style |
|---|---|
| **Default** | Clean white background with green (#25D366) accents |
| **Dark** | Dark background with subtle gradients and glowing CTAs |
| **Minimal** | Ultra-clean, typography-focused, lots of whitespace |
| **Vibrant** | Colorful gradients with bold, energetic styling |

Each theme is a self-contained React component rendering: Hero section (logo, headline, subheadline, location, WhatsApp CTA), About section, Products grid, and a sticky mobile WhatsApp bar.

---

## 📦 Database Migrations

```bash
cd backend

# Generate a new migration after model changes
alembic revision --autogenerate -m "describe your change"

# Apply all pending migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ for small businesses everywhere
</p>
