import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation Schemas using Zod for clean, strict input validation
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string(),
});

export class AuthController {
  
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validate incoming data
      const parsedData = signupSchema.safeParse(req.body);
      if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error.issues[0].message });
        return;
      }

      const { name, email, password } = parsedData.data;

      // 2. Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }

      // 3. Hash the password before saving to database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Create the user in the database
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        }
      });

      // 5. Generate a JWT token
      const token = jwt.sign(
        { userId: newUser.id }, 
        process.env.JWT_SECRET || 'fallback_secret_key', 
        { expiresIn: '7d' }
      );

      // 6. Send success response (excluding password)
      res.status(201).json({
        message: "User created successfully",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Login an existing user
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validate data
      const parsedData = loginSchema.safeParse(req.body);
      if (!parsedData.success) {
        res.status(400).json({ error: "Invalid email or password format" });
        return;
      }

      const { email, password } = parsedData.data;

      // 2. Find user in the database
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // 3. Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // 4. Generate token
      const token = jwt.sign(
        { userId: user.id }, 
        process.env.JWT_SECRET || 'fallback_secret_key', 
        { expiresIn: '7d' }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get current logged-in user profile
   * GET /api/auth/me
   * Note: This route must be protected by the authMiddleware!
   */
  static async getMe(req: any, res: Response): Promise<void> {
    try {
      // req.user is attached by the authMiddleware
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Fetch the user from the database, excluding the password
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          goal: true,
          createdAt: true
        }
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error("GetMe error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
