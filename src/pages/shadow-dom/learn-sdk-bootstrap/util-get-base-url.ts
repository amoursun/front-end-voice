import {
    getWindow,
    BASE_LOCAL,
    BASE_DEV,
    BASE_PROD,
    BASE_UAT,
} from '../common/common-learn-sdk';

export function getBaseURL() {
    const context = getWindow().__LearnSDK__;
    if (!context) {
        console.error('__LearnSDK__ 为空, 是否没有 setup 呢?');
        return '';
    }

    const sdkEnv = context.options.sdkEnv;

    // @ts-ignore sdk env
    const Learn_SDK_ENV = window.Learn_SDK_ENV as SDK_ENV;
    if (Learn_SDK_ENV === 'local') {
        return BASE_LOCAL;
    }

    if (sdkEnv === 'dev') {
        return BASE_DEV;
    }

    if (sdkEnv === 'uat') {
        return BASE_UAT;
    }

    return BASE_PROD;
}
