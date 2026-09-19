import { sendError } from '../utils/apiResponse.js';

export function notFoundHandler(request, response) {
  return sendError(
    response,
    404,
    'NOT_FOUND',
    `Route not found: ${request.method} ${request.originalUrl}`,
  );
}
