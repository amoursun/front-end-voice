
export enum ICompareEnum {
    equal = 'equal',
    less = 'less',
    greater = 'greater',
}
export interface IPosition {
    index: number;
    top: number;
    bottom: number;
    height: number;
    dValue: number;
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
export const binarySearch = (list: IPosition[], scrollTop: number): number => {
    let left = 0;
    let right = list.length - 1;
    let tempIndex = -1;
    while (left <= right) {
        tempIndex = Math.floor((left + right) / 2);
        const midValue = list[tempIndex].bottom;
        const compareType: ICompareEnum = compareResult(midValue, scrollTop);
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
    return tempIndex; 
};
