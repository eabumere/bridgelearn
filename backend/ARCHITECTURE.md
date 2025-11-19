# BridgeLearn Backend Architecture

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Runtime Topology](#runtime-topology)
4. [Source Tree](#source-tree)
5. [Application Layers](#application-layers)
6. [API Surface](#api-surface)
7. [Data & Persistence](#data--persistence)
8. [Third-Party Integrations](#third-party-integrations)
9. [Flow Diagrams](#flow-diagrams)
10. [Configuration](#configuration)
11. [Future Enhancements](#future-enhancements)

---

## Overview

```
┌─────────────────────────────┐
│          Client             │
│ (React Frontend, other apps)│
└──────────────┬──────────────┘
               │ HTTPS / WebSockets
┌──────────────▼──────────────┐
│       BridgeLearn API        │
│  Express + TypeScript (ESM)  │
│                              │
│  • Routing (src/routes)      │
│  • Controllers (src/controllers)
│  • Services (src/services)   │
│  • Data access (src/utils)   │
└──────────────┬──────────────┘
      ┌────────┴────────┐
      │                 │
┌─────▼─────┐   ┌───────▼────────┐
│ PostgreSQL│   │ Moodle REST API │
│ bridgelearn│  │  (LMS)          │
└───────────┘   └────────────────┘
```

The backend is an Express application (ESM, TypeScript) that exposes REST endpoints, persists data in PostgreSQL, and synchronizes users with Moodle via its REST API.

---

## Technology Stack

- **Node.js 20** (ESM)
- **Express 5** for HTTP routing
- **TypeScript** targeting ES2022 (NodeNext module resolution)
- **PostgreSQL** via `pg` connection pool
- **CORS** middleware for browser access
- **Docker** (containerized deployment via `docker-compose.yml`)
- **Moodle REST API** (external LMS synchronization)

---

## Runtime Topology

```
Docker Network: bridgelearn-net
 ├─ bridgelearn-backend  (Express API, port 5000)
 ├─ bridgelearn-db       (PostgreSQL, port 5432)
 └─ bridgelearn-frontend (React/Vite dev server, port 3000)
```

- **Backend service** listens on `http://localhost:5000`.
- **Frontend** accesses backend through `/api/...` endpoints with CORS enabled.
- Internal services communicate over the Docker network (`bridgelearn-net`).

---

## Source Tree

```
backend/
├─ src/
│  ├─ index.ts                # Entry point, CORS setup, route registration
│  ├─ utils/
│  │  └─ db.ts               # PostgreSQL pool + schema initialization
│  ├─ models/
│  │  └─ User.ts             # User interfaces/types
│  ├─ services/
│  │  ├─ moodle/
│  │  │  └─ moodleService.ts # Moodle REST client
│  │  └─ userService.ts      # Business logic + DB access
│  ├─ controllers/
│  │  └─ userController.ts   # HTTP handlers
│  └─ routes/
│     └─ userRoutes.ts       # Express router for /api/users
├─ middlewares/              # (reserved for future middlewares)
├─ Dockerfile
├─ package.json
└─ tsconfig.json
```

Compiled JavaScript is emitted under `backend/dist/`.

---

## Application Layers

1. **Entry Point (`src/index.ts`)**
   - Loads environment variables.
   - Configures JSON parsing and CORS.
   - Initializes database schema.
   - Binds routes (`/api/users`).

2. **Routes (`src/routes`)**
   - Each route module registers endpoints on an Express router and binds controller methods.

3. **Controllers (`src/controllers`)**
   - Bridge HTTP semantics to service calls.
   - Handle validation, status codes, error responses.

4. **Services (`src/services`)**
   - Business logic layer.
   - `userService` orchestrates DB operations and Moodle sync within transactions.
   - `moodleService` handles REST calls to Moodle (`core_user_*` functions).

5. **Persistence (`src/utils/db.ts`)**
   - Configures pooled connections to PostgreSQL.
   - Provides `initializeDatabase()` to create tables & indexes.

6. **Models (`src/models`)**
   - Type definitions for users and DTOs (`CreateUserInput`, `UserResponse`, etc.).

---

## API Surface

Base path: `/api/users`

| Method | Path        | Description                    | Auth | Notes                                    |
|--------|-------------|--------------------------------|------|------------------------------------------|
| GET    | `/`         | List users (paginated)         | TBD  | Query params `limit`, `offset`           |
| GET    | `/:id`      | Fetch single user              | TBD  | 404 for unknown user                     |
| POST   | `/`         | Create user                    | TBD  | Sync to Moodle by default                |
| PUT    | `/:id`      | Update user                    | TBD  | Also updates Moodle if synced            |
| DELETE | `/:id`      | Soft-delete user               | TBD  | Deactivates and removes from Moodle      |

> Authentication/authorization is currently mocked; future work should add JWT middleware.

---

## Data & Persistence

### PostgreSQL Schema (auto-created)

```
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'student',
  moodle_user_id INTEGER,
  moodle_username VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

Indexes: `email`, `username`, `moodle_user_id`.

### Transactions

`userService` wraps create/update/delete operations in database transactions to ensure atomicity when syncing with Moodle.

---

## Third-Party Integrations

### Moodle REST API

- Base URL: `${MOODLE_URL}/webservice/rest/server.php`
- Authentication: token-based (`MOODLE_TOKEN`)
- Functions used:
  - `core_user_create_users`
  - `core_user_update_users`
  - `core_user_delete_users`
  - `core_user_get_users_by_field`
  - `core_webservice_get_site_info`
- Error handling: failures are logged; DB operations continue to avoid blocking.

### Future Integrations (placeholders)

- `src/services/aws/` directory reserved for AWS (S3, Cognito) helpers.

---

## Flow Diagrams

### User Creation

```
Client
  │ POST /api/users
  ▼
Controller (userController)
  │ Validate payload, role
  ▼
Service (userService)
  │ BEGIN transaction
  │ Hash password
  │ IF syncToMoodle → moodleService.createUser()
  │ INSERT INTO users …
  │ COMMIT
  ▼
Response { success, data }
```

### User Update

```
Client → Controller → Service
  │
  ├─ Fetch existing user
  ├─ Build dynamic UPDATE statement
  ├─ IF Moodle linked AND name/email changed → moodleService.updateUser()
  └─ Return updated user
```

### User Deletion

```
Client → Controller → Service
  │
  ├─ Fetch user
  ├─ Soft delete (is_active = false)
  └─ IF Moodle linked → moodleService.deleteUser()
```

---

## Configuration

Environment variables (see `docker-compose.yml`):

| Variable       | Description                        | Default                     |
|----------------|------------------------------------|-----------------------------|
| `PORT`         | API port                           | `5000`                      |
| `DB_HOST`      | PostgreSQL host                    | `bridge-db` (docker)        |
| `DB_USER`      | PostgreSQL user                    | `bridgeuser`                |
| `DB_PASS`      | PostgreSQL password                | `bridgepass`                |
| `DB_NAME`      | Database name                      | `bridgelearn`               |
| `DB_PORT`      | PostgreSQL port                    | `5432`                      |
| `MOODLE_URL`   | Moodle base URL                    | `http://moodle-app:8080`    |
| `MOODLE_TOKEN` | Moodle REST token                  | _(required)_                |
| `CORS_ORIGINS` | Comma-separated allowed origins    | `http://localhost:3000,…`   |

---

## Future Enhancements

1. **Authentication & RBAC**: add JWT middleware, admin-only endpoints.
2. **Validation Layer**: introduce zod/joi schemas for payload validation.
3. **Logging & Tracing**: structured logs, correlation IDs, APM hooks.
4. **Error Handling**: central error middleware with typed errors.
5. **Pagination Metadata**: include `limit`, `offset`, `next` links in responses.
6. **Background Jobs**: queue for Moodle sync retries.
7. **Testing**: unit tests for services and integration tests for routes.
8. **Rate Limiting**: protect endpoints from abuse.

---

**Status**: Architecture reflects the current state of `backend/src` after the user management + Moodle integration work (November 2025). Update this document as new modules or services are added.


