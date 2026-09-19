export function validate(schema, source = 'body') {
  return (request, _response, next) => {
    const result = schema.safeParse(request[source]);

    if (!result.success) {
      return next(result.error);
    }

    request[source] = result.data;
    return next();
  };
}
