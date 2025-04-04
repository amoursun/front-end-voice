/**
 * @file coding
 * @author gyl
 */

// see babel-plugins/dev-expression/README.md
// which is use to make tree-shaking dev-only dead-code reliable
export const __DEV__ = process.env.NODE_ENV !== 'production';

export function isDev() {
    return process.env.NODE_ENV !== 'production';
}

let warned: {
    [key: string]: string | boolean;
} = {};

export function resetWarned() {
    warned = {};
}

export function codeWarning(assert: boolean, message: string, ...args: string[]) {
    if (!assert && message) {
        let argIdx = 0;
        console.error(`Warning: ${message.replace(/%s/g, () => args[argIdx++])}`);
    }
}

export function codeWarningOnce(assert: boolean, message: string, ...args: string[]) {
    if (!warned[message]) {
        codeWarning(assert, message, ...args);
        warned[message] = !assert;
    }
}

