import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    success: true,
    message: 'DevTrace API is running',
  });
});

export default app;
