import { RequestOptions } from 'https';
import { Methods } from './methods';

export interface FetchOptions extends RequestOptions {
    method: keyof Methods;
}
