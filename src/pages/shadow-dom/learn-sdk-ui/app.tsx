import React from 'react';
import {useStyle} from '../hooks/useStyle';
import {StoreProvider} from './context/store-context';
import {Provider} from './component/config-provider';
import AiChatRoom from './component/ai-chat-room';
import AiChatIcon from './component/ai-chat-icon';
import style from './style.module.scss';

const App = () => {
    // 注册全局样式
    useStyle(style);

    return (
        <StoreProvider>
            <Provider
                renderIconMode={<AiChatIcon />}
            >
                <AiChatRoom />
            </Provider>
        </StoreProvider>
    );
};

export default App;
