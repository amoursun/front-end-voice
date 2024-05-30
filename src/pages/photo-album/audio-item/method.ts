
// 计算时间
export function getHour(second: number): string {
    const hour = Math.floor(second / 360);
    if (hour < 10) {
        return '0' + hour.toString();
    }
    return hour.toString();
}
export function getMinute(second: number): string {
    const minute = Math.floor(second / 60);
    if (minute < 10) {
        return '0' + minute.toString();
    }
    return minute.toString();
}
export function getSecond(s: number): string {
    const second = s % 60;
    if (second < 10) {
        return '0' + second.toString();
    }
    return second.toString();
}

export function getTime(second: number) {
    return {
        hour: getHour(second),
        minute: getMinute(second),
        second: getSecond(second),
    };
}