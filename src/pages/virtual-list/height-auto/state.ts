import {get} from 'lodash-es';
import {computed, makeAutoObservable} from 'mobx';
import {ReactionManager} from '../../../utils/mobx/reaction-manager';
import {generateList, IListItem} from '../method';
import { binarySearch } from './binary-search';
export interface IPosition {
    index: number;
    top: number;
    bottom: number;
    height: number;
    dValue: number;
}
class State {
    reactions = new ReactionManager();
    constructor() {
        makeAutoObservable(this, {
            visibleSize: computed,
            visibleData: computed,
            bufferSize: computed,
            virtualStart: computed,
            virtualEnd: computed,
            total: computed,
            end: computed,
        });
        const {list, itemSize} = this;
        this.positions = list.map((_, index) => {
            return  {
                index,
                top: index * itemSize,
                bottom: (index + 1) * itemSize,
                height: itemSize,
                dValue: 0,
            };
        });
        this.reaction();
    }
    list: IListItem[] = generateList({isAuto: true});
    positions: IPosition[] = [];
    itemSize = 80; // 初始给一个开始高度
    screenHeight = 0;
    currentOffset = 0;
    start = 0;
    listHeight = this.itemSize * this.total;
    /**
     * 可视区 上下 缓冲可视区屏幕比率
     * 每个缓冲区只缓冲 1 * 最大可见列表项数 个元素
     * - 上下两个缓冲区
     */
    bufferRatio = 1;
    contentRef!: React.RefObject<HTMLDivElement | null>;

    get total() {
        return this.list.length;
    }
    get visibleSize() {
        return Math.ceil(this.screenHeight / this.itemSize);
    };
    
    /**
     * 可视区显示的 end 索引
     */
    get end(): number {
        return Math.min(this.start + this.visibleSize, this.total - 1);
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
    get virtualStart(): number {
        return Math.max(0, this.start - this.bufferSize);
    };
    get virtualEnd(): number {
        return Math.min(this.total - 1, this.end + this.bufferSize);
    };
    get visibleData() {
        return this.list.slice(
            this.start - this.virtualStart,
            this.end + this.virtualEnd
        );
    };

    getCurrentOffset() {
        if(this.virtualStart >= 1) {
            return this.positions[this.virtualStart - 1].bottom;
            // return this.positions[this.start].top;
            // 计算偏移量时包括上缓冲区的列表项
            const top = this.positions[this.virtualStart].top;
            const offset = this.positions[this.start].top - top;
            return this.positions[this.start - 1].bottom - offset;
        }
        else {
            return 0;
        }
    }

    getStartIndex(scrollTop = 0) {
        return binarySearch(this.positions, scrollTop);
    };
    // 滚动回调
    scrollEvent(target: HTMLElement | null) {
        if (!target) {
            return;
        }
        const {scrollTop} = target;
        const {start} = this;
        const currentStartIndex = this.getStartIndex(scrollTop);
        if (currentStartIndex !== start) {
            this.start = currentStartIndex;
        }
        this.updatePositions();
        this.currentOffset = this.getCurrentOffset();
        console.log('scrollEvent', {
            start: this.start,
            scrollTop,
            end: this.end,
            currentOffset: this.currentOffset,
            positions: this.positions,
        });
    };

    getIndexFromNode(node: Element) {
        return Number(get(node, 'dataset.id', 0)) - 1;
    }
    // 渲染后更新positions
    updatePositions() {
        const nodes = this.contentRef.current?.children || [];
        const startNode = nodes[0];
        for (const node of nodes) {
            if (!node) {
                continue;
            }
            // 获取 真实DOM高度
            const {height} = node.getBoundingClientRect();
            // 根据 元素索引 获取 缓存列表对应的列表项
            const index = this.getIndexFromNode(node);
            const oldHeight = this.positions[index].height;
            // dValue：真实高度与预估高度的差值 决定该列表项是否要更新
            const dValue = oldHeight - height;
            // 如果有高度差 !!dValue === true
            if(dValue) {
                // 更新对应列表项的 bottom 和 height
                this.positions[index].bottom = this.positions[index].bottom - dValue;
                this.positions[index].height = height;
                this.positions[index].dValue = dValue;
            }
        }
        let startIdx = 0;
        if (startNode) {
            startIdx = this.getIndexFromNode(startNode);
        }
        let diff = this.positions[startIdx].dValue;
        this.positions[startIdx].dValue = 0;
        // 依次更新positions中后续元素的 top bottom
        for(let k = startIdx + 1; k < this.positions.length; k++) {
            const item = this.positions[k];
            this.positions[k].top = this.positions[k - 1].bottom;
            this.positions[k].bottom = this.positions[k].bottom - diff;
            if (item.dValue !== 0) {
                diff += item.dValue;
                item.dValue = 0;
            }
        }
        this.listHeight = this.positions[this.positions.length - 1].bottom;
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