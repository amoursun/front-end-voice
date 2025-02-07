import {useState, useEffect, useContext, useRef} from 'react';
import {Button} from 'antd';
import {setupLearnSDK} from './learn-sdk-bootstrap';
import style from './style.module.scss';

const createDom = () => {
  const create = document.createElement('create-app');
  document.body.appendChild(create);
  return create;
};
export function ShadowDom() {
  const handleSetupSDK1 = () => {
      const {getSDK} = setupLearnSDK({
          sdkEnv: 'dev',
      });
      void getSDK().then(sdk => {
          sdk.mount();
      });
  };

  

  const handleSetupSDK2 = () => {
      const {getSDK} = setupLearnSDK({
          sdkEnv: 'dev',
      });
      void getSDK().then(sdk => {
          sdk.mount(createDom());
      });
  };
  return (
    <div className={style.shadowDom}>
      <Button className={style.button} type="primary" onClick={handleSetupSDK1}>加载默认sdk</Button>
      <Button className={style.button} type="primary" onClick={handleSetupSDK2}>加载create容器sdk</Button>
    </div>
  )
}

export default ShadowDom;
