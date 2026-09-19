# DevTrace API Contract

The backend will expose JSON over `/api/v1`. Unless noted otherwise, protected endpoints require a valid bearer token:

```text
Authorization: Bearer <jwt>
```

This document defines the initial route shape only. It is not an implementation checklist for this setup phase.

## Response Conventions

Success responses return JSON data directly or inside a resource-specific object. Collection endpoints use:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

Errors use a stable shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

## Authentication

| Method | Path             | Auth | Purpose                                              |
| ------ | ---------------- | ---- | ---------------------------------------------------- |
| POST   | `/auth/register` | No   | Create an account and establish a session            |
| POST   | `/auth/login`    | No   | Authenticate with email and password                 |
| POST   | `/auth/logout`   | Yes  | Invalidate the current client session/token strategy |
| GET    | `/auth/me`       | Yes  | Return the current user                              |

Passwords are accepted only for register/login and are never returned.

## Debug Sessions

| Method | Path                   | Auth | Purpose                                            |
| ------ | ---------------------- | ---- | -------------------------------------------------- |
| GET    | `/sessions`            | Yes  | Search, filter, sort, and paginate owned sessions  |
| POST   | `/sessions`            | Yes  | Create a session                                   |
| GET    | `/sessions/:sessionId` | Yes  | Read a session with its hypotheses and experiments |
| PATCH  | `/sessions/:sessionId` | Yes  | Update session fields and lifecycle status         |
| DELETE | `/sessions/:sessionId` | Yes  | Delete a session and its owned nested records      |

Supported list query parameters should include `page`, `pageSize`, `search`, `status`, `severity`, `technology`, and `tag`. The server must clamp pagination values and reject unsupported enum values.

## Hypotheses

| Method | Path                              | Auth | Purpose                                            |
| ------ | --------------------------------- | ---- | -------------------------------------------------- |
| POST   | `/sessions/:sessionId/hypotheses` | Yes  | Add a hypothesis to an owned session               |
| PATCH  | `/hypotheses/:hypothesisId`       | Yes  | Update hypothesis reasoning, confidence, or status |
| DELETE | `/hypotheses/:hypothesisId`       | Yes  | Delete a hypothesis and its experiments            |

Reading hypotheses is included in the session detail response initially.

## Experiments

| Method | Path                                    | Auth | Purpose                                  |
| ------ | --------------------------------------- | ---- | ---------------------------------------- |
| POST   | `/hypotheses/:hypothesisId/experiments` | Yes  | Add an experiment to an owned hypothesis |
| PATCH  | `/experiments/:experimentId`            | Yes  | Update test results and conclusion       |
| DELETE | `/experiments/:experimentId`            | Yes  | Delete an experiment                     |

## Dashboard

| Method | Path                 | Auth | Purpose                                                               |
| ------ | -------------------- | ---- | --------------------------------------------------------------------- |
| GET    | `/dashboard/summary` | Yes  | Return totals, statuses, technology distribution, and recent sessions |

Dashboard aggregation must be scoped to the authenticated user.

## Status and Error Expectations

- `400` for malformed or invalid request data.
- `401` for missing or invalid authentication.
- `403` when an authenticated user lacks access to a resource.
- `404` when an owned resource does not exist.
- `409` for conflicts such as a duplicate email.
- `429` when rate limits are exceeded.
- `500` for unexpected server failures without leaking internal details.
