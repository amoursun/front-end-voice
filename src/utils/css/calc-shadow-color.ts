/**
 * @description 转换给定基础颜色为阴影颜色；
 * * 使用示例：
 * * const baseColor = '#2cc787';
 * * const shadowColor = calculateShadowColor(baseColor); // 返回 #1f9061；
 * @param baseColor 基础颜色
 * @param shadowFactor 阴影系数
 * @returns 阴影颜色
 */
export function calculateShadowColor(baseColor: string, shadowFactor = 0.72): string {
    if (baseColor.length < 4) {
        return baseColor;
    }

    // 处理4位简写颜色格式（如#333转为#333333）
    if (baseColor.length === 4) {
        baseColor = baseColor + baseColor[3].repeat(3);
    }

    // 1. 将16进制颜色转换为RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // 2. 应用阴影系数 shadowFactor
    const newR = Math.round(r * shadowFactor);
    const newG = Math.round(g * shadowFactor);
    const newB = Math.round(b * shadowFactor);

    // 3. 转回16进制
    const shadowColor = '#'
        + newR.toString(16).padStart(2, '0')
        + newG.toString(16).padStart(2, '0')
        + newB.toString(16).padStart(2, '0');

    return shadowColor;
}

// 使用示例
// const baseColor = '#2cc787';
// const shadowColor = calculateShadowColor(baseColor); // 返回 #1f9061


export function calculateOpacityColor(color: string, opacity: number) {
    // 1. 将16进制颜色转换为RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
