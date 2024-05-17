import {useState, useEffect, useMemo, useRef} from 'react';
import style from './style.module.scss';
import {Input, Spin} from 'antd';
import {annotationState} from './annotation';
import dogPng from './images/dog.png';

const canvasRect = {
  width: 1000,
  height: 700,
}
export function ImageAnnotationTool() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      annotationState
        .createContext(canvas)
        .loadImage(dogPng);
    }
    annotationState.eventListener();
    return () => {
      annotationState.dispose();
    };
    
  }, [ref]);
  return (
    <Spin tip={'Loading...'} spinning={loading}>
      <div className={style.imageAnnotationTool}>
        <canvas
          ref={ref}
          width={canvasRect.width}
          height={canvasRect.height}
        />
      </div>
    </Spin>
  );
}

export default ImageAnnotationTool;
