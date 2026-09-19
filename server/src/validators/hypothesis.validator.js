import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid MongoDB ObjectId');
const hypothesisStatus = z.enum(['UNTESTED', 'TESTING', 'CONFIRMED', 'REJECTED', 'INCONCLUSIVE']);

export const sessionHypothesisParamsSchema = z
  .object({
    sessionId: objectId,
  })
  .strict();

export const hypothesisParamsSchema = z
  .object({
    id: objectId,
  })
  .strict();

const hypothesisFields = {
  description: z.string().trim().min(1, 'Description is required').max(10000),
  reasoning: z.string().trim().max(10000).optional(),
  confidence: z.coerce.number().min(0).max(100),
  status: hypothesisStatus,
};

export const createHypothesisSchema = z.object(hypothesisFields).strict();

export const updateHypothesisSchema = z
  .object(hypothesisFields)
  .partial()
  .strict()
  .refine((values) => Object.keys(values).length > 0, {
    message: 'At least one hypothesis field is required',
  });

export { hypothesisStatus };
