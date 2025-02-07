/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import {throttle} from 'lodash-es';

type DataBase = Record<string, any>;

export class LocalData<Data extends DataBase = DataBase> {
    constructor(
        private readonly key: string,
        private readonly getDefault: () => Data
    // eslint-disable-next-line no-empty-function
    ) {}

    private _data: Data | null = null;

    private readonly getStorageKey = () => {
        return `learn-${this.key}`;
    };

    get = () => {
        if (this._data === null) {
            const jsonText = localStorage.getItem(this.getStorageKey());
            const data = JSON.parse(jsonText!) as Data;

            if (data === null) {
                this._data = this.getDefault();
            } else {
                this._data = data;
            }
        }
        return this._data;
    };

    set = (data: Partial<Data>) => {
        Object.assign(this.get(), data);
        this.update();
    };

    private readonly update = throttle(
        () => {
            localStorage.setItem(
                this.getStorageKey(),
                JSON.stringify(this._data)
            );
        },
        1500
    );
}
