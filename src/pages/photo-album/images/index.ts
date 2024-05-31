export interface IImageItem {
    value: string;
    label: string;
    url: string;
    count: number,
}
// 音频文件
const imageFiles: Record<string, {default: string}> = import.meta.glob('./files/*.jpg', {eager: true});
export const imagesPaths = Object.keys(imageFiles).reduce((result, key) => {
    const name = key.replace('./files/', '');
    const url = imageFiles[key].default;
    const res: IImageItem = {
        value: key,
        label: name,
        url,
        count: 0,
    };
    if (name.includes('in')) {
        res.count = result.inList.length + 1;
        result.inList.push(res);
    }
    if (name.includes('out')) {
        res.count = result.outList.length + 1;
        result.outList.push(res);
    }
    return result;
}, {inList: [], outList: []} as {
    outList: IImageItem[];
    inList: IImageItem[];
});