import CryptoJS from 'crypto-js';

const toHash256 = async (uint8Array: Uint8Array) => {
    const wordArray = CryptoJS.lib.WordArray.create(uint8Array);
    return CryptoJS.SHA256(wordArray).toString();
};

// 定义一个函数，用于将Uint8Array转换为MD5 hash
function toMd5Hash(uint8Array: Uint8Array) {
    const wordArray = CryptoJS.lib.WordArray.create(uint8Array);
    // 使用CryptoJS生成MD5 hash
    const hash = CryptoJS.MD5(wordArray).toString();
    return hash;
}
const createChunks = (params: {
    file: File;
    index: number;
    chunkSize: number;
}): Promise<IChunkResult> => {
    const {file, index, chunkSize} = params;
    return new Promise((resolve) => {
        // 开始
        const start = index * chunkSize;
        // 结束
        const end = start + chunkSize;
        const fileReader: FileReader = new FileReader();
        // 每个切片都通过FileReader读取为ArrayBuffer
        fileReader.onload = (e: Event) => {
            const target = e.target as FileReader;
            const contents = new Uint8Array(target.result as ArrayBuffer);
            const files = file.slice(start, end);
            const hash = toMd5Hash(contents);
            resolve({
                start,
                end,
                index,
                hash,
                files,
            });
        };
        // 读取文件的分片
        fileReader.readAsArrayBuffer(file.slice(start, end));
    });
};
interface IParams {
    file: File;
    chunkSize: number;
    startIndex: number;
    endIndex: number;
}
export interface IChunkResult {
    start: number;
    end: number;
    index: number;
    hash: string;
    files: Blob;
}
self.onmessage = async function(e: {data: IParams}) {
    const {file, chunkSize, startIndex, endIndex} = e.data;
    const arr = [];

    for (let index = startIndex; index < endIndex; index++) {
        arr.push(createChunks({file, index, chunkSize}));
    }
    const chunks = await Promise.all(arr);
    // 提交线程信息
    postMessage(chunks);
}