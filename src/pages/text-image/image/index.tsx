import {useRef, useEffect} from 'react';
import style from './style.module.scss';
import { createTextImage } from 'src/components/text-image-animate';

export function ImageAnimate() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        createTextImage({
            canvas: canvasRef.current,
            radius: 8,
            isGray: false,
            source: {
                img: './assets/1.png',
            },
        });
    }, [canvasRef]);

    return (
        <div className={style.imageAnimate}>
            <h1>图片「文本化」</h1>
            <canvas ref={canvasRef} width={500} height={500} className={style.canvas} />
        </div>
    );
}

export default ImageAnimate;
