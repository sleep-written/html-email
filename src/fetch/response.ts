import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { FetchResponse } from './interfaces';

export class Response<T> implements FetchResponse<T> {
    private _buffer: Buffer;
    
    private _status: number;
    get status(): number {
        return this._status;
    }

    private _charset: BufferEncoding;
    get charset(): BufferEncoding {
        return this._charset;
    }

    private _headers: IncomingHttpHeaders;
    get headers(): IncomingHttpHeaders {
        return this._headers;
    }

    constructor(byte: Buffer, msg: IncomingMessage) {
        this._buffer = byte;
        this._status = msg.statusCode ?? 200;
        this._headers = msg.headers;

        // Get charset
        const charset = msg.headers['content-type']
            ?.match(/(?<=charset=)[a-z0-9\-_]+/g);

        if (charset) {
            this._charset = charset[0] as BufferEncoding;
        } else {
            this._charset = 'utf-8'
        }
    }

    toString(): string {
        return this._buffer.toString(this._charset);
    }

    toJSON(): T {
        const text = this.toString();
        return JSON.parse(text);
    }
}
