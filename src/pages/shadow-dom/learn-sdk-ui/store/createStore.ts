import {createStore as _create, StateCreator} from 'zustand';

export const create = (<T>(f: StateCreator<T> | undefined) => {
    if (f === undefined) {
        return create;
    }
    const store = _create(f);
    return store;
}) as typeof _create;

