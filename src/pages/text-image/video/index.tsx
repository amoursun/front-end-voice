import {useRef, useEffect} from 'react';
import style from './style.module.scss';
import { createTextImage } from 'src/components/text-image-animate';

export function VideoAnimate() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        createTextImage({
            canvas: canvasRef.current,
            radius: 6,
            isGray: true,
            source: {
                video: './assets/1.mp4',
                height: 500,
            },
        });
    }, [canvasRef]);

    return (
        <div className={style.videoAnimate}>
            <h1>视频「文本化」</h1>
            <canvas ref={canvasRef} width={500} height={500} className={style.canvas} />
        </div>
    );
}

export default VideoAnimate;
