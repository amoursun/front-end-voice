import {getList} from './get-list';
import style from './style.module.scss';
import {VirtualItem, IItem} from './item';

const data: IItem[] = getList();
export function VirtualList() {
  return (
    <div className={style.virtualList}>
      {data.map((item) => (
        <VirtualItem {...item} key={item.id} />
      ))}
    </div>
  )
}
export default VirtualList;
