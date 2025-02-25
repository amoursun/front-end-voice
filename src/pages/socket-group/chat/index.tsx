import {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {io, Socket} from 'socket.io-client';
import {getId} from 'src/utils/util-get-id';
import {Form} from 'antd';
import style from './style.module.scss';
import {FormModal, UserFieldType} from './form-modal';
import {useCacheInfo} from './cache-info';

const socket = io('ws://172.21.207.60:3888', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 3,
    transports: ['websocket'], // transports: ['websocket', 'polling'],
});

interface ISocketItem {
    id: string;
    room: string;
    user: string;
    text: string;
}
interface IGroup {
    id: string;
    groupName: string;
    groupNumber: number;
}
function SocketGroupChat() {
  const infoStore = useCacheInfo();
  const [open, setOpen] = useState(() => {
    const info = infoStore.info;
    return !(info.room && info.user);
  });
  const [socketList, setSocketList] = useState<ISocketItem[]>([]);
  const iptRef = useRef<HTMLDivElement>(null);
  const [groupList, setGroupList] = useState<IGroup[]>([]);
  const sendMessage = useCallback((message: ISocketItem) => {
    void setSocketList(state => [...state, message]);
  }, []);

  useEffect(() => {
      const info = infoStore.info;
      if (socket) {
        // 连接成功socket
        socket.on('connect', () => {
            console.log('连接成功');
            socket.emit('join', info); // 加入一个房间
            socket.on('message', (message) => {
                console.log(message);
                sendMessage(message);
            });
            socket.on('groups', (groups: Record<string, Omit<ISocketItem, 'text'>[]>) => {
                console.log(groups);
                setGroupList(
                    Object.keys(groups).map(key => {
                        const list = groups[key as keyof typeof groups] || [];
                        return {
                            id: getId(),
                            groupName: key,
                            groupNumber: list.length,
                        }
                    })
                );
            });
        });
        socket.on('connect_error', function(error) {
            console.log(error.message);
        });
      }
      return () => {
        socket.off('connect');
        socket.off('message');
        socket.off('groups');
        socket.off('connect_error');
      };
  }, [sendMessage, infoStore]);
  
  return (
    <div className={style.socketGroupChat}>
      <div className={style.left}>
          <div className={style.groupList}>
              {groupList.map((item, index) => {
                  return (
                    <div className={style.groupListItem} key={item.id || index}>
                      房间名称:{item.groupName} 房间人数:{item.groupNumber}
                    </div>
                  );
              })}
          </div>
      </div>
      <div className={style.right}>
          <header className={style.header}>聊天室</header>
          <main className={style.main}>
              {socketList.map((item, index) => {
                  return (
                    <div className={style.mainChat} key={item.id || index}>
                      {item.user}: {item.text}
                    </div>
                  );
              })}
          </main>
          <footer className={style.footer}>
              <div
                className={style.ipt}
                contentEditable
                ref={iptRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const info = infoStore.info;
                    const value = {
                      text: iptRef.current?.innerText || '',
                      room: info.room,
                      user: info.user,
                    }
                    socket.emit('message', value);
                    if (iptRef.current) {
                      iptRef.current.innerText = '';
                    }
                  }
                }}
              ></div>
          </footer>
      </div>
      <Form.Provider
          onFormFinish={(name, {values, forms}) => {
              if (name === 'userForm') {
                  infoStore.update(values as UserFieldType)
                  setOpen(false);
              }
          }}
      >
          <FormModal open={open} />
      </Form.Provider>
    </div>
  )
}

export default observer(SocketGroupChat);
