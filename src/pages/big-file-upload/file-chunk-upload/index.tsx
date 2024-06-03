import {useState, useMemo, useEffect, useRef} from 'react';
import style from './style.module.scss';
import {Button} from 'antd';
import {sliceFile, uploadFile, handleEvent} from './util-file';

export function FileChunkUpload() {
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleUpload = () => {
    const target = fileRef.current as unknown as {files: File[]};
    const file = target?.files[0];
    if(!file) {
      return;
    }
    console.time()
    const promise = sliceFile(file);
    promise.then(({chunks, chunkLength}) => {
        uploadFile(chunks);
        const {addEventListener} = handleEvent()

        const listener = addEventListener(window, ({detail}) => {
          setProgress((detail as number) / chunkLength);
          // // 上传完成，关闭事件监听
          if(detail === chunkLength) {
            listener();
          }
        })
    });

    console.timeEnd() 
  };
  return (
    <div className={style.fileChunkUpload}>
      <h1>大文件分片上传</h1>
      <div className={style.content}>
        <input type="file" ref={fileRef} />
        <Button onClick={handleUpload}>提交</Button>
        <p>进度：{progress * 100}%</p>
      </div>
    </div>
  )
}

export default FileChunkUpload;
