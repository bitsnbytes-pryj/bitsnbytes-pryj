# Bits&Bytes Prayagraj - Consolidated Backend

A unified Express.js backend API for the Bits&Bytes Prayagraj website, handling authentication, content management, and form submissions.

## Features

- **Authentication**: JWT-based admin authentication with bcrypt password hashing
- **Content Management**: CRUD operations for events, team members, projects, and roles
- **Submissions Management**: View and manage contact forms, join applications, event registrations, and feedback
- **Dashboard**: Statistics and recent activity overview
- **Webhooks**: Public endpoints for form submissions (with API key validation)
- **Audit Logging**: Track all admin actions

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT tokens, bcrypt password hashing
- **Validation**: Built-in Express middleware

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account with project set up

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
```

### Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for admin operations) |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) |
| `WEBHOOK_API_KEY` | API key for webhook endpoints |

### Database Setup

1. Run the SQL schema from `../database.txt` in your Supabase SQL editor
2. Seed the database with initial admin user:

```bash
pnpm seed
```

Default credentials:
- Email: `admin@bnbprayagraj.com`
- Password: `pass123`

⚠️ **Change the password after first login!**

### Running

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/login` - Admin login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Admin Routes (all require authentication)

#### Events (`/admin/events`)
- `GET /admin/events` - List all events
- `GET /admin/events/:id` - Get single event
- `POST /admin/events` - Create event
- `PUT /admin/events/:id` - Update event
- `DELETE /admin/events/:id` - Delete event

#### Team (`/admin/team`)
- `GET /admin/team` - List team members
- `POST /admin/team` - Create team member
- `PUT /admin/team/:id` - Update team member
- `DELETE /admin/team/:id` - Delete team member

#### Projects (`/admin/projects`)
- `GET /admin/projects` - List projects
- `POST /admin/projects` - Create project
- `PUT /admin/projects/:id` - Update project
- `DELETE /admin/projects/:id` - Delete project

#### Roles (`/admin/roles`)
- `GET /admin/roles` - List roles
- `POST /admin/roles` - Create role
- `PUT /admin/roles/:id` - Update role
- `DELETE /admin/roles/:id` - Delete role

#### Submissions (`/admin/submissions`)
- `GET /admin/submissions/contacts` - List contact submissions
- `GET /admin/submissions/join` - List join applications
- `GET /admin/submissions/event-registrations` - List event registrations
- `GET /admin/submissions/role-applications` - List role applications
- `GET /admin/submissions/feedback` - List feedback

#### Dashboard (`/admin/dashboard`)
- `GET /admin/dashboard/stats` - Get statistics
- `GET /admin/dashboard/activity` - Get recent activity

### Webhooks (`/webhooks`)
All webhook endpoints require `x-webhook-key` header with valid API key.

- `POST /webhooks/forms/contact` - Contact form
- `POST /webhooks/forms/join` - Join application
- `POST /webhooks/forms/event-register` - Event registration
- `POST /webhooks/forms/role-apply` - Role application
- `POST /webhooks/forms/feedback` - Feedback submission

## Architecture

```
backend/
├── src/
│   ├── auth/           # Password hashing, JWT utilities
│   ├── config/         # Environment configuration
│   ├── db/             # Supabase connection
│   ├── middleware/     # Auth middleware
│   ├── routes/
│   │   ├── admin/      # Admin CRUD routes
│   │   ├── auth.routes.ts
│   │   └── webhooks.routes.ts
│   ├── scripts/        # Seed scripts
│   └── services/       # Business logic (audit, etc.)
├── .env.example
├── package.json
└── tsconfig.json
```

## Security

- All admin routes require JWT authentication
- Passwords hashed with bcrypt (10 rounds by default)
- Rate limiting on all endpoints
- Stricter rate limiting on login endpoint
- CORS restricted to allowed origins
- Helmet.js for security headers
- Webhook endpoints require API key

## Deployment

The backend is designed to run on platforms like Railway, Render, or any Node.js hosting:

1. Set all environment variables
2. Run `pnpm build`
3. Run `pnpm start` (or use the start script)

For production:
- Set `NODE_ENV=production`
- Use strong JWT secret
- Configure proper CORS origins
- Set up SSL/TLS