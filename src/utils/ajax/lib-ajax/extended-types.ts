import {
    AxiosError,
    AxiosInstance,
    AxiosInterceptorManager,
    AxiosRequestConfig,
    AxiosResponse,
    Canceler,
} from 'axios';

/**
 * @public
 */
export interface AjaxRequestConfig extends AxiosRequestConfig {
    /**
     * [扩展 api]
     *
     * 如果请求未返回，是否会被 "相同请求地址" 的后续请求取消
     *
     * 相同请求地址指，请求 method, url 相同，其中 url 包含 search (`?query=foo`) 部分
     *
     * @default true
     */
    couldBeCanceledBySameRequest?: boolean;
}

// @ts-ignore
export interface AjaxResponse<T = any, Config extends AjaxRequestConfig = AjaxRequestConfig> extends AxiosResponse<T> {
    config: Config;
}

// @ts-ignore
export interface AjaxError<T = any, Config extends AjaxRequestConfig = AjaxRequestConfig> extends AxiosError<T> {
    config: Config;
    response?: AjaxResponse<T, Config>;
}

export interface AjaxPromise<T = any> extends Promise<AjaxResponse<T>> {
}

export interface RequestRecord<Config extends AjaxRequestConfig = AjaxRequestConfig> {
    config: Config;
    cancel: Canceler;
}

// @ts-ignore
export interface AjaxInstance<T = any, Config extends AjaxRequestConfig = AjaxRequestConfig> extends AxiosInstance {
    (config: Config): AjaxPromise;

    (url: string, config?: Config): AjaxPromise;

    defaults: Config;
    interceptors: {
        request: AxiosInterceptorManager<Config>;
        response: AxiosInterceptorManager<AjaxResponse<T, Config>>;
    };

    getUri(config?: AxiosRequestConfig): string;

    request<T = any, R = AjaxResponse<T, Config>>(config: Config): Promise<R>;

    get<T = any, R = AjaxResponse<T, Config>>(url: string, config?: Config): Promise<R>;

    delete<T = any, R = AjaxResponse<T, Config>>(url: string, config?: Config): Promise<R>;

    head<T = any, R = AjaxResponse<T, Config>>(url: string, config?: Config): Promise<R>;

    options<T = any, R = AjaxResponse<T, Config>>(url: string, config?: Config): Promise<R>;

    post<T = any, R = AjaxResponse<T, Config>>(url: string, data?: any, config?: Config): Promise<R>;

    put<T = any, R = AjaxResponse<T, Config>>(url: string, data?: any, config?: Config): Promise<R>;

    patch<T = any, R = AjaxResponse<T, Config>>(url: string, data?: any, config?: Config): Promise<R>;
}
