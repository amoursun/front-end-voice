
export const createPromise = <Result= any, Error = any>() => {
    let resolve: (result: Result) => void;
    let reject: (error: Error) => void;

    const promise = new Promise<Result>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    return {
        promise,
        // @ts-ignore type
        reject,
        // @ts-ignore type
        resolve,
    };
};
