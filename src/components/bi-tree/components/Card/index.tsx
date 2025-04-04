import React, {FC} from 'react';
import {observer} from 'mobx-react';
import cx from 'classnames';
import {isFunction} from 'lodash-es';
import {Avatar} from 'antd';
import {DefaultTreeNode, TreeStyle} from '../../types';

import './style.scss';

interface CardProps<T> {
    data: DefaultTreeNode<T>;
    innerParams?: {
        style: TreeStyle;
        appendHTML?: ((data: any) => string) | string;
        renderNode?: (data: DefaultTreeNode<T>) => React.ReactNode;
    };
    isActive?: boolean;
}

export const Card = observer(<T, >({data, innerParams, isActive = false}: CardProps<T>) => {
    const getContent = () => {
        const {appendHTML} = innerParams || {};
        if (!appendHTML) {
            return data.orgName;
        }

        if (typeof appendHTML === 'function') {
            return appendHTML(data);
        }

        return appendHTML.replace(/\${(.+?)}/g, (_, tag) => data[tag as keyof DefaultTreeNode<T>] as string);
    };

    const handleClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).getAttribute('data-click')) {
            // EventBus.$emit('showTargetDetail', data);
        }
    };

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        e.stopPropagation();
    };

    const cardStyle = {
        height: `${innerParams?.style.cardHeight || 132}px`,
        borderColor: innerParams?.style.borderColor,
        ...(isActive && {
            borderColor: innerParams?.style.highlightColor,
            boxShadow: innerParams?.style.highlightShadow,
        }),
    };

    const cardNode = (data: DefaultTreeNode<T>) => {
        const {orgName, image, orgLeader} = data;
        return (
            <div className="inner-content">
                <div className="content-top">
                    <div className="content-org-name">{orgName}</div>
                    <div className="content-info-wrap">
                        <Avatar
                            src={image}
                            alt={orgName}
                            draggable={false}
                        />
                        <span className="content-org-leader">{orgLeader}</span>
                    </div>
                </div>
                <div className="content-bottom">暂无内容</div>
            </div>
        );
    };

    if (isFunction(innerParams?.appendHTML)) {
        return (
            <div
                className="card-wrap"
                onClick={handleClick}
                onTransitionEnd={handleTransitionEnd}
                style={cardStyle}
                dangerouslySetInnerHTML={{__html: getContent()}}
            />
        );
    }

    return (
        <div
            className="card-wrap"
            style={cardStyle}
            onClick={handleClick}
            onTransitionEnd={handleTransitionEnd}
        >
            {isFunction(innerParams?.renderNode) && innerParams.renderNode(data) || cardNode(data)}
        </div>
    );
});
