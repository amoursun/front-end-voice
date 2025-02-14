/* eslint-disable react/prop-types */
import React, {useRef} from 'react';
import {App, ConfigProvider} from 'antd';
import {createCache, StyleProvider} from '@ant-design/cssinjs';
import AiContainer from '../ai-container';
import {useShadow} from '../../context/shadow-context';
import {useStyle} from '../../../hooks/useStyle';
import style from './style.scss?inline';

export const Provider = ({
    children = null as React.ReactNode,
    renderIconMode = null as React.ReactNode
}) => {
    const {shadowRoot} = useShadow();
    const containerRef = useRef<HTMLDivElement>(null);

    const messageConfig = {
        getContainer: () => containerRef.current as unknown as HTMLElement,
        prefixCls: 'ai-message',
        maxCount: 1,
        duration: 3,
        top: 50,
    };

    useStyle(style);

    return (
        <StyleProvider
            // hashPriority="high"
            cache={createCache()}
            container={shadowRoot}
        >
            <ConfigProvider
                prefixCls="ai"
                getPopupContainer={() => shadowRoot as unknown as HTMLElement}
            >
                <AiContainer ref={containerRef}>
                    <App message={messageConfig}>
                        {children}
                    </App>
                </AiContainer>
                {renderIconMode}
            </ConfigProvider>
        </StyleProvider>
    );
};
