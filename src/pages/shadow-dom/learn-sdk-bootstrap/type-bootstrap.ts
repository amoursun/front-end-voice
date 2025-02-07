/* eslint-disable camelcase */
import {LearnSDK_SetupOptions, Public_LearnSDK_SetupReturnResult} from '../common/common-public-type';

export interface TypeWindowWithSDK {
    [x: string]: any;
    __LearnSDK__: LearnSDK_SetupReturns;
}

export interface LearnSDKError extends Error {
    errorType?: string;
}

/**
 * @private
 * 这些是 sdk 内部使用的部分, 可以忽略
 */
export interface Private_LearnSDK_SetupReturnResult {
    /**
     * @private
     */
    _bootstrapBuildTime: string;

    /**
     * log 开关
     * @private
     */
    _logVisible: boolean;

    /**
     * @private
     */
    _sdkBuildTime?: string;

    /**
     * ======== 以下由 bootstrap 负责 ========
     */
    /**
     * @private
     */
    __resolve: (sdk: any) => void;

    /**
     * @private
     */
    __reject: (error: LearnSDKError) => void;

    /**
     * @private
     */
    options: LearnSDK_SetupOptions;

    /**
     * @private
     */
    getBaseURL: (requestedFrom?: 'sdk') => string;
}

export type LearnSDK_SetupReturns =
    & Public_LearnSDK_SetupReturnResult
    & Private_LearnSDK_SetupReturnResult;
