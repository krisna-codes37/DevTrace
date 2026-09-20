import mongoose from 'mongoose';

import { env } from './env.js';
import { ConfigurationError } from '../utils/apiError.js';

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    throw new ConfigurationError(
      'MONGODB_URI is not configured. Set it in the environment before connecting to MongoDB.',
    );
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: env.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('[database] MongoDB connection failed', error);
    throw new ConfigurationError(
      'MongoDB connection failed. Check MONGODB_URI and confirm MongoDB is reachable.',
    );
} 
}
