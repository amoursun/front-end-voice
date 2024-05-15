import {get} from 'lodash-es';

export const datasetName = 'data-index';
export function getIndexFromNode(node: Element) {
    return Number(get(node, 'dataset.index', 0));
}