import {useLayoutEffect, useRef} from 'react';
import cx from 'classnames';
import {state} from './state';
import style from './style.module.scss';

interface IProps {
  className?: string;
}
export function CanvasAnimate(props: IProps) {
  const {className} = props;
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    state.init(canvas);
  }, [ref]);
  
  return (
    <canvas
      className={cx(style.canvasAnimate, className)}
      ref={ref}
    ></canvas>
  );
}