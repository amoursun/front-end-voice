import React, { useState, useCallback, useEffect, useRef } from "react";

function getValueTime(value: number) {
    return value / 1000;
}

export default function App() {
    const [time, setTime] = useState(5000);
    const ref = useRef<NodeJS.Timeout | null>(null);
    const clear = () => {
        clearInterval(ref.current);
        ref.current = null;
    };
    const onStart = useCallback((type?: string) => {
        if (type !== 'start' && time <= 0) {
            clear();
            return;
        }
        if (!ref.current) {
            ref.current = setInterval(() => {
                setTime((state) => {
                   
                    const value = state - 1000;
                    if (value <= 0) {
                        clear();
                    }
                    return value;
                });
            }, 1000);
        }
    }, []);
    const onPause = useCallback(() => {
        clear();
    }, []);
    const onReset = useCallback(() => {
        setTime(5000);
        clear();
        onStart('start');
    }, []);
    useEffect(() => {
        onStart();
    }, []);

    return (
        <div>
        {getValueTime(time)}
        <button onClick={() => onStart()}>开始</button>
        <button onClick={onPause}>暂停</button>
        <button onClick={onReset}>重置</button>
        </div>
    );
}
