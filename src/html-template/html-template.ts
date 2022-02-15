import { readFile } from 'fs/promises';
import { resolve } from 'path';

import { flattenObj, Literal } from '../flatten-obj';

export class HtmlTemplate<T extends Literal> {
    private _path: string;
    get path(): string {
        return this._path;
    }

    private _encoding: BufferEncoding;
    get encoding(): BufferEncoding {
        return this._encoding;
    }
    
    constructor(path: string, encoding?: BufferEncoding) {
        this._path = resolve(path);
        this._encoding = encoding ?? 'utf-8';
    }

    private _keysToRegExp(keys: string[]): RegExp {
        const flat = keys.reduce((prev, curr, i) =>
            i ? `${prev}\\.${curr}` : curr
        );

        const patt = `\\{{2}\\s*${flat}\\s*\\}{2}`;
        return new RegExp(patt, 'gi');
    }

    async parse(data: T): Promise<string> {
        let html = await readFile(this._path, this._encoding);
        const flat = flattenObj(data);

        for (const item of flat) {
            const regexp = this._keysToRegExp(item.keys);
            html = html.replace(regexp, `${item.value}`);
        }

        return html;
    }
}