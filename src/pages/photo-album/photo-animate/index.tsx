import {useState, useEffect, useMemo, useRef, useCallback} from 'react'
import {Button, Select} from 'antd';
import cx from 'classnames';
import {imagesPaths} from '../images';
import {CanvasAnimate} from '../canvas-animate';
import style from './style.module.scss';

interface IProps {
  className?: string;
}
export function PhotoAnimate(props: IProps) {
  const {className} = props;
  return (
    <div className={cx(style.photoAnimate, className)}>
      <div className={style.photoBox}>
        <ul className={style.minBox}>
          {imagesPaths.inList.map((item, index) => {
            return (
              <li className={cx(style.photoIn, style[`photoInItem${item.count}`])} key={item.value}>
                <img className={style.img} src={item.url} alt={item.label} />
              </li>
            );
          })}
        </ul>
        <ol className={style.maxBox}>
          {imagesPaths.outList.map((item, index) => {
            return (
              <li className={cx(style.photoOut, style[`photoOutItem${item.count}`])} key={item.value}>
                <img className={style.img} src={item.url} alt={item.label} />
              </li>
            )
          })}
        </ol>
      </div>
      <CanvasAnimate />
    </div>
  )
}