/* eslint-disable react-hooks/rules-of-hooks */
import {useEffect} from 'react';
import {LocalData} from '../common/local-data';
import {CHAT_MODE_TYPE, type ChatModeType} from '../learn-sdk-ui/store/chat-store/initialState';

const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

const useLocalData = <K extends string, T extends Record<string, any>>(key: K, value: T) => {
    const storage = new LocalData(
        key,
        () => value
    );

    return {
        ...storage.get(),
        storage,
    };
};

export const useMode = (action: (value: ChatModeType) => void, delay: number) => {

    const initMode = async () => {
        const {mode, storage} = useLocalData<string, {mode: ChatModeType}>('chat-mode', {mode: CHAT_MODE_TYPE.ICON});

        if (mode === CHAT_MODE_TYPE.UI) {
            storage.set({
                mode: CHAT_MODE_TYPE.ICON,
            });
        }

        await sleep(delay);

        action(mode);
    };

    useEffect(() => {
        void initMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
