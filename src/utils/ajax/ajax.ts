import {
    createAjax as _createAjax,
    AjaxRequestConfig as AxiosRequestConfig,
    AxiosError,
    AxiosResponse,
    AxiosInstance,
    AxiosInterceptorManager,
    AjaxResponse,
} from './lib-ajax';
import {tuple} from './tuple.d';
import {genericSuccessHandler, statusOK} from './pure-ajax';
import {EventManager, Status} from './eventManager';

// @todo [sack] 待确定规范
// @todo 根据项目情况处置
const tupleResponseStatus = tuple(
    'ok',
    'fail',
    // 'warning',
    // 'need-login',
    // 'need-logout',
    'no-auth',
    'invalid-response',
    'request-failed',
    'need-refresh'
);

export interface Response<T = any, Config extends AxiosRequestConfig = IAjaxConfig> extends AjaxResponse<
    Omit<ResponseJSON<T>, 'response'>,
    Config
> {
}


export interface ResponseWrapper<T = any> extends ResponseJSON<T> {
}

/**
 * 项目中业务接口返回数据结构
 */
export interface ResponseJSON<Data = any, Config extends AxiosRequestConfig = IAjaxConfig> {
    status?: (typeof tupleResponseStatus)[number];
    data?: Data;
    message?: string;
    error?: AxiosError | Error;
    response: Response<Data, Config>;
    code?: string | number;
    redirectUrl?: string;
}

type FromAxiosInstance = Omit<AxiosInstance,
    | 'interceptors'
    | 'request'
    | 'get'
    | 'delete'
    | 'head'
    | 'options'
    | 'post'
    | 'put'
    | 'patch'
>;

interface AjaxInterceptors extends Omit<AxiosInstance['interceptors'], 'response'> {
    response: AxiosInterceptorManager<ResponseJSON>;
}

export interface AjaxInstance extends FromAxiosInstance {
    interceptors: AjaxInterceptors;
    request<Data = any, R = ResponseJSON<Data>>(config: AxiosRequestConfig): Promise<R>;
    get<Data = any, R = ResponseJSON<Data>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    delete<Data = any, R = ResponseJSON<Data>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    head<Data = any, R = ResponseJSON<Data>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    options<Data = any, R = ResponseJSON<Data>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    post<Data = any, R = ResponseJSON<Data>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    put<Data = any, R = ResponseJSON<Data>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    patch<Data = any, R = ResponseJSON<Data>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
}

export interface IAjaxConfig extends AxiosRequestConfig {
    /**
     * interceptors.request 中注入，非外部传入
     */
    requestKey?: string;
}

interface ICustomError {
    type?: Status;
    val?: any;
    config: IAjaxConfig;
    response?: AxiosResponse;
}

export function isInvalidResponse(response: Response): boolean {
    const {data} = response;
    return !data
        || typeof data !== 'object'
        || !Object.keys(data).length
        || !!(data.status && !tupleResponseStatus.includes(data.status));
}

const eventManager = new EventManager();
const pendingRequests: Map<string, boolean> = new Map();

export function createAjax(config: AxiosRequestConfig) {
    const decoratedAjax = _createAjax<ResponseJSON>(config);
    const {couldBeCanceledBySameRequest = true} = config;

    decoratedAjax.interceptors.request.use(
        async (config) => {
            /**
             * INFO：优化一个页面需要同时发出多个同样请求的情况，
             * 后面重复的request以第一个request的结果为准，
             * requestKey 增加 location.hash 保证每个页面的唯一性
             */
            if (!couldBeCanceledBySameRequest) {
                const {method, data, url, params} = config;
                const eventName = [
                    method,
                    url,
                    JSON.stringify(params),
                    JSON.stringify(data),
                    location.hash,
                ].join('&');
                if (pendingRequests.has(eventName)) {
                    /**
                     * 将相同的请求挂起，等待第一个请求完成后再进行数据返回
                     */
                    try {
                        const res = await new Promise((resolve, reject) => {
                            eventManager.subscribe(eventName, [resolve, reject]);
                        });
                        return Promise.reject({
                            val: res,
                            type: Status.ok,
                        });
                    } catch (error) {
                        return Promise.reject({
                            val: error,
                            type: Status.fail,
                        });
                    }
                } else {
                    pendingRequests.set(eventName, true);
                }

                return {
                    ...config,
                    requestKey: eventName,
                };
            }

            return config;
        },
        (error: any) => Promise.reject(error)
    );

    decoratedAjax.interceptors.response.use(
        // @ts-ignore 把结构改成我们习惯的 ResponseJson
        response => {
            const config: IAjaxConfig = response.config;
            const {requestKey} = config;
            const data = response.data || {};

            if (requestKey) {
                /** 挂起的请求进行数据处理 */
                pendingRequests.delete(requestKey);
                eventManager.publish(requestKey, data, data?.status);
            }

            // 处理 content-type: "application/octet-stream;"
            const headers = response.headers as {'content-type': string};
            const isOctetDate: boolean = headers['content-type'].includes('application/octet-stream');
            if (isOctetDate) {
                return data;
            }

            // status 不ok的集中在这里处理
            /**
             * data.status: 最新接口标准 ok fail
             * data.code: 老接口标准 200 '200' 40001 ...
             */
            const status = data.status || data.code;
            if (status && !statusOK.includes(status)) {
                genericSuccessHandler(data);
            }
            // if (data.status !== 'ok') {
            //     // 无权限跳转

            //     // 待验证 测试环境反复跳转
            //     if (data.code && +data.code === 40001) {
            //         if (data.redirectUrl) {
            //             window.location.href = data.redirectUrl;
            //             return false;
            //         }
            //     }

            //     toast.error(data.message || '请求失败');
            // }
            if (isInvalidResponse(response)) {
                data.status = 'invalid-response';
            }

            // AjaxResponse<ResponseJSON, IAjaxConfig> => ResponseJSON
            return {
                ...data,
                response,
            };
        },
        (error: (AxiosError | Error) & ICustomError) => {
            const {type, config, response} = error;
            const {requestKey} = config || {};

            if (type === Status.ok) {
                return Promise.resolve(error.val);
            } else if (type === Status.fail) {
                return Promise.reject(error.val);
            }
            if (requestKey && pendingRequests.has(requestKey)) {
                pendingRequests.delete(requestKey);
                eventManager.publish(requestKey, response?.data || {}, Status.fail);
            }

            return {
                status: 'request-failed',
                error,
            };
        });

    return decoratedAjax as any as AjaxInstance;
}
