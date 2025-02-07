/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-empty-function */
/* eslint-disable react-hooks/rules-of-hooks */
import {loadScript} from '../common/load-script';
import {createPromise} from '../common/create-promise';

export type BPlayerProps = new (el: string | HTMLVideoElement, options: Record<string, any>) => any;

declare global {
    interface Window {
        player: () => Promise<BPlayerProps>;
        BPlayer: BPlayerProps;
        DONG_TING_BPLAYER_URL: string;
    }
}

/**
 * BPlayer SDK API文档
 * https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/AGpi0UIzKq/OfM90VNV0aXMup
 */
export const usePlayer = () => {
    const {promise, resolve, reject} = createPromise<BPlayerProps>();
    const getSDK = () => promise;

    if (window.player) {
        return window.player;
    }

    window.player = getSDK;

    loadScript(
        // BPlayer SDK
        window.DONG_TING_BPLAYER_URL + '?t=' + Date.now(),
        {
            onLoad: () => resolve(window.BPlayer),
            onError: (err) => reject(err),
        }
    );

    return window.player;
};
