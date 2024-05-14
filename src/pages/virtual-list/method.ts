export function repeat(value: string, count: number) {
    return value.repeat(count);
}
export interface IListItem {
    id: number;
    title: string;
    value: string;
}
export const GENERATE_LIST_NUM = 100 * 1000;
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
            return Math.ceil(Math.random() * repeatNum);
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