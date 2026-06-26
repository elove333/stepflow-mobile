# SOPO live agent runner

Runnable SOPO Live Agent workspace for the external Socket.IO runner.

## Setup

```bash
cd agents/sopo-agent-advanced-strategy
npm install
cp .env.example .env
# set SOPO_API_KEY and optional AGENT_NAME
npm run build
npm start
```

## Environment

- `SOPO_API_KEY` required for the live runner
- `SOPO_ORIGIN` defaults to `https://sopolabs.ai`
- `AGENT_NAME` optional display name
- `DECISION_TIMEOUT_MS` defaults to `7500`
- `MANAGEMENT_TOKEN` reserved for future management API flows and is not used by the runner yet
- `BOT_MEMORY_PATH` path to the JSONL hand-history file (default: `bot-memory.jsonl` in cwd)

Do not commit `.env`.

## Bot Memory

The runner loads `bot-memory.jsonl` at startup and appends every decision it makes.
At decision time it looks up the last 1 000 entries for hands with the same
**street × position × board-texture × hand-strength** and passes the most-frequent
past action as a hint to `decideAction`. The strategy uses that hint to:

- annotate reasoning with `[mem:Nx top=action]` (≥ 3 matches)
- tilt borderline calls to fold when memory strongly suggests it (≥ 5 matches, top=fold)

## Practice Arena

Start the runner, then launch a Practice Arena hand in the Live Agent lane. The runner logs:

- `connected` when the socket is live
- `qualifier_registered` when SOPO accepts the runner
- `qualifier_turn` and `qualifier_action` during hands

## Commands

- `npm run build`
- `npm run test`
- `npm start`
