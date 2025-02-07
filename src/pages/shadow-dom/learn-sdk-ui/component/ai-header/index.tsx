import React from 'react';
import {CHAT_MODE_TYPE, type ChatModeType} from '../../store/chat-store/initialState';
import {useStyle} from '../../../hooks/useStyle';
// import {useCopy} from '../../../hooks/useCopy';
import AiChatHeaderSvg from './img/ai-chat-header.svg';
import style from './ai-header.lazy.less';

interface HeaderProps {
    onClose?: (value: ChatModeType) => void;
}

const AiHeader: React.FC<HeaderProps> = (props) => {
    const {onClose} = props;
    // const copyRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        onClose && onClose(CHAT_MODE_TYPE.ICON);
    };

    // useCopy(copyRef);

    useStyle(style);

    return (
        <div className='ai-chat-header'>
            <div className='ai-chat-header-title'>
                <div className='ai-chat-header-logo'>
                    <img src={AiChatHeaderSvg} />
                </div>
                <div className='ai-chat-header-name'>
                    <span>乐乐</span>
                    <span>你的学习小助手</span>
                </div>
            </div>
            <div className='ai-chat-header-options'>
                <div className='ai-chat-header-beta'>Web内测版</div>
                {/* <div ref={copyRef} className='ai-chat-header-group' data-clipboard-text="888888">群号888888</div> */}
                <a className='ai-chat-header-group' href='baidu://viewobject/?type=group&id=1558388'>群号1558388</a>
                {/* <div className='ai-chat-header-feedback'>反馈</div> */}
                <div className='ai-chat-header-close' onClick={handleClose}></div>
            </div>
        </div>
    );
};

export default AiHeader;