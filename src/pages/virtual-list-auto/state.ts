import {get} from 'lodash-es';
import {computed, observable, action, makeAutoObservable, runInAction} from 'mobx';
import { RefObject } from 'react';
import { ReactionManager } from '../../utils/mobx/reaction-manager';

function repeat(value: string, count: number) {
    return value.repeat(count);
}
const getList = () => {
    const data = [];
    for (let i = 1; i <= 10000; i++) {
        data.push({
            id: i,
            value: `${i}${repeat('字符内容', Math.random() * 50)}`,
        });
    }
    return data;
};

const binarySearch = function(list: IPosition[], target: number): number {  
    const len = list.length  
    let left = 0
    let right = len - 1;
    let tempIndex = -1;
    while (left <= right) {  
        let midIndex = (left + right) >> 1;
        let midVal = list[midIndex].bottom;
        if (midVal === target) {
            return midIndex;
        }
        else if (midVal < target) {
            left = midIndex + 1;
        }
        else {
            // list不一定存在与target相等的项，不断收缩右区间，寻找最匹配的项
            if(tempIndex === -1 || tempIndex > midIndex) {
                tempIndex = midIndex;
            }
            right--;
        }
    }  
    // 如果没有搜索到完全匹配的项 就返回最匹配的项
    return tempIndex;
};

interface Item {
    id: number;
    value: string;
}
interface IPosition {
    index: number;
    top: number;
    bottom: number;
    height: number;
}
class State {
    reactions = new ReactionManager();
    constructor() {
        makeAutoObservable(this, {
            listHeight: computed,
            visibleCount: computed,
            visibleData: computed,
            bufferCount: computed,
            aboveCount: computed,
            belowCount: computed,
            length: computed,
        });
        this.created();
        this.reaction();
    }
    list: Item[] = [];
    positions: IPosition[] = [];
    preItemSize = 20; // 初始给一个开始高度
    screenHeight = 0;
    currentOffset = 0;
    start = 0;
    end = 0;
    count = 0;
    bufferPercent = 0.5; // 即每个缓冲区只缓冲 0.5 * 最大可见列表项数 个元素
    refs: Array<HTMLDivElement | null> = [];

    created() {
        const data = getList();
        this.list = data;
        this.initPositions(this.list, this.preItemSize);
    };
    get length() {
        return this.list.length;
    }
    get listHeight() {
        return this.positions[this.positions.length - 1].bottom;
    }
    get visibleCount() {
        return Math.ceil(this.screenHeight / this.preItemSize);
    };
    get visibleData() {
        return this.list.slice(this.start - this.aboveCount, this.end + this.belowCount);
    };
    get bufferCount() {
        return Math.floor(this.visibleCount * this.bufferPercent); // 向下取整
    };
    // 使用索引和缓冲数量的最小值 避免缓冲不存在或者过多的数据
    get aboveCount() {
        return Math.min(this.start, this.bufferCount);
    };
    get belowCount() {
        return Math.min(this.length - this.end, this.bufferCount);
    };
    // 滚动回调
    scrollEvent(target: HTMLElement) {
        if (!target) {
            return;
        }
        const {scrollTop} = target;
        this.start = this.getStartIndex(scrollTop);
        this.currentOffset = this.getCurrentOffset();
        Promise.resolve().then(() => {
            runInAction(() => {
                // // 根据真实元素大小，修改对应的缓存列表
                // this.updatePositions();
                // // 更新完缓存列表后，重新赋值偏移量
                // this.currentOffset = this.getCurrentOffset();
            });
        });
    };
    // 初始化列表
    initPositions(list: Item[], itemSize: number) {
        this.positions = list.map((item, index) => {
            return  {
                index,
                top: index * itemSize,
                bottom: (index + 1) * itemSize,
                height: itemSize, 
            };
        });
    };
    // 渲染后更新positions
    updatePositions() {
        const nodes = this.refs || [];
        for (const node of nodes) {
            if (!node) {
                continue;
            }
            // 获取 真实DOM高度
            const {height} = node.getBoundingClientRect();
            // 根据 元素索引 获取 缓存列表对应的列表项
            const index = Number(get(node, 'dataset.id', -1)) - 1;
            const oldHeight = this.positions[index].height;
            // dValue：真实高度与预估高度的差值 决定该列表项是否要更新
            const dValue = oldHeight - height;
            // 如果有高度差 !!dValue === true
            if(dValue) {
                // 更新对应列表项的 bottom 和 height
                this.positions[index].bottom = this.positions[index].bottom - dValue;
                this.positions[index].height = height;
                // 依次更新positions中后续元素的 top bottom
                for(let k = index + 1; k < this.positions.length; k++) {
                    this.positions[k].top = this.positions[k - 1].bottom;
                    this.positions[k].bottom = this.positions[k].bottom - dValue;
                }
            }
        }
    };
    getStartIndex(scrollTop = 0) {
        return binarySearch(this.positions, scrollTop);
    };
    getCurrentOffset() {
        if(this.start >= 1) {
            // 计算偏移量时包括上缓冲区的列表项
            let size = this.positions[this.start].top - (this.positions[this.start - this.aboveCount] ? 
            this.positions[this.start - this.aboveCount].top : 0);
            return this.positions[this.start - 1].bottom - size;
        }
        else {
            return 0;
        }
    };

    reaction() {
        this.reactions.reaction(
            () => [this.visibleCount, this.start],
            ([visibleCount, start]) => {
                this.end = start + visibleCount;
                
            }
        );
    }

    dispose() {
        this.reactions.dispose();
    }
}

export const store = new State();