import {useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import {runInAction} from 'mobx';
import {observer} from 'mobx-react';
import {store} from './state';
import style from './style.module.scss';
import {debounce} from 'lodash-es';

export const VirtualList = observer(() => {
  const ref = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const {visibleData, listHeight, currentOffset} = store;
  const handleScroll = useCallback(debounce(() => {
    store.scrollEvent(ref.current);
  }, 15), []);
  useLayoutEffect(() => {
    const target = ref.current;
    if (target) {
      runInAction(() => {
        store.screenHeight = target.clientHeight;
        store.contentRef = contentRef;
      });
    }
    return () => {
      store.dispose();
    };
  }, [ref, contentRef, store]);
  // console.log(store, refs, 'store')
  return (
    <div className={style.virtualListAuto} ref={ref} onScroll={handleScroll}>
      <div className={style.phantom} style={{height: listHeight}}></div>
      <div
        className={style.content}
        ref={contentRef}
        style={{transform: `translate3d(0, ${currentOffset}px, 0)`}}
      >
        {visibleData.map((item, index) => {
          return (
            <div
              className={style.contentItem}
              data-id={item.id}
              key={item.id || index}
            >
              <div className={style.contentInner}>
                <div className={style.title}>{item.title}</div>
                <div className={style.value}>{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default VirtualList;
