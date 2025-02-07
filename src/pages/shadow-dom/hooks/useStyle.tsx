import {useEffect} from 'react';
import {useShadow} from '../learn-sdk-ui/context/shadow-context';

interface Style {
    use: (options: {target: ShadowRoot}) => void;
    unuse: (options: {target: ShadowRoot}) => void;
}

export const useLazyStyle = (style: Style) => {
    // 组件加载时，将样式挂载到shadowRoot上
    const {shadowRoot: target} = useShadow();

    useEffect(() => {
        style.use({target});

        // 组件卸载时，将样式从shadowRoot上移除
        return () => style.unuse({target});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

const createStyle = (style: string) => {
    const element = document.createElement('style');
    element.textContent = style;
    return element;
};

const lastInsertedElementMap = new Map<ShadowRoot, HTMLStyleElement>();
// 插入到shadowRoot上
const insertIntoTarget = (element: HTMLStyleElement, target: ShadowRoot) => {
    const parent = target;
    const styleElement = parent.querySelectorAll('style');
    const lastInsertedElement = lastInsertedElementMap.get(parent);

    if (lastInsertedElement && lastInsertedElement.nextSibling) {
        parent.insertBefore(element, lastInsertedElement || lastInsertedElement.nextSibling);
    } else {
        parent.insertBefore(element, styleElement[styleElement.length - 1]);
    }

    lastInsertedElementMap.set(parent, element);
}

export const useStyle = (style: string) => {
    // 组件加载时，将样式挂载到shadowRoot上
    const {shadowRoot} = useShadow();

    useEffect(() => {
        const element = createStyle(style);
        insertIntoTarget(element, shadowRoot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
