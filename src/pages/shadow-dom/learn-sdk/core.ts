/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-empty-function */
/* eslint-disable consistent-return */
/* eslint-disable react/no-deprecated */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react/no-children-prop */
import {
    version,
    useEffect,
    createElement,
    type ReactElement,
} from 'react';
import {createRoot} from 'react-dom/client';
import {render, unmountComponentAtNode} from 'react-dom';
import {ShadowContext} from '../learn-sdk-ui/context/shadow-context';
import App from '../learn-sdk-ui/app';
import {
    EventEmitter,
    type EventEmitterFunc,
    createDom,
    createShadowDom,
    LEARN_APP,
    LEARN_SDK_APP,
} from '../utils';
    
import {SDKContext} from './sdk-context';
import { runSdkUi } from '../learn-sdk-ui';

const majorVersion = parseInt(version.split('.')[0], 10);

export interface SDK {
    isMounted: boolean;
    mount(dom?: HTMLElement): this;
    unmount(): void;
    on(name: string, fn: EventEmitterFunc): this;
    off(name: string, fn: EventEmitterFunc): this;
    emit(name: string): this;
}

export class LearnInstance implements SDK {
    private readonly _events = new EventEmitter();

    _options = {};

    isMounted = false;

    _unmount = () => {};

    _app: ReactElement | null = null;

    _shadowRootElement: ShadowRoot = {} as unknown as ShadowRoot;

    constructor(options: any) {
        this._options = options;
    }

    _createApp(container?: HTMLElement) {
        if (!container) {
            container = createDom({
                id: LEARN_SDK_APP,
                element: LEARN_APP,
            });
        }
        this._shadowRootElement = createShadowDom(container);
    }

    _renderApp(dom = this._shadowRootElement) {
        if (!this._app) {
            return this;
        }

        if (majorVersion >= 18) {
            const root = createRoot(dom);
            root.render(this._app);

            this._unmount = () => root.unmount();
        } else {
            render(this._app, dom);
            this._unmount = () => unmountComponentAtNode(dom);
        }
    }

    mount(dom?: HTMLElement) {

        this._createApp(dom);

        this._view();

        this._renderApp();

        return this;
    }

    unmount() {
        this._unmount();
    }

    /**
     * babel 解析 context
     */
    /*
    <SDKContext.Provider value={{this}}>
        <ShadowContext.Provider value={{shadowRoot}}>
            <App />
        </ShadowContext.Provider>
    </SDKContext.Provider>
    */
    _createShadowContext = (app: ReactElement) => {
        return createElement(
            ShadowContext.Provider,
            {
                value: {shadowRoot: this._shadowRootElement},
            },
            app
        );
    };

    _createSDKContext = ({value, children}: Record<string, any>) => {
        useEffect(() => {
            if (!this.isMounted) {
                this.emit('mount');
            }
            this.isMounted = true;

            return () => {
                if (this.isMounted) {
                    this.emit('unmount');
                }
                this.isMounted = false;
            };
        }, []);

        return createElement(SDKContext.Provider, {value}, children);
    };

    _view(app: ReactElement = createElement(App)) {
        this._app = createElement(
            this._createSDKContext,
            {
                value: this,
                children: this._createShadowContext(app),
            }
        );

        return this;
    }

    on(name: string, fn: EventEmitterFunc) {
        this._events.on(name, fn);
        return this;
    }

    off(name: string, fn: EventEmitterFunc) {
        this._events.off(name, fn);
        return this;
    }

    emit(name: string, ...args: any[]) {
        this._events.emit(name, ...args);
        return this;
    }
}
