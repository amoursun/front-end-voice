import React, {useRef, createContext, useContext, PropsWithChildren} from 'react';
import {createChatStore, type Store} from '../store/chat-store';

export const StoreContext = createContext<Store>({} as never);

export const StoreProvider = (props: PropsWithChildren) => {
    const {children} = props;
    const store = useRef(createChatStore()).current;

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
