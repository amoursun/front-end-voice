/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, {useEffect, useRef} from 'react';
import cx from 'classnames';
import {CHAT_MODE_TYPE} from '../../store/chat-store/initialState';
import {useShadow} from '../../context/shadow-context';
import {useStore} from '../../context/store-context';
import {AddIconDrag} from './add-icon-drag';
import AiRecommend from './ai-recommend';
import AiIcon from './ai-icon';

const AiChatIcon = () => {
    const store = useStore();
    const {shadowRoot} = useShadow();
    const recommend = store.use.recommend();
    const setChatMode = store.use.setChatMode();
    const chatModeValue = store.use.chatModeValue();
    const isRecommendOpen = store.use.isRecommendOpen();
    const setRecommendOpen = store.use.setRecommendOpen();
    const recommendPopOverRef = useRef<Record<string, any>>(null);

    // 初始化拖拽
    const drag = new AddIconDrag({
        getIcon: () => shadowRoot.querySelector('.ai-chat-icon'),
        onClick: () => setChatMode(CHAT_MODE_TYPE.UI),
        onUpdatePopOver: () => recommendPopOverRef.current?.forceAlign(),
    });

    useEffect(() => {
        drag.init();

        return () => drag.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AiRecommend
            getPopupContainer={() => shadowRoot.querySelector('.ai-chat-icon')!}
            onClose={() => setRecommendOpen()}
            ref={recommendPopOverRef}
            visible={isRecommendOpen}
            recommend={recommend}
        >
            <AiIcon
                className={cx(
                    'ai-chat-icon',
                    {
                        'ai-chat-icon-open': chatModeValue === CHAT_MODE_TYPE.ICON,
                    }
                )}
                // onUpdateChatMode={setChatMode}
                // onUpdatePopOver={() => recommendPopOverRef.current?.forceAlign()}
            />
        </AiRecommend>
    );
};

export default AiChatIcon;
