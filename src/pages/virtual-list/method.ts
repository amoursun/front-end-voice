export function repeat(value: string, count: number) {
    return value.repeat(count);
}
export interface IListItem {
    id: number;
    title: string;
    value: string;
}
export const GENERATE_LIST_NUM = 100 * 1000;
/**
 * 生成虚拟列表数据
 * @param num : 列表数量
 * @param repeatNum : 内容重复次数
 * @param isAuto : 是否高度内容不定
 */
export const generateList = (params?: {
    num?: number;
    repeatNum?: number;
    isAuto?: boolean;
}) => {
    const {
        num = GENERATE_LIST_NUM,
        repeatNum = 50,
        isAuto = false,
    } = params || {};
    const getRepeatNum = () => {
        if (isAuto) {
            return Math.floor(Math.random() * repeatNum) + 1;
        }
        return repeatNum;
    };
    const data = [];
    const value = Math.random().toString(36).substring(2, 15);
    for (let i = 1; i <= num; i++) {
        data.push({
            id: i,
            title: `标题${i}`,
            value: repeat(`内容${value}`, getRepeatNum()),
        });
    }
    return data;
};