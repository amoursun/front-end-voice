/* eslint-disable no-underscore-dangle */
import {getLNSDKContext} from '../common/common-learn-sdk';
import {LearnInstance} from './core';

function initLNSDKInstance() {
    const context = getLNSDKContext();
    debugger;
    context._sdkBuildTime = '@${sdkBuildTime}$@';

    const learnSDKInstance = new LearnInstance({});
    context.__resolve(learnSDKInstance);
}

export function mainSdk() {
    initLNSDKInstance();
}

// void mainSdk();
