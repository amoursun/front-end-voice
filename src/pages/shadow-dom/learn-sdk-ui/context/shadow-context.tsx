import React, {createContext, useContext} from 'react';

interface ShadowProviderProps {
    children?: React.ReactNode;
    shadowRoot: ShadowRoot;
}

export const ShadowContext = createContext<{shadowRoot: ShadowRoot}>({} as never);

export const ShadowProvider = (props: ShadowProviderProps) => {
    const {children, shadowRoot} = props;

    return (
        <ShadowContext.Provider value={{shadowRoot}}>
            {children}
        </ShadowContext.Provider>
    );
};

export const useShadow = () => useContext(ShadowContext);
