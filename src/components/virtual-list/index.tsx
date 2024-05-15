import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import style from './style.module.scss';
import {debounce, get} from 'lodash-es';
import {binarySearch} from './binary-search';

function getIndexFromNode(node: Element) {
  return Number(get(node, 'dataset.index', 0));
}
function getStartIndex(params: {
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
export interface VirtualSizeListProps {
  /**
   * 列表总个数
   */
  total: number;
  /**
   * 初始渲染的列表项高度
   * - 固定高度：itemHeight
   * - 自动高度：初始高度, 后续自身变化
   */
  itemHeight?: number;
  /**
   * 列表项渲染类型
   * 固定高度：fixed
   * 自动高度：auto
   */
  itemType?: 'fixed' | 'auto';
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
export interface IPosition {
  index: number;
  top: number;
  bottom: number;
  height: number;
  dValue: number;
}
export const VirtualSizeList = forwardRef((props: VirtualSizeListProps, ref) => {
  const {
    total,
    bufferRange = 1,
    itemHeight = 100,
    itemType = 'auto',
  } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [phantomHeight, setPhantomHeight] = useState(itemHeight * total);
  const [positions, setPositions] = useState<IPosition[]>(() => {
    const positions = [];
    for (let i = 0; i < total; ++i) {
      positions.push({
        index: i,
        height: itemHeight,
        top: i * itemHeight,
        bottom: (i + 1) * itemHeight,
        dValue: 0,
      });
    }
    return positions;
  });
  const [screenHeight, setScreenHeight] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  useLayoutEffect(() => {
    const target = containerRef.current;
    if (target) {
      setScreenHeight(target.clientHeight);
    }
  }, [containerRef]);

  const visibleSize = Math.ceil(screenHeight / itemHeight);
  const bufferSize = bufferRange * visibleSize;
  const endIndex = useMemo(() => {
    return Math.min(
      visibleStartIndex + visibleSize + bufferSize,
      total - 1
    );
  }, [total, visibleSize, visibleStartIndex, bufferSize]);
  const updatePositions = useCallback(() => {
    const nodes = contentRef.current?.children || [];
    const start = nodes[0];
    for (const node of nodes) {
      if (!node) {
          continue;
      }
      // 获取 真实DOM高度
      const {height} = node.getBoundingClientRect();
      // 根据 元素索引 获取 缓存列表对应的列表项
      const index = getIndexFromNode(node);
      const oldHeight = positions[index].height;
      const dValue = oldHeight - height;
      // 如果有高度差 !!dValue === true
      if (dValue) {
        positions[index].bottom -= dValue;
        positions[index].height = height;
        positions[index].dValue = dValue;
      }
    }
    let startIdx = 0;
    if (start) {
      startIdx = getIndexFromNode(start);;
    }
    const length = positions.length;
    let diff = positions[startIdx].dValue;
    positions[startIdx].dValue = 0;
    for (let i = startIdx + 1; i < length; ++i) {
      const item = positions[i];
      positions[i].top = positions[i - 1].bottom;
      positions[i].bottom = positions[i].bottom - diff;

      if (item.dValue !== 0) {
        diff += item.dValue;
        item.dValue = 0;
      }
    }
    const height = positions[length - 1].bottom;
    setPhantomHeight(height);
    setPositions(positions);
  }, [contentRef, positions]);
  useEffect(() => {
    updatePositions();
  }, []);
  
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const {scrollTop} = container;

      const currentStartIndex = getStartIndex({
        scrollTop,
        positions,
      });

      if (currentStartIndex !== visibleStartIndex) {
        setVisibleStartIndex(currentStartIndex);
        setStartIndex(Math.max(currentStartIndex - bufferSize, 0));
        // setState({ scrollTop });
      }
    }
  }, [visibleStartIndex, bufferSize, total, positions]);
  const transform = useMemo(() => {
    return `translate3d(0,${
      startIndex >= 1
        ? positions[startIndex - 1].bottom
        : 0
    }px,0)`
  }, [startIndex, positions]);
  const visibleList = useMemo(() => {
    const contents = [];
    for (let i = startIndex; i <= endIndex; ++i) {
      contents.push((
        <div data-index={i} key={i}>
          {props.renderItem(i)}
        </div>
      ));
    }
    return contents;
  }, [startIndex, endIndex]);
  return (
    <div className={style.virtualListAuto} ref={containerRef} onScroll={handleScroll}>
      <div className={style.phantom} style={{height: phantomHeight}}></div>
      <div
        className={style.content}
        ref={contentRef}
        style={{transform: transform}}
      >
        {visibleList}
      </div>
    </div>
  );
});

