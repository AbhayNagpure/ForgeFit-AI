import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Route: POST /api/chat
router.post('/chat', requireAuth, AIController.handleChat);

export default router;
