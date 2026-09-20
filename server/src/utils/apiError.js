export class ApiError extends Error {
  constructor(statusCode, code, message, details = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ConfigurationError extends ApiError {
  constructor(message, details = []) {
    super(503, 'CONFIGURATION_ERROR', message, details);
  }
}

export class ConflictError extends ApiError {
  constructor(message, details = []) {
    super(409, 'CONFLICT', message, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(code, message, details = []) {
    super(401, code, message, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message, details = []) {
    super(404, 'NOT_FOUND', message, details);
  }
}

export class AiUnavailableError extends ApiError {
  constructor(message = 'AI analysis is currently unavailable. Please try again later.', details = []) {
    super(503, 'AI_UNAVAILABLE', message, details);
  }
}
