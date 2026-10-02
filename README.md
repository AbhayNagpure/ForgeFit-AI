# ForgeFit AI

ForgeFit is a data-aware fitness coaching application. The product combines a React training dashboard with a bounded, tool-using coaching agent. Stored facts and deterministic calculations remain in application code; the language model decides when a validated tool is useful.

## Architecture

```text
React client
  -> Express API + authentication
    -> Agent orchestrator (bounded loop, retries, context assembly)
      -> Gemini model
      -> Validated fitness tools
        -> Prisma + MongoDB
      -> Curated fitness retrieval
    -> Agent runs, tool traces, conversations, memories, approvals
```

The agent implementation is intentionally framework-light. The loop in `backend/src/agent/agent.service.ts` exposes the fundamental model → tool → observation → model pattern without hiding it behind an agent framework.

## Implemented agent concepts

- Server-owned conversation memory with bounded context
- Explicit long-term user memories, separate from chat history
- Strict Zod tool argument validation
- Multi-turn tool execution with a maximum-turn limit
- Retry, timeout, idempotency, and graceful tool-error feedback
- User-scoped authorization in every data-changing tool
- Human approval gate for destructive workout deletion
- Curated knowledge retrieval and source-aware coaching instructions
- Run and tool-execution traces with latency and token fields
- Deterministic progress calculations outside the LLM
- Retrieval evaluation fixtures and domain unit tests

## Local development

1. Copy `backend/.env.example` to `backend/.env` and fill the values.
2. In `backend`, run `npm install`, `npx prisma generate`, and `npm run db:push`.
3. Run `npm run dev` in `backend`.
4. Run `npm install` and `npm run dev` in `frontend`.

The Vite development server proxies `/api` to `http://localhost:5000`.

## Verification

```bash
cd backend
npm run build
npm test
npm run eval
npm run eval:live # optional: calls the configured model and cleans up its synthetic user
npm run eval:approval # optional: verifies the destructive-action approval gate

cd ../frontend
npm run build
npm run lint
```

## Safety boundary

ForgeFit is coaching software, not a medical diagnostic system. The agent is instructed to avoid diagnoses and to escalate alarming pain or injury symptoms. Nutrition values inferred from natural language are stored as estimates with confidence metadata. Destructive actions pause for explicit approval.
