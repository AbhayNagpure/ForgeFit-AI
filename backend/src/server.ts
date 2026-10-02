import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.routes';
import authRoutes from './routes/auth.routes';
import workoutRoutes from './routes/workout.routes';
import personalRecordRoutes from './routes/personalRecord.routes';
import bodyMetricRoutes from './routes/bodyMetric.routes';
import progressRoutes from './routes/progress.routes';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './lib/errors';

dotenv.config();

const app = express();
const PORT = env.PORT;

// Global Middleware
app.disable('x-powered-by');
app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()), credentials: true }));
app.use(express.json({ limit: '256kb' }));
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.send('ForgeFit API is running smoothly!');
});

// Register Feature Routes
app.use('/api', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/personal-records', personalRecordRoutes);
app.use('/api/body-metrics', bodyMetricRoutes);
app.use('/api/progress', progressRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
