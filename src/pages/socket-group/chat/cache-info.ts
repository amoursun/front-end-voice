import {useLocalObservable} from 'mobx-react-lite';
import {UserFieldType} from './form-modal';

const sessionKey = 'socket_group_chat:7498';
function getDefaultValue(value?: UserFieldType) {
    const {
        room = '',
        user = '',
    } = value || {};
    return {room, user};
}
function getData(value?: UserFieldType) {
    const defaultValue = getDefaultValue(value);
    try {
        const data = sessionStorage.getItem(sessionKey);
        if (data) {
            return JSON.parse(data);
        }
        return defaultValue;
    }
    catch (e) {
        return defaultValue;
    }
}
function setData(value: UserFieldType) {
    sessionStorage.setItem(sessionKey, JSON.stringify(value));
}
function clearData() {
    sessionStorage.removeItem(sessionKey);
}

interface IStore {
    info: UserFieldType;
    update(data: UserFieldType): void;
}
export const useCacheInfo = (param?: UserFieldType): IStore => {
    const data = getData(param);
    const store = useLocalObservable<{
        info: UserFieldType;
        update(data: UserFieldType): void;
    }>(() => ({
        info: data,
        update(data: UserFieldType){
            setData(data);
            this.info = data;
        },
    }));
    return store;
};