import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { ConfigurationError } from './apiError.js';

function getJwtSecret() {
  if (!env.JWT_SECRET) {
    throw new ConfigurationError(
      'JWT_SECRET is not configured. Set it in the environment before using authentication.',
    );
  }

  return env.JWT_SECRET;
}

export function assertJwtConfigured() {
  getJwtSecret();
}

export function createAccessToken(userId) {
  return jwt.sign({}, getJwtSecret(), {
    algorithm: 'HS256',
    expiresIn: env.JWT_EXPIRES_IN,
    subject: userId.toString(),
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
}
