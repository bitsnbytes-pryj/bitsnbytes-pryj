# Bits&Bytes Prayagraj Public API

Production-ready public API service for the Bits&Bytes Prayagraj community website.

## Overview

This is the public backend API for the Bits&Bytes Prayagraj frontend website. It handles:

- **Form Submissions**: Contact, join applications, event registrations, role applications, and feedback
- **Public Data**: Events, roles, team members, and projects
- **Email Notifications**: Automatic emails to admins and users on form submissions

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Email**: Nodemailer (Gmail SMTP)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/bitsnbytes-prayagraj/public-api.git
cd public-api
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# Open src/db/schema.sql and execute it in Supabase
```

### 4. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `SMTP_HOST` | SMTP host (default: smtp.gmail.com) | No |
| `SMTP_PORT` | SMTP port (default: 587) | No |
| `SMTP_USER` | SMTP username (email) | Yes |
| `SMTP_APP_PASSWORD` | Gmail app password | Yes |
| `ADMIN_EMAIL` | Admin notification email | Yes |
| `CORS_ORIGINS` | Comma-separated allowed origins | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (default: 900000) | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window (default: 100) | No |

### Gmail Setup

For Gmail SMTP, you need to create an App Password:

1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Use this password as `SMTP_APP_PASSWORD`

## API Endpoints

### Root

```
GET /
```

Returns API information and available endpoints.

### Health Check

```
GET /health
```

Returns server health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600,
    "database": "connected"
  }
}
```

---

### Contact Form

```
POST /contact
```

Submit a contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about events",
  "message": "I'd like to know more about upcoming events."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "message": "Your message has been sent successfully. We'll get back to you soon!"
  }
}
```

---

### Join Application

```
POST /join
```

Submit a join application.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 98765 43210",
  "interests": ["web development", "AI/ML", "open source"],
  "experience": "intermediate",
  "why_join": "I want to learn and contribute to the community.",
  "how_heard": "Friend"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "message": "Your application has been submitted successfully. We'll review it and get back to you soon!"
  }
}
```

---

### Events

```
GET /events
```

List all upcoming and ongoing events.

**Query Parameters:**
- `status` - Filter by status (upcoming, ongoing, completed, cancelled)
- `limit` - Limit number of results

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Introduction to Web Development",
      "slug": "intro-web-dev-2024",
      "description": "Learn web development basics",
      "event_date": "2024-02-15",
      "event_time": "14:00:00",
      "location": "Online",
      "status": "upcoming",
      "tags": ["web", "beginner"],
      "registration_required": true
    }
  ]
}
```

---

```
GET /events/:id
```

Get event details by ID or slug.

---

### Event Registration

```
POST /event-register
```

Register for an event.

**Request Body:**
```json
{
  "event_id": "event-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "organization": "ABC College",
  "special_requirements": "Need accessibility assistance"
}
```

---

### Roles

```
GET /roles
```

List all open roles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Community Manager",
      "slug": "community-manager",
      "description": "Help grow our community",
      "responsibilities": ["Organize events", "Manage social media"],
      "requirements": ["Good communication", "Event management experience"],
      "time_commitment": "5 hours/week",
      "department": "Community"
    }
  ]
}
```

---

```
GET /roles/:id
```

Get role details by ID or slug.

---

### Role Application

```
POST /role-apply
```

Apply for a role.

**Request Body:**
```json
{
  "role_id": "role-uuid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 98765 43210",
  "portfolio_url": "https://jane.dev",
  "resume_url": "https://drive.google.com/resume",
  "cover_letter": "I'm excited to apply for this role...",
  "linkedin_url": "https://linkedin.com/in/janedoe",
  "availability": "Weekends"
}
```

---

### Team

```
GET /team
```

List all active team members.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "role": "Founder & Lead Organizer",
      "bio": "Passionate about building communities",
      "avatar_url": "https://example.com/avatar.jpg",
      "linkedin_url": "https://linkedin.com/in/johndoe",
      "display_order": 1
    }
  ]
}
```

---

### Projects

```
GET /projects
```

List all projects.

**Query Parameters:**
- `status` - Filter by status (planning, active, completed, on-hold)
- `limit` - Limit number of results

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Community Website",
      "slug": "community-website",
      "description": "Official website for Bits&Bytes Prayagraj",
      "github_url": "https://github.com/bnb-prayagraj/website",
      "live_url": "https://bnbprayagraj.com",
      "technologies": ["Next.js", "TypeScript", "TailwindCSS"],
      "status": "active"
    }
  ]
}
```

---

```
GET /projects/:id
```

Get project details by ID or slug.

---

### Feedback

```
POST /feedback
```

Submit feedback.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "feedback_type": "suggestion",
  "message": "Would love to see more workshops on AI/ML!",
  "rating": 4
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "message": "Thank you for your feedback!"
  }
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {
    "field": "Specific error for this field"
  }
}
```

**Validation Errors:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email address",
    "message": "Message must be at least 10 characters"
  }
}
```

**Rate Limiting:**
```json
{
  "success": false,
  "error": "Too many requests, please try again later."
}
```

---

## Deployment

### Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy!

The `npm start` command will run the production build.

### Manual Deployment

```bash
npm run build
npm start
```

---

## Development

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |

### Project Structure

```
src/
├── config/          # Configuration and Supabase client
├── controllers/     # Request handlers
├── db/              # Database schema
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types and Zod schemas
├── utils/           # Utility functions
└── index.ts         # App entry point
```

---

## Security

- **CORS**: Configured for specific origins
- **Rate Limiting**: 100 requests per 15 minutes (general), 10 per hour (forms)
- **Input Validation**: All inputs validated with Zod
- **Request Size Limit**: 1MB max request body
- **No Auth Required**: Public endpoints only

---

## License

MIT © Bits&Bytes Prayagraj