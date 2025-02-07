import dayjs from 'dayjs';

export const createDom = (options: Record<string, string>): HTMLElement => {
    const element = options.element || 'div';
    const container = document.createElement(element);
    document.body.appendChild(container);

    if (Object.keys(options).length) {
        Object.keys(options).forEach((key) => {
            setAttribute(container, key, options[key]);
        });
    }

    return container;
};

export const createShadowDom = (element: HTMLElement): ShadowRoot =>{
    return element.attachShadow({mode: 'open'});
};

export const setAttribute = (element: HTMLElement, attributeName: string, value: any): void => {
    element.setAttribute(attributeName, value);
};

export const getWindowInnerHeight = () => {
    return window.innerHeight;
};

export const getElement = (target: HTMLElement, elementName: string) => {
    if (!target) {
        return [];
    }

    return target.querySelector(`[data-element="${elementName}"]`);
};

export const getElementList = (target: HTMLElement, elementName: string) => {
    if (!target) {
        return [];
    }

    return [...target.querySelectorAll(`[data-element="${elementName}"]`)];
};

const noop = () => undefined;

export const initEventListener = <Bound extends Event = Event>(
    target: EventTarget | null,
    eventName: string,
    handler: (event: Bound) => void
) => {
    if (!target) {
        return noop;
    }

    // @ts-ignore event handler
    target.addEventListener(eventName, handler);

    return () => {
        // @ts-ignore event handler
        target.removeEventListener(eventName, handler);
    };
};

export const initElementEventListener = <Bound extends Event = Event>(
    parent: HTMLElement,
    elementName: string,
    eventName: string,
    handler: (event: Bound) => void
) => {
    if (!parent) {
        return noop;
    }

    const elementList = getElementList(parent, elementName);

    const disposers = elementList.map(element => {
        return initEventListener(element, eventName, handler);
    });

    return () => disposers.forEach(dispose => dispose());
};

export const formatTime = (value: dayjs.ConfigType): string => {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
};

export const formatDiffDay = (value: dayjs.ConfigType): number => {
    return dayjs(value).diff(dayjs(), 'day');
};

