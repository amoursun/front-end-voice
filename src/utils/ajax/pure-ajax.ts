/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * 这个存在原因: ajax.ts 里面处理了判断流文件(判断不完全)直接输出 流内容, 我们可能需要是解析流response header
 * 针对这个新创建一个, 专门处理流文件, 且可以根据 response 做文件名等拦截
 * - 不影响历史
 */

import {
    AxiosError,
    AxiosRequestConfig,
    createAjax,
} from './lib-ajax';
import {message} from 'antd';
import {urlUtils} from 'src/utils/util-url';
import {IS_DEV} from 'src/constants';
import {ErrorPathType} from 'src/constants/error';
import {AjaxInstance, ResponseJSON, isInvalidResponse} from './ajax';


export declare type AjaxStatus = number | string | boolean;
export const statusOK: AjaxStatus[] = ['200', 200, 'ok', 'true', true];
export const OK = 'ok';
interface ResponseAuthJSON extends Omit<ResponseJSON, 'code'> {
    msg?: string;
    code?: string | number;
    redirectUrl?: string;
}

export const genericSuccessHandler = (res: ResponseAuthJSON) => {
    const toastError = () => {
        message.error(res.message || res.msg || '请求失败', 1500);
    };
    if (IS_DEV) {
        toastError();
    }
    else if (res.status === ErrorPathType.NoAuth) {
        window.location.href = urlUtils.getPageLink(`/${ErrorPathType.NoAuth}`, {}, {entry: 'error'});
        message.error(res.message || '暂无权限');
    }
    else if ((res.code === 40001 || res.msg === 'not login') && res.redirectUrl) {
        window.location.href = res.redirectUrl;
    }
    else if (res.status === 'need-refresh') {
        window.location.reload();
    }
    else if (res.message || res.msg) {
        toastError();
    }

    return res;
};

export function createPureAjax(config: AxiosRequestConfig) {
    const decoratedCreateAjax = createAjax(config);
    decoratedCreateAjax.interceptors.response.use(
        // @ts-ignore
        response => {
            // console.log('response', response);
            // const data = (response.data || {}) as ResponseJSON;
            const data = response.data ?? {};
            /**
             * data.status: 最新接口标准 ok fail
             * data.code: 老接口标准 200 '200' ...
             * data.flag: 上传下载老接口标准  true false
             */
            const status = (data.status || data.code || data.flag) as string;
            // if (data.status !== 'ok') {
            // console.log('status', status);
            if (!statusOK.includes(status) && status) {
                genericSuccessHandler(data);
            }
            if (isInvalidResponse(response)) {
                data.status = 'invalid-response';
            }

            return {
                ...data,
                response,
            } as unknown as AjaxInstance;
        },
        (error: AxiosError | Error) => {
            return {
                status: 'request-failed',
                error,
            };
        });

    return decoratedCreateAjax;
}
