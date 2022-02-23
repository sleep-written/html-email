import { request } from 'https';

import { Response } from './response';
import { getCharset } from './get-charset';
import { FetchOptions, FetchResponse, Methods } from './interfaces';

export class Fetch<I = void, O = any> {
    private _options: FetchOptions;
    get options(): FetchOptions {
        return this._options;
    }
    set options(v: FetchOptions) {
        this._options = v;
    }

    constructor(href: string, method?: keyof Methods);
    constructor(href: URL, method?: keyof Methods);
    constructor(options: FetchOptions);
    constructor(arg: URL | string | FetchOptions, method?: keyof Methods) {
        if (typeof arg === 'string' || arg instanceof URL) {
            // Get URL instance
            const url = (arg instanceof URL)
                ? arg
                : new URL(arg);

            // Set base parameters
            this._options = {
                method: method ?? 'GET',
                host: url.host,
                hostname: url.hostname,
                path: url.pathname
            };

            // Set port
            if (url.port) {
                this._options.port = parseInt(url.port, 10);
            } else if (url.protocol === 'https') {
                this._options.port = 443;
            } else if (url.protocol === 'http') {
                this._options.port = 80;
            }
        } else {
            this._options = { ...arg };
        }
    }

    private _dataToBuffer(data: I): Buffer | undefined {
        if (Buffer.isBuffer(data)) {
            return data;
        }

        const charset = getCharset(this._options.headers);
        if (typeof data === 'string') {
            return Buffer.from(data, charset);
        } else if (data != null) {
            const text = JSON.stringify(data);
            return Buffer.from(text, charset);
        } else {
            return undefined;
        }
    }

    write(data: I): Promise<FetchResponse<O>> {
        const rawData = this._dataToBuffer(data);
        const headers = { ...this._options.headers };
        if (rawData) {
            headers['content-lenght'] = rawData.length;

            if (!headers['content-type']) {
                const charset = getCharset(headers);
                headers['content-type'] = `application/json; charset=${charset}`;
            }
        }

        const options = {
            ...this._options,
            headers
        };

        return new Promise((resolve, reject) => {
            // Create the request
            const req = request(options, msg => {
                const chunks: Buffer[] = [];

                msg.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                });

                msg.on('close', () => {
                    const byte = Buffer.concat(chunks);
                    const resp = new Response<O>(byte, msg);
                    resolve(resp);
                });

                msg.on('error', err => {
                    reject(err);
                });
            });
            
            // Close the connection
            rawData && req.write(rawData);
            req.end();
        });
    }
}
