import React from 'react';
import {createRoot} from 'react-dom/client';
import {LEARN_APP} from '../utils';
import {ShadowProvider} from './context/shadow-context';
import App from './app';

function createShadowRoot(element: HTMLElement): ShadowRoot {
    element.setAttribute('data-element', LEARN_APP);
    return element.attachShadow({mode: 'open'});
}

function main() {
    const rootElement = document.createElement('learn-app');
    const shadowRoot = createShadowRoot(rootElement);

    const container = document.createElement('learn-app-root');
    shadowRoot.appendChild(container);

    const root = createRoot(container);

    root.render(
        <ShadowProvider shadowRoot={shadowRoot}>
            <App />
        </ShadowProvider>
    );

    document.body.appendChild(rootElement);
}

// void main();

export function runSdkUi() {
    void main();
}
