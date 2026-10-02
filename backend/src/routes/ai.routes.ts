import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../lib/errors';
import { rateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// Route: POST /api/chat
router.post('/chat', requireAuth, rateLimit({ windowMs: 60_000, max: 20 }), asyncHandler(AIController.handleChat));
router.get('/conversations', requireAuth, asyncHandler(AIController.listConversations));
router.post('/conversations', requireAuth, asyncHandler(AIController.createConversation));
router.get('/conversations/:id/messages', requireAuth, asyncHandler(AIController.getConversationMessages));
router.get('/agent-actions', requireAuth, asyncHandler(AIController.listPendingActions));
router.post('/agent-actions/:id/resolve', requireAuth, asyncHandler(AIController.resolveAction));
router.get('/agent-runs/:id', requireAuth, asyncHandler(AIController.getAgentRun));

export default router;
