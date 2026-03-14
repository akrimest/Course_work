import { ClientMessage, HostMessage } from './protocol';

const isString = (value: unknown): value is string => typeof value === 'string';
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export function validateClientMessage(input: unknown): input is ClientMessage {
  if (!isObject(input)) return false;
  if (!isString(input.type) || !isString(input.id) || !isNumber(input.ts)) return false;
  if (!('payload' in input) || !isObject(input.payload)) return false;

  switch (input.type) {
    case 'CLIENT_HELLO':
      return isString(input.payload.name) && isString(input.payload.version);
    case 'JOIN_REQUEST':
      return isString(input.payload.roomCode) && isString(input.payload.name);
    case 'ROLE_REQUEST':
      return isString(input.payload.role);
    case 'PLAYER_READY':
      return isBoolean(input.payload.ready);
    case 'ANSWER_SUBMIT':
      return isString(input.payload.questionId) && isString(input.payload.answer) && isNumber(input.payload.clientTime);
    case 'REQUEST_SNAPSHOT':
      return isNumber(input.payload.lastEventSeq);
    case 'PING':
      return isString(input.payload.nonce);
    default:
      return false;
  }
}

export function validateHostMessage(input: unknown): input is HostMessage {
  if (!isObject(input)) return false;
  if (!isString(input.type) || !isString(input.id) || !isNumber(input.ts)) return false;
  if (!('payload' in input) || !isObject(input.payload)) return false;

  switch (input.type) {
    case 'HOST_WELCOME':
      return isString(input.payload.clientId) && isString(input.payload.roomCode);
    case 'JOIN_ACCEPTED':
      return isString(input.payload.clientId) && isString(input.payload.role) && isObject(input.payload.snapshot);
    case 'JOIN_REJECTED':
      return isString(input.payload.reason);
    case 'STATE_PATCH':
      return Array.isArray(input.payload.events);
    case 'STATE_SNAPSHOT':
      return isObject(input.payload.snapshot);
    case 'QUESTION':
      return isString(input.payload.questionId) && isString(input.payload.text) && Array.isArray(input.payload.answers);
    case 'ROUND_TIMER':
      return isString(input.payload.round) && isNumber(input.payload.remainingMs);
    case 'ERROR':
      return isString(input.payload.message);
    case 'PONG':
      return isString(input.payload.nonce);
    default:
      return false;
  }
}
