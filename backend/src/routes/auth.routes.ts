import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

import { requireAuth } from '../middleware/auth.middleware';

// Route: POST /api/auth/register
router.post('/register', AuthController.register);

// Route: POST /api/auth/login
router.post('/login', AuthController.login);

// Route: GET /api/auth/me (Protected Route)
router.get('/me', requireAuth, AuthController.getMe);

export default router;
