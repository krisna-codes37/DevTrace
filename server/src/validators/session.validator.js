import { z } from 'zod';

const sessionStatus = z.enum(['OPEN', 'IN_PROGRESS', 'SOLVED', 'ARCHIVED']);
const sessionSeverity = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid MongoDB ObjectId');

const sessionFields = {
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(10000).optional(),
  errorMessage: z.string().trim().max(10000).optional(),
  technology: z.string().trim().max(100).optional(),
  projectName: z.string().trim().max(200).optional(),
  environment: z.string().trim().max(200).optional(),
  severity: sessionSeverity.optional(),
  status: sessionStatus.optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(50).optional(),
  rootCause: z.string().trim().max(10000).optional(),
  solution: z.string().trim().max(10000).optional(),
  lessonLearned: z.string().trim().max(10000).optional(),
  solvedAt: z.coerce.date().nullable().optional(),
};

export const createSessionSchema = z.object(sessionFields).strict();

export const updateSessionSchema = z
  .object(sessionFields)
  .partial()
  .strict()
  .refine((values) => Object.keys(values).length > 0, {
    message: 'At least one session field is required',
  });

export const sessionIdSchema = z.object({ id: objectId }).strict();

export const listSessionsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(200).optional(),
    status: sessionStatus.optional(),
    technology: z.string().trim().max(100).optional(),
    severity: sessionSeverity.optional(),
    sort: z
      .enum(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'title', '-title'])
      .default('-createdAt'),
  })
  .strict();

export const sessionEnums = {
  sessionStatus,
  sessionSeverity,
};
