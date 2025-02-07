import {TypeWindowWithSDK} from '../learn-sdk-bootstrap/type-bootstrap';

export function getWindow(): TypeWindowWithSDK {
    // @ts-ignore return window
    return window;
}

export function getLNSDKContext() {
    return getWindow().__LearnSDK__;
}

export function getLNSDK() {
    return getLNSDKContext().getSDK();
}

export const BASE_LOCAL = 'http://localhost:8899';

export const BASE_DEV = 'http://duxue.learn.com:8624';

export const BASE_UAT = 'http://preonline.learn.com';

export const BASE_PROD = 'http://learn.com';
