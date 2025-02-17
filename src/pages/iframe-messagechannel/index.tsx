import {useState, useLayoutEffect, useRef} from 'react';
import {Button} from 'antd';
import style from './style.module.scss';

export function IframeMessageChannel() {
  const [port, setPort] = useState<MessagePort>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useLayoutEffect(() => {
      const contentWindow = iframeRef.current?.contentWindow;
      const handler = (event: MessageEvent) => {
          if (event.data === 'iframe' && event.ports[0]) {
              const port = event.ports[0];
              setPort(port);
              // 监听来自子窗口的消息
              port.onmessage = (ev) => {
                  console.log('from child data: ', ev.data);
              };
              // 通信 ready 后发送给子窗口
              port.postMessage({
                  type: 'ready',
              });
          }
      }
      // 监听来自子窗口的消息
      contentWindow?.addEventListener('message', handler);
  }, [iframeRef]);
  
  const sendMessage = () => {
      port?.postMessage({
          type: 'update',
          data: new Array(100).fill(0).map((_, i) => {
              return {
                id: i,
                name: `name-${i}`,
                age: i,
                address: `address-${i}`,
                email: `email-${i}`,
                phone: `phone-${i}`,
                avatar: `avatar-${i}`,
              };
          }),
      });
  };
  return (
    <div className={style.iframeMessageChannel}>
      <h1>MessageChannel iframe 通信</h1>
      <Button onClick={sendMessage}>发送消息到child</Button>
      <iframe
        className={style.iframe}
        ref={iframeRef}
        src="http://localhost:3000/#/iframe-messagechannel-child"
      />
    </div>
  )
}

export default IframeMessageChannel;
