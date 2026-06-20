import 'dotenv/config';
import { io, type Socket } from 'socket.io-client';
import { decideAction } from '../strategy.js';
import { fallbackAction, sanitizeAgentAction } from './actions.js';
import type { AgentAction, QualifierAction, RunnerConfig, StrategyContext, TurnState } from './types.js';

interface ServerToClientEvents {
  qualifier_registered: (payload: unknown) => void;
  mode_changed: (payload: unknown) => void;
  qualifier_turn: (turn: TurnState) => void;
}

interface ClientToServerEvents {
  qualifier_action: (action: QualifierAction) => void;
}

const DEFAULT_ORIGIN = 'https://sopolabs.ai';
const DEFAULT_DECISION_TIMEOUT_MS = 7_500;
const MAX_DECISION_TIMEOUT_MS = 7_900;

function parseDecisionTimeoutMs(value: string | undefined): number {
  if (!value) return DEFAULT_DECISION_TIMEOUT_MS;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_DECISION_TIMEOUT_MS;
  return Math.min(Math.floor(parsed), MAX_DECISION_TIMEOUT_MS);
}

function readConfig(): RunnerConfig {
  const origin = process.env.SOPO_ORIGIN || DEFAULT_ORIGIN;
  const apiKey = process.env.SOPO_API_KEY;
  const agentName = process.env.AGENT_NAME || undefined;

  if (!apiKey) {
    console.error('Missing SOPO_API_KEY env var. Create a Live Agent key in SOPO and put it in .env.');
    process.exit(1);
  }

  return {
    origin,
    apiKey,
    agentName,
    decisionTimeoutMs: parseDecisionTimeoutMs(process.env.DECISION_TIMEOUT_MS),
  };
}

function describeTurn(turn: TurnState): string {
  return [
    `hand=${turn.hand_id}`,
    `street=${turn.street}`,
    `pot=${turn.pot}`,
    `to_call=${turn.to_call}`,
    `legal=${(turn.legal_actions || []).join(',')}`,
  ].join(' ');
}

async function decideWithTimeout(turn: TurnState, cfg: RunnerConfig): Promise<AgentAction> {
  const startedAt = Date.now();
  const context: StrategyContext = {
    startedAt,
    deadlineAt: startedAt + cfg.decisionTimeoutMs,
    budgetMs: cfg.decisionTimeoutMs,
    origin: cfg.origin,
    agentName: cfg.agentName,
  };

  let timeout: NodeJS.Timeout | undefined;
  const timeoutAction = new Promise<AgentAction>((resolve) => {
    timeout = setTimeout(() => {
      resolve(fallbackAction(turn, 'decision timeout'));
    }, cfg.decisionTimeoutMs);
  });

  try {
    return await Promise.race([Promise.resolve(decideAction(turn, context)), timeoutAction]);
  } catch (error) {
    console.log('[runner] strategy error:', (error as Error).message);
    return fallbackAction(turn, 'strategy error');
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function handleTurn(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  cfg: RunnerConfig,
  turn: TurnState,
): Promise<void> {
  console.log(`[runner] qualifier_turn ${describeTurn(turn)}`);
  const rawAction = await decideWithTimeout(turn, cfg);
  const action = sanitizeAgentAction(rawAction, turn);
  socket.emit('qualifier_action', action);
  console.log(
    `[runner] qualifier_action hand=${action.hand_id} action=${action.action}` +
      (action.amount ? ` amount=${action.amount}` : '') +
      (action.reasoning ? ` reason="${action.reasoning}"` : ''),
  );
}

function main(): void {
  const cfg = readConfig();
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(cfg.origin, {
    auth: {
      role: 'qualifier',
      apiKey: cfg.apiKey,
      name: cfg.agentName,
    },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    timeout: 5_000,
  });

  console.log(
    `[runner] connecting origin=${cfg.origin} name=${cfg.agentName || 'unnamed'} budget=${cfg.decisionTimeoutMs}ms`,
  );

  socket.on('connect', () => {
    console.log(`[runner] connected socket=${socket.id}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[runner] disconnected reason=${reason}`);
  });

  socket.on('connect_error', (error) => {
    console.log('[runner] connect_error:', error.message);
  });

  socket.on('qualifier_registered', (payload) => {
    console.log('[runner] qualifier_registered', JSON.stringify(payload));
  });

  socket.on('mode_changed', (payload) => {
    console.log('[runner] mode_changed', JSON.stringify(payload));
  });

  socket.on('qualifier_turn', (turn) => {
    void handleTurn(socket, cfg, turn);
  });
}

main();
