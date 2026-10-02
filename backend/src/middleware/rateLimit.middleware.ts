import type { NextFunction, Request, Response } from 'express';

type Entry = { count: number; resetAt: number };
const requests = new Map<string, Entry>();

export function rateLimit({ windowMs, max }: { windowMs: number; max: number }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const current = requests.get(key);

    if (!current || current.resetAt <= now) {
      requests.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= max) {
      res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
      res.status(429).json({ error: 'Too many requests. Please try again shortly.', code: 'RATE_LIMITED' });
      return;
    }

    current.count += 1;
    next();
  };
}
