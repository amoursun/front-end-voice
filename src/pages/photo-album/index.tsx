import {Button, Select} from 'antd';
import {PhotoAnimate} from './photo-animate';
import {AudioItem} from './audio-item';
import style from './style.module.scss';

export function PhotoAlbum() {
  return (
    <div className={style.photoAlbum}>
      <AudioItem className={style.audioItem} />
      <div className={style.container}>
        <PhotoAnimate className={style.photoAnimate} />
        <canvas className={style.canvas}></canvas>
      </div>
    </div>
  );
}

export default PhotoAlbum;