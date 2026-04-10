# Bits&Bytes Official Website

Official platform for Bits&Bytes, a teen-led coding community based in Lucknow, India. This repository powers the public website, community pages, admin dashboard, and an AI assistant with retrieval and tool-calling support.

## What This Project Includes

- **Frontend**: Next.js App Router website for community pages, events, projects, join, and contact
- **Admin Dashboard**: Admin panel for managing events, team, projects, roles, and submissions
- **Backend API**: Express.js API for authenticated admin operations and public form submissions
- **AI Assistant**: SSE streaming responses and tool-calling flows with semantic search (RAG)
- **Database**: Supabase (PostgreSQL) for data storage

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Supabase     │◀────│    Backend      │
│   (Next.js)     │     │   (PostgreSQL)  │     │    (Express)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
      ▲                                                ▲
      │                                                │
      │         Public reads (anon key)                │
      │         Authenticated writes (JWT)             │
      └────────────────────────────────────────────────┘
```

- **Frontend reads directly from Supabase** using the anon key for public data
- **Backend handles all writes** with JWT authentication for admin operations
- **Webhook routes** allow public form submissions with API key validation

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Backend | Express.js, TypeScript |
| Styling/UI | Tailwind CSS 4, Radix UI, custom animated components |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI SDK against Hack Club proxy endpoints |
| Deployment | Vercel (frontend), any Node.js host (backend) |
| Package manager | pnpm (workspaces) |

## Required APIs & Services

| Service | Required | Purpose |
|---------|----------|---------|
| **Supabase** | ✅ Yes | Database, real-time subscriptions, storage |
| **Z.ai / Hack Club Proxy** | ✅ Yes* | AI assistant and embedding generation |
| **SMTP Server** | Optional | Email notifications for form submissions |
| **Google Search Console** | Optional | SEO verification |

*Required only if using the AI assistant feature.

## Getting Started

### 1. Prerequisites

- Node.js 20+
- pnpm 9+
- A Supabase project (see [Database Setup](#database-setup))
- Z.ai API key for AI endpoints (optional)

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

The complete database schema is in [`database.txt`](./database.txt) at the project root.

**To set up the database:**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `database.txt`
4. Paste and execute the SQL

This creates all necessary tables:
- `admin_users` - Admin authentication
- `events`, `team_members`, `projects`, `roles` - Content management
- `contacts`, `join_applications`, `event_registrations`, `role_applications`, `feedback` - Submissions
- `audit_logs` - Audit trail for admin actions

### 4. Configure Environment Variables

#### Frontend (`frontend/.env.local`)

```env
# Supabase Configuration (required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend API URL (required for admin dashboard)
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3000

# AI Configuration (required for AI assistant)
ZAI_API_KEY=your-zai-api-key

# Optional
OSM_API_KEY=your-osm-api-key
GOOGLE_SITE_VERIFICATION=your-google-site-verification-code
```

#### Backend (`backend/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Supabase (required)
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT Authentication (required)
JWT_SECRET=your-jwt-secret-change-in-production
JWT_EXPIRES_IN=7d

# CORS (comma-separated origins)
CORS_ORIGIN=http://localhost:3000,https://gobitsnbytes.org

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=500
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX_REQUESTS=5

# Password Hashing
BCRYPT_ROUNDS=10

# Email Notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_APP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@bnbprayagraj.com

# Webhook API Key (for public form submissions)
WEBHOOK_API_KEY=your-webhook-api-key-change-in-production
```

### 5. Seed Admin User

After setting up the database, create the default admin user:

```bash
pnpm --filter bnb-prayagraj-api seed
```

**Default credentials:**
- Email: `admin@bnbprayagraj.com`
- Password: `pass123`

⚠️ **Change the password immediately after first login!**

### 6. Run Development Servers

**Run both frontend and backend:**

```bash
# Terminal 1 - Backend
pnpm --filter bnb-prayagraj-api dev

# Terminal 2 - Frontend
pnpm --filter frontend dev
```

Or use concurrently (if installed):
```bash
pnpm dev
```

**Ports:**
- Frontend: `http://localhost:3001` (or next available)
- Backend: `http://localhost:3000`

## Available Scripts

### Root Level

```bash
pnpm install          # Install all dependencies
pnpm dev              # Run all workspaces in dev mode
pnpm build            # Build all workspaces
```

### Frontend

```bash
pnpm --filter frontend dev       # Development server
pnpm --filter frontend build     # Production build
pnpm --filter frontend start     # Start production server
pnpm --filter frontend lint      # Run ESLint
```

### Backend

```bash
pnpm --filter bnb-prayagraj-api dev       # Development server with hot reload
pnpm --filter bnb-prayagraj-api build     # Compile TypeScript
pnpm --filter bnb-prayagraj-api start     # Run compiled server
pnpm --filter bnb-prayagraj-api seed      # Seed admin user
```

### Shared Package

```bash
pnpm --filter @bitsnbytes/shared build    # Build shared package
```

## Project Structure

```
├── frontend/                 # Next.js App Router application
│   ├── app/                  # Pages and API routes
│   │   ├── admin/            # Admin dashboard pages
│   │   └── api/              # API routes (assistant, etc.)
│   ├── components/           # React components
│   ├── lib/                  # Utilities, hooks, API clients
│   ├── public/               # Static assets
│   └── styles/               # Global styles
│
├── backend/                  # Express.js API server
│   ├── src/
│   │   ├── auth/             # Authentication utilities
│   │   ├── config/           # Configuration
│   │   ├── db/               # Database connection
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   │   ├── admin/        # Admin CRUD routes
│   │   │   ├── auth.routes.ts
│   │   │   └── webhooks.routes.ts
│   │   ├── scripts/          # Utility scripts (seed)
│   │   └── services/         # Business logic
│   └── dist/                 # Compiled JavaScript
│
├── shared/                   # Shared types and schemas
│   └── src/
│       ├── types/            # TypeScript types
│       ├── schemas/          # Zod validation schemas
│       └── constants/        # Shared constants
│
├── database.txt              # Complete SQL schema for Supabase
└── README.md
```

## API Overview

### Backend API Endpoints

#### Authentication (`/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Admin login | None |
| POST | `/auth/logout` | Admin logout | JWT |
| GET | `/auth/me` | Get current user | JWT |

#### Admin Routes (`/admin/*`)

All admin routes require JWT authentication.

| Resource | Endpoints |
|----------|-----------|
| Events | `GET`, `POST`, `PUT`, `DELETE` `/admin/events` |
| Team | `GET`, `POST`, `PUT`, `DELETE` `/admin/team` |
| Projects | `GET`, `POST`, `PUT`, `DELETE` `/admin/projects` |
| Roles | `GET`, `POST`, `PUT`, `DELETE` `/admin/roles` |
| Submissions | `GET`, `PUT` `/admin/submissions/*` |
| Dashboard | `GET` `/admin/dashboard/stats`, `/admin/dashboard/activity` |

#### Webhook Routes (`/webhooks/*`)

Public form submission endpoints (require `X-Webhook-Key` header).

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks/forms/contact` | Submit contact form |
| POST | `/webhooks/forms/join` | Submit join application |
| POST | `/webhooks/forms/event-register` | Register for event |
| POST | `/webhooks/forms/role-apply` | Apply for a role |
| POST | `/webhooks/forms/feedback` | Submit feedback |

### Frontend API Routes

#### `POST /api/assistant`

Main AI assistant endpoint with SSE streaming.

#### `POST /api/join`

Stores join requests in Supabase.

## Embedding Site Content for RAG

The script `scripts/embed-site.ts` generates embeddings for RAG:

```bash
pnpm --filter frontend tsx scripts/embed-site.ts
```

## Deployment

### Frontend (Vercel)

Configured via `vercel.json`:
- Install command: `pnpm install`
- Build command: `pnpm run build`
- Framework: `nextjs`

### Backend

Build and run the compiled server:

```bash
pnpm --filter bnb-prayagraj-api build
pnpm --filter bnb-prayagraj-api start
```

For production, set `NODE_ENV=production` and use a process manager like PM2 or Docker.

## Documentation

- `backend/README.md` - Backend API documentation
- `frontend/TECHNICAL_DOCUMENTATION.md` - Frontend technical reference
- `frontend/agents.md` - Organization context for AI assistant
- `database.txt` - Complete database schema

## Contributing

1. Create a feature branch
2. Make focused changes
3. Run lint/build locally
4. Open a PR with context and screenshots for UI work

## License

This repository does not currently include a license file. Add one if you intend to allow reuse/distribution under specific terms.