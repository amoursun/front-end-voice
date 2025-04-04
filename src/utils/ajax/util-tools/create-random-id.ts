/**
 * @file createRandomId
 * @author gyl
 */
export function createRandomId(prefix = '') {
    const random = `${Math.random()}`.replace('0.', '');
    return prefix + parseInt(random, 10).toString(36);
}
