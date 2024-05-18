import {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useLayoutEffect,
} from 'react';
import {IPosition} from './binary-search';
import {VirtualSizeListProps} from '.';
import {getIndexFromNode} from './utils';

interface IUsePositionsParams extends Pick<VirtualSizeListProps, 'total' | 'renderType'> {
    itemHeight: number;
    /**
     * 开始索引
     */
    startIndex: number;
    renderContainerRef: React.RefObject<HTMLElement>
}
function createPosition(data: {
    /**
     * 索引
     */
    index: number;
    /**
     * 计算 index
     * 默认 为index
     */
    calculateIndex?: number;
    itemHeight: number;
    /**
     * 基于此 bottom 基数计算
     * baseBottom: 10
     *   - 第一个索引: 0 => top = 10 + 0 * itemHeight
     *   - .....     n => top = 10 + n * itemHeight
     */
    baseBottom?: number;
}) {
    const {index, calculateIndex = index, itemHeight, baseBottom = 0} = data;
    return {
        index,
        height: itemHeight,
        top: baseBottom + calculateIndex * itemHeight,
        bottom: baseBottom + (calculateIndex + 1) * itemHeight,
        dValue: 0,
    }
}
export function usePositions(props: IUsePositionsParams) {
    const {
        total,
        itemHeight,
        startIndex,
        renderType = 'auto',
        renderContainerRef,
    } = props;
    const [scrollHeight, setScrollHeight] = useState(0);
    const [positions, setPositions] = useState<IPosition[]>(() => {
        const positions = [];
        for (let i = 0; i < total; ++i) {
            positions[i] = createPosition({
                index: i,
                itemHeight,
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
            // console.log(node.clientHeight, index, 'node')
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
            startIdx = getIndexFromNode(start);
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
        const height = positions[positions.length - 1].bottom;
        setScrollHeight(height);
        setPositions(positions);
    }, [renderContainerRef, positions]);
    // total 变化时候 init 变化的 positions
    useLayoutEffect(() => {
        const originLength = positions.length;
        const diff = total - originLength;
        if (diff > 0) {
            const baseBottom = positions[originLength - 1].bottom;
            for (let i = 0; i < diff; ++i) {
                const index = originLength + i;
                positions[index] = createPosition({
                    index,
                    calculateIndex: i,
                    itemHeight,
                    baseBottom,
                });
            }
            setPositions(positions);
        }
    }, [total, positions, itemHeight]);
    useEffect(() => {
        // 高度不定时候计算
        if (renderType === 'auto') {
            updatePositions();
        }
    }, [renderType, startIndex, total]);
    const transformValue = useMemo(() => {
        return startIndex >= 1 ? positions[startIndex - 1].bottom : 0;
    }, [startIndex, positions]);
    return {
        positions,
        transformValue,
        scrollHeight,
        updatePositions,
    }
}









