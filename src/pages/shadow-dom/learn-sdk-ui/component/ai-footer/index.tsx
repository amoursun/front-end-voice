import React from 'react';
import AiTextarea from '../ai-textarea';
import {useChatStore} from '../../store/chat-store';
import {useStyle} from '../../../hooks/useStyle';
import style from './style.scss?inline';

const AiFooter = () => {
    const isGenerating = useChatStore.use.isGenerating();
    const addChatRequest = useChatStore.use.addChatRequest();

    useStyle(style);

    return (
        <div className="ai-chat-footer">
            <AiTextarea
                disabled={isGenerating}
                onPressEnter={addChatRequest}
            />
        </div>
    );
};

export default AiFooter;