import axios, {AxiosResponse} from 'axios';

/**
 * 文件切片
 * @param file {File} 大文件
 * @param size {number} 切片大小
 */
export const chunkSize = 10 * 1024 * 1024;
export const getChunks = (file: File, size = chunkSize): {
    chunks: Blob[];
    total: number;
} => {
    let start = 0;
    const chunks: Blob[] = [];
    while (start < file.size) {
        const chunk = file.slice(start, start + size);
        chunks.push(chunk);
        start += size;
    }
    return {
        chunks,
        total: chunks.length,
    };
};

/**
 * 合并文件接口
 * @param file 
 */
export function mergeChunks(file: File, size = chunkSize) {
    return axios({
        url: 'http://localhost:3002/merge',
        method: 'post',
        data: {
            fileName: file.name,
            size,
        },
    });
}

/**
 * 上传切片
 */
export async function uploadChunks(params: {
    chunks: Blob[];
    uploaded: Set<number>;
    onProgress?: (data: {
        progress: number;
        index: number;
    }) => void;
    file: File;
}) {
    const {chunks, uploaded, onProgress, file} = params;
    let progress = uploaded.size;

    // 切片格式
    const formDataList = chunks.map((chunk, index) => {
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('filename', file.name);
        formData.append('index', index.toString());
        return formData;
    }).filter(item => {
        // 筛选出还未上传的
        return !uploaded.has(Number(item.get('index')));
    });

    const requestList = formDataList.map((formData) => {
        return axios<AxiosResponse<{index: number}>>({
            url: 'http://localhost:3002/upload',
            method: 'post',
            data: formData,
            // cancelToken: source.token,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then(({data: res}) => {
            if (res.status === 200) {
                progress++;
                onProgress?.({
                    progress,
                    index: res.data.index,
                });
            }
            return res;
        });
    });
    return Promise.all(requestList).then(() => progress);
}

/**
 * 校验是否上传成功 (判断秒传)
 */
export function verifyFile(file: File) {
    return axios({
        url: 'http://localhost:3002/verify',
        method: 'post',
        data: {
            fileName: file.name,
            size: file.size,
        },
    });
}