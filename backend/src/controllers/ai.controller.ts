import type { Response } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { AuthRequest } from '../middleware/auth.middleware';
import { AgentService } from '../agent/agent.service';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';
import { executeAgentTool } from '../agent/agent.executor';

const chatSchema = z.object({
  message: z.string().trim().min(1).max(5000),
  conversationId: z.string().optional(),
  requestId: z.string().uuid().optional(),
});

export class AIController {
  static async handleChat(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;
    const input = chatSchema.parse(req.body);
    const response = await AgentService.generateResponse({ userId, ...input });
    res.json(response);
  }

  static async listConversations(req: AuthRequest, res: Response) {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user!.userId }, orderBy: { updatedAt: 'desc' }, take: 20,
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    res.json({ conversations });
  }

  static async createConversation(req: AuthRequest, res: Response) {
    const conversation = await prisma.conversation.create({ data: { userId: req.user!.userId, title: 'New coaching session' } });
    res.status(201).json({ conversation });
  }

  static async getConversationMessages(req: AuthRequest, res: Response) {
    const conversation = await prisma.conversation.findFirst({ where: { id: req.params.id as string, userId: req.user!.userId } });
    if (!conversation) throw new AppError(404, 'Conversation not found', 'CONVERSATION_NOT_FOUND');
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId: conversation.id }, orderBy: { createdAt: 'asc' }, take: 100,
    });
    res.json({ conversation, messages });
  }

  static async listPendingActions(req: AuthRequest, res: Response) {
    const actions = await prisma.pendingAction.findMany({
      where: { userId: req.user!.userId, status: 'pending', expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ actions });
  }

  static async getAgentRun(req: AuthRequest, res: Response) {
    const run = await prisma.agentRun.findFirst({
      where: { id: req.params.id as string, userId: req.user!.userId },
      select: {
        id: true, model: true, status: true, turnCount: true, inputTokens: true, outputTokens: true,
        durationMs: true, error: true, createdAt: true, completedAt: true,
        toolExecutions: { select: { id: true, name: true, status: true, durationMs: true, requiresApproval: true, createdAt: true } },
      },
    });
    if (!run) throw new AppError(404, 'Agent run not found', 'RUN_NOT_FOUND');
    res.json({ run });
  }

  static async resolveAction(req: AuthRequest, res: Response) {
    const input = z.object({ decision: z.enum(['approve', 'reject']) }).parse(req.body);
    const pending = await prisma.pendingAction.findFirst({ where: { id: req.params.id as string, userId: req.user!.userId } });
    if (!pending) throw new AppError(404, 'Pending action not found', 'ACTION_NOT_FOUND');
    if (pending.status !== 'pending') throw new AppError(409, 'This action has already been resolved', 'ACTION_RESOLVED');
    if (pending.expiresAt < new Date()) {
      await prisma.pendingAction.update({ where: { id: pending.id }, data: { status: 'expired', resolvedAt: new Date() } });
      throw new AppError(410, 'This action has expired', 'ACTION_EXPIRED');
    }

    if (input.decision === 'reject') {
      await prisma.pendingAction.update({ where: { id: pending.id }, data: { status: 'rejected', resolvedAt: new Date() } });
      res.json({ status: 'rejected', message: 'Action cancelled. No changes were made.' });
      return;
    }

    const run = await prisma.agentRun.create({
      data: { userId: req.user!.userId, conversationId: pending.conversationId, requestId: randomUUID(), model: 'deterministic-tool-approval', input: `Approved action ${pending.id}` },
    });
    const execution = await executeAgentTool(
      pending.toolName, pending.arguments,
      { userId: req.user!.userId, runId: run.id, conversationId: pending.conversationId ?? '' },
      { approved: true },
    );
    await Promise.all([
      prisma.pendingAction.update({ where: { id: pending.id }, data: { status: 'approved', resolvedAt: new Date() } }),
      prisma.agentRun.update({ where: { id: run.id }, data: { status: 'completed', output: execution.result.message, turnCount: 1, completedAt: new Date() } }),
    ]);
    res.json({ status: 'approved', result: execution.result, action: execution.action });
  }
}
