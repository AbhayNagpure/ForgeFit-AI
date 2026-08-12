import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.routes';
import authRoutes from './routes/auth.routes';
import workoutRoutes from './routes/workout.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.send('ForgeFit API is running smoothly!');
});

// Register Feature Routes
app.use('/api', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});