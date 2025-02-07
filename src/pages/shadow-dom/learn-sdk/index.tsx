/* eslint-disable no-underscore-dangle */
import {getLNSDKContext} from '../common/common-learn-sdk';
import {LearntingInstance} from './core';

function initLNSDKInstance() {
    const context = getLNSDKContext();

    context._sdkBuildTime = '@${sdkBuildTime}$@';

    const learnSDKInstance = new LearntingInstance({});
    context.__resolve(learnSDKInstance);
}

function main() {
    initLNSDKInstance();
}

void main();
