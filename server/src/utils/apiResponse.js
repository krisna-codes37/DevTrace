export function sendError(response, statusCode, code, message, details = []) {
  return response.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
  });
}
