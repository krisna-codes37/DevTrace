# DevTrace Architecture

## Purpose

DevTrace is a developer debugging journal. A debugging session records the path from an observed problem to a tested explanation and a reusable lesson:

`Problem -> Hypothesis -> Experiment -> Evidence -> Root Cause -> Solution -> Lesson Learned`

The first implementation phase is intentionally limited to the application foundation. AI-assisted debugging is out of scope.

## Repository Boundaries

```text
client/                 React single-page application
  src/
server/                 Express HTTP API
  src/
docs/                 Product and technical contracts
```

The root package uses npm workspaces so frontend and backend dependencies remain independently owned while sharing one development entry point.

## Runtime Responsibilities

### Client

- React and Vite provide the browser application and build pipeline.
- React Router owns URL-level navigation and protected-route boundaries.
- Axios is the HTTP transport.
- TanStack Query owns server-state fetching, caching, invalidation, and pagination state.
- React Hook Form and Zod handle form state and client-side validation.
- Tailwind CSS, Lucide React, and Recharts provide the visual system and dashboard visualization primitives.

### Server

- Express exposes versioned JSON endpoints under `/api/v1`.
- Mongoose owns MongoDB schemas, indexes, and persistence.
- JWT provides stateless access authentication; bcryptjs hashes passwords.
- Zod validates request bodies, query parameters, and environment configuration at the boundary.
- Helmet, CORS, and express-rate-limit are applied as baseline HTTP protections.

## Request Flow

1. The client sends an authenticated request to the API.
2. Express applies security middleware and identifies the route.
3. Authentication middleware verifies the JWT and attaches the user identity.
4. Route handlers validate input with Zod and delegate persistence to a service/repository boundary.
5. The server returns a consistent JSON success or error envelope.
6. TanStack Query updates the relevant client cache after reads or mutations.

User ownership is enforced on every session and nested-resource query. Client route guards are a usability layer, not an authorization boundary.

## Initial Module Direction

The server should be organized around `config`, `middleware`, `modules/auth`, `modules/sessions`, `modules/hypotheses`, `modules/experiments`, and shared error/validation utilities. Keep controllers thin and keep database access out of route definitions.

The client should separate application routing, query/API clients, shared UI primitives, and feature areas for authentication, sessions, hypotheses, experiments, and dashboard views.

## Non-Goals

- No AI provider, prompt pipeline, or generated diagnosis.
- No mock API layer replacing the Express backend.
- No real-time collaboration, notifications, billing, or team administration in the initial scope.
