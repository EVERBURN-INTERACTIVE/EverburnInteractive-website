/**
 * Minimal typed event emitter used by Scene, Actor, and Runtime for lifecycle
 * notifications. Listeners are removed on `off` or when `clear` is called.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<TEvents extends Record<string, any>> {
  private readonly listeners = new Map<keyof TEvents, Set<(payload: unknown) => void>>();

  on<K extends keyof TEvents>(event: K, listener: (payload: TEvents[K]) => void): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    const wrapped = listener as (payload: unknown) => void;
    set.add(wrapped);
    return () => set?.delete(wrapped);
  }

  off<K extends keyof TEvents>(event: K, listener: (payload: TEvents[K]) => void): void {
    this.listeners.get(event)?.delete(listener as (payload: unknown) => void);
  }

  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const listener of set) {
      listener(payload);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
