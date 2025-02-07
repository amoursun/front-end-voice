import {loadScript} from '../common/load-script';
import {createPromise} from '../common/create-promise';

export interface HiShareProps {
    tip: string;
    pic: string;
    title: string;
    username: string;
    defaultPic: string;
    description: string;
    resourceUrl: string;
    onlyShareUrl: number;
}

type HiShareFunProps = (value: Partial<HiShareProps>) => void;

declare global {
    interface Window {
        duHiShareSDK: () => Promise<HiShareFunProps>;
        shareOnclick: HiShareFunProps;
    }
}

const useHiShare = () => {
    const {promise, resolve, reject} = createPromise<HiShareFunProps>();
    const getSDK = () => promise;

    if (window.duHiShareSDK) {
        return window.duHiShareSDK;
    }

    window.duHiShareSDK = getSDK;

    loadScript(
        // 百度Hi分享SDK
        '//open.im.baidu.com/share/js/share-sdk.min.js',
        {
            onLoad: () => resolve(window.shareOnclick),
            onError: (err) => reject(err),
        }
    );

    return window.duHiShareSDK;
};

export default useHiShare;
