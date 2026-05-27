'use strict';

const { io } = require('socket.io-client');

const site = process.env.NIGHTLY_SITE || 'https://sopolabs.ai';
const apiKey = process.env.NIGHTLY_API_KEY;
const name = process.env.NIGHTLY_NAME || 'my-agent-v1';
const role = process.env.NIGHTLY_ROLE || 'qualifier';

if (!apiKey) {
  console.error('Missing NIGHTLY_API_KEY (treat it like a password).');
  process.exit(1);
}

function pickFallbackAction(legalActions, toCall) {
  if (Array.isArray(legalActions) && legalActions.includes('check')) {
    return 'check';
  }
  if (toCall > 0 && Array.isArray(legalActions) && legalActions.includes('call')) {
    return 'call';
  }
  if (Array.isArray(legalActions) && legalActions.includes('call')) {
    return 'call';
  }
  if (Array.isArray(legalActions) && legalActions.includes('fold')) {
    return 'fold';
  }
  if (Array.isArray(legalActions) && legalActions.length > 0) {
    return legalActions[0];
  }
  return 'check';
}

function coerceDecisionToLegal(decision, turn) {
  const legalActions = Array.isArray(turn.legal_actions) ? turn.legal_actions : [];
  const legalSet = new Set(legalActions);

  let action = decision.action;
  let amount = decision.amount;

  if (!legalSet.has(action)) {
    action = pickFallbackAction(legalActions, Number(turn.to_call) || 0);
    amount = undefined;
  }

  if (action === 'bet' || action === 'raise') {
    const stack = Math.max(0, Number(turn.your_stack) || 0);
    const min = Math.max(0, Number(turn.min_raise) || 0);

    let desired = Number.isFinite(Number(amount)) ? Number(amount) : stack;
    desired = Math.max(min, Math.min(stack, desired));
    amount = desired;
  } else {
    amount = undefined;
  }

  return { action, amount };
}

function isPocketPair(cards) {
  return (
    Array.isArray(cards) && cards.length === 2 && cards[0]?.[0] && cards[0][0] === cards[1]?.[0]
  );
}

const socket = io(site, {
  auth: { role, apiKey, name },
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected as', socket.id, 'to', site);
});

socket.on('connect_error', (err) => {
  console.error('Connect error:', err?.message || err);
});

socket.on('qualifier_turn', (t) => {
  const startedAt = Date.now();

  // Default: fold to bets, check when free.
  let action = (Number(t.to_call) || 0) > 0 ? 'fold' : 'check';
  let amount;

  // Example rule: preflop pocket pair -> shove (all-in).
  if (t.street === 'PREFLOP' && isPocketPair(t.your_cards)) {
    const shoveAction = (Number(t.to_call) || 0) > 0 ? 'raise' : 'bet';
    if (Array.isArray(t.legal_actions) && t.legal_actions.includes(shoveAction)) {
      action = shoveAction;
      amount = Number(t.your_stack) || 0;
    }
  }

  const decision = coerceDecisionToLegal({ action, amount }, t);
  const reasoning =
    `${decision.action}${decision.amount != null ? ` ${decision.amount}` : ''}`.slice(0, 120);

  socket.emit('qualifier_action', {
    action: decision.action,
    amount: decision.amount,
    hand_id: t.hand_id,
    reasoning,
  });

  const elapsedMs = Date.now() - startedAt;
  if (elapsedMs > 8000) {
    console.warn('Slow turn handler:', elapsedMs, 'ms');
  }
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
