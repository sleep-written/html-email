import * as htmlParser from 'node-html-parser';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

import { NotLoadedTemplateError } from './not-loaded-template-error';
import { flattenObj, Literal } from '../flatten-obj';
import { CssTemplate } from '../css-template';

export class HtmlTemplate<T extends Literal> {
    private _path: string;
    get path(): string {
        return this._path;
    }

    private _encoding: BufferEncoding;
    get encoding(): BufferEncoding {
        return this._encoding;
    }

    private _template!: string;
    get template(): string {
        if (typeof this._template === 'undefined') {
            throw new NotLoadedTemplateError(this._path);
        } else {
            return this._template;
        }
    }

    private _styles!: CssTemplate[];
    get styles(): CssTemplate[] {
        if (typeof this._styles === 'undefined') {
            throw new NotLoadedTemplateError(this._path);
        } else {
            return this._styles;
        }
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

    async load(): Promise<void> {
        // Get raw html
        this._template = await readFile(this._path, this._encoding);

        // Get styles
        const html = htmlParser.parse(this._template);
        const paths = html
            .querySelectorAll('link[rel="stylesheet"]')
            .map(n => {
                const href = n.getAttribute('href');
                n.remove();
                return href;
            });

        // Read stylefiles
        this._styles = [];
        for (const path of paths) {
            if (path) {
                const fullPath = resolve(this._path, '..', path);
                const style = await CssTemplate.load(fullPath);
                this._styles.push(style);
            }
        }

        // Save altered template
        this._template = html.toString();
    }

    parse(data: T): string {
        // Check the state
        if (
            (typeof this._template === 'undefined') ||
            (typeof this._styles === 'undefined')
        ) {
            throw new NotLoadedTemplateError(this._path);
        }

        // Replace values
        let html = this._template;
        const flat = flattenObj(data);
        for (const item of flat) {
            const regexp = this._keysToRegExp(item.keys);
            html = html.replace(regexp, `${item.value}`);
        }

        // Render css
        const node = htmlParser.parse(html);
        for (const style of this._styles) {
            style.apply(node);
        }

        // Return the edited html
        return node.toString();
    }
}