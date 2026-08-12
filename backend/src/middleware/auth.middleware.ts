import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include our custom user property
export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Extract the token from the "Authorization" header
  // Hint: It usually looks like "Bearer <token>"
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the JWT token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret_key'
    ) as { userId: string };

    // Attach the decoded userId to the request object so routes can access it
    req.user = decoded;

    
    
    // 3. Call next() to pass control to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }
};
