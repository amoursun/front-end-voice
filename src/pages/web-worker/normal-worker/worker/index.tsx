import {useEffect, useState, useRef} from 'react';
import {Input, Spin, Button} from 'antd';
import style from './style.module.scss'

const total = 5000 * 1000 * 1000;
export function CountWorker() {
    const ref = useRef<Worker>();
    const [count, setCount] = useState(0);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        ref.current = new Worker(
            new URL('./worker.ts',
            import.meta.url
        ));
    }, [ref]);
    const handleCount = () => {
        setLoading(true);
        const worker = ref.current;
        if (worker) {
            console.time('NormalWorker');
            worker.postMessage(total);
            worker.onmessage = function(event) {
                setCount(event.data);
                console.timeEnd('NormalWorker');
                setLoading(false);
            };
        }
    };
    return (
        <div className={style.worker}>
            <h3>CountWorker</h3>
            <Button onClick={handleCount}>触发计算任务</Button>
            <div>
                <Input value={value} onChange={e => setValue(e.target.value)} />
                <div>
                    计算{total}累加: 
                    {loading ? (
                        <Spin size={'small'} />
                    ) : (
                        <span className={style.bold}>{count}</span>
                    )}
                </div>
            </div>
        </div>
    )
}