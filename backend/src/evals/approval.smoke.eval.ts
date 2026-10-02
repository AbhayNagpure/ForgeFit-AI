import { randomUUID } from 'node:crypto';
import { executeAgentTool } from '../agent/agent.executor';
import { prisma } from '../lib/prisma';

async function main() {
  const user = await prisma.user.create({
    data: { email: `forgefit-approval-eval-${randomUUID()}@example.invalid`, password: 'not-a-login-account', name: 'Approval Evaluation' },
  });
  try {
    const [conversation, workout] = await Promise.all([
      prisma.conversation.create({ data: { userId: user.id, title: 'Approval evaluation' } }),
      prisma.workout.create({ data: { userId: user.id, name: 'Temporary evaluation workout', type: 'Strength', duration: 30 } }),
    ]);
    const run = await prisma.agentRun.create({
      data: { userId: user.id, conversationId: conversation.id, requestId: randomUUID(), model: 'approval-eval', input: 'delete workout' },
    });
    const context = { userId: user.id, conversationId: conversation.id, runId: run.id };
    const gated = await executeAgentTool('deleteWorkout', { workoutId: workout.id }, context);
    const existsBeforeApproval = Boolean(await prisma.workout.findUnique({ where: { id: workout.id } }));
    await executeAgentTool('deleteWorkout', { workoutId: workout.id }, context, { approved: true });
    const existsAfterApproval = Boolean(await prisma.workout.findUnique({ where: { id: workout.id } }));
    const passed = gated.action?.type === 'APPROVAL_REQUIRED' && existsBeforeApproval && !existsAfterApproval;
    console.log(`Approval was required: ${gated.action?.type === 'APPROVAL_REQUIRED'}`);
    console.log(`Workout preserved before approval: ${existsBeforeApproval}`);
    console.log(`Workout deleted after approval: ${!existsAfterApproval}`);
    if (!passed) process.exitCode = 1;
  } finally {
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
