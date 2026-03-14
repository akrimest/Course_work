import { ClientId, GameSnapshot, RoundType } from './state';
import { EventEnvelope, GameEvent } from './events';

export function createRoomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export function createEnvelope(seq: number, from: ClientId, event: GameEvent, now = Date.now()): EventEnvelope {
  return { seq, ts: now, from, event };
}

export function startRound(state: GameSnapshot, from: ClientId, round: RoundType, seq: number): EventEnvelope {
  return createEnvelope(seq, from, { type: 'ROUND_STARTED', round, startedAt: Date.now() });
}

export function endRound(state: GameSnapshot, from: ClientId, round: RoundType, seq: number): EventEnvelope {
  return createEnvelope(seq, from, { type: 'ROUND_ENDED', round, endedAt: Date.now() });
}

export function updatePrize(from: ClientId, amount: number, seq: number): EventEnvelope {
  return createEnvelope(seq, from, { type: 'PRIZE_UPDATED', amount });
}
