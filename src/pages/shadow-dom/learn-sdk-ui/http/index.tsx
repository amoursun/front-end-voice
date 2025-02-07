/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-underscore-dangle */
import axios, {
    type AxiosRequestConfig,
    type AxiosResponse,
    type AxiosInstance,
} from 'axios';

// 请求返回格式
export interface Result<T> {
    message: string;
    code: number;
    data: T;
}

export class Request {
    _instance: AxiosInstance = {} as unknown as AxiosInstance;

    _baseConfig: AxiosRequestConfig = {
        baseURL: '',
        timeout: 10e3,
        withCredentials: true,
        // headers: {
        //     'Content-Type': 'application/json;charset=UTF-8',
        //     'X-Requested-With': 'XMLHttpRequest',
        // },
    };

    constructor(config: AxiosRequestConfig) {
        this._instance = axios.create({
            ...this._baseConfig,
            ...config,
        });

        this._instance.interceptors.request.use(config => {
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        this._instance.interceptors.response.use(response => {
            if (response.data && response.data.code === 200) {
                return response.data;
            }
            if (response.data && response.data.code === 40001) {
                // 未登录
                location.replace(response.data.redirectUrl as string);
                console.log('未登录', response.data.redirectUrl);
            }
            console.log('response =', response.data);
            return Promise.reject(response.data);
        }, error => {
            return Promise.reject(error);
        });
    }

    request<T = any>(
        config: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this._instance.request(config);
    }

    get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<Result<T>> {
        return this._instance.get(url, {params: config});
    }

    post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<Result<T>> {
        return this._instance.post(url, data, config);
    }
}

export default new Request({});
