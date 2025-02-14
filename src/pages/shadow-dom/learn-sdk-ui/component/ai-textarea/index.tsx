import React, {useRef, useState} from 'react';
import cx from 'classnames';
import {Input} from 'antd';
import {message} from '../../../hooks/useApp';
import {useStyle} from '../../../hooks/useStyle';
import {ChatValue} from '../../store/chat-store/initialState';
import AiChatSearch from './img/ai-chat-search.svg';
import style from './style.scss?inline';

interface TextareaProps {
    onPressEnter: (value: ChatValue) => void;
    disabled: boolean;
}

const AiTextarea: React.FC<TextareaProps> = (props) => {
    const {disabled, onPressEnter} = props;
    const [textValue, setTextValue] = useState('');
    const textRef = useRef<HTMLTextAreaElement>(null);

    const resetTextValue = () => {
        setTextValue('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = e.target;
        setTextValue(value);
    };

    const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();

        if (disabled) {
            message.warning('生成回答时无法发送问题');
            return;
        }

        onPressEnter && onPressEnter({
            type: 'text',
            content: textValue,
        });

        resetTextValue();
    };

    useStyle(style);

    return (
        <div
            className={cx(
                'ai-chat-textarea',
                {disabled}
            )}
        >
            <Input.TextArea
                ref={textRef}
                value={textValue}
                onChange={handleChange}
                onPressEnter={handlePressEnter}
                autoSize={{minRows: 1, maxRows: 6}}
            />
            <img
                onClick={handlePressEnter as unknown as React.MouseEventHandler<HTMLImageElement>}
                className='ai-chat-send'
                src={AiChatSearch}
            />
        </div>
    );
};

export default AiTextarea;