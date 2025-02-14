import React from 'react';
import {CHAT_MODE_TYPE, type ChatModeType} from '../../store/chat-store/initialState';
import {useStyle} from '../../../hooks/useStyle';
import AiChatHeaderSvg from './img/ai-chat-header.svg';
import style from './style.scss?inline';

interface HeaderProps {
    onClose?: (value: ChatModeType) => void;
}

const AiHeader: React.FC<HeaderProps> = (props) => {
    const {onClose} = props;
    // const copyRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        onClose && onClose(CHAT_MODE_TYPE.ICON);
    };

    useStyle(style);

    return (
        <div className='ai-chat-header'>
            <div className='ai-chat-header-title'>
                <div className='ai-chat-header-logo'>
                    <img src={AiChatHeaderSvg} />
                </div>
                <div className='ai-chat-header-name'>
                    <span>乐乐</span>
                    <span>你的小助手</span>
                </div>
            </div>
            <div className='ai-chat-header-options'>
                <div className='ai-chat-header-beta'>内测版</div>
                <a className='ai-chat-header-group' href='https://jq.qq.com/?_wv=1027&k=5GwZdZvK'>群号666</a>
                <div className='ai-chat-header-close' onClick={handleClose}></div>
            </div>
        </div>
    );
};

export default AiHeader;