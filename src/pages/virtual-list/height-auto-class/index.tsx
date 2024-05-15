import {VirtualSizeList} from '../../../components/virtual-list-v2';
import {generateList, IListItem} from '../method';
import style from './style.module.scss';

const data: IListItem[] = generateList({
    isAuto: true,
    repeatNum: 100,
});

export default function dummyComp() {
    return (
        <div className={style.virtualListAuto}>
            <VirtualSizeList
                total={data.length}
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
        </div>
    );
}
