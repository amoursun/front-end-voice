type TypeList = string | number | boolean | undefined | null | void | Record<string, unknown>;
export declare function tuple<T extends TypeList[]>(...args: T): T;
