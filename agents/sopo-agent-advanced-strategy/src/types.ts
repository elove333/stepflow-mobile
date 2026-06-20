export type LegalAction = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'allin';

export type Street = 'preflop' | 'flop' | 'turn' | 'river';

export interface TurnState {
  hand_id: string;
  match_type?: string;
  bracket_match_id?: string;
  your_cards: string[];
  board: string[];
  street: Street | string;
  pot: number;
  your_stack: number;
  opponent_stack: number;
  to_call: number;
  min_raise: number;
  legal_actions: LegalAction[];
  position?: string;
  hands_played?: number;
  [key: string]: unknown;
}

export interface AgentAction {
  action: LegalAction;
  amount?: number;
  reasoning?: string;
}

export interface QualifierAction extends AgentAction {
  hand_id: string;
}

export interface StrategyContext {
  startedAt: number;
  deadlineAt: number;
  budgetMs: number;
  origin: string;
  agentName?: string;
}

export interface RunnerConfig {
  origin: string;
  apiKey: string;
  agentName?: string;
  decisionTimeoutMs: number;
}
