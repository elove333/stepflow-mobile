import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeAgentAction } from '../src/actions.js';
import { decideAction } from '../strategy.js';
import type { AgentAction, TurnState } from '../src/types.js';

function turn(overrides: Partial<TurnState> = {}): TurnState {
  return {
    hand_id: 'hand-1',
    match_type: 'practice',
    bracket_match_id: 'match-1',
    your_cards: ['As', 'Kh'],
    board: [],
    street: 'preflop',
    pot: 30,
    your_stack: 100,
    opponent_stack: 100,
    to_call: 10,
    min_raise: 20,
    legal_actions: ['fold', 'call', 'raise'],
    position: 'SB',
    hands_played: 1,
    ...overrides,
  };
}

test('starter strategy uses a stack-sized raise for premium preflop pressure', async () => {
  const action = await decideAction(turn({ your_cards: ['Ah', 'Ad'] }));
  assert.equal(action.action, 'raise');
  assert.equal(action.amount, 100);
  assert.match(action.reasoning || '', /stack-sized/);
});

test('starter strategy uses a stack-sized bet when raise is not legal', async () => {
  const action = await decideAction(
    turn({
      your_cards: ['Ah', 'Ad'],
      to_call: 0,
      legal_actions: ['check', 'bet'],
    }),
  );
  assert.equal(action.action, 'bet');
  assert.equal(action.amount, 100);
  assert.match(action.reasoning || '', /stack-sized/);
});

test('starter strategy only returns allin when allin is legal', async () => {
  const action = await decideAction(
    turn({
      your_cards: ['Ah', 'Ad'],
      legal_actions: ['fold', 'call', 'raise', 'allin'],
    }),
  );
  assert.equal(action.action, 'allin');
});

test('starter strategy checks when facing no bet', async () => {
  const action = await decideAction(
    turn({
      street: 'flop',
      your_cards: ['7h', '2d'],
      board: ['As', 'Kd', '4c'],
      to_call: 0,
      legal_actions: ['check', 'bet'],
    }),
  );
  assert.equal(action.action, 'check');
});

test('starter strategy calls small prices and folds bad prices', async () => {
  const small = await decideAction(
    turn({
      your_cards: ['8h', '7h'],
      to_call: 2,
      legal_actions: ['fold', 'call'],
    }),
  );
  assert.equal(small.action, 'call');

  const bad = await decideAction(
    turn({
      your_cards: ['8h', '7h'],
      to_call: 80,
      legal_actions: ['fold', 'call'],
    }),
  );
  assert.equal(bad.action, 'fold');
});

test('sanitizer preserves a legal sized raise and adds hand_id', () => {
  const action = sanitizeAgentAction(
    { action: 'raise', amount: 25, reasoning: 'value raise' } satisfies AgentAction,
    turn(),
  );
  assert.deepEqual(action, {
    hand_id: 'hand-1',
    action: 'raise',
    amount: 25,
    reasoning: 'value raise',
  });
});

test('sanitizer falls back check, then call, then fold', () => {
  assert.equal(
    sanitizeAgentAction(
      { action: 'banana' },
      turn({
        to_call: 0,
        legal_actions: ['check', 'bet'],
      }),
    ).action,
    'check',
  );

  assert.equal(
    sanitizeAgentAction(
      { action: 'banana' },
      turn({
        legal_actions: ['call', 'fold'],
      }),
    ).action,
    'call',
  );

  assert.equal(
    sanitizeAgentAction(
      { action: 'banana' },
      turn({
        legal_actions: ['fold'],
      }),
    ).action,
    'fold',
  );
});

test('sanitizer rejects invalid bet sizing', () => {
  const action = sanitizeAgentAction(
    { action: 'raise', amount: 5, reasoning: 'too small' },
    turn({ legal_actions: ['fold', 'call', 'raise'], min_raise: 20 }),
  );
  assert.equal(action.action, 'call');
});

test('sanitizer truncates long reasoning', () => {
  const action = sanitizeAgentAction(
    { action: 'call', reasoning: 'x'.repeat(200) },
    turn({ legal_actions: ['fold', 'call'] }),
  );
  assert.equal(action.action, 'call');
  assert.ok(action.reasoning);
  assert.ok(action.reasoning.length <= 120);
});
