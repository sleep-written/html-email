import { IncomingHttpHeaders } from 'http';

export interface FetchResponse<T> {
    get status(): number;
    get charset(): BufferEncoding;
    get headers(): IncomingHttpHeaders;

    toString(): string;
    toJSON(): T;
}
