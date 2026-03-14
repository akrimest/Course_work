export type ClientId = string;
export type RoomCode = string;

export type Role = 'host' | 'chaser' | 'contestant';
export type PlayerStatus = 'idle' | 'ready' | 'playing' | 'eliminated' | 'disconnected';
export type RoundType = 'cashBuilder' | 'headToHead' | 'finalChase';
export type GamePhase = 'lobby' | 'cashBuilder' | 'headToHead' | 'finalChase' | 'results';

export interface Player {
  id: ClientId;
  name: string;
  role: Role;
  status: PlayerStatus;
  money: number;
  position: number;
  connected: boolean;
}

export interface GameSnapshot {
  roomCode: RoomCode;
  hostId: ClientId;
  seed: number;
  phase: GamePhase;
  round: RoundType | null;
  boardSize: number;
  prizePool: number;
  players: Player[];
  lastEventSeq: number;
}

export const DEFAULT_BOARD_SIZE = 22;

export function createInitialState(roomCode: RoomCode, hostId: ClientId, seed: number): GameSnapshot {
  return {
    roomCode,
    hostId,
    seed,
    phase: 'lobby',
    round: null,
    boardSize: DEFAULT_BOARD_SIZE,
    prizePool: 0,
    players: [],
    lastEventSeq: 0,
  };
}
