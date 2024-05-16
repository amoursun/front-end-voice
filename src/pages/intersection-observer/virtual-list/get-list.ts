import {IItem} from './item/index';

function repeat(value: string, count: number) {
    return value.repeat(count);
}

export const getList = (): IItem[] => {
    const data = [];
    for (let i = 1; i <= 100000; i++) {
        data.push({
            id: i,
            value: `${i}${repeat('字符内容', Math.random() * 200)}`,
            visible: false,
        });
    }
    return data;
};