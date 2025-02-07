
export type EventEmitterFunc = (...args: unknown[]) => unknown;

export class EventEmitter {
    private readonly _events = new Map<string, Set<EventEmitterFunc>>();

    on(name: string, fn: EventEmitterFunc) {
        const eventSet = this._events.get(name);
        if (eventSet) {
            eventSet.add(fn);
        } else {
            const events = new Set<() => void>();
            events.add(fn);

            this._events.set(name, events);
        }
    }

    off(name: string, fn: EventEmitterFunc) {
        const eventSet = this._events.get(name);
        if (eventSet) {
            eventSet.delete(fn);
        }
    }

    emit(name: string, ...args: unknown[]) {
        const eventSet = this._events.get(name);
        if (eventSet) {
            eventSet.forEach((fn) => fn(...args));
        }
    }
}
