import audio1 from './沉醉的青丝.mp3';
import audio2 from './白月光与朱砂痣.mp3';

export interface IAudioItem {
    value: string;
    label: string;
    url: string;
}
export const audioList: IAudioItem[] = [
    {
        value: 'audio1',
        label: '沉醉的青丝.mp3',
        url: audio1
    },
    {
        value: 'audio2',
        label: '白月光与朱砂痣.mp3',
        url: audio2
    }
]