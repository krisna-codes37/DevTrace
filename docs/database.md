# DevTrace Database Design

MongoDB is the system of record. Mongoose models should use timestamps and validate enum values at the persistence boundary. All user-owned records must include ownership checks in their query conditions.

## User

| Field                     | Type     | Notes                                       |
| ------------------------- | -------- | ------------------------------------------- |
| `_id`                     | ObjectId | Primary key                                 |
| `name`                    | String   | Required display name                       |
| `email`                   | String   | Required, normalized, unique                |
| `passwordHash`            | String   | Required; never returned by API serializers |
| `avatar`                  | String   | Optional avatar URL or identifier           |
| `createdAt` / `updatedAt` | Date     | Managed timestamps                          |

Index `email` uniquely.

## DebugSession

| Field                     | Type     | Notes                                       |
| ------------------------- | -------- | ------------------------------------------- |
| `_id`                     | ObjectId | Primary key                                 |
| `userId`                  | ObjectId | Required reference to User                  |
| `title`                   | String   | Required                                    |
| `description`             | String   | Problem context                             |
| `errorMessage`            | String   | Observed error or symptom                   |
| `technology`              | String   | Primary technology for filtering and charts |
| `projectName`             | String   | Optional project context                    |
| `environment`             | String   | Optional runtime context                    |
| `severity`                | String   | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`         |
| `status`                  | String   | `OPEN`, `IN_PROGRESS`, `SOLVED`, `ARCHIVED` |
| `tags`                    | String[] | Searchable labels                           |
| `rootCause`               | String   | Completed diagnosis                         |
| `solution`                | String   | Applied fix                                 |
| `lessonLearned`           | String   | Reusable takeaway                           |
| `solvedAt`                | Date     | Set when status becomes `SOLVED`            |
| `createdAt` / `updatedAt` | Date     | Managed timestamps                          |

Index `{ userId: 1, updatedAt: -1 }` for the dashboard and session list. Add text/search indexes only after query behavior is finalized.

## Hypothesis

| Field                     | Type     | Notes                                                          |
| ------------------------- | -------- | -------------------------------------------------------------- |
| `_id`                     | ObjectId | Primary key                                                    |
| `sessionId`               | ObjectId | Required parent session                                        |
| `description`             | String   | Required hypothesis                                            |
| `reasoning`               | String   | Supporting reasoning                                           |
| `confidence`              | Number   | Bounded confidence score                                       |
| `status`                  | String   | `UNTESTED`, `TESTING`, `CONFIRMED`, `REJECTED`, `INCONCLUSIVE` |
| `createdAt` / `updatedAt` | Date     | Managed timestamps                                             |

Index `{ sessionId: 1, createdAt: 1 }`.

## Experiment

| Field                     | Type     | Notes                                   |
| ------------------------- | -------- | --------------------------------------- |
| `_id`                     | ObjectId | Primary key                             |
| `hypothesisId`            | ObjectId | Required parent hypothesis              |
| `sessionId`               | ObjectId | Required denormalized session reference |
| `testDescription`         | String   | What was tested                         |
| `expectedResult`          | String   | Prediction                              |
| `actualResult`            | String   | Observation                             |
| `evidence`                | String   | Logs, links, or measurements            |
| `conclusion`              | String   | Effect on the hypothesis                |
| `createdAt` / `updatedAt` | Date     | Managed timestamps                      |

Index `{ hypothesisId: 1, createdAt: 1 }` and validate that the referenced hypothesis belongs to the same session.

## Relationship Rules

- One User owns many DebugSessions.
- One DebugSession owns many Hypotheses.
- One Hypothesis owns many Experiments.
- Experiments retain `sessionId` to make authorization and session-scoped reads explicit.
- Deleting a session must define a deliberate cascade policy for hypotheses and experiments before implementation. The API should not leave orphaned records.
