export function validate(schema, source = 'body') {
  return (request, _response, next) => {
    const result = schema.safeParse(request[source]);

    if (!result.success) {
      return next(result.error);
    }

    // In Express 5, request.query is a read-only getter. Keep its validated
    // value separately instead of assigning to it and triggering a 500 error.
    if (source === 'query') {
      request.validatedQuery = result.data;
    } else {
      request[source] = result.data;
    }
    return next();
  };
}
