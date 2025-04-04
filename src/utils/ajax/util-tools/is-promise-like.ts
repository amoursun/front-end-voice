/**
 * @file isPromiseLike
 * @author gyl
 */
export function isPromiseLike<T = any>(maybePromise: unknown): maybePromise is Promise<T> {
    return (typeof maybePromise === 'object' || typeof maybePromise === 'function')
        && typeof (maybePromise as Promise<unknown>).then === 'function'
        && typeof (maybePromise as Promise<unknown>).finally === 'function';
}
