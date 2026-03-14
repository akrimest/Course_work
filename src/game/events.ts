import { ClientId, GameSnapshot, RoundType, Role } from './state';

export type GameEvent =
  | { type: 'PLAYER_JOINED'; playerId: ClientId; name: string; role: Role }
  | { type: 'PLAYER_LEFT'; playerId: ClientId }
  | { type: 'ROLE_ASSIGNED'; playerId: ClientId; role: Role }
  | { type: 'PLAYER_READY'; playerId: ClientId; ready: boolean }
  | { type: 'ROUND_STARTED'; round: RoundType; startedAt: number }
  | { type: 'ROUND_ENDED'; round: RoundType; endedAt: number }
  | { type: 'PRIZE_UPDATED'; amount: number }
  | { type: 'POSITION_UPDATED'; playerId: ClientId; position: number }
  | { type: 'PLAYER_STATUS'; playerId: ClientId; status: 'idle' | 'ready' | 'playing' | 'eliminated' | 'disconnected' };

export interface EventEnvelope {
  seq: number;
  ts: number;
  from: ClientId;
  event: GameEvent;
}

export function applyEvent(state: GameSnapshot, envelope: EventEnvelope): GameSnapshot {
  if (envelope.seq <= state.lastEventSeq) return state;

  const next: GameSnapshot = {
    ...state,
    players: state.players.map((p) => ({ ...p })),
    lastEventSeq: envelope.seq,
  };

  const { event } = envelope;

  switch (event.type) {
    case 'PLAYER_JOINED': {
      if (next.players.some((p) => p.id === event.playerId)) return next;
      next.players.push({
        id: event.playerId,
        name: event.name,
        role: event.role,
        status: 'idle',
        money: 0,
        position: 0,
        connected: true,
      });
      return next;
    }
    case 'PLAYER_LEFT': {
      const target = next.players.find((p) => p.id === event.playerId);
      if (target) target.connected = false;
      return next;
    }
    case 'ROLE_ASSIGNED': {
      const target = next.players.find((p) => p.id === event.playerId);
      if (target) target.role = event.role;
      return next;
    }
    case 'PLAYER_READY': {
      const target = next.players.find((p) => p.id === event.playerId);
      if (target) target.status = event.ready ? 'ready' : 'idle';
      return next;
    }
    case 'ROUND_STARTED': {
      next.phase = event.round;
      next.round = event.round;
      return next;
    }
    case 'ROUND_ENDED': {
      next.phase = event.round === 'finalChase' ? 'results' : next.phase;
      return next;
    }
    case 'PRIZE_UPDATED': {
      next.prizePool = event.amount;
      return next;
    }
    case 'POSITION_UPDATED': {
      const target = next.players.find((p) => p.id === event.playerId);
      if (target) target.position = event.position;
      return next;
    }
    case 'PLAYER_STATUS': {
      const target = next.players.find((p) => p.id === event.playerId);
      if (target) target.status = event.status;
      return next;
    }
    default:
      return next;
  }
}

export function applyEvents(state: GameSnapshot, events: EventEnvelope[]): GameSnapshot {
  return events.reduce(applyEvent, state);
}
