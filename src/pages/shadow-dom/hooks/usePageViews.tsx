/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import {useCallback, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {loadScript} from '../common/load-script';
import {createPromise} from '../common/create-promise';

export interface PageViewsProps {
    push: (...args: any[]) => void;
    cmd: Record<string, any>;
    id: string;
}

declare global {
    interface Window {
        duTongjiSDK: () => Promise<PageViewsProps>;
        _hmt: PageViewsProps;
    }
}

/**
 * 百度统计SDK API文档
 * https://tongji.baidu.com/web/help/article?id=235&type=0&from_query=_trackPageview&index=0
 * https://tongji.baidu.com/holmes/Analytics/%E6%8A%80%E6%9C%AF%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97/JS%20API/JS%20API%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C
 */
export const useTongjiSDK = () => {
    const {promise, resolve, reject} = createPromise<PageViewsProps>();
    const getSDK = () => promise;

    if (window.duTongjiSDK) {
        return window.duTongjiSDK;
    }

    window.duTongjiSDK = getSDK;

    loadScript(
        // 百度统计SDK
        '//hm.baidu.com/hm.js?b5bf61f2f2cd8fee972e3a7acb59d5c2',
        {
            onLoad: () => resolve(window._hmt),
            onError: (err) => reject(err),
        }
    );

    return window.duTongjiSDK;
};

// 添加用户PV埋点
export const usePageViews = () => {
    const location = useLocation();

    const addPageViews = useCallback(async () => {
        const getSDK = useTongjiSDK();
        const tongjiSDK = await getSDK();
        const path = `${window.location.pathname}#${location.pathname}${location.search}`;
        // 设置 PV 属性
        tongjiSDK.push(['_setPageviewProperty', {}]);
        // 发送 PV 日志
        tongjiSDK.push(['_trackPageview', path]);
    }, [location]);

    useEffect(() => {
        void addPageViews();
    }, [addPageViews]);
};
