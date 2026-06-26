/**
 * Bot Memory
 *
 * Persists every action to a JSONL file and recalls similar past spots
 * so the strategy can annotate reasoning and tilt borderline decisions.
 *
 * Similarity is determined by: street × position × board-texture × hand-strength.
 */

import { createReadStream, existsSync } from 'node:fs';
import { open } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import type { BoardTexture, HandStrength, LegalAction, MemoryEntry, MemoryHint } from './types.js';

const DEFAULT_MAX_ENTRIES = 1_000;
const RANK_VALUE: Readonly<Record<string, number>> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  T: 10, J: 11, Q: 12, K: 13, A: 14,
};

function rankOf(card: string): string {
  const t = String(card).trim().toUpperCase();
  return t.startsWith('10') ? 'T' : t.slice(0, 1);
}

function suitOf(card: string): string {
  return String(card).trim().slice(-1).toLowerCase();
}

export function boardTexture(board: string[]): BoardTexture {
  if (!board || board.length === 0) return 'none';
  const ranks = board.map(rankOf);
  const suits = board.map(suitOf);
  const isPaired = ranks.some((r, i) => ranks.indexOf(r) !== i);
  if (isPaired) return 'paired';
  const suitCounts = suits.reduce<Record<string, number>>((acc, s) => {
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  const hasMultipleSameSuit = Object.values(suitCounts).some((n) => n >= 2);
  return hasMultipleSameSuit ? 'wet' : 'dry';
}

export function handStrength(cards: string[]): HandStrength {
  if (!cards || cards.length !== 2) return 'trash';
  const ranks = cards.map(rankOf);
  const vals = ranks.map((r) => RANK_VALUE[r] ?? 0).sort((a, b) => b - a);
  const isPair = vals[0] === vals[1];
  if (isPair && vals[0] >= RANK_VALUE['J']) return 'premium';
  if (isPair && vals[0] >= RANK_VALUE['7']) return 'medium';
  if (vals[0] === RANK_VALUE['A'] && vals[1] >= RANK_VALUE['Q']) return 'premium';
  if (vals[0] >= RANK_VALUE['Q'] && vals[1] >= RANK_VALUE['T']) return 'medium';
  if (vals[0] === RANK_VALUE['A']) return 'medium';
  return 'trash';
}

function isSimilar(
  entry: MemoryEntry,
  street: string,
  position: string,
  texture: BoardTexture,
  strength: HandStrength,
): boolean {
  if (!entry.street || !entry.position) return false;
  return (
    entry.street.toLowerCase() === street.toLowerCase() &&
    entry.position === position &&
    boardTexture(entry.board ?? []) === texture &&
    handStrength(entry.your_cards ?? []) === strength
  );
}

export class BotMemory {
  private entries: MemoryEntry[] = [];
  readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Load up to maxEntries recent lines from the JSONL file.
   * Silently skips malformed lines.
   */
  async load(maxEntries = DEFAULT_MAX_ENTRIES): Promise<void> {
    if (!existsSync(this.filePath)) {
      console.log(`[memory] file not found at ${this.filePath} — starting fresh`);
      return;
    }

    const lines: string[] = [];
    const rl = createInterface({
      input: createReadStream(this.filePath, { encoding: 'utf8' }),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const trimmed = line.trim();
      if (trimmed) lines.push(trimmed);
    }

    const recent = lines.slice(-maxEntries);
    this.entries = recent.flatMap((line) => {
      try {
        return [JSON.parse(line) as MemoryEntry];
      } catch {
        return [];
      }
    });

    console.log(`[memory] loaded ${this.entries.length} entries from ${this.filePath}`);
  }

  /**
   * Append one entry to the in-memory buffer and to the JSONL file.
   * The file is opened in append mode ('a'), so writeFile writes only
   * the new line rather than truncating.
   */
  async record(entry: MemoryEntry): Promise<void> {
    this.entries.push(entry);
    const line = JSON.stringify(entry) + '\n';
    const fh = await open(this.filePath, 'a');
    try {
      await fh.write(line, null, 'utf8');
    } finally {
      await fh.close();
    }
  }

  /**
   * Find past decisions in the same spot (street × position × texture × strength)
   * and return the most-frequent action as a hint.
   */
  recall(street: string, position: string, board: string[], cards: string[]): MemoryHint {
    const texture = boardTexture(board);
    const strength = handStrength(cards);
    const similar = this.entries.filter((e) =>
      isSimilar(e, street, position, texture, strength),
    );

    if (similar.length === 0) {
      return { matchCount: 0, topAction: null, texture, strength };
    }

    const freq: Partial<Record<LegalAction, number>> = {};
    for (const e of similar) {
      if (e.action) {
        freq[e.action] = (freq[e.action] ?? 0) + 1;
      }
    }

    const entries = Object.entries(freq);
    if (entries.length === 0) {
      return { matchCount: similar.length, topAction: null, texture, strength };
    }

    const topAction = entries.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0][0] as LegalAction;

    return { matchCount: similar.length, topAction, texture, strength };
  }

  get size(): number {
    return this.entries.length;
  }
}
