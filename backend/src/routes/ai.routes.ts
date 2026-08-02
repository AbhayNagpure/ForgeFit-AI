import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';

const router = Router();

// Route: POST /api/chat
router.post('/chat', AIController.handleChat);

export default router;
