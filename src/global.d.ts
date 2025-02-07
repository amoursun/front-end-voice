type SDK_ENV = undefined
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
    | 'dev'

    /**
     * 用于部署 sdk ( 按理说, 这个不算是一个 "环境" )
     *
     * @deprecated: sdk 不再适用, bootstrap 也仅用 dev 和 prod
     */
    | 'sdk'
    /**
     * 前端本地的开发环境
     */
    | 'local';

declare global {
    interface Window {
        webkitSpeechRecognition?: any;
        SpeechRecognition?: any;
        APP_ENV: string;
    }
}
declare const APP_ENV: string;


declare namespace NodeJS {
    type Timeout = any;
}



