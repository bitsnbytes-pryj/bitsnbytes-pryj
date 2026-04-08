# Bits&Bytes Prayagraj Admin API

A production-ready admin backend for the Bits&Bytes Prayagraj tech community. This service manages content, submissions, and provides dashboard analytics for administrators.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase PostgreSQL
- **Validation**: Zod
- **Authentication**: JWT with bcrypt password hashing
- **Security**: Helmet, CORS, Rate Limiting

## Features

- 🔐 **Authentication** - Secure email/password login with JWT tokens
- 📅 **Events Management** - Full CRUD for community events
- 👥 **Roles Management** - Manage volunteer/job positions
- 🧑‍💻 **Team Members** - Manage team profiles
- 🚀 **Projects Showcase** - CRUD for community projects
- 📬 **Submission Management** - View contacts, applications, registrations, feedback
- 📊 **Dashboard Analytics** - Stats and recent activity

## Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- npm or yarn

## Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd bnb-prayagraj-admin-api
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT signing | `your-super-secret-key` |
| `PORT` | Server port (optional) | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:3001` |

### 3. Database Setup

Run the SQL schema in your Supabase SQL editor:

```bash
# Open supabase/schema.sql and execute it in your Supabase dashboard
```

### 4. Create Initial Admin User

```bash
npm run seed
```

Or manually via SQL:

```sql
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@example.com',
  '$2b$10$...', -- Use bcrypt hash
  'Admin Name',
  'super_admin'
);
```

### 5. Start the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with email/password |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout (audit log) |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List events (paginated) |
| GET | `/events/:id` | Get event by ID |
| POST | `/events` | Create event |
| PUT | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event |

### Roles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/roles` | List roles (paginated) |
| GET | `/roles/:id` | Get role by ID |
| POST | `/roles` | Create role |
| PUT | `/roles/:id` | Update role |
| DELETE | `/roles/:id` | Delete role |

### Team Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/team` | List team members |
| GET | `/team/:id` | Get team member |
| POST | `/team` | Create team member |
| PUT | `/team/:id` | Update team member |
| DELETE | `/team/:id` | Delete team member |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List projects |
| GET | `/projects/:id` | Get project |
| POST | `/projects` | Create project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |

### Submissions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/submissions/contacts` | List contacts |
| GET | `/submissions/contacts/:id` | Get contact |
| DELETE | `/submissions/contacts/:id` | Delete contact |
| GET | `/submissions/join-applications` | List join applications |
| GET | `/submissions/join-applications/:id` | Get join application |
| DELETE | `/submissions/join-applications/:id` | Delete join application |
| GET | `/submissions/event-registrations` | List event registrations |
| GET | `/submissions/event-registrations/:id` | Get event registration |
| DELETE | `/submissions/event-registrations/:id` | Delete event registration |
| GET | `/submissions/role-applications` | List role applications |
| GET | `/submissions/role-applications/:id` | Get role application |
| DELETE | `/submissions/role-applications/:id` | Delete role application |
| GET | `/submissions/feedback` | List feedback |
| GET | `/submissions/feedback/:id` | Get feedback |
| DELETE | `/submissions/feedback/:id` | Delete feedback |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/health` | Health check (public) |
| GET | `/dashboard/stats` | Dashboard statistics |

## Request/Response Examples

### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "name": "Admin",
      "role": "super_admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2026-04-15T00:00:00.000Z"
  }
}
```

### Create Event

```bash
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Hackathon 2026",
  "description": "Annual hackathon event",
  "venue": "Prayagraj Tech Hub",
  "event_date": "2026-05-15T10:00:00Z",
  "capacity": 100,
  "status": "published"
}
```

### List with Pagination

```bash
GET /events?page=1&limit=10&status=published&search=hackathon&sort_by=event_date&sort_order=asc
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 25,
    "totalPages": 3,
    "hasMore": true
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

Common HTTP status codes:
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Internal server error

## Deployment

### Railway

1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm start
```

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Security Features

- JWT-based authentication
- bcrypt password hashing (10 rounds)
- Helmet.js security headers
- CORS protection
- Rate limiting (500 req/15min general, 5 req/15min for login)
- Request body size limits
- SQL injection protection via parameterized queries

## Project Structure

```
src/
├── auth/           # Authentication utilities
├── config/         # Configuration management
├── controllers/    # Request handlers
├── db/             # Database connection
├── middleware/     # Express middleware
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types & Zod schemas
├── utils/          # Utility functions
└── index.ts        # Application entry
```

## License

MIT