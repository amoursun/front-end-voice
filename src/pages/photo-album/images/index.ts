import inPhoto1 from './01.jpg';
import inPhoto2 from './02.jpg';
import inPhoto3 from './03.jpg';
import inPhoto4 from './04.jpg';
import inPhoto5 from './05.jpg';
import inPhoto6 from './06.jpg';

import outPhoto1 from './1.jpg';
import outPhoto2 from './2.jpg';
import outPhoto3 from './3.jpg';
import outPhoto4 from './4.jpg';
import outPhoto5 from './5.jpg';
import outPhoto6 from './6.jpg';

const imagesPath: {
    out: Record<string, string>;
    in: Record<string, string>;
} = {
    in: {
        1: inPhoto1,
        2: inPhoto2,
        3: inPhoto3,
        4: inPhoto4,
        5: inPhoto5,
        6: inPhoto6,
    },
    out: {
        1: outPhoto1,
        2: outPhoto2,
        3: outPhoto3,
        4: outPhoto4,
        5: outPhoto5,
        6: outPhoto6,
    }
}
function createArray(n: number) {
    return Array.from({length: n}, (_, i) => i + 1);
}
const list = createArray(6);
export interface IAudioItem {
    value: string;
    label: string;
    url: string;
    count: number,
}
export const imageContents: {
    outList: IAudioItem[];
    inList: IAudioItem[];
} = {
    outList: list.map(i => ({
        value: `out-photo-${i.toString()}`,
        label: `Out ${i}`,
        url: imagesPath.out[i.toString()],
        count: i,
    })),
    inList: list.map(i => ({
        value: `in-photo-${i.toString()}`,
        label: `In ${i}`,
        url: imagesPath.in[`${i}`],
        count: i,
    })),
}