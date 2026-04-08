# @bitsnbytes/shared

Shared types, schemas, and constants for the Bits&Bytes platform. This package provides a single source of truth for data structures used across the frontend, backend, and admin-backend packages.

## Installation

This package is part of the pnpm workspace and is automatically linked to other packages. No manual installation needed.

## Usage

### Import Types

```typescript
import { 
  Event, 
  Project, 
  TeamMember, 
  ApiResponse, 
  PaginatedResponse 
} from '@bitsnbytes/shared';
```

### Import Schemas for Validation

```typescript
import { 
  contactSchema, 
  joinSchema, 
  createEventSchema,
  listEventsQuerySchema 
} from '@bitsnbytes/shared';

// Use with Zod
const result = contactSchema.safeParse(formData);
if (result.success) {
  // result.data is typed
}
```

### Import Constants

```typescript
import { 
  DEPARTMENTS, 
  EVENT_STATUSES, 
  RATE_LIMITS,
  DEFAULT_PAGE_SIZE 
} from '@bitsnbytes/shared';
```

## Structure

```
shared/
├── src/
│   ├── types/           # TypeScript interfaces
│   │   ├── common.types.ts    # API responses, pagination, etc.
│   │   ├── event.types.ts     # Event entities
│   │   ├── project.types.ts   # Project entities
│   │   ├── team.types.ts      # Team member entities
│   │   └── role.types.ts      # Role entities
│   ├── schemas/         # Zod validation schemas
│   │   ├── common.schema.ts   # Common validation patterns
│   │   ├── event.schema.ts    # Event CRUD validation
│   │   ├── project.schema.ts  # Project CRUD validation
│   │   ├── team.schema.ts     # Team member CRUD validation
│   │   ├── role.schema.ts     # Role CRUD validation
│   │   └── form.schema.ts     # Public form validation
│   ├── constants/       # Shared constants
│   └── index.ts         # Main exports
├── package.json
└── tsconfig.json
```

## Key Features

### 1. Entity Types
- `Event` - Complete event entity with all database fields
- `Project` - Project entity with technologies and team
- `TeamMember` - Team member with social links and badges
- `Role` - Job/volunteer role with requirements

### 2. Input Validation Schemas
- `createEventSchema` / `updateEventSchema` - Event CRUD
- `createProjectSchema` / `updateProjectSchema` - Project CRUD
- `createTeamMemberSchema` / `updateTeamMemberSchema` - Team CRUD
- `createRoleSchema` / `updateRoleSchema` - Role CRUD

### 3. Form Validation Schemas
- `contactSchema` - Contact form validation
- `joinSchema` - Join application validation
- `feedbackSchema` - Feedback submission validation
- `eventRegisterSchema` - Event registration validation
- `roleApplySchema` - Role application validation

### 4. Common Patterns
- `ApiResponse<T>` - Standard success response wrapper
- `ApiErrorResponse` - Standard error response
- `PaginatedResponse<T>` - Paginated list response
- `PaginationQuery` - Pagination query parameters

## Development

Run type checking:
```bash
pnpm --filter @bitsnbytes/shared run typecheck
```

## Adding New Types

1. Create or update the appropriate file in `src/types/`
2. Export from `src/types/index.ts`
3. Create corresponding Zod schema in `src/schemas/`
4. Export schema from `src/schemas/index.ts`

Both types and schemas will be available via the main `@bitsnbytes/shared` import.