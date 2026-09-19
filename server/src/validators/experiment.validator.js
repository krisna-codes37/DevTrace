import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid MongoDB ObjectId');

const experimentFields = {
  testDescription: z.string().trim().min(1, 'Test description is required').max(10000),
  expectedResult: z.string().trim().max(10000).optional(),
  actualResult: z.string().trim().max(10000).optional(),
  evidence: z.string().trim().max(10000).optional(),
  conclusion: z.string().trim().max(10000).optional(),
};

export const experimentParentParamsSchema = z
  .object({
    hypothesisId: objectId,
  })
  .strict();

export const experimentParamsSchema = z
  .object({
    id: objectId,
  })
  .strict();

export const createExperimentSchema = z.object(experimentFields).strict();

export const updateExperimentSchema = z
  .object(experimentFields)
  .partial()
  .strict()
  .refine((values) => Object.keys(values).length > 0, {
    message: 'At least one experiment field is required',
  });
