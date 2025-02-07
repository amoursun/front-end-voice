/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-empty-function */
/* eslint-disable react-hooks/rules-of-hooks */
import {loadScript} from '../common/load-script';
import {createPromise} from '../common/create-promise';

declare global {
    interface Window {
        flv: () => Promise<void>;
        flvjs: any;
    }
}

export const useFlv = () => {
    const {promise, resolve, reject} = createPromise();
    const getFlv = () => promise;

    if (window.flv) {
        return window.flv;
    }

    window.flv = getFlv;

    loadScript(
        '/dulearn/static/flv.min.js',
        {
            onLoad: () => resolve(window.flvjs),
            onError: (err) => reject(err),
        }
    );

    return window.flv;
};
