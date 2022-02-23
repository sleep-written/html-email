import { resolve } from 'path';
import { URL } from 'url';

import { readFile } from 'fs/promises';
import * as htmlParser from 'node-html-parser';

import { CssTemplate } from '../css-template';
import { flattenObj, Literal } from '../flatten-obj';

export class HtmlTemplate<T extends Literal> {
    static async load<T extends Literal>(
        path: string,
        encoding?: BufferEncoding
    ): Promise<HtmlTemplate<T>> {
        // Get html
        const text = await readFile(path, encoding ?? 'utf-8');
        const html = htmlParser.parse(text);

        // Get styles
        const paths = html
            .querySelectorAll('link[rel="stylesheet"]')
            .map(n => {
                const href = n.getAttribute('href');
                n.remove();
                if (typeof href !== 'string') {
                    throw new Error('Invalid <link> element: The property "href" doesn\'t exists');
                }

                try {
                    return new URL(href);
                } catch {
                    return resolve(path, '..', href);
                }
            });

        // Read stylefiles
        const styles = [];
        for (const href of paths) {
            const style = await CssTemplate.load(href, encoding);
            styles.push(style);
        }

        // Return the new instance
        return new HtmlTemplate(
            html.toString(),
            styles
        );
    }

    private _template!: string;
    get template(): string {
        return this._template;
    }

    private _styles!: CssTemplate[];
    get styles(): CssTemplate[] {
        return this._styles;
    }
    
    private constructor(html: string, styles?: CssTemplate[]) {
        this._template = html;
        this._styles = styles ?? [];
    }

    private _keysToRegExp(keys: string[]): RegExp {
        const flat = keys.reduce((prev, curr, i) =>
            i ? `${prev}\\.${curr}` : curr
        );

        const patt = `\\{{2}\\s*${flat}\\s*\\}{2}`;
        return new RegExp(patt, 'gi');
    }

    parse(data: T): string {
        // Replace values
        let template = this._template;
        const flat = flattenObj(data);
        for (const item of flat) {
            const regexp = this._keysToRegExp(item.keys);
            template = template.replace(regexp, `${item.value}`);
        }

        // Render CSS
        const html = htmlParser.parse(template);
        for (const style of this._styles) {
            style.applyInline(html);
        }

        // Return the edited html
        return html.toString();
    }
}