import {useState, useEffect, useContext, useRef} from 'react';
import style from './style.module.scss';

export function SearchImageText() {
  const ref = useRef<Array<HTMLDivElement | null>>([]);
  return (
    <div className={style.searchImageText}>
      
    </div>
  )
}

export default SearchImageText;
