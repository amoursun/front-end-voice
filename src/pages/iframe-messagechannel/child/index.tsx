import {useState, useLayoutEffect} from 'react';
import {Button} from 'antd';
import {MessageChannelState} from '../messagechannel-state';
import {IUserInfo} from '../type';
import style from './style.module.scss';

export function IframeMessageChannelChild() {
  const [data, setData] = useState<IUserInfo[]>([]);
  const [port] = useState<MessagePort[]>(() => {
    const messageChannel = new MessageChannelState();
    return [messageChannel.portOne, messageChannel.portTwo];
  });
  useLayoutEffect(() => {
      port[0].onmessage = (event: MessageEvent) => {
          console.log('from parent data: ', event.data);
          const {type, data} = event.data;
          if (type === 'update') {
            setData(data);
          }
      };
      // 将MessageChannel port 传递给父页面，以便建立连接
      window.postMessage('iframe', '*', [port[1]]);
      // return () => {
      //     // 清理资源
      // };
  }, [port]);

  const sendMessage = () => {
      port[0].postMessage({type: 'update_parent'});
  };
  return (
    <div className={style.iframeMessageChannelChild}>
      <Button onClick={sendMessage}>发送消息到parent</Button>
      <h1>iframe MessageChannel 通信子页面</h1>
      <div>
        {(data || []).map((item, index) => {
            return (
                <div className={style.item} key={item.id || index}>
                    <div>id: {item.id}</div>
                    <div>name: {item.name}</div>
                    <div>age: {item.age}</div>
                    <div>address: {item.address}</div>
                    <div>phone: {item.phone}</div>
                    <div>email: {item.email}</div>
                </div>
            );
        })}
      </div>
    </div>
  )
}

export default IframeMessageChannelChild;
