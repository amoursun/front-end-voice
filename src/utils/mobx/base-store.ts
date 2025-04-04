/* eslint-disable @typescript-eslint/no-empty-function */
import {action, makeObservable} from 'mobx';

/*
    集成基础类
    class Store extends baseStore<Store> {
    }
*/

export class BaseStore<T> {
    constructor() {
        makeObservable(this, {
            setProps: action,
        });
    }
    setProps(props: Partial<T>) {
        Object.assign(this, props);
    }

    init = (props?: Partial<T>) => {};

    exit = () => {};
}

export default BaseStore;
