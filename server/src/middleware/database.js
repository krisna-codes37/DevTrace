import mongoose from 'mongoose';

import { ConfigurationError } from '../utils/apiError.js';

export function requireDatabase(_request, _response, next) {
  if (mongoose.connection.readyState !== 1) {
    return next(
      new ConfigurationError(
        'Database is unavailable. Configure MONGODB_URI and confirm MongoDB is reachable.',
      ),
    );
  }

  return next();
}
