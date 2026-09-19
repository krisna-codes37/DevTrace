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
