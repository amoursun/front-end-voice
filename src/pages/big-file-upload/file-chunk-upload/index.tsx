import {useState, useMemo, useEffect, useRef} from 'react';
import style from './style.module.scss';
import {Button} from 'antd';
import {sliceFile, uploadFile, handleEvent} from './util-file';

export function FileChunkUpload() {
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleChange = () => {
      setProgress(0);
  };
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
          const numStr = ((detail as number) / chunkLength).toFixed(2);
          setProgress(+numStr);
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
        <input type="file" ref={fileRef} onChange={handleChange} />
        <Button onClick={handleUpload}>提交</Button>
        <p>进度：{progress * 100}%</p>
      </div>
    </div>
  )
}

export default FileChunkUpload;
