import { ZodError } from 'zod';

import { ApiError } from '../utils/apiError.js';
import { sendError } from '../utils/apiResponse.js';

export function errorHandler(error, _request, response, _next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return sendError(response, 400, 'INVALID_JSON', 'Request body contains invalid JSON');
  }

  if (error instanceof ZodError) {
    return sendError(
      response,
      400,
      'VALIDATION_ERROR',
      'Request validation failed',
      error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
    );
  }

  if (error instanceof ApiError) {
    return sendError(response, error.statusCode, error.code, error.message, error.details);
  }

  console.error(error);
  return sendError(response, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
}
