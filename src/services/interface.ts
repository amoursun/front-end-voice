import { ResponseJSON } from 'src/utils/ajax/ajax';

export interface IJsonResult<T = any> extends ResponseJSON<T> {}
