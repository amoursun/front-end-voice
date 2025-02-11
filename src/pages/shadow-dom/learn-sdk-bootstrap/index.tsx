/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import {createPromise} from '../common/create-promise';
// import {loadScript} from '../common/load-script';
import {
    getWindow,
} from '../common/common-learn-sdk';
import {
    LearnSDK_SetupOptions,
} from '../common/common-public-type';
import {getBaseURL} from './util-get-base-url';
import {mainSdk} from '../learn-sdk';

export function setupLearnSDK(
    opts: LearnSDK_SetupOptions
) {
    const {
        promise,
        resolve,
        reject,
    } = createPromise<unknown>();

    const getSDK = () => promise;

    const window = getWindow();

    if (window.__LearnSDK__) {
        // @log
        return window.__LearnSDK__;
    }

    window.__LearnSDK__ = {
        _bootstrapBuildTime: '@${bootstrapBuildTime}$@',

        // log 开关
        _logVisible: true,

        getSDK,
        __resolve: resolve,
        __reject: reject,
        options: opts,

        getBaseURL,
    };
    mainSdk();
    // @log
    // loadScript(
    //     // @todo: 更改此处配置
    //     getBaseURL() + '/dulearn/learn-sdk.js'
    // );


    return window.__LearnSDK__;
}
