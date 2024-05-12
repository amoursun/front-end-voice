import {useState, useEffect, useLayoutEffect, useRef} from 'react';
import {runInAction} from 'mobx';
import {observer, Observer} from 'mobx-react';
import {store} from './state';
import style from './style.module.scss';
import {debounce, throttle} from 'lodash-es';

export const VirtualList = observer(() => {
  const ref = useRef<HTMLDivElement | null>(null);
  const {visibleData, listHeight, currentOffset, refs} = store;
  useLayoutEffect(() => {
    // 绑定滚动事件
    const target = ref.current;
    const handleScroll = (event: Event) => store.scrollEvent(event.target as HTMLElement)
    const debounceScroll = debounce(handleScroll, 160);
    const throttleScroll = throttle(handleScroll, 80);
    if (target) {
      runInAction(() => {
        store.screenHeight = target.clientHeight;
      });
      target.addEventListener('scroll',  debounceScroll);
      target.addEventListener('scroll',  throttleScroll);
    }
    return () => {
      if (target) {
        target.removeEventListener('scroll',  debounceScroll);
        target.removeEventListener('scroll',  throttleScroll);
      }
    };
  }, [ref, store]);
  useEffect(() => {
    return () => {
      store.dispose();
    };
  }, []);
  // console.log(store, refs, 'store')
  return (
    <div className={style.virtualList} ref={ref}>
      <div className={style.phantom} style={{height: listHeight}}></div>
      <div
        className={style.content}
        style={{transform: `translate3d(0, ${currentOffset}px, 0)`}}
      >
        {visibleData.map((item, index) => {
          return (
            <Observer>
              {() => (
                <div
                  className={style.contentItem}
                  ref={r => {
                    runInAction(() => {
                      refs.push(r);
                    });
                  }}
                  data-id={item.id}
                  key={item.id || index}
                >
                  <div className={style.contentInner}>{item.value}</div>
                </div>
              )}
            </Observer>
          );
        })}
      </div>
    </div>
  );
});

export default VirtualList;
