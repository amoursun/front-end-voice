import {useState, useMemo, useEffect, useRef} from 'react';
import {Button, Progress, message as toast} from 'antd';
import style from './style.module.scss';
import {get} from 'lodash-es';
import {getChunks, mergeChunks, verifyFile, uploadChunks} from './utils';

enum IUploadedTypeEnum {
    all = 'all',
    part = 'part',
    none = 'none',
}
export function FileChunkUpload() {
    const uploadedRef = useRef<Set<number>>(new Set());
    const [progress, setProgress] = useState(0);
    const fileRef = useRef<HTMLInputElement>(null);
    const handleUpload = async() => {
        const file = get(fileRef, 'current.files[0]');
        if(!file) {
            return;
        }
        const {data: {data, message}} = await verifyFile(file);
        if (data.uploadedType === IUploadedTypeEnum.all) {
            toast.warning(message);
            return;
        }
        else if (data.uploadedType === IUploadedTypeEnum.part) {
            const uploaded = data.uploaded || [];
            uploadedRef.current.clear();
            uploaded.forEach((item: number) => uploadedRef.current.add(item));
        }
        else if (data.uploadedType === IUploadedTypeEnum.none) {
            uploadedRef.current.clear();
        }

        const {chunks, total} = getChunks(file);
        const uploadedCount = await uploadChunks({
            chunks,
            file,
            uploaded: uploadedRef.current,
            onProgress: ({progress, index}) => {
                uploadedRef.current.add(index);
                setProgress(Number((progress / total * 100).toFixed(2)));
            }
        });

        if (uploadedCount === total) {
            mergeChunks(file);
        }
    };
    return (
        <div className={style.fileChunkUpload}>
        <h1>大文件分片上传</h1>
        <div className={style.content}>
            <input type="file" ref={fileRef} onChange={() => uploadedRef.current.clear()} />
            <Button onClick={handleUpload}>提交</Button>
            <Progress percent={progress} status="active" />
        </div>
        </div>
    );
}

export default FileChunkUpload;