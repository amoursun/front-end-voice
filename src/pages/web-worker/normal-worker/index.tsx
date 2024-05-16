import {CountWorker} from './worker';
import {NoCountWorker} from './no-worker';
import style from './style.module.scss'

export function NormalWorker() {
    return (
        <div className={style.normalWorker}>
            <CountWorker />
            <NoCountWorker />
        </div>
    )
}
export default NormalWorker;