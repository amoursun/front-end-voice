import {useLayoutEffect, memo, useState, useRef} from 'react';
import style from './style.module.scss';

export interface IItem {
  id: number;
  value: string;
  visible: boolean;
}
interface Props extends IItem {
  className?: string;
}
export const VirtualItem = memo((props: Props) => {
  const {value} = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const constRef = useRef<{visible: boolean}>({visible: false})
  const [visible, setVisible] = useState(false);
  useLayoutEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      // 判断是否已经渲染
      if (constRef.current.visible) {
        return;
      }
      const entry = entries[0];
      if (entry) {
        // 判断是否在可视区域
        if (entry.isIntersecting) {
          constRef.current.visible = true;
          setVisible(true);
        }
      }
    };
    const observer = new IntersectionObserver(callback);
    const element = ref.current;
    if (element) {
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
    };
  }, [ref, constRef]);
  useLayoutEffect(() => {
    if (!visible) {
      return;
    }
    const target = ref.current;
    if (target) {
      const {height} = target.getBoundingClientRect();
      target.style.height = `${height}px`;
    }
  }, [visible, ref]);
  return (
    <div className={style.content} ref={ref}>
      {visible && <div className={style.item}>{value}</div>}
    </div>
  );
});

