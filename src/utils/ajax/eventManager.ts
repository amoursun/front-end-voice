export enum Status {
    ok = 'ok',
    fail = 'fail',
}

type FunctionType = (data?: unknown) => void;

export class EventManager {
    subscribers: Map<string, FunctionType[][]>;

    constructor() {
        this.subscribers = new Map(); // 存储事件和订阅者的关系
    }

    // 订阅事件
    subscribe(eventName: string, callback: FunctionType[]) {
        if (!this.subscribers.has(eventName)) {
            this.subscribers.set(eventName, []);
        }
        this.subscribers.get(eventName)?.push(callback);
    }

    // 取消订阅事件
    unsubscribe(eventName: string) {
        if (!this.subscribers.has(eventName)) {
            return;
        }

        this.subscribers.delete(eventName);
    }

    // 发布事件
    publish(eventName: string, data: Record<string, any>, status?: string) {
        if (this.subscribers.has(eventName)) {
            const callbacks = this.subscribers.get(eventName);
            callbacks?.forEach((callback) => {
                const [resolve, reject] = callback;
                if (status === Status.ok) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
            this.unsubscribe(eventName);
        }
    }
}
