# Monorepo scaffolding

This repository now includes top-level scaffolding for hosting multiple projects in one Git repository without blending them into one runtime.

## Layout

```text
apps/
  botpress/
  socketio-server/
agents/
  sopo-agent-advanced-strategy/
tools/
  codex/
```

## Rules

- Keep each project in its own directory with its own dependencies and runtime.
- Use the repository root for shared documentation, CI, and workspace-level scripts.
- Do not merge Botpress, socket.io server, Codex, or SOPO agent internals into the mobile app source tree.
- Import upstream forks into the scaffolded directories when you are ready to vendor them into this repository.

## Current state

- `apps/socketio-server` is a placeholder Node workspace.
- `apps/botpress` is a placeholder Node workspace.
- `tools/codex` is a placeholder directory for the Rust tool.
- `agents/sopo-agent-advanced-strategy` is a placeholder directory for the agent project.

The existing mobile app remains in place at the repository root for now. A future follow-up can move it under `apps/mobile` if you want a full workspace migration.
