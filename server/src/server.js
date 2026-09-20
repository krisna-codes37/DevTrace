import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error(`[database] ${error.message}`);
  }

  app.listen(env.PORT, () => {
    console.log(`DevTrace API listening on port ${env.PORT}`);
  });
}

startServer();