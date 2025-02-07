/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/display-name */
import React, {PropsWithChildren, forwardRef, FC} from 'react';
import {Popover} from 'antd';
import {useStyle} from '../../../../hooks/useStyle';
import {addBehavior} from '../../../api';

import style from './ai-recommend.lazy.less';

interface AiRecommendProps {
    getPopupContainer?: () => HTMLElement;
    recommend: Record<string, any>;
    onClose: () => void;
    visible?: boolean;
}

interface ToDoContentProps {
    data: Array<Record<string, any>> | undefined;
}

const ToDoContent: FC<ToDoContentProps> = (props) => {
    const {data = []} = props;

    return (
        <>
            {
                data.map((item) => {
                    return (
                        <a
                            key={item.name}
                            href={item.href}
                            className="ai-recommend-content-item"
                            onClick={() => {
                                // 点击埋点: 97 待办任务
                                void addBehavior({resourceType: 97});
                            }}
                        >
                            <div className="ai-recommend-content-item-name" title={item.name}>{item.name}</div>
                            <div className="ai-recommend-content-item-time">
                                {
                                    item.remainDay >= 1 ? (
                                        <span>
                                            倒计时<span className="day"> {item.remainDay + 1} </span>天
                                        </span>
                                    ) : <span>今日截止</span>
                                }
                                <span>截止时间：{item.endTime}</span>
                            </div>
                        </a>
                    );
                })
            }
        </>
    );
};

const ToDoTitle: FC<{title: string; onClose: () => void}> = (props) => {
    const {title, onClose} = props;
    return (
        <div className="ai-recommend-head">
            <div className="ai-recommend-title">{title}</div>
            <div className="ai-recommend-close" onClick={onClose}></div>
        </div>
    );
};

const AiRecommend = forwardRef<any, PropsWithChildren<AiRecommendProps>>((props, ref) => {
    const {recommend, visible, children, getPopupContainer, onClose} = props;
    const {title, list} = recommend;

    useStyle(style);

    return (
        <Popover
            ref={ref}
            arrow={false}
            open={visible}
            placement="left"
            title={<ToDoTitle title={title} onClose={onClose} />}
            content={<ToDoContent data={list} />}
            getPopupContainer={getPopupContainer}
        >
            {children}
        </Popover>
    );
});

export default AiRecommend;
