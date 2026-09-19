import { z } from 'zod';

export const sessionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(10000, 'Description is too long'),
  errorMessage: z.string().max(10000, 'Error message is too long'),
  technology: z.string().max(100, 'Technology is too long'),
  projectName: z.string().max(200, 'Project name is too long'),
  environment: z.string().max(200, 'Environment is too long'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'SOLVED', 'ARCHIVED']),
  tags: z.array(z.string().min(1).max(50)).max(50, 'You can add up to 50 tags'),
  rootCause: z.string().max(10000, 'Root cause is too long'),
  solution: z.string().max(10000, 'Solution is too long'),
  lessonLearned: z.string().max(10000, 'Lesson learned is too long'),
});

export const emptySession = {
  title: '',
  description: '',
  errorMessage: '',
  technology: '',
  projectName: '',
  environment: '',
  severity: 'MEDIUM',
  status: 'OPEN',
  tags: [],
  rootCause: '',
  solution: '',
  lessonLearned: '',
};
