import {
    useState,
    useCallback,
    useEffect,
} from 'react';
import {IPosition} from './binary-search';
import {VirtualSizeListProps} from '.';
import {getIndexFromNode} from './utils';

interface IUsePositionsParams extends Pick<VirtualSizeListProps, 'total' | 'itemType'> {
    itemHeight: number;
    /**
     * 开始索引
     */
    startIndex: number;
    renderContainerRef: React.RefObject<HTMLElement>
}
export function usePositions(props: IUsePositionsParams) {
    const {
        total,
        itemHeight,
        startIndex,
        itemType = 'auto',
        renderContainerRef,
    } = props;
    const [positions, setPositions] = useState<IPosition[]>(() => {
        const positions = [];
        for (let i = 0; i < total; ++i) {
        positions.push({
            index: i,
            height: itemHeight,
            top: i * itemHeight,
            bottom: (i + 1) * itemHeight,
            dValue: 0,
        });
        }
        return positions;
    });
    const updatePositions = useCallback(() => {
        const nodes = renderContainerRef.current?.children || [];
        const start = nodes[0];
        for (const node of nodes) {
        if (!node) {
            continue;
        }
        // 获取 真实DOM高度
        const {height} = node.getBoundingClientRect();
        // 根据 元素索引 获取 缓存列表对应的列表项
        const index = getIndexFromNode(node);
        const oldHeight = positions[index].height;
        const dValue = oldHeight - height;
        // 如果有高度差 !!dValue === true
        if (dValue) {
            positions[index].bottom -= dValue;
            positions[index].height = height;
            positions[index].dValue = dValue;
        }
        }
        let startIdx = 0;
        if (start) {
        startIdx = getIndexFromNode(start);;
        }
        const length = positions.length;
        let diff = positions[startIdx].dValue;
        positions[startIdx].dValue = 0;
        for (let i = startIdx + 1; i < length; ++i) {
        const item = positions[i];
        positions[i].top = positions[i - 1].bottom;
        positions[i].bottom = positions[i].bottom - diff;
    
        if (item.dValue !== 0) {
            diff += item.dValue;
            item.dValue = 0;
        }
        }
        setPositions(positions);
    }, [renderContainerRef, positions]);
    useEffect(() => {
        // 高度不定时候计算
        if (itemType === 'auto') {
            updatePositions();
        }
    }, [itemType, startIndex]);
    return {
        positions,
        updatePositions,
    }
}









