import style from './style.module.scss';
import {VirtualSizeList, IVirtualSizeListRefProps} from '../../../components/virtual-list';
import {generateList, IListItem, GENERATE_LIST_NUM} from '../method';
import {useRef, useState, useCallback} from 'react';

const limit = GENERATE_LIST_NUM * 3;
export const VirtualList = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IListItem[]>(generateList({isAuto: true}));
  const ref = useRef<IVirtualSizeListRefProps>({});
  const updateLoadList = useCallback(() => {
    setLoading(true);
    const l = list.length;
    if (l < limit) {
      const nextList = generateList({
        isAuto: true,
        calculate: l,
        num: Math.min(limit - l, GENERATE_LIST_NUM),
      });
      new Promise((resolve) => {
        setTimeout(resolve, 2000); // 模拟异步加载
      }).then(() => {
        setList([...list, ...nextList]);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [list]);
  return (
    <div className={style.virtualListAuto}>
      <VirtualSizeList
        total={list.length}
        ref={ref}
        loading={loading}
        updateData={updateLoadList}
        renderItem={(index) => {
          const item = list[index];
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
        }}
      />
    </div>
  );
};

export default VirtualList;
