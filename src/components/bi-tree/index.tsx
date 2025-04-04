import React, {FC, useEffect, useLayoutEffect, useRef, useState} from 'react';
import cx from 'classnames';
import {useLocalObservable, observer} from 'mobx-react';
import SvgIcon from 'src/components/svg-icon';
import {Person} from './components/Person';
import {
    DirectionType,
    HierarchyType,
    FoldType,
    TreeNode,
    TreeStyle,
    Params,
    defaultTreeStyle,
} from './types';

import './index.scss';

import {store} from './store';

export interface BiTreeProps<T> {
    className?: string;
    params?: Partial<Params<T>>;
}

export const BiTree = observer(<T, >(props: BiTreeProps<T>) => {
    // const store = new Store<T>();
    const {className} = props;
    const params = props.params as Partial<Params<unknown>>;
    const {
        treeData,
        treeStyle,
        secondTree,
        thirdTree,
        thirdAll,
        hasThird,
        foldType,
        showThird,
        showSecond,
        goTop,
        goPage,
        thirdData,
        secondData,
        activePerson,
        innerParams,
        personClick,
        secondLastIndex,
        thirdLastIndex,
        initNum,
        topNodePid,
    } = store;

    useEffect(() => {
        const {style} = params || {};
        if (style) {
            const newStyle = defaultTreeStyle;
            Object.keys(style).forEach((key) => {
                const styleKey = key as keyof TreeStyle;
                if (styleKey === 'cardWidth') {
                    const {cardWidth, cardMargin} = style;
                    const width = cardWidth || treeStyle.cardWidth;
                    const margin = cardMargin || treeStyle.cardMargin;
                    newStyle.cardWidth = width + margin * 2 + 4;
                }
                else if (style[styleKey]) {
                    Object.assign(newStyle, {[styleKey]: style[styleKey]});
                }
            });
            store.setProps({treeStyle: newStyle});
        }

        store.setProps({
            params,
            currentId: params?.focusId,
        });
        store.getData();
    }, [params]);

    useLayoutEffect(() => {
        store.setProps({clientWidth: document.body.clientWidth});
        store.setCardNum();
        // Handle window resize
        const handleResize = () => {
            const clientWidth = document.body.clientWidth;
            if (Math.abs(clientWidth - store.clientWidth) >= treeStyle.cardWidth) {
                const prevNum = initNum;
                store.setCardNum();
                const changeNum = initNum - prevNum;
                if (changeNum) {
                    store.setProps({clientWidth});
                    store.setStartEndIndex(treeData?.children || [], HierarchyType.Second);
                    store.setStartEndIndex(thirdAll, HierarchyType.Third);
                }
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [treeStyle]);

    // useEffect(() => {
    //     store.init();
    // }, []);

    return (
        <div className={cx(className, 'bi-tree-container')}>
            {/* <div
                className="tree-info-wrap"
                style={{
                    minWidth: `${treeStyle.minWidth}px`,
                    maxWidth: `${treeStyle.maxWidth}px`,
                }}
            >
                {
                    treeData ? (
                        <div>
                            <div className="first-wrap">
                                {
                                    treeData?.pid && treeData.pid !== topNodePid ? (
                                        <span
                                            className="go-top"
                                            onClick={() => goTop(treeData)}
                                        >
                                            <SvgIcon name="arrow-double-up" size={10} color="#fff" />
                                        </span>
                                    ) : null
                                }
                                <Person<T>
                                    personData={treeData}
                                    showMinus={treeData?.isOpen}
                                    showOpenBtn={treeData.childFlag}
                                    hierarchy={HierarchyType.First}
                                    isActive={!treeData.childFlag || activePerson.data?.id === treeData?.id}
                                    innerParams={innerParams}
                                    onPersonClick={personClick}
                                />
                            </div>
                            {
                                showSecond ? (
                                    <div
                                        className="second-wrap"
                                        style={{marginTop: `${treeStyle.connectLineHeight * 2}px`}}>
                                        <span className="direction-wrap left">
                                            {
                                                secondTree.startIndex !== 0 ? (
                                                    <span
                                                        className="direction"
                                                        onClick={() => goPage(
                                                            treeData?.children || [],
                                                            true,
                                                            DirectionType.Previous,
                                                            HierarchyType.Second
                                                        )}
                                                    >
                                                        <SvgIcon name="arrow-left" size={26} color="#8a919f" />
                                                    </span>
                                                ) : null
                                            }
                                        </span>
                                        {secondData.map((item, index) => (
                                            <Person<T>
                                                key={item ? item.id : index}
                                                personData={item}
                                                personIndex={index}
                                                isActive={activePerson.data?.id === item?.id}
                                                showMinus={item?.isOpen}
                                                showOpenBtn={item && item.childFlag}
                                                isLastPerson={
                                                    secondLastIndex > initNum - 2 && secondLastIndex === index
                                                }
                                                hierarchy={HierarchyType.Second}
                                                hasThird={hasThird}
                                                startIndex={secondTree.startIndex}
                                                endIndex={secondTree.endIndex}
                                                currentIndex={secondTree.currentIndex}
                                                length={secondData.length}
                                                innerParams={innerParams}
                                                onPersonClick={personClick}
                                            />
                                        ))}
                                        <span className="direction-wrap right">
                                            {
                                                treeData.children?.length
                                                    && secondTree.endIndex !== treeData.children.length - 1 ? (
                                                        <span
                                                            className="direction"
                                                            onClick={() => goPage(
                                                                treeData.children || [],
                                                                true,
                                                                DirectionType.Next,
                                                                HierarchyType.Second
                                                            )}>
                                                            <SvgIcon name="arrow-right" size={26} color="#8a919f" />
                                                        </span>
                                                    ) : null
                                            }
                                        </span>
                                    </div>
                                ) : null
                            }
                            {
                                showThird && foldType === FoldType.All ? (
                                    <div
                                        className="third-wrap"
                                        style={{marginTop: `${treeStyle.connectLineHeight * 2}px`}}>
                                        <span className="direction-wrap left">
                                            {
                                                thirdTree.startIndex !== 0 && hasThird ? (
                                                    <span
                                                        className="direction"
                                                        onClick={() => goPage(
                                                            thirdAll,
                                                            true,
                                                            DirectionType.Previous,
                                                            HierarchyType.Third
                                                        )}
                                                    >
                                                        <SvgIcon name="arrow-left" size={26} color="#8a919f" />
                                                    </span>
                                                ) : null
                                            }
                                        </span>
                                        {thirdData.map((item, index) => (
                                            <Person<T>
                                                key={item ? item.id : index}
                                                personData={item}
                                                personIndex={index}
                                                hierarchy={HierarchyType.Third}
                                                isActive={item && activePerson?.data?.id === item.id}
                                                showOpenBtn={item && item.childFlag}
                                                isLastPerson={thirdLastIndex === index}
                                                startIndex={thirdTree.startIndex}
                                                endIndex={thirdTree.endIndex}
                                                currentIndex={thirdTree.currentIndex}
                                                secondCur={secondTree.currentIndex}
                                                secondStart={secondTree.startIndex}
                                                secondEnd={secondTree.endIndex}
                                                initNum={initNum}
                                                length={thirdData.length}
                                                secondLength={secondData.length}
                                                innerParams={innerParams}
                                                onPersonClick={personClick}
                                            />
                                        ))}
                                        <span className="direction-wrap right">
                                            {
                                                thirdTree.endIndex !== thirdAll.length - 1 && hasThird ? (
                                                    <span
                                                        className="direction"
                                                        onClick={() => goPage(
                                                            thirdAll,
                                                            true,
                                                            DirectionType.Next,
                                                            HierarchyType.Third
                                                        )}
                                                    >
                                                        <SvgIcon name="arrow-right" size={26} color="#8a919f" />
                                                    </span>
                                                ) : null
                                            }
                                        </span>
                                    </div>
                                ) : null
                            }
                        </div>
                    ) : null
                }
            </div> */}
        </div>
    );
});

export default BiTree;
