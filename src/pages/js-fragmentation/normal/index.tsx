import cx from 'classnames';
import style from './style.module.scss';
import {Button} from 'antd';
import {useRef} from 'react';

const total = 100000;
export function Normal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleClick = () => {
    const dom = ref.current;
    if (!dom) return;
    // 记录开始时间
    console.time('耗时');
    for (let i = 0; i < total; i++) {
      const div = document.createElement('div');
      div.innerText = `${i}-内容`;
      dom.appendChild(div);
    }
    console.timeEnd('耗时');
  };
  
  return (
    <div className={style.normal} ref={ref}>
      <h3>无分片任务</h3>
      <Button onClick={handleClick}>点击按钮向页面插入 100000 条数据</Button>
      <div className={cx(style.ball, style.ballAnimate)}></div>
    </div>
  );
}
