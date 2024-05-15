import React, {ReactNode} from 'react';
import cx from 'classnames';
import {binarySearch, ICompareEnum, IPosition} from './binary-search';
import {get} from 'lodash-es';
import style from './style.module.scss';

function getIndexFromNode(node: Element) {
  return Number(get(node, 'dataset.index', 0));
}
export interface VirtualSizeListProps {
  className?: string;
  /**
   * 列表总个数
   */
  total: number;
  /**
   * 初始渲染的列表项高度
   * - 固定高度：itemHeight
   * - 自动高度：初始高度, 后续自身变化
   * 默认 100
   */
  itemHeight?: number;
  /**
   * 列表项渲染类型
   * 固定高度：fixed
   * 自动高度：auto
   */
  renderType?: 'fixed' | 'auto';
  /**
   * 列表渲染上下缓冲区 bufferRange
   * 渲染高度: 可视区列表高度(screenHeight) 可视区top(top)
   *    [top - bufferRange * screenHeight, top + screenHeight + bufferRange * screenHeight]
   *    bufferRange: 1 => 最大渲染 3 * screenHeight 高度的内容
   * 默认：1
   */
  bufferRange?: 0.5 | 1 | 1.5 | 2;
  /**
   * 渲染单元, 外部自己控制格式
   * @param index 渲染索引
   */
  renderItem: (index: number) => React.ReactNode;
}
export class VirtualSizeList extends React.PureComponent<VirtualSizeListProps> {
  state = {
    scrollTop: 0,
    screenHeight: 0,
    phantomHeight: this.itemHeight * this.props.total,
  };
  defaultProps = {
    itemHeight: 100,
    bufferRange: 1,
  }

  positions: IPosition[] = [];
  originStartIdx = 0;
  get startIndex(): number {
    return Math.max(this.originStartIdx - this.bufferSize, 0);
  }
  get endIndex(): number {
    return Math.min(
      this.originStartIdx + this.visibleSize + this.bufferSize,
      this.total - 1
    );
  }
  get total(): number {
    return this.props.total;
  }
  get itemHeight(): number {
    return this.props.itemHeight || 100;;
  }
  get visibleSize(): number {
    return Math.ceil(this.state.screenHeight / this.itemHeight)
  }
  get bufferSize(): number {
    const {bufferRange = 1} = this.props;
    return bufferRange * this.visibleSize;
  }

  // ref
  containerRef = React.createRef<HTMLDivElement>();
  contentRef = React.createRef<HTMLDivElement>();

  constructor(props: VirtualSizeListProps) {
    super(props);
    this.initPositions();
  }

  componentDidMount() {
    if (this.containerRef.current) {
      this.updatePositions();
      this.setState({
        screenHeight: this.containerRef.current.clientHeight,
      });
    }
  }
  componentDidUpdate(nextProps: VirtualSizeListProps) {
    if (nextProps.total !== this.props.total) {
      this.resetAllVirtualParam();
      return;
    }

    if (this.contentRef.current && this.total > 0) {
      this.updatePositions();
    }
  }
  initPositions = () => {
    const {itemHeight} = this;
    this.positions = [];
    for (let i = 0; i < this.total; ++i) {
      this.positions[i] = {
        index: i,
        height: itemHeight,
        top: i * itemHeight,
        bottom: (i + 1) * itemHeight,
        dValue: 0
      };
    }
  };
  
  updatePositions = () => {
    const nodes = this.contentRef.current?.children || [];
    const start = nodes[0];

    for (const node of nodes) {
      if (!node) {
          continue;
      }
      // 获取 真实DOM高度
      const {height} = node.getBoundingClientRect();
      // 根据 元素索引 获取 缓存列表对应的列表项
      const index = getIndexFromNode(node);
      const oldHeight = this.positions[index].height;
      const dValue = oldHeight - height;
      // 如果有高度差 !!dValue === true
      if (dValue) {
        this.positions[index].bottom -= dValue;
        this.positions[index].height = height;
        this.positions[index].dValue = dValue;
      }
    }

    // perform one time height update...
    let startIdx = 0;
    if (start) {
      startIdx = getIndexFromNode(start);;
    }
    const cachedPositionsLen = this.positions.length;
    let diff = this.positions[startIdx].dValue;
    this.positions[startIdx].dValue = 0;

    for (let i = startIdx + 1; i < cachedPositionsLen; ++i) {
      const item = this.positions[i];
      this.positions[i].top = this.positions[i - 1].bottom;
      this.positions[i].bottom = this.positions[i].bottom - diff;

      if (item.dValue !== 0) {
        diff += item.dValue;
        item.dValue = 0;
      }
    }

    const height = this.positions[cachedPositionsLen - 1].bottom;
    this.setState({
      phantomHeight: height,
    })
  };

  getStartIndex = (scrollTop = 0) => {
    let idx = binarySearch(this.positions, scrollTop);
    if (idx === -1) {
      idx = 0;
    }
    const targetItem = this.positions[idx];
    if (targetItem.bottom < scrollTop) {
      idx += 1;
    }
    return idx;
  };

  resetAllVirtualParam = () => {
    this.originStartIdx = 0;
    if (this.containerRef.current) {
      this.containerRef.current.scrollTop = 0;
    }
    this.initPositions();

    this.setState({scrollTop: 0, phantomHeight: this.itemHeight * this.total});
  };

  onScroll = () => {
    const target = this.containerRef.current;
    // if (evt.target && evt.target === this.containerRef.current) {
    if (target) {
      const {scrollTop} = target;
      const {originStartIdx} = this;

      const currentStartIndex = this.getStartIndex(scrollTop);

      if (currentStartIndex !== originStartIdx) {
        this.originStartIdx = currentStartIndex;
        this.setState({ scrollTop });
      }
    }
  };

  renderContents = () => {
    const contents = [];
    for (let i = this.startIndex; i <= this.endIndex; ++i) {
      contents.push((
        <div data-index={i} key={i}>
          {this.props.renderItem(i)}
        </div>
      ));
    }
    return contents;
  };

  get transform() {
    const value = this.startIndex >= 1 ? this.positions[this.startIndex - 1].bottom : 0;
    return `translate3d(0,${value}px,0)`;
  }

  render() {
    const {className} = this.props;
    return (
      <div className={cx(style.virtualListWrapper, className)} ref={this.containerRef} onScroll={this.onScroll}>
        <div className={style.phantom} style={{height: this.state.phantomHeight}}></div>
        <div
          className={style.content}
          ref={this.contentRef}
          style={{transform: this.transform}}
        >
          {this.renderContents()}
        </div>
      </div>
    );
  }
}
