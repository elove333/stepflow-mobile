import type { AgentAction, LegalAction, QualifierAction, TurnState } from './types.js';

const LEGAL_ACTIONS: ReadonlySet<string> = new Set([
  'fold',
  'check',
  'call',
  'bet',
  'raise',
  'allin',
]);

const FALLBACK_ORDER: LegalAction[] = ['check', 'call', 'fold'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toLegalAction(value: unknown): LegalAction | null {
  if (typeof value !== 'string') return null;
  const normalized = value.toLowerCase();
  return LEGAL_ACTIONS.has(normalized) ? (normalized as LegalAction) : null;
}

export function legalActionsFor(turn: TurnState): LegalAction[] {
  const out: LegalAction[] = [];
  for (const action of turn.legal_actions || []) {
    const normalized = toLegalAction(action);
    if (normalized && !out.includes(normalized)) {
      out.push(normalized);
    }
  }
  return out;
}

function cleanReasoning(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const compact = value.replace(/\s+/g, ' ').trim();
  if (!compact) return undefined;
  return compact.length <= 120 ? compact : compact.slice(0, 117) + '...';
}

function cleanAmount(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const amount = Math.floor(value);
  return amount > 0 ? amount : null;
}

function withReasoning(action: QualifierAction, reasoning: string | undefined): QualifierAction {
  return reasoning ? { ...action, reasoning } : action;
}

export function fallbackAction(turn: TurnState, reasoning = 'safe fallback'): QualifierAction {
  const legal = legalActionsFor(turn);
  for (const action of FALLBACK_ORDER) {
    if (legal.includes(action)) {
      return withReasoning({ hand_id: turn.hand_id, action }, reasoning);
    }
  }

  const firstLegal = legal[0];
  if (firstLegal) {
    return withReasoning({ hand_id: turn.hand_id, action: firstLegal }, reasoning);
  }

  return withReasoning({ hand_id: turn.hand_id, action: 'fold' }, reasoning);
}

export function sanitizeAgentAction(candidate: unknown, turn: TurnState): QualifierAction {
  if (!isRecord(candidate)) {
    return fallbackAction(turn, 'strategy returned no action');
  }

  const action = toLegalAction(candidate.action);
  const legal = legalActionsFor(turn);
  const reasoning = cleanReasoning(candidate.reasoning);

  if (!action || !legal.includes(action)) {
    return fallbackAction(turn, 'illegal action fallback');
  }

  if (action === 'bet' || action === 'raise') {
    const amount = cleanAmount(candidate.amount);
    const minAmount = Math.max(1, Math.floor(Number(turn.min_raise) || 0));
    const stack = Math.floor(Number(turn.your_stack) || 0);

    if (amount === null || amount < minAmount) {
      return fallbackAction(turn, 'invalid bet size fallback');
    }

    if (stack > 0 && amount > stack) {
      return legal.includes('allin')
        ? withReasoning({ hand_id: turn.hand_id, action: 'allin' }, reasoning)
        : fallbackAction(turn, 'oversized bet fallback');
    }

    return withReasoning({ hand_id: turn.hand_id, action, amount }, reasoning);
  }

  const cleanAction: AgentAction = { action };
  return withReasoning({ hand_id: turn.hand_id, ...cleanAction }, reasoning);
}
