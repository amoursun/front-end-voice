export interface IPosition {
    index: number;
    top: number;
    bottom: number;
    height: number;
    dValue: number;
}

export enum ICompareEnum {
    equal = 'equal',
    less = 'less',
    greater = 'greater',
}
function compareResult(targetNumber: number, value: number): ICompareEnum {
    if (targetNumber === value) {
        return ICompareEnum.equal;
    }
    if (targetNumber < value) {
        return ICompareEnum.less;
    }
    return ICompareEnum.greater;
}
export const binarySearch = function(list: IPosition[], scrollTop: number): number {  
    let left = 0;
    let right = list.length - 1;
    let tempIndex = -1;
    while (left <= right) {
        tempIndex = Math.floor((left + right) / 2);
        let midVal = list[tempIndex].bottom;
        const compareType: ICompareEnum = compareResult(midVal, scrollTop);
        if (compareType === ICompareEnum.equal) {
            return tempIndex;
        }
        else if (compareType === ICompareEnum.less) {
            left = tempIndex + 1;
        }
        else if (compareType === ICompareEnum.greater) {
            right = tempIndex - 1;
        }
    }
    // 如果没有搜索到完全匹配的项 就返回最匹配的项
    return tempIndex;
};

export function getStartIndex(params: {
    scrollTop: number;
    positions: IPosition[];
}) {
    const {scrollTop = 0, positions = []} = params;
    let idx = binarySearch(positions, scrollTop);
    if (idx === -1) {
        idx = 0;
    }
    const targetItem = positions[idx];
    if (targetItem.bottom < scrollTop) {
        idx += 1;
    }
    return idx;
};