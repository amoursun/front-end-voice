import React, {useEffect} from 'react';
import ClipboardJS from 'clipboard';
import {message} from './useApp';

const createClip = (element: string | Element | NodeListOf<Element>) => {
    const clipboard = new ClipboardJS(element);

    clipboard.on('success', (e) => {
        void message.success('复制成功');
        e.clearSelection();
    });

    clipboard.on('error', (e) => {
        e.clearSelection();
    });

    return clipboard;
};

export const useCopy = <Base extends React.RefObject<HTMLElement>>(ref: Base) => {
    useEffect(() => {
        const copy = createClip(ref.current!);

        return () => copy.destroy();
    }, [ref]);
};
