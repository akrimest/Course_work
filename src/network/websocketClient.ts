import { Transport } from './transport';
import { HostMessage, ClientMessage } from './protocol';
import { validateHostMessage } from './validator';

export class WebSocketTransport implements Transport<ClientMessage, HostMessage> {
  private socket: WebSocket | null = null;
  private messageHandlers: Array<(message: HostMessage) => void> = [];
  private openHandlers: Array<() => void> = [];
  private closeHandlers: Array<(code: number, reason: string) => void> = [];
  private errorHandlers: Array<(error: unknown) => void> = [];

  constructor(private url: string) {}

  connect(): void {
    if (this.socket) return;
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('open', () => this.openHandlers.forEach((h) => h()));
    this.socket.addEventListener('close', (evt) => this.closeHandlers.forEach((h) => h(evt.code, evt.reason)));
    this.socket.addEventListener('error', (evt) => this.errorHandlers.forEach((h) => h(evt)));
    this.socket.addEventListener('message', (evt) => {
      const data = safeParse(evt.data);
      if (validateHostMessage(data)) {
        this.messageHandlers.forEach((h) => h(data));
      }
    });
  }

  close(): void {
    if (!this.socket) return;
    this.socket.close();
    this.socket = null;
  }

  send(message: ClientMessage): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify(message));
  }

  onMessage(handler: (message: HostMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onOpen(handler: () => void): void {
    this.openHandlers.push(handler);
  }

  onClose(handler: (code: number, reason: string) => void): void {
    this.closeHandlers.push(handler);
  }

  onError(handler: (error: unknown) => void): void {
    this.errorHandlers.push(handler);
  }
}

function safeParse(input: unknown): unknown {
  if (typeof input !== 'string') return null;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}
