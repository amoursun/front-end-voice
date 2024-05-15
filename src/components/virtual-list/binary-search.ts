import {IPosition} from '.';

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
        /**
         * 正好处于临界点
         * 8(left)          9(right)
         * 6590     6600    6610
         * 下来一步: left + 1 => 9   ===  right  或 right - 1 => left
         * 结果 left === right
         */
        if (left === right) {
            return left;
        }
        let midIndex = Math.floor((left + right) / 2);
        let midVal = list[midIndex].bottom;
        const compareType: ICompareEnum = compareResult(midVal, scrollTop);
        if (compareType === ICompareEnum.equal) {
            return midIndex;
        }
        else if (compareType === ICompareEnum.less) {
            left = midIndex + 1;
        }
        else if (compareType === ICompareEnum.greater) {
            right = midIndex - 1;
        }
    }
    // 如果没有搜索到完全匹配的项 就返回最匹配的项
    return tempIndex;
};