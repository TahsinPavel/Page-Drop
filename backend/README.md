# PageDrop — Backend API

> AI-powered landing page generator for small & WhatsApp-based businesses.

## Tech Stack

- **Python 3.11+** / **FastAPI**
- **SQLAlchemy 2.0 (async)** + **asyncpg** → NeonDB (PostgreSQL)
- **Alembic** for migrations
- **Google Gemini 2.0 Flash** for AI copy generation
- **Cloudinary** for image uploads
- **JWT** (python-jose) authentication

---

## Quick Start

```bash
# 1. Create & activate virtualenv (already in backend/venv)
backend\venv\Scripts\activate      # Windows
# source backend/venv/bin/activate  # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy env template and fill in real values
cp .env.example .env

# 4. Run database migrations
alembic upgrade head

# 5. Start the dev server
uvicorn app.main:app --reload --port 8000
```

The API docs are available at **http://localhost:8000/docs** (Swagger UI) and **http://localhost:8000/redoc**.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql+asyncpg://...`) |
| `SECRET_KEY` | JWT signing key (min 32 chars) |
| `ALGORITHM` | JWT algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_DAYS` | Token expiry in days (default `7`) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Create account, returns JWT |
| POST | `/login` | — | OAuth2 form login, returns JWT |
| GET | `/me` | ✅ | Current user profile |
| PUT | `/me` | ✅ | Update full_name |

### Pages — `/api/v1/pages`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create page + auto AI generation |
| GET | `/my-pages` | ✅ | List user's pages |
| GET | `/my-pages/{id}` | ✅ | Get single page |
| PUT | `/my-pages/{id}` | ✅ | Update page (re-triggers AI if needed) |
| DELETE | `/my-pages/{id}` | ✅ | Soft-delete page |
| POST | `/my-pages/{id}/regenerate-ai` | ✅ | Re-run AI generation |
| GET | `/public/{slug}` | — | Public page (increments views) |
| POST | `/public/{slug}/whatsapp-click` | — | Track WhatsApp click |
| POST | `/upload/logo` | ✅ | Upload logo (JPG/PNG/WebP, max 2 MB) |

### AI — `/api/v1/ai`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/generate` | ✅ | Standalone AI content generation |

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Service health check |

---

## Database Migrations

```bash
# Generate a new migration after model changes
alembic revision --autogenerate -m "describe change"

# Apply all pending migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

---

## Project Structure

```
backend/
├── app/
│   ├── main.py            # FastAPI app, CORS, exception handlers
│   ├── config.py           # Pydantic Settings from .env
│   ├── database.py         # Async engine & session
│   ├── dependencies.py     # get_current_user dependency
│   ├── models/             # SQLAlchemy ORM models
│   ├── schemas/            # Pydantic request/response models
│   ├── routers/            # API route handlers
│   └── services/           # Business logic & integrations
├── alembic/                # Database migrations
├── venv/                   # Python virtual environment
├── alembic.ini
├── requirements.txt
├── .env.example
└── README.md
```
