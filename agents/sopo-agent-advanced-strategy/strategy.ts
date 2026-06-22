import type { AgentAction, LegalAction, StrategyContext, TurnState } from './src/types.js';

const RANK_VALUE: Record<string, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

function legalSet(turn: TurnState): Set<LegalAction> {
  return new Set(turn.legal_actions || []);
}

function rankOf(card: string): string {
  const trimmed = String(card).trim().toUpperCase();
  return trimmed.startsWith('10') ? 'T' : trimmed.slice(0, 1);
}

function ranksOf(cards: string[]): string[] {
  return cards.map(rankOf).filter((rank) => rank in RANK_VALUE);
}

function isPocketPair(cards: string[]): boolean {
  const ranks = ranksOf(cards);
  return ranks.length === 2 && ranks[0] === ranks[1];
}

function isPremiumPreflop(cards: string[]): boolean {
  const ranks = ranksOf(cards);
  if (ranks.length !== 2) return false;

  const values = ranks.map((rank) => RANK_VALUE[rank]).sort((a, b) => b - a);
  if (isPocketPair(cards) && values[0] >= RANK_VALUE.J) return true;

  const [high, low] = values;
  return high === RANK_VALUE.A && low >= RANK_VALUE.Q;
}

function hasMadePair(turn: TurnState): boolean {
  if (isPocketPair(turn.your_cards)) return true;
  const holeRanks = new Set(ranksOf(turn.your_cards));
  return ranksOf(turn.board || []).some((rank) => holeRanks.has(rank));
}

function smallCall(turn: TurnState): boolean {
  const toCall = Number(turn.to_call) || 0;
  if (toCall <= 0) return false;
  const pot = Math.max(1, Number(turn.pot) || 0);
  const stack = Math.max(1, Number(turn.your_stack) || 0);
  return toCall <= Math.max(2, pot * 0.25) && toCall <= stack * 0.12;
}

function mediumCall(turn: TurnState): boolean {
  const toCall = Number(turn.to_call) || 0;
  if (toCall <= 0) return false;
  const pot = Math.max(1, Number(turn.pot) || 0);
  const stack = Math.max(1, Number(turn.your_stack) || 0);
  return toCall <= Math.max(4, pot * 0.4) && toCall <= stack * 0.22;
}

function betAmount(turn: TurnState, fraction: number): number {
  const pot = Math.max(1, Number(turn.pot) || 0);
  const minRaise = Math.max(1, Number(turn.min_raise) || 0);
  const stack = Math.max(1, Number(turn.your_stack) || 0);
  return Math.min(stack, Math.max(minRaise, Math.floor(pot * fraction)));
}

function shoveAmount(turn: TurnState): number {
  return Math.max(1, Math.floor(Number(turn.your_stack) || 0));
}

function firstLegal(turn: TurnState, actions: LegalAction[], reasoning: string): AgentAction {
  const legal = legalSet(turn);
  for (const action of actions) {
    if (legal.has(action)) {
      return { action, reasoning };
    }
  }
  return { action: 'fold', reasoning: 'no preferred legal action' };
}

export async function decideAction(turn: TurnState, context?: StrategyContext): Promise<AgentAction> {
  void context;

  const legal = legalSet(turn);
  const street = String(turn.street).toLowerCase();
  const canCheck = legal.has('check') && (Number(turn.to_call) || 0) <= 0;

  if (street === 'preflop') {
    if (isPremiumPreflop(turn.your_cards)) {
      if (legal.has('allin')) {
        return { action: 'allin', reasoning: 'premium preflop pressure' };
      }
      if (legal.has('raise')) {
        return {
          action: 'raise',
          amount: shoveAmount(turn),
          reasoning: 'premium preflop stack-sized raise shove',
        };
      }
      if (legal.has('bet')) {
        return {
          action: 'bet',
          amount: shoveAmount(turn),
          reasoning: 'premium preflop stack-sized bet shove',
        };
      }
      if (legal.has('call')) {
        return { action: 'call', reasoning: 'premium preflop continue' };
      }
    }

    if (canCheck) {
      return { action: 'check', reasoning: 'free preflop option' };
    }

    if (legal.has('call') && smallCall(turn)) {
      return { action: 'call', reasoning: 'small preflop price' };
    }

    return firstLegal(turn, ['fold', 'check', 'call'], 'weak preflop spot');
  }

  if (hasMadePair(turn)) {
    if (canCheck && legal.has('bet')) {
      return { action: 'bet', amount: betAmount(turn, 0.5), reasoning: 'made hand value bet' };
    }
    if (legal.has('call') && mediumCall(turn)) {
      return { action: 'call', reasoning: 'made hand continues' };
    }
  }

  if (canCheck) {
    return { action: 'check', reasoning: 'free card' };
  }

  if (legal.has('call') && smallCall(turn)) {
    return { action: 'call', reasoning: 'small price call' };
  }

  return firstLegal(turn, ['fold', 'check', 'call'], 'bad price without a hand');
}
