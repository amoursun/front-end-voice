/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {createSelectors, create, immer} from '..';
// import {getTodoTask} from '../../api';
import {formatTime, formatDiffDay} from '../../../utils/tools';
import {type State, initialChatState, ChatModeType} from './initialState';
// import {message} from '../../../hooks/useApp';

export interface Action {
    setChatMode: (value: ChatModeType) => void;
    setRecommendOpen: () => void;
    setRecommend: (value: State['recommend']) => void;
    updateRecommend: (value?: State['recommend']) => void;
    fetchTodoTask: () => Promise<void>;
    initRecommend: () => void;
}

export type ChatStore = State & Action;

export type Store = ReturnType<typeof createChatStore>;

export const createChatStore = () => createSelectors(create(immer<ChatStore>((set, get) => ({
    ...initialChatState,

    initRecommend: () => {
        const {fetchTodoTask} = get();

        void fetchTodoTask();
    },

    fetchTodoTask: async () => {
        // const {data = []} = await getTodoTask();
        const data: any[] = [];
        const {updateRecommend} = get();

        const list = data
            .sort((a: any, b: any) => a.endTime - b.endTime)
            .map((item: any) => {
                const {endTime, pcUrl} = item;

                return {
                    ...item,
                    href: pcUrl,
                    endTime: formatTime(endTime),
                    remainDay: formatDiffDay(endTime),
                };
            }) as State['recommend'];

        if (list.length) {
            updateRecommend({
                title: `学习清单(${list.length})`,
                list,
            });
        }
    },

    updateRecommend: (value = {}) => {
        const {setRecommend, setRecommendOpen} = get();

        setRecommendOpen();

        setRecommend(value);
    },

    setRecommend: (value) => {
        set(state => {
            state.recommend = value;
        });
    },

    setChatMode: (value) => {
        set(state => {
            state.chatModeValue = value;
        });
    },

    setRecommendOpen: () => {
        set(state => {
            state.isRecommendOpen = !state.isRecommendOpen;
        });
    },
}))));
