import React, {FC} from 'react';
import {observer} from 'mobx-react';
import cx from 'classnames';
import SvgIcon from 'src/components/svg-icon';
import {Card} from '../Card';
import {HierarchyType, DefaultTreeNode, TreeStyle} from '../../types';
import './style.scss';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

interface PersonProps<T> {
    personData: DefaultTreeNode<T>;
    hierarchy: HierarchyType;
    isActive?: boolean;
    showOpenBtn?: boolean;
    showMinus?: boolean;
    isLastPerson?: boolean;
    hasThird?: boolean;
    personIndex?: number;
    startIndex?: number;
    endIndex?: number;
    currentIndex?: number;
    secondCur?: number;
    secondStart?: number;
    secondEnd?: number;
    initNum?: number;
    length?: number;
    secondLength?: number;
    innerParams?: {
        style: TreeStyle;
    };
    onPersonClick?: (params: {
        hierarchy: HierarchyType;
        personData: DefaultTreeNode<T>;
        isOpen: boolean;
    }) => void;
}

export const Person = observer(<T, >({
    personData,
    hierarchy,
    isActive = false,
    showOpenBtn = false,
    showMinus = false,
    isLastPerson = false,
    hasThird = true,
    personIndex = 0,
    startIndex = 0,
    endIndex = 0,
    secondCur = 0,
    secondStart = 0,
    initNum = 0,
    length = 0,
    secondLength = 0,
    innerParams,
    onPersonClick,
}: PersonProps<T>) => {
    const noRadius = React.useMemo(() => {
        const num = secondCur - secondStart;
        // 第二层展开的卡片是最后一个并且是第三层的最后一个卡片
        const isLastOpen = num === initNum - 1
            && personIndex === initNum - 2
            && endIndex - startIndex !== 1;
        // 第二层展开的卡片位置在第三层的第一个卡片,并且第二层数据大于第三层数据
        const isThirdFirst = num === personIndex
            && personIndex !== length - 2
            && secondLength >= length;
        return isThirdFirst || isLastOpen || endIndex === startIndex;
    }, [secondCur, secondStart, initNum, personIndex, endIndex, startIndex, length, secondLength]);

    const leftNoRadius = React.useMemo(() => {
        const num = secondCur - secondStart;
        const flag = hierarchy === HierarchyType.Second && num || hierarchy !== HierarchyType.Second;
        return flag && num === personIndex && endIndex - startIndex === 1;
    }, [hierarchy, secondCur, secondStart, personIndex, endIndex, startIndex]);

    const rightNoRadius = React.useMemo(() => {
        const num = secondCur - secondStart;
        return num - 1 === personIndex;
    }, [secondCur, secondStart, personIndex]);

    const personStyle = React.useMemo(() => {
        const {cardWidth, connectLineHeight, borderColor, cardMargin} = innerParams?.style || {};
        return {
            cardWidth,
            cardMargin,
            connectLineHeight,
            borderColor,
        };
    }, [innerParams]);

    const cardStyle = React.useMemo(() => {
        const {cardWidth, cardHeight, cardMargin} = innerParams?.style || {};
        return {
            width: `${cardWidth || 170}px`,
            height: `${cardHeight || 132}px`,
            margin: `0 ${cardMargin || 10}px`,
        };
    }, [innerParams]);

    const handleShowSubordinate = () => {
        onPersonClick?.({
            hierarchy,
            personData,
            isOpen: personData?.isOpen || false,
        });
    };

    if (!personData) {
        return <p className="placeholder-info-wrap" style={cardStyle} />;
    }

    return (
        <div
            className={cx('person-info-wrap', {
                'person-active': isActive,
                'last-person-info-wrap': isLastPerson,
                'top-person-info-wrap': hierarchy === HierarchyType.First,
            })}
            style={cardStyle}
        >
            {hierarchy !== HierarchyType.First && (
                <div
                    className={cx('connect-line', {
                        'line-right-angle': noRadius,
                        'only-one': endIndex === startIndex,
                        'line-right-radius': leftNoRadius,
                        'line-left-radius': rightNoRadius,
                    })}
                    style={{
                        height: `${personStyle.connectLineHeight || 0}px`,
                        top: `-${personStyle.connectLineHeight || 0}px`,
                    }}
                >
                    <div
                        className="tree-vertical-line"
                        style={{
                            height: `${personStyle.connectLineHeight || 0}px`,
                            borderColor: personStyle.borderColor,
                        }}
                    />
                    <div
                        className="tree-horizontal-line"
                        style={{
                            height: `${personStyle.connectLineHeight || 0}px`,
                            width: `${(personStyle.cardWidth || 0) + (personStyle.cardMargin || 0) * 2}px`,
                            borderColor: personStyle.borderColor,
                        }}
                    />
                </div>
            )}

            <Card<T> data={personData} innerParams={innerParams} isActive={isActive} />

            {showOpenBtn && (
                <span
                    className={cx('show-btn', {'minus-btn': showMinus})}
                    // data-sub={personData.children || ''}
                    onClick={handleShowSubordinate}
                >
                    {/* <SvgIcon
                        name={showMinus ? 'circle-pie-minus' : 'circle-pie-add'}
                        size={18}
                        color={showMinus ? '#3999f7' : '#8a919f'}
                    /> */}
                    {showMinus ? (
                        <MinusCircleOutlined
                            style={{
                                fontSize: '18px',
                                color: '#3999f7',
                            }}
                        />
                    ) : (
                        <PlusCircleOutlined
                            style={{
                                fontSize: '18px',
                                color: '#8a919f',
                            }}
                        />
                    )}
                    
                    {hasThird && (
                        <span
                            className="tree-vertical-line"
                            style={{
                                height: `${(personStyle.connectLineHeight || 0) - 8}px`,
                                borderColor: personStyle.borderColor,
                            }}
                        />
                    )}
                </span>
            )}
        </div>
    );
});
