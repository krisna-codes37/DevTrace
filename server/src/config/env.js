import 'dotenv/config';
import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().trim().min(1).optional(),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  JWT_SECRET: z.string().trim().min(32).optional(),
  JWT_EXPIRES_IN: z.string().trim().min(1).default('15m'),
  AI_API_KEY: z.string().trim().min(1).optional(),
  AI_MODEL: z.string().trim().min(1).default('gemini-3.5-flash-lite'),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const details = parsedEnvironment.error.issues.map(
    (issue) => `${issue.path.join('.')}: ${issue.message}`,
  );
  throw new Error(`Invalid environment configuration: ${details.join('; ')}`);
}

export const env = parsedEnvironment.data;
