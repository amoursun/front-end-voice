import style from './style.module.scss';
import {Normal} from './normal';
import {Fragmentation} from './fragmentation';

export function ScrollAnimation() {
  return (
    <div className={style.jsFragmentation}>
      <div><Normal /></div>
      <div><Fragmentation /></div>
    </div>
  );
}

export default ScrollAnimation;
