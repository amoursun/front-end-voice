/**
 * 将百分比转换为16进制 用于css颜色值转换
 * 示例使用:
 * percentageToHex(16) => "29"
 * percentageToHex(100) => "ff"
 * percentageToHex(0) => "00"
 * @param percentage 百分比数值(0-100)
 * @returns 两位16进制字符串(00-ff)
 */
export const percentageToHex = (percentage: number): string => {
    // 将百分比转换为0-255的数值
    const value = Math.round((percentage / 100) * 255);
    // 转16进制并补0
    return value.toString(16).padStart(2, '0');
};
