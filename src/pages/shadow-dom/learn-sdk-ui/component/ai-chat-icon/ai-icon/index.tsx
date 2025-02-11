import React from 'react';
import cx from 'classnames';
import {ChatModeType} from '../../../store/chat-store/initialState';
import {useStyle} from '../../../../hooks/useStyle';
// import AiChatLogoSvg from '../img/ai-chat-logo.svg';
import style from './style.module.scss';

interface AiIconProps {
    className?: string;
    onUpdatePopOver?: () => void;
    onUpdateChatMode?: (value: ChatModeType) => void;
}

const AiIcon: React.FC<AiIconProps> = (props) => {
    const {className} = props;

    useStyle(style);

    return (
        <div
            className={cx(
                // 'ai-chat-icon',
                'ai-icon-theme',
                className
            )}
        >
            <div data-element="move-handler" className="ai-chat-icon-ui"></div>
            {/* <div className='ai-chat-icon-ui'>
                <img src={AiChatLogoSvg} onClick={() => onUpdateChatMode(CHAT_MODE_TYPE.UI)} />
            </div>
            <div data-element="move-handler" className='ai-chat-icon-top'></div>
            <div data-element="move-handler" className='ai-chat-icon-right'></div>
            <div data-element="move-handler" className='ai-chat-icon-bottom'></div>
            <div data-element="move-handler" className='ai-chat-icon-left'></div> */}
        </div>
    );
};

export default AiIcon;
