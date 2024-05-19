import axios, { AxiosResponse } from 'axios';
import {createEventHandler, defer as handleDefer} from 'js-hodgepodge';
import {IChunkResult} from './worker';
import {createPromise} from '../../utils/util-create-promise';

/**
 * @returns 返回当前设备的并发数
 */
export const getConcurrency = () => navigator.hardwareConcurrency || 4;
export const handleEvent = () => createEventHandler('handleSchedule')
const handleFormData = (chunk: IChunkItem) => {
    const formData = new FormData();
    Object
        .entries(chunk)
        .forEach(([key, val]) => {
            formData.append(key, val)
        });

    return formData;
};
type IRequestPromiseFactory = () => Promise<AxiosResponse<any, any>>;
interface IChunkItem extends IChunkResult {
    chunkLength: number; // 切片数量
    filename: string; // 文件名
}
export const sliceFile = (file: File) => {
    // const defer = handleDefer<{
    //     chunks: IChunkItem[];
    //     // 切片总数量
    //     chunkLength: number;
    // }>();
    // defer.resolve({
    //     chunks: [],
    //     chunkLength: 0,
    // });
    // return defer;
    const {
        promise,
        resolve,
    } = createPromise<{
        chunks: IChunkItem[];
        // 切片总数量
        chunkLength: number;
    }>();
    const chunkSize = 1024 * 1024 * 10; // 10Mb
    const thread = getConcurrency(); // 线程数
    const chunks: IChunkItem[] = [];
    // 切片总数量
    const chunkLength = Math.ceil(file.size / chunkSize);
    // 每个线程需要处理的切片数量
    const workerChunkCount = Math.ceil(chunkLength / thread);
    let finishCount = 0;
    for (let i = 0; i < thread; i++) {
        const worker = new Worker(new URL(
            './worker.ts',
            import.meta.url
        ));
        // 计算每个线程的开始索引和结束索引
        const startIndex = i * workerChunkCount;
        let endIndex = startIndex + workerChunkCount;
        // 防止最后一个线程结束索引大于文件的切片数量的总数量
        if (endIndex > chunkLength) {
            endIndex = chunkLength;
        }
        worker.postMessage({
            file,
            chunkSize,
            startIndex,
            endIndex,
        });

        worker.onmessage = (e: {data: IChunkResult[]}) => {
            // 接收到 worker 线程返回的消息
            for (let i = startIndex; i < endIndex; i++) {
                chunks[i] = {
                    ...e.data[i - startIndex],
                    chunkLength,
                    filename: file.name
                };
            }

            worker.terminate(); // 关闭线程
            finishCount++;
            if (finishCount === thread) {
                resolve({
                    chunks,
                    chunkLength,
                });
            }
        };
    }
    return promise;
};

// chunks 总切片
export const uploadFile = (chunks: IChunkItem[] ) => {
    chunks = chunks || [];
    let schedule = 0; // 进度
    const {dispatch} = handleEvent();

    const requestQueue = (concurrency: number) => {
        concurrency = concurrency || 6
        const queue: IRequestPromiseFactory[] = []; // 线程池
        let current = 0;

        const dequeue = () => {
            while (current < concurrency && queue.length) {
                current++;
                const requestPromiseFactory = queue.shift();
                if (requestPromiseFactory) {
                    requestPromiseFactory()
                        .then(() => { 
                            // 上传成功处理
                            // 收集上传切片成功的数量
                            schedule++;
                            dispatch(window, schedule);  // 事件派发，通知进度
                        })
                        .catch((error: any) => { // 失败
                            console.log(error);
                        })
                        .finally(() => {
                            current--;
                            dequeue();
                        });
                }
                else {
                    current--;
                    dequeue();
                }
            }
        };

        return (requestPromiseFactory: IRequestPromiseFactory) => {
            queue.push(requestPromiseFactory);
            dequeue();
        };
    };
    const enqueue = requestQueue(6);
    for (let i = 0; i < chunks.length; i++) {
        const request: IRequestPromiseFactory = () => axios.post(
            '/api/file/upload',
            handleFormData(chunks[i]),
            {
                headers: {
                    'Content-Type': 'multipart/form-data' 
                },
            }
        );
        enqueue(request);
    }

    return schedule;
}