import User from '../models/User.js';
import { UnauthorizedError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/auth.js';

function getBearerToken(request) {
  const authorization = request.get('authorization');

  if (!authorization) {
    throw new UnauthorizedError('AUTH_TOKEN_MISSING', 'Authentication token is required');
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    throw new UnauthorizedError(
      'AUTH_TOKEN_MALFORMED',
      'Authentication token must use the Bearer scheme',
    );
  }

  return match[1];
}

export async function requireAuth(request, _response, next) {
  try {
    const token = getBearerToken(request);
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('AUTH_TOKEN_EXPIRED', 'Authentication token has expired');
      }

      if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
        throw new UnauthorizedError('AUTH_TOKEN_INVALID', 'Authentication token is invalid');
      }

      throw error;
    }

    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new UnauthorizedError('AUTH_TOKEN_INVALID', 'Authentication token is invalid');
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedError('AUTH_USER_NOT_FOUND', 'Authenticated user no longer exists');
    }

    request.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}
