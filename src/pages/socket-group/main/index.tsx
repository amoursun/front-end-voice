import {useState, useEffect, useMemo} from 'react'
import {Button, Input} from 'antd';
import style from './style.module.scss';

const {TextArea} = Input;
function SocketGroupMain() {
  return (
    <div className={style.socketGroupMain}>
      <TextArea
        autoSize={{minRows: 5, maxRows: 15}}
      />
    </div>
  )
}

export default SocketGroupMain;
