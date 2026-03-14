export type MessageHandler<T> = (message: T) => void;

export interface Transport<TOutgoing, TIncoming> {
  connect(): void;
  close(): void;
  send(message: TOutgoing): void;
  onMessage(handler: MessageHandler<TIncoming>): void;
  onOpen(handler: () => void): void;
  onClose(handler: (code: number, reason: string) => void): void;
  onError(handler: (error: unknown) => void): void;
}
