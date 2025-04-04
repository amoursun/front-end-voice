/**
 * @file ajax
 * @author wujun07
 * @owner wujun07:2020-04-20
 */


import axios, {AxiosRequestConfig} from 'axios';
import {__DEV__, codeWarning, isEqual, pick} from '../util-tools';
import {AjaxError, AjaxInstance, AjaxRequestConfig, RequestRecord} from './extended-types';

const allPendingRequestsRecord: RequestRecord[] = [];

function isSameRequest(config: AxiosRequestConfig, comparedConfig: AxiosRequestConfig) {
    const comparisonProps: Array<keyof AxiosRequestConfig> = [
        'url',
        'method',
        'params',
    ];

    return isEqual(pick(config, comparisonProps), pick(comparedConfig, comparisonProps));
}

export function createAjax<T = any, Config extends AjaxRequestConfig = AjaxRequestConfig>(config?: Config) {

    function removePendingRequestRecord(config?: Config) {
        allPendingRequestsRecord.forEach((item, index) => {
            if (item.config === config) {
                allPendingRequestsRecord.splice(index, 1);
            }
        });
    }

    const decoratedAjax = axios.create(config) as AjaxInstance<T, Config>;
    decoratedAjax.interceptors.response.use(
        response => {
            removePendingRequestRecord(response.config);
            return response;
        },
        (error: AjaxError<T, Config>) => {
            removePendingRequestRecord(error.config);
            return Promise.reject(error);
        });

    decoratedAjax.interceptors.request.use(function (config) {
        (allPendingRequestsRecord as Array<RequestRecord<Config>>).forEach(item => {
            const {couldBeCanceledBySameRequest = true} = item.config;
            if (couldBeCanceledBySameRequest && isSameRequest(item.config, config)) {
                item.cancel();
                removePendingRequestRecord(item.config);
                if (__DEV__) {
                    codeWarning(
                        false,
                        [
                            `${item.config.url!} 被后续相同求请求取消。`,
                            '可以通过 `couldBeCanceledBySameRequest` 选项将此默认行为取消或翻转。',
                            '详见 https://sack.weiyun.baoyu.com/main/libs/ajax#be-canceled-by-same',
                        ].join(' ')
                    );
                }
            }
        });

        // 取消请求
        config.cancelToken = new axios.CancelToken(function executor(cancel) {
            // 添加记录，记录请求的唯一值和取消方法
            allPendingRequestsRecord.push({
                config,
                cancel,
            });
        });

        return config;
    }, error => Promise.reject(error));

    return decoratedAjax;
}
