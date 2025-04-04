export enum ErrorPathType {
    Forbidden = '403',
    NotFound = '404',
    BadServer = '500',
    NoAuth = 'no-auth',
}
export const ErrorPathMatch = {
    [ErrorPathType.Forbidden]: '403',
    [ErrorPathType.NotFound]: '404',
    [ErrorPathType.BadServer]: 'error',
    [ErrorPathType.NoAuth]: 'no-access',
} as const;

export type ErrorPathNameType = keyof typeof ErrorPathMatch;
