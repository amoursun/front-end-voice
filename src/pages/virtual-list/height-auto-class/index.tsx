import {generateList, IListItem} from '../method';
import Vlist from './v-list';
import style from './style.module.scss';

const data: IListItem[] = generateList({
    isAuto: true,
    repeatNum: 100,
});

const userVisibleHeight = 400;
const estimateRowHeight = 80;
const bufferSize = 5;

export default function dummyComp() {
  return (
    <Vlist
        height={userVisibleHeight}
        total={data.length}
        estimateRowHeight={estimateRowHeight}
        bufferSize={bufferSize}
        renderItem={(index: number) => {
            const item = data[index];
            return (
                <div
                    className={style.contentItem}
                    data-id={item.id}
                    key={item.id}
                >
                    <div className={style.contentInner}>
                    <div className={style.title}>{item.title}</div>
                    <div className={style.value}>{item.value}</div>
                    </div>
                </div>
            );
        }}
    />
  );
}
