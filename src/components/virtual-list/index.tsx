import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import cx from 'classnames';
import style from './style.module.scss';
import {debounce} from 'lodash-es';
import {getStartIndex} from './binary-search';
import {useVirtualIndex} from './use-virtual-index';
import {usePositions} from './use-positions';
import {useScreenHeight} from './use-screen-height';


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

export const VirtualSizeList = forwardRef((props: VirtualSizeListProps, ref) => {
  const {
    className,
    total,
    bufferRange = 1,
    itemHeight = 100,
    renderType = 'auto',
  } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const screenHeight = useScreenHeight(containerRef);
  const {
    startIndex,
    endIndex,
    viewStartIndex,
    setViewStartIndex,
  } = useVirtualIndex({
    height: screenHeight,
    total,
    bufferRange,
    itemHeight,
  });
  const {positions} = usePositions({
    total,
    itemHeight,
    renderType,
    startIndex,
    renderContainerRef: contentRef,
  });
  
  const handleScroll = useCallback(debounce(() => {
    const container = containerRef.current;
    if (container) {
      const {scrollTop} = container;
      const currentStartIndex = getStartIndex({
        scrollTop,
        positions,
      });
      if (currentStartIndex !== viewStartIndex) {
        setViewStartIndex(currentStartIndex);
      }
    }
  }, 15), [viewStartIndex, total, positions]);
  const transformValue = startIndex >= 1 ? positions[startIndex - 1].bottom : 0;
  const visibleList = useMemo(() => {
    const contents = [];
    for (let i = startIndex; i <= endIndex; ++i) {
      contents.push((
        <div
          className={cx(style.contentArea, {
            [style.fixed]: renderType === 'fixed',
          })}
          style={{
            height: renderType === 'fixed' ? itemHeight : 'auto',
          }}
          data-index={i}
          key={i}
        >
          {props.renderItem(i)}
        </div>
      ));
    }
    return contents;
  }, [startIndex, endIndex]);
  return (
    <div className={cx(style.virtualListWrapper, className)} ref={containerRef} onScroll={handleScroll}>
      <div
        className={style.phantom}
        style={{height: positions[positions.length - 1].bottom}}
      />
      <div
        className={style.content}
        ref={contentRef}
        style={{transform: `translate3d(0,${transformValue}px,0)`}}
      >
        {visibleList}
      </div>
    </div>
  );
});

