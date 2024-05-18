import {useMemo, useState} from 'react';
import {VirtualSizeListProps} from '.';

interface IVirtualIndexParams extends Pick<VirtualSizeListProps, 'total'> {
    height: number;
    bufferRange: number;
    itemHeight: number;
}
export function useVirtualIndex(props: IVirtualIndexParams) {
    const {
        height,
        total,
        bufferRange,
        itemHeight,
    } = props;
    const [viewStartIndex, setViewStartIndex] = useState(0);
    const [startIndex, endIndex] = useMemo(() => {
        const visibleSize = Math.ceil(height / itemHeight);
        const bufferSize = bufferRange * visibleSize;
        const startIndex = Math.max(viewStartIndex - bufferSize, 0)
        const endIndex = Math.min(
            viewStartIndex + visibleSize + bufferSize,
            total - 1
        );
        return [startIndex, endIndex];
    }, [height, bufferRange, itemHeight, total, viewStartIndex]);
    

    return {
        startIndex,
        endIndex,
        viewStartIndex,
        setViewStartIndex,
    }
}

