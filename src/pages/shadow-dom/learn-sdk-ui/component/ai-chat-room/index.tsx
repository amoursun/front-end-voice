/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, {useEffect} from 'react';
import axios from 'axios';
import {getBaseURL} from '../../../learn-sdk-bootstrap/util-get-base-url';
import {useApp} from '../../../hooks/useApp';
import {useStyle} from '../../../hooks/useStyle';
import {useStore} from '../../context/store-context';
import {useMode} from '../../../hooks/useMode';
import AiHeader from '../ai-header';
import style from './ai-chat-room.lazy.less';

// 获取授权
const getAuthorization = (ak: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const auth = await axios.get(`${getBaseURL()}/duxuetang/rs/auth/getApiToken?targetAppKey=${ak}`);
            if (auth.data && auth.data.code === 200) {
                resolve(auth.data.data);
            } else {
                reject('获取授权失败');
            }
        } catch (error) {
            reject('获取授权失败');
        }
    });
};

const AiChatRoom = () => {
    const store = useStore();
    const setChatMode = store.use.setChatMode();
    const initRecommend = store.use.initRecommend();

    const config = {
        getAuthorization,
        rootStyle: {
            width: '468px',
            height: 'calc(100vh - 60px)',
        },
        settings: {
            hello: {
                title: '',
                description: '',
            },
            size: 'lg',
            avatar: false,
            actions: true,
            pullRequest: true,
        },
    };

    useEffect(() => {
        initRecommend();
    }, [initRecommend]);

    // 注册聊天模式
    useMode(setChatMode, 100);

    useStyle(style);

    // 注册app组件
    useApp();

    return (
        <div className="">
            <AiHeader onClose={setChatMode} />
            <AiChatSDK {...config} />
        </div>
    );
};

export default AiChatRoom;
