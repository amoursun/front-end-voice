import {useState, useEffect, useMemo, useRef} from 'react';
import style from './style.module.scss';
import {Input, Spin} from 'antd';
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
      const {width, height} = canvasRect;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = dogPng;
      img.onload = function () {
        draw();
      };
      function draw() {
        ctx?.drawImage(img, 0, 0, width, height);
      }
    }
    
  }, [ref]);
  return (
    <Spin tip={'Loading...'} spinning={loading}>
      <div className={style.imageAnnotationTool}>
        <canvas ref={ref} width={canvasRect.width} height={canvasRect.height}></canvas>
      </div>
    </Spin>
  );
}

export default ImageAnnotationTool;
