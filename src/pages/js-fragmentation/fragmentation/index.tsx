import cx from 'classnames';
import style from './style.module.scss';
import {Button} from 'antd';
import {useRef} from 'react';
import {performChunk} from './perform-chunk';

const total = 100000;
export function Fragmentation() {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleClick = () => {
    // 记录开始时间
    console.time('耗时');
    performChunk(total, ref);
    console.timeEnd('耗时');
  };
  
  return (
    <div className={style.fragmentation} ref={ref}>
      <h3>分片任务</h3>
      <Button onClick={handleClick}>点击按钮向页面插入 100000 条数据</Button>
      <div className={cx(style.ball, style.ballAnimate)}></div>
    </div>
  );
}
