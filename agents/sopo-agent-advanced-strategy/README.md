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

Do not commit `.env`.

## Practice Arena

Start the runner, then launch a Practice Arena hand in the Live Agent lane. The runner logs:

- `connected` when the socket is live
- `qualifier_registered` when SOPO accepts the runner
- `qualifier_turn` and `qualifier_action` during hands

## Commands

- `npm run build`
- `npm run test`
- `npm start`
