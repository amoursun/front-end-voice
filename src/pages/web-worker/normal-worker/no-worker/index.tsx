import {useState} from 'react';
import {Input, Button} from 'antd';
import style from './style.module.scss'

const total = 5000 * 1000 * 1000;
export function NoCountWorker() {
    const [count, setCount] = useState(0);
    const [value, setValue] = useState('');
    const handleCount = () => {
        console.time('NoCountWorker');
        let result = 0;
        for (let i = 0; i < total; i++) {
            result += i;
        }
        setCount(result);
        console.timeEnd('NoCountWorker');
    };
    return (
        <div className={style.noWorker}>
            <h3>No CountWorker</h3>
            <Button onClick={handleCount}>触发计算任务</Button>
            <div>
                <Input value={value} onChange={e => setValue(e.target.value)} />
                <div>计算{total}累加: <span className={style.bold}>{count}</span></div>
            </div>
        </div>
    )
}