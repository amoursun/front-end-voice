export function safeInvoke<TArgs extends any[], TResult>(
    func: ((...arg: TArgs) => TResult) | undefined | null,
    ...arg: TArgs
): TResult | void {
    if (func && typeof func === 'function') {
        return func(...arg);
    }

    return undefined;
}
