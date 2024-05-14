import React, { ReactNode } from 'react';
import { binarySearch, CompareResult } from './binary-search';
import { get } from 'lodash-es';
import style from './style.module.scss';

export interface VirtualListProps {
  height: number;
  total: number;
  estimateRowHeight: number;
  renderItem(index: number): ReactNode;
  bufferSize?: number;
  noDataContent?: ReactNode;
}

interface CachedPosition {
  index: number;
  top: number;
  bottom: number;
  height: number;
  dValue: number;
}

export default class VirtualList extends React.Component<VirtualListProps> {
  state = {
    scrollTop: 0
  };

  height = this.props.height;
  total = this.props.total;
  estimatedRowHeight = this.props.estimateRowHeight;
  bufferSize = this.props.bufferSize || 5;

  scrollingContainer = React.createRef<HTMLDivElement>();

  // params that use for calculate visible content
  limit = Math.ceil(this.height / this.estimatedRowHeight);
  originStartIdx = 0;
  startIndex = 0;
  endIndex = Math.min(
    this.originStartIdx + this.limit + this.bufferSize,
    this.total - 1
  );

  // handle dynamic inner content height
  cachedPositions: CachedPosition[] = [];
  phantomContentRef = React.createRef<HTMLDivElement>();
  actualContentRef = React.createRef<HTMLDivElement>();
  phantomHeight = this.estimatedRowHeight * this.total;

  constructor(props: VirtualListProps) {
    super(props);
    this.initCachedPositions();
  }

  componentDidMount() {
    if (this.actualContentRef.current && this.total > 0) {
      this.updateCachedPositions();
    }
  }

  componentDidUpdate() {
    if (this.total !== this.props.total) {
      this.total = this.props.total;
      this.resetAllVirtualParam();
      return;
    }

    if (this.actualContentRef.current && this.total > 0) {
      this.updateCachedPositions();
    }
  }

  initCachedPositions = () => {
    const { estimatedRowHeight } = this;
    this.cachedPositions = [];
    for (let i = 0; i < this.total; ++i) {
      this.cachedPositions[i] = {
        index: i,
        height: estimatedRowHeight,
        top: i * estimatedRowHeight,
        bottom: (i + 1) * estimatedRowHeight,
        dValue: 0
      };
    }
  };

  getIndexFromNode(node: Element) {
    return Number(get(node, 'dataset.index', 0));
  }
  /**
   * Update cached positions when componentDidMount Triggered...
   */
  updateCachedPositions = () => {
    const nodes = this.actualContentRef.current?.children || [];
    const start = nodes[0];

    for (const node of nodes) {
      if (!node) {
          continue;
      }
      // 获取 真实DOM高度
      const {height} = node.getBoundingClientRect();
      // 根据 元素索引 获取 缓存列表对应的列表项
      const index = this.getIndexFromNode(node);
      const oldHeight = this.cachedPositions[index].height;
      const dValue = oldHeight - height;
      // 如果有高度差 !!dValue === true
      if (dValue) {
        this.cachedPositions[index].bottom -= dValue;
        this.cachedPositions[index].height = height;
        this.cachedPositions[index].dValue = dValue;
      }
    }

    // perform one time height update...
    let startIdx = 0;
    if (start) {
      startIdx = this.getIndexFromNode(start);;
    }
    const cachedPositionsLen = this.cachedPositions.length;
    let cumulativeDiffHeight = this.cachedPositions[startIdx].dValue;
    this.cachedPositions[startIdx].dValue = 0;

    for (let i = startIdx + 1; i < cachedPositionsLen; ++i) {
      const item = this.cachedPositions[i];
      // update height
      this.cachedPositions[i].top = this.cachedPositions[i - 1].bottom;
      this.cachedPositions[i].bottom =
        this.cachedPositions[i].bottom - cumulativeDiffHeight;

      if (item.dValue !== 0) {
        cumulativeDiffHeight += item.dValue;
        item.dValue = 0;
      }
    }

    // update our phantom div height
    const height = this.cachedPositions[cachedPositionsLen - 1].bottom;
    this.phantomHeight = height;
    if (this.phantomContentRef.current) {
      this.phantomContentRef.current.style.height = `${height}px`;
    }
  };

  getStartIndex = (scrollTop = 0) => {
    let idx = binarySearch<CachedPosition, number>(
      this.cachedPositions,
      scrollTop,
      (currentValue: CachedPosition, targetValue: number) => {
        const currentCompareValue = currentValue.bottom;
        if (currentCompareValue === targetValue) {
          return CompareResult.eq;
        }

        if (currentCompareValue < targetValue) {
          return CompareResult.lt;
        }

        return CompareResult.gt;
      }
    );

    if (idx === null) {
      idx = 0;
    }
    const targetItem = this.cachedPositions[idx];

    // Incase of binarySearch give us a not visible data(an idx of current visible - 1)...
    if (targetItem.bottom < scrollTop) {
      idx += 1;
    }

    return idx;
  };

  /**
   * Rest all VList helper param when total changes
   */
  resetAllVirtualParam = () => {
    this.originStartIdx = 0;
    this.startIndex = 0;
    this.endIndex = Math.min(
      this.originStartIdx + this.limit + this.bufferSize,
      this.total - 1
    );
    if (this.scrollingContainer.current) {
      this.scrollingContainer.current.scrollTop = 0;
    }
    this.initCachedPositions();

    // rest phantom div height
    this.phantomHeight = this.estimatedRowHeight * this.total;
    this.setState({ scrollTop: 0 });
  };

  onScroll = (evt: any) => {
    if (evt.target === this.scrollingContainer.current) {
      const { scrollTop } = evt.target;
      const { originStartIdx, bufferSize, total } = this;

      const currentStartIndex = this.getStartIndex(scrollTop);

      if (currentStartIndex !== originStartIdx) {
        // we need to update visualized data
        this.originStartIdx = currentStartIndex;
        this.startIndex = Math.max(this.originStartIdx - bufferSize, 0);
        this.endIndex = Math.min(
          this.originStartIdx + this.limit + bufferSize,
          total - 1
        );
        this.setState({ scrollTop });
      }
    }
  };

  /**
   * Prepare visible data
   */
  renderDisplayContent = () => {
    const content = [];
    for (let i = this.startIndex; i <= this.endIndex; ++i) {
      content.push((
        <div data-index={i} key={i}>
          {this.props.renderItem(i)}
        </div>
      ));
    }
    return content;
  };

  getTransform = () =>
    `translate3d(0,${
      this.startIndex >= 1
        ? this.cachedPositions[this.startIndex - 1].bottom
        : 0
    }px,0)`;

  render() {
    const { height, phantomHeight, total } = this;
    return (
      <div className={style.virtualListAuto} ref={this.scrollingContainer} onScroll={this.onScroll}>
      <div className={style.phantom} ref={this.phantomContentRef} style={{height: phantomHeight}}></div>
        <div
          className={style.content}
          ref={this.actualContentRef}
          style={{
            transform: this.getTransform()
          }}
        >
          {this.renderDisplayContent()}
        </div>
      </div>
    );
  }
}
