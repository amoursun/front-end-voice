import {useEffect, useRef} from 'react'
import {Soul} from './soul';
import style from './style.module.scss';


export default function WebglSoulPlanet() {
    const ref = useRef<HTMLDivElement>(null);
    const soulRef = useRef<Soul | null>(null);
    useEffect(() => {
        if (ref.current && !soulRef.current) {
            soulRef.current = new Soul(ref.current);
        }
        () => {
            soulRef.current = null;
        };
    }, [ref, soulRef]);
    return (
        <div className={style.webglSoulPlanet} ref={ref}>
        </div>
    );
};
