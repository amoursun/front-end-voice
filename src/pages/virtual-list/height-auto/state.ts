import {get} from 'lodash-es';
import {computed, observable, action, makeAutoObservable, runInAction} from 'mobx';
import {ReactionManager} from '../../../utils/mobx/reaction-manager';
import {generateList, IListItem} from '../method';
import { binarySearch } from './binary-search';
export interface IPosition {
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
            visibleSize: computed,
            visibleData: computed,
            bufferSize: computed,
            aboveCount: computed,
            belowCount: computed,
            length: computed,
            end: computed,
        });
        const {list, itemSize} = this;
        this.positions = list.map((_, index) => {
            return  {
                index,
                top: index * itemSize,
                bottom: (index + 1) * itemSize,
                height: itemSize, 
            };
        });
        this.reaction();
    }
    list: IListItem[] = generateList();
    positions: IPosition[] = [];
    itemSize = 80; // 初始给一个开始高度
    screenHeight = 0;
    currentOffset = 0;
    start = 0;
    /**
     * 可视区 上下 缓冲可视区屏幕比率
     * 每个缓冲区只缓冲 1 * 最大可见列表项数 个元素
     * - 上下两个缓冲区
     */
    bufferRatio = 1;
    refs: Array<HTMLDivElement | null> = [];

    get length() {
        return this.list.length;
    }
    get listHeight() {
        return this.positions[this.positions.length - 1].bottom;
    }
    get visibleSize() {
        return Math.ceil(this.screenHeight / this.itemSize);
    };
    get visibleData() {
        return this.list.slice(
            this.start - this.aboveCount,
            this.end + this.belowCount
        );
    };
    /**
     * 可视区显示的 end 索引
     */
    get end(): number {
        return Math.min(this.start + this.visibleSize, this.length - 1);
    }
    /**
     * 可视区域 上下各 在显示个数
     */
    get bufferSize(): number {
        return Math.floor(this.visibleSize * this.bufferRatio); // 向下取整
    };
    /**
     * 下面 使用索引和缓冲数量的最小值 避免缓冲不存在或者过多的数据
     * virtualStart 向上缓冲
     * virtualEnd 向下缓冲
     */
    // get virtualStart(): number {
    //     return Math.max(0, this.start - this.bufferSize);
    // };
    // get virtualEnd(): number {
    //     return Math.min(this.length - 1, this.end + this.bufferSize);
    // };
    /**
     * 下面 使用索引和缓冲数量的最小值 避免缓冲不存在或者过多的数据
     * aboveCount 向上缓冲
     * belowCount 向下缓冲
     */
    get aboveCount() {
        return Math.min(this.start, this.bufferSize);
    };
    get belowCount() {
        return Math.min(this.length - this.end, this.bufferSize);
    };

    getCurrentOffset() {
        if(this.start >= 1) {
            // return this.positions[this.start].top;
            // 计算偏移量时包括上缓冲区的列表项
            const safetyStart = this.start - this.aboveCount;
            const {top} = this.positions[safetyStart] || {top: 0};
            const offset = this.positions[this.start].top - top;
            return this.positions[this.start - 1].bottom - offset;
        }
        else {
            return 0;
        }
    }
    // getCurrentOffset() {
    //     if(this.start >= 1) {
    //         return this.positions[this.start].top;
    //         // 计算偏移量时包括上缓冲区的列表项
    //         const safetyStart = this.start - this.aboveCount;
    //         const {top} = this.positions[safetyStart] || {top: 0};
    //         const offset = this.positions[this.start].top - top;
    //         return this.positions[this.start - 1].bottom - offset;
    //     }
    //     else {
    //         return 0;
    //     }
    // };

    getStartIndex(scrollTop = 0) {
        return binarySearch(this.positions, scrollTop);
    };
    // 滚动回调
    scrollEvent(target: HTMLElement | null) {
        if (!target) {
            return;
        }
        const {scrollTop} = target;
        this.start = this.getStartIndex(scrollTop);
        this.updatePositions();
        this.currentOffset = this.getCurrentOffset();
        console.log('scrollEvent', {
            start: this.start,
            scrollTop,
            end: this.end,
            currentOffset: this.currentOffset,
            positions: this.positions,
        });
        // Promise.resolve().then(() => {
        //     runInAction(() => {
        //         // // 根据真实元素大小，修改对应的缓存列表
        //         this.updatePositions();
        //         // 更新完缓存列表后，重新赋值偏移量
        //         this.currentOffset = this.getCurrentOffset();
        //         console.log('Promise', {
        //             start: this.start,
        //             end: this.end,
        //             currentOffset: this.currentOffset,
        //             positions: this.positions,
        //         });
        //     });
        // });
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

    reaction() {
        // this.reactions.reaction(
        // );
    }

    dispose() {
        this.reactions.dispose();
    }
}

export const store = new State();