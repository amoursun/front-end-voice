export interface IAudioItem {
    value: string;
    label: string;
    url: string;
}
// 音频文件
const mp3Files: Record<string, {default: string}> = import.meta.glob('./files/*.mp3', {eager: true});
export const audioList: IAudioItem[] = Object.keys(mp3Files).map((key) => {
    const name = key
        .replace('./files/', '');
        // .replace('.mp3', '');
    const audio = mp3Files[key];

    return {
        value: key,
        label: name,
        url: audio.default,
    };
});