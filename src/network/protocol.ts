import { ClientId, GameSnapshot, Role, RoomCode } from '../game/state';
import { EventEnvelope } from '../game/events';

export type ClientEventType =
  | 'CLIENT_HELLO'
  | 'JOIN_REQUEST'
  | 'ROLE_REQUEST'
  | 'PLAYER_READY'
  | 'ANSWER_SUBMIT'
  | 'REQUEST_SNAPSHOT'
  | 'PING';

export type HostEventType =
  | 'HOST_WELCOME'
  | 'JOIN_ACCEPTED'
  | 'JOIN_REJECTED'
  | 'STATE_PATCH'
  | 'STATE_SNAPSHOT'
  | 'QUESTION'
  | 'ROUND_TIMER'
  | 'ERROR'
  | 'PONG';

export interface BaseMessage<TType extends string, TPayload> {
  type: TType;
  id: string;
  ts: number;
  from?: ClientId;
  payload: TPayload;
}

export type ClientMessage =
  | BaseMessage<'CLIENT_HELLO', { name: string; version: string }>
  | BaseMessage<'JOIN_REQUEST', { roomCode: RoomCode; name: string; requestedRole?: Role }>
  | BaseMessage<'ROLE_REQUEST', { role: Role }>
  | BaseMessage<'PLAYER_READY', { ready: boolean }>
  | BaseMessage<'ANSWER_SUBMIT', { questionId: string; answer: 'A' | 'B' | 'C'; clientTime: number }>
  | BaseMessage<'REQUEST_SNAPSHOT', { lastEventSeq: number }>
  | BaseMessage<'PING', { nonce: string }>
  ;

export type HostMessage =
  | BaseMessage<'HOST_WELCOME', { clientId: ClientId; roomCode: RoomCode }>
  | BaseMessage<'JOIN_ACCEPTED', { clientId: ClientId; role: Role; snapshot: GameSnapshot }>
  | BaseMessage<'JOIN_REJECTED', { reason: string }>
  | BaseMessage<'STATE_PATCH', { events: EventEnvelope[] }>
  | BaseMessage<'STATE_SNAPSHOT', { snapshot: GameSnapshot }>
  | BaseMessage<'QUESTION', { questionId: string; text: string; answers: [string, string, string] }>
  | BaseMessage<'ROUND_TIMER', { round: string; remainingMs: number }>
  | BaseMessage<'ERROR', { message: string }>
  | BaseMessage<'PONG', { nonce: string }>
  ;

export type AnyMessage = ClientMessage | HostMessage;
