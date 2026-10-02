import { prisma } from '../lib/prisma';
import { getTool, type ToolContext, validateToolArguments } from './fitness.tools';

export type AgentAction = {
  type: string;
  data?: unknown;
  pendingAction?: {
    id: string;
    toolName: string;
    description: string;
    arguments: unknown;
    expiresAt: string;
  };
};

export async function executeAgentTool(
  name: string,
  rawArguments: unknown,
  context: ToolContext,
  options: { approved?: boolean } = {},
) {
  const tool = getTool(name);
  const args = validateToolArguments(name, rawArguments);
  const startedAt = Date.now();

  if (tool.requiresApproval && !options.approved) {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const description = tool.approvalDescription?.(args) ?? `Approve ${name}?`;
    const pending = await prisma.pendingAction.create({
      data: {
        userId: context.userId,
        conversationId: context.conversationId,
        toolName: name,
        arguments: JSON.parse(JSON.stringify(args)) as never,
        description,
        expiresAt,
      },
    });
    await prisma.toolExecution.create({
      data: {
        agentRunId: context.runId,
        name,
        arguments: JSON.parse(JSON.stringify(args)) as never,
        status: 'awaiting_approval',
        requiresApproval: true,
        durationMs: Date.now() - startedAt,
      },
    });
    return {
      result: { message: `Approval required: ${description}`, data: { pendingActionId: pending.id } },
      action: {
        type: 'APPROVAL_REQUIRED',
        pendingAction: { id: pending.id, toolName: name, description, arguments: args, expiresAt: expiresAt.toISOString() },
      } satisfies AgentAction,
    };
  }

  try {
    const result = await tool.execute(args, context);
    await prisma.toolExecution.create({
      data: {
        agentRunId: context.runId,
        name,
        arguments: JSON.parse(JSON.stringify(args)) as never,
        result: JSON.parse(JSON.stringify(result)) as never,
        status: 'completed',
        requiresApproval: Boolean(tool.requiresApproval),
        durationMs: Date.now() - startedAt,
      },
    });
    return {
      result,
      action: result.event ? ({ type: result.event, data: result.data } satisfies AgentAction) : undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Tool execution failed';
    await prisma.toolExecution.create({
      data: {
        agentRunId: context.runId,
        name,
        arguments: JSON.parse(JSON.stringify(args)) as never,
        result: { error: message },
        status: 'failed',
        requiresApproval: Boolean(tool.requiresApproval),
        durationMs: Date.now() - startedAt,
      },
    });
    throw error;
  }
}
