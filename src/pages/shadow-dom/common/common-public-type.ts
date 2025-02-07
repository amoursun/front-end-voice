/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/**
 * **注意** 业务方接入, 目前仅关注 'prod' 和 'dev' 两种环境
 */
export type SDK_ENV =
/**
 *  正式环境
 */
    | 'prod'

     /**
     * 预上线环境
     */
     | 'uat'

    /**
     * 测试环境
     */
    | 'dev';

export interface LearnSDK_SetupOptions {
    sdkEnv: SDK_ENV;

    /**
     * 默认 7200 (两小时, 单位 : 秒)
     */
    ugateTokenReloadInternal?: 7200 | number;

    /**
     * 提供一个自定义的 "业务方 header 高度", 指导辅助区的上边距的设定
     * 如不提供, 默认为 60
     */
    appHeaderHeight?: number;
}

export interface Public_LearnSDK_SetupReturnResult {
    /**
     * 返回一个, 获取 sdk 示例的方法
     *
     * @note: sdk 这个 promise 也可作为 "sdk 初始化完毕" 的标记
     */
    getSDK: () => Promise<any>;

}

export type StatusType = 'ok' | 'failed';
