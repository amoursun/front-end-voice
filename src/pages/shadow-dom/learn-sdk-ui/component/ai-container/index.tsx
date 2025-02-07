import React, {forwardRef, PropsWithChildren} from 'react';
import cx from 'classnames';
import {CHAT_MODE_TYPE} from '../../store/chat-store/initialState';
import {useStore} from '../../context/store-context';
// import {useStyle} from '../../../hooks/useStyle';
// import style from './ai-container.lazy.less';
import './ai-container.lazy.less';

interface ContainerProps {
    className?: string;
}

// eslint-disable-next-line react/display-name
const AiContainer = forwardRef<HTMLDivElement, PropsWithChildren<ContainerProps>>((props, ref) => {
    const {children} = props;
    const store = useStore();
    const chatModeValue = store.use.chatModeValue();

    // useStyle(style);

    return (
        <div
            ref={ref}
            className={cx(
                'ai-container',
                'ai-theme',
                {
                    'ai-container-open': chatModeValue == CHAT_MODE_TYPE.UI,
                }
            )}
        >
            {children}
        </div>
    );
});

export default AiContainer;
