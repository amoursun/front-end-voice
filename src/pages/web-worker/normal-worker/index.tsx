import {CountWorker} from './worker';
import {LoadCountWorker} from './run-load-worker';
import {NoCountWorker} from './no-worker';
import style from './style.module.scss'

export function NormalWorker() {
    return (
        <div className={style.normalWorker}>
            <CountWorker />
            <NoCountWorker />
            <LoadCountWorker />
        </div>
    )
}
export default NormalWorker;