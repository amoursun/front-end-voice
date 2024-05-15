import style from './style.module.scss';
import {VirtualSizeList} from '../../../components/virtual-list';
import {generateList, IListItem} from '../method';

const list: IListItem[] = generateList({isAuto: true});
export const VirtualList = () => {
  return (
    <div className={style.virtualListAuto}>
      <VirtualSizeList
        total={list.length}
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
