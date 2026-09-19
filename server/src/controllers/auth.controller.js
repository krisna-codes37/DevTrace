import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import { ConflictError, UnauthorizedError } from '../utils/apiError.js';
import { assertJwtConfigured, createAccessToken } from '../utils/auth.js';
import { serializeUser } from '../utils/userSerializer.js';

const passwordSaltRounds = 12;

export async function register(request, response) {
  assertJwtConfigured();
  const { name, email, password } = request.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ConflictError('An account with that email already exists');
  }

  const passwordHash = await bcrypt.hash(password, passwordSaltRounds);

  try {
    const user = await User.create({ name, email, passwordHash });
    const token = createAccessToken(user._id);

    return response.status(201).json({
      success: true,
      data: {
        user: serializeUser(user),
        token,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ConflictError('An account with that email already exists');
    }

    throw error;
  }
}

export async function login(request, response) {
  assertJwtConfigured();
  const { email, password } = request.body;
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new UnauthorizedError('INVALID_CREDENTIALS', 'Email or password is incorrect');
  }

  const token = createAccessToken(user._id);

  return response.json({
    success: true,
    data: {
      user: serializeUser(user),
      token,
    },
  });
}

export function getCurrentUser(request, response) {
  return response.json({
    success: true,
    data: {
      user: serializeUser(request.user),
    },
  });
}

export function logout(_request, response) {
  return response.json({
    success: true,
    message: 'Logged out successfully. Discard the access token on the client.',
  });
}
