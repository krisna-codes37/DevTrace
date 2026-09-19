export function getHealth(_request, response) {
  return response.json({
    success: true,
    message: 'DevTrace API is running',
  });
}
