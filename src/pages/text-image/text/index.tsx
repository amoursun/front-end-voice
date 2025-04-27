import {useRef, useEffect} from 'react';
import style from './style.module.scss';
import { createTextImage } from 'src/components/text-image-animate';

export function TextAnimate() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        createTextImage({
            canvas: canvasRef.current,
            source: {
                text: 'gan**',
            },
            replaceText: '甘**',
        });
    }, [canvasRef]);

    return (
        <div className={style.textAnimate}>
            <h1>文字「文本化」</h1>
            <canvas ref={canvasRef} width={500} height={500} className={style.canvas} />
        </div>
    );
}

export default TextAnimate;
