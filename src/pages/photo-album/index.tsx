import {useState, useEffect, useMemo, useRef, useCallback} from 'react'
import {Button, Select} from 'antd';
import {AudioItem} from './audio-item';
import style from './style.module.scss';

export function PhotoAlbum() {
  return (
    <div className={style.photoAlbum}>
      <AudioItem />
      <div id="jsi-cherry-container" className="container">
        <div className="box">
            <ul className="min-box">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ol className="max-box">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ol>
        </div>
    </div>
    </div>
  )
}

export default PhotoAlbum;