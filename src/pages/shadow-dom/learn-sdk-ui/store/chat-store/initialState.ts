type ValueOf<T> = T[keyof T];

export const CHAT_MODE_TYPE = {
    ICON: 'icon',
    UI: 'ui',
} as const;

export type ChatModeType = ValueOf<typeof CHAT_MODE_TYPE>;

export interface ChatValue {
    type: string;
    content: string;
    isGenerating?: boolean;
}

export interface State {
    isRecommendOpen: boolean;
    chatModeValue: ChatModeType | '';
    recommend: Record<string, any>;
}

export const initialChatState: State = {
    recommend: {},
    chatModeValue: '',
    isRecommendOpen: false,
};
